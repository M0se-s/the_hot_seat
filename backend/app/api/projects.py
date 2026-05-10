from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.project import Project
from app.models.session_type import SessionType
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate

router = APIRouter(tags=["projects"])


def get_demo_user_or_404(db: Session) -> User:
    user = db.query(User).filter(User.email == "demo@hotseat.local").first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not seeded")
    return user


@router.post("/projects", response_model=ProjectRead)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    user = get_demo_user_or_404(db)

    session_type = (
        db.query(SessionType)
        .filter(SessionType.id == payload.session_type_id)
        .first()
    )

    if not session_type:
        raise HTTPException(status_code=404, detail="Session type not found")

    project = Project(
        user_id=user.id,
        title=payload.title,
        description=payload.description,
        session_type_id=payload.session_type_id,
        file_urls=payload.file_urls,
        pasted_texts=payload.pasted_texts,
        extracted_context=[],
        suggested_questions=[],
        status="draft",
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get("/projects", response_model=list[ProjectRead])
def get_projects(db: Session = Depends(get_db)):
    user = get_demo_user_or_404(db)

    return (
        db.query(Project)
        .filter(Project.user_id == user.id)
        .order_by(Project.created_at.desc())
        .all()
    )


@router.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


@router.patch("/projects/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)

    return project


@router.delete("/projects/{project_id}")
def delete_project(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    return {"status": "deleted"}
