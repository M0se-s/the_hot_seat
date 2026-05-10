from typing import Any

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.session_type import SessionType
from app.prompts.project_analysis import (
    CONTEXT_SYSTEM_PROMPT,
    CONTEXT_USER_TEMPLATE,
    QUESTIONS_SYSTEM_PROMPT,
    QUESTIONS_USER_TEMPLATE,
)
from app.services.featherless_service import call_featherless_json


def _join_materials(items: list[str] | None, empty_message: str) -> str:
    clean_items = [item.strip() for item in items or [] if item and item.strip()]

    if not clean_items:
        return empty_message

    return "\n\n---\n\n".join(clean_items)


def _join_list(items: list[str] | None, empty_message: str) -> str:
    clean_items = [item.strip() for item in items or [] if item and item.strip()]

    if not clean_items:
        return empty_message

    return "\n".join(f"- {item}" for item in clean_items)


def _as_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []

    clean_items = []

    for item in value:
        if isinstance(item, str) and item.strip():
            clean_items.append(item.strip())

    return clean_items


def generate_context_for_project(db: Session, project: Project) -> dict[str, list[str]]:
    user_prompt = CONTEXT_USER_TEMPLATE.format(
        project_title=project.title,
        project_description=project.description or "No description provided.",
        pasted_materials=_join_materials(
            project.pasted_texts,
            "No pasted materials were provided.",
        ),
        extracted_materials=_join_materials(
            project.extracted_context,
            "No uploaded/extracted materials were provided.",
        ),
    )

    result = call_featherless_json(
        system_prompt=CONTEXT_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.2,
    )

    context_points = _as_string_list(result.get("context_points"))[:5]
    weak_spots = _as_string_list(result.get("weak_spots"))[:3]
    unsupported_risks = _as_string_list(result.get("unsupported_risks"))[:3]

    return {
        "context_points": context_points,
        "weak_spots": weak_spots,
        "unsupported_risks": unsupported_risks,
    }


def generate_questions_for_project(
    db: Session,
    project: Project,
    session_type: SessionType,
) -> dict[str, list[str]]:
    user_prompt = QUESTIONS_USER_TEMPLATE.format(
        project_title=project.title,
        project_description=project.description or "No description provided.",
        session_type_name=session_type.name,
        pasted_materials=_join_materials(
            project.pasted_texts,
            "No pasted materials were provided.",
        ),
        extracted_materials=_join_materials(
            project.extracted_context,
            "No uploaded/extracted materials were provided.",
        ),
        existing_context=_join_list(
            project.extracted_context,
            "No context has been generated yet.",
        ),
    )

    result = call_featherless_json(
        system_prompt=QUESTIONS_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.25,
    )

    pressure_questions = _as_string_list(result.get("pressure_questions"))[:5]
    follow_up_angles = _as_string_list(result.get("follow_up_angles"))[:3]

    return {
        "pressure_questions": pressure_questions,
        "follow_up_angles": follow_up_angles,
    }
