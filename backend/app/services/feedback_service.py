from typing import Any

from sqlalchemy.orm import Session, selectinload

from app.models.project import Project
from app.models.session import HotSeatSession
from app.models.session_type import SessionType, SessionTypeJudge
from app.prompts.feedback import FEEDBACK_SYSTEM_PROMPT, FEEDBACK_USER_TEMPLATE
from app.services.featherless_service import call_featherless_json


def _join_list(items: list[str] | None, empty_message: str) -> str:
    clean_items = [item.strip() for item in items or [] if item and item.strip()]
    if not clean_items:
        return empty_message

    return "\n".join(f"- {item}" for item in clean_items)


def _format_transcript(transcript: list[str] | None) -> str:
    clean_lines = [line.strip() for line in transcript or [] if line and line.strip()]
    if not clean_lines:
        return "No transcript was provided."

    return "\n".join(clean_lines)


def _format_judge_panel(session_type: SessionType) -> str:
    links = sorted(session_type.judge_links, key=lambda link: link.order_index)

    lines = []
    for link in links:
        judge = link.judge
        lines.append(
            f"- {judge.name} ({judge.role_name}): {judge.description or judge.personality}"
        )

    return "\n".join(lines) if lines else "No judge panel was configured."


def _validate_feedback_payload(payload: dict[str, Any]) -> dict[str, Any]:
    required_keys = [
        "final_verdict",
        "overall_score",
        "scoring",
        "feedback",
        "strengths",
        "weaknesses",
        "best_moment",
        "weakest_moment",
        "suggested_stronger_answers",
    ]

    for key in required_keys:
        if key not in payload:
            raise ValueError(f"Feedback payload missing required key: {key}")

    try:
        payload["overall_score"] = float(payload["overall_score"])
    except (TypeError, ValueError) as exc:
        raise ValueError("overall_score must be numeric") from exc

    payload["overall_score"] = max(0, min(100, payload["overall_score"]))

    return payload


def generate_feedback_for_session(db: Session, session: HotSeatSession) -> dict[str, Any]:
    project = db.query(Project).filter(Project.id == session.project_id).first()

    if not project:
        raise ValueError("Project not found for session")

    session_type = (
        db.query(SessionType)
        .options(
            selectinload(SessionType.judge_links).selectinload(SessionTypeJudge.judge)
        )
        .filter(SessionType.id == session.session_type_id)
        .first()
    )

    if not session_type:
        raise ValueError("Session type not found for session")

    project_materials = "\n\n".join(
        [text.strip() for text in project.pasted_texts if text and text.strip()]
    )

    if not project_materials:
        project_materials = "No pasted project materials were provided."

    user_prompt = FEEDBACK_USER_TEMPLATE.format(
        project_title=project.title,
        project_description=project.description or "No description provided.",
        session_type_name=session_type.name,
        judge_panel=_format_judge_panel(session_type),
        project_materials=project_materials,
        extracted_context=_join_list(
            project.extracted_context,
            "No extracted context has been generated yet.",
        ),
        suggested_questions=_join_list(
            project.suggested_questions,
            "No suggested pressure questions have been generated yet.",
        ),
        transcript=_format_transcript(session.transcript),
    )

    raw_feedback = call_featherless_json(
        system_prompt=FEEDBACK_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.2,
    )

    return _validate_feedback_payload(raw_feedback)
