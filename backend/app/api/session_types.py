from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.db import get_db
from app.models.session_type import SessionType

router = APIRouter(tags=["session-types"])


@router.get("/session-types")
def get_session_types(db: Session = Depends(get_db)):
    session_types = (
        db.query(SessionType)
        .options(selectinload(SessionType.judge_links))
        .filter(SessionType.is_active.is_(True))
        .order_by(SessionType.name)
        .all()
    )

    response = []
    for session_type in session_types:
        ordered_links = sorted(session_type.judge_links, key=lambda link: link.order_index)
        response.append(
            {
                "id": session_type.id,
                "name": session_type.name,
                "description": session_type.description,
                "default_duration_seconds": session_type.default_duration_seconds,
                "rubric": session_type.rubric,
                "is_active": session_type.is_active,
                "judges": [link.judge for link in ordered_links],
            }
        )

    return response
