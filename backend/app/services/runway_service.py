from typing import Any
import time

import requests
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.models.project import Project
from app.models.session import HotSeatSession
from app.models.session_type import SessionType, SessionTypeJudge
from app.prompts.runway import RUNWAY_JUDGE_PROMPT_TEMPLATE

RUNWAY_VERSION = "2024-11-06"


class RunwayError(Exception):
    pass


def get_runway_api_key() -> str:
    if settings.runway_env == "hackathon":
        key = settings.runway_api_key_hackathon
    else:
        key = settings.runway_api_key_test

    if not key:
        raise RunwayError("Runway API key is not configured")

    return key


def _join_list(items: list[str] | None, empty_message: str) -> str:
    clean_items = [item.strip() for item in items or [] if item and item.strip()]
    if not clean_items:
        return empty_message

    return "\n".join(f"- {item}" for item in clean_items)


def _runway_headers(api_key: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "X-Runway-Version": RUNWAY_VERSION,
    }


def _extract_value(payload: dict[str, Any], *keys: str) -> str | None:
    for key in keys:
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value

    return None


def _request_json(
    method: str,
    url: str,
    *,
    headers: dict[str, str],
    json_body: dict[str, Any] | None = None,
) -> dict[str, Any]:
    try:
        response = requests.request(
            method,
            url,
            headers=headers,
            json=json_body,
            timeout=60,
        )
    except requests.RequestException as exc:
        raise RunwayError(f"Runway request failed: {exc}") from exc

    if response.status_code >= 400:
        raise RunwayError(f"Runway returned {response.status_code}: {response.text}")

    data = response.json()
    if not isinstance(data, dict):
        raise RunwayError("Runway response was not a JSON object")

    return data


def build_runway_prompt(db: Session, session: HotSeatSession) -> tuple[str, str]:
    project = db.query(Project).filter(Project.id == session.project_id).first()

    if not project:
        raise RunwayError("Project not found for session")

    session_type = (
        db.query(SessionType)
        .options(
            selectinload(SessionType.judge_links).selectinload(SessionTypeJudge.judge)
        )
        .filter(SessionType.id == session.session_type_id)
        .first()
    )

    if not session_type:
        raise RunwayError("Session type not found for session")

    active_judge = None
    for link in sorted(session_type.judge_links, key=lambda item: item.order_index):
        if link.judge_id == session.active_judge_id:
            active_judge = link.judge
            break

    if not active_judge:
        raise RunwayError("Active judge not found")

    if not active_judge.avatar_id:
        raise RunwayError("Active judge does not have a Runway avatar_id")

    project_materials = "\n\n".join(
        [text.strip() for text in project.pasted_texts if text and text.strip()]
    )

    if not project_materials:
        project_materials = "No pasted project materials were provided."

    prompt = RUNWAY_JUDGE_PROMPT_TEMPLATE.format(
        judge_name=active_judge.name,
        role_name=active_judge.role_name,
        personality=active_judge.personality,
        signature_pressure=active_judge.signature_pressure or "",
        project_title=project.title,
        project_description=project.description or "No description provided.",
        project_materials=project_materials,
        extracted_context=_join_list(
            project.extracted_context,
            "No extracted context has been generated yet.",
        ),
        suggested_questions=_join_list(
            project.suggested_questions,
            "No suggested pressure questions have been generated yet.",
        ),
    )

    return active_judge.avatar_id, prompt


def create_runway_realtime_session(
    *,
    avatar_id: str,
    prompt: str,
    duration_seconds: int,
) -> dict[str, Any]:
    api_key = get_runway_api_key()

    if not settings.allow_long_test_sessions and settings.runway_env != "hackathon":
        duration_seconds = min(duration_seconds, settings.max_dev_session_seconds)

    base_url = settings.runway_base_url.rstrip("/")
    create_url = f"{base_url}/v1/realtime_sessions"
    headers = _runway_headers(api_key)

    create_payload: dict[str, Any] = {
        "model": "gwm1_avatars",
        "avatar": {
            "type": "custom",
            "avatarId": avatar_id,
        },
        "personality": prompt,
        "startScript": "Introduce yourself in one sentence, then ask the first high-pressure question.",
        "maxDuration": duration_seconds,
    }

    created_session = _request_json(
        "POST",
        create_url,
        headers=headers,
        json_body=create_payload,
    )

    session_id = _extract_value(created_session, "id", "sessionId")
    if not session_id:
        raise RunwayError("Runway did not return a realtime session ID")

    session_key = _extract_value(created_session, "sessionKey", "session_key")
    session_details: dict[str, Any] | None = None

    for _ in range(12):
        session_details = _request_json(
            "GET",
            f"{base_url}/v1/realtime_sessions/{session_id}",
            headers=headers,
        )

        session_key = session_key or _extract_value(
            session_details,
            "sessionKey",
            "session_key",
        )

        status = str(session_details.get("status") or "").upper()
        if status == "READY":
            break
        if status == "FAILED":
            raise RunwayError(f"Runway realtime session failed: {session_details}")

        time.sleep(5)

    if not session_key:
        raise RunwayError("Runway realtime session did not return a session key")

    consume_response = _request_json(
        "POST",
        f"{base_url}/v1/realtime_sessions/{session_id}/consume",
        headers={
            "Authorization": f"Bearer {session_key}",
            "Content-Type": "application/json",
            "X-Runway-Version": RUNWAY_VERSION,
        },
    )

    return {
        "session_id": session_id,
        "session_key": session_key,
        "conversation_id": session_id,
        "state": "running",
        "raw": {
            "created_session": created_session,
            "session": session_details,
            "consume": consume_response,
        },
    }
