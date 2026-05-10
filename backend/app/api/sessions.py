from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.project import Project
from app.models.session import HotSeatSession
from app.models.session_type import SessionTypeJudge
from app.schemas.session import SessionEnd, SessionRead

router = APIRouter(tags=["sessions"])


@router.post("/projects/{project_id}/sessions", response_model=SessionRead)
def create_session(project_id: UUID, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    first_judge_link = (
        db.query(SessionTypeJudge)
        .filter(SessionTypeJudge.session_type_id == project.session_type_id)
        .order_by(SessionTypeJudge.order_index.asc())
        .first()
    )

    if not first_judge_link:
        raise HTTPException(status_code=400, detail="Session type has no judges")

    session = HotSeatSession(
        project_id=project.id,
        user_id=project.user_id,
        session_type_id=project.session_type_id,
        active_judge_id=first_judge_link.judge_id,
        state="created",
        duration_seconds=300,
        transcript=[],
        feedback=[],
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/sessions/{session_id}", response_model=SessionRead)
def get_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session


@router.post("/sessions/{session_id}/start", response_model=SessionRead)
def start_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.state = "running"
    session.started_at = datetime.utcnow()

    db.commit()
    db.refresh(session)

    return session


@router.post("/sessions/{session_id}/end", response_model=SessionRead)
def end_session(
    session_id: UUID,
    payload: SessionEnd,
    db: Session = Depends(get_db),
):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.state = "ended"
    session.ended_at = datetime.utcnow()
    session.transcript = payload.transcript

    db.commit()
    db.refresh(session)

    return session
