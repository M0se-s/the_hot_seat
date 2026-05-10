from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.project import Project
from app.models.session_type import SessionType
from app.schemas.project_analysis import (
    ProjectContextResponse,
    ProjectQuestionsResponse,
)
from app.services.featherless_service import FeatherlessError
from app.services.project_analysis_service import (
    generate_context_for_project,
    generate_questions_for_project,
)

router = APIRouter(tags=["project-analysis"])


@router.post(
    "/projects/{project_id}/generate-context",
    response_model=ProjectContextResponse,
)
def generate_project_context(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    has_materials = any(project.pasted_texts or []) or any(project.extracted_context or [])

    if not has_materials:
        raise HTTPException(
            status_code=400,
            detail="Add pasted text or upload a source file before generating context",
        )

    try:
        result = generate_context_for_project(db, project)
    except FeatherlessError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    extracted_context = [
        *result["context_points"],
        *[f"Weak spot: {item}" for item in result["weak_spots"]],
        *[f"Unsupported risk: {item}" for item in result["unsupported_risks"]],
    ]

    project.extracted_context = extracted_context

    db.commit()
    db.refresh(project)

    return {
        "extracted_context": project.extracted_context,
        "weak_spots": result["weak_spots"],
        "unsupported_risks": result["unsupported_risks"],
    }


@router.post(
    "/projects/{project_id}/generate-questions",
    response_model=ProjectQuestionsResponse,
)
def generate_project_questions(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    session_type = (
        db.query(SessionType)
        .filter(SessionType.id == project.session_type_id)
        .first()
    )

    if not session_type:
        raise HTTPException(status_code=404, detail="Session type not found")

    has_materials = any(project.pasted_texts or []) or any(project.extracted_context or [])

    if not has_materials:
        raise HTTPException(
            status_code=400,
            detail="Add pasted text or upload a source file before generating questions",
        )

    try:
        result = generate_questions_for_project(db, project, session_type)
    except FeatherlessError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    project.suggested_questions = [
        *result["pressure_questions"],
        *[f"Follow-up angle: {item}" for item in result["follow_up_angles"]],
    ]

    db.commit()
    db.refresh(project)

    return {
        "suggested_questions": project.suggested_questions,
        "follow_up_angles": result["follow_up_angles"],
    }
