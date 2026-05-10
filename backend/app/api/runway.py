from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.session import HotSeatSession
from app.schemas.runway import RunwayStartResponse
from app.services.runway_service import (
    RunwayError,
    build_runway_prompt,
    create_runway_realtime_session,
)

router = APIRouter(tags=["runway"])


@router.post("/sessions/{session_id}/runway/start", response_model=RunwayStartResponse)
def start_runway_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        avatar_id, prompt = build_runway_prompt(db, session)
        runway_response = create_runway_realtime_session(
            avatar_id=avatar_id,
            prompt=prompt,
            duration_seconds=session.duration_seconds,
        )
    except RunwayError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    runway_session_id = (
        runway_response.get("sessionId")
        or runway_response.get("session_id")
        or runway_response.get("id")
    )

    session_key = (
        runway_response.get("sessionKey")
        or runway_response.get("session_key")
        or runway_response.get("clientSecret")
        or runway_response.get("client_secret")
    )

    if not runway_session_id:
        raise HTTPException(
            status_code=502,
            detail="Runway response did not include a session ID",
        )

    session.runway_session_id = runway_session_id
    session.runway_conversation_id = runway_session_id
    session.state = "running"
    session.started_at = session.started_at or datetime.utcnow()

    db.commit()
    db.refresh(session)

    return {
        "session_id": runway_session_id,
        "session_key": session_key,
        "conversation_id": runway_session_id,
        "state": session.state,
        "raw": runway_response,
    }


@router.post("/sessions/{session_id}/runway/end")
def end_runway_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.state = "ended"
    session.ended_at = datetime.utcnow()

    db.commit()

    return {"status": "ended"}
