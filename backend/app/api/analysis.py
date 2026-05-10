from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.session import HotSeatSession
from app.schemas.feedback import FeedbackReportRead
from app.services.featherless_service import FeatherlessError
from app.services.feedback_service import generate_feedback_for_session

router = APIRouter(tags=["analysis"])


@router.post("/sessions/{session_id}/analyze", response_model=FeedbackReportRead)
def analyze_session(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.state not in {"ended", "completed"}:
        raise HTTPException(
            status_code=400,
            detail="Session must be ended before analysis",
        )

    try:
        feedback_report = generate_feedback_for_session(db, session)
    except FeatherlessError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    feedback_report_with_transcript = {
        **feedback_report,
        "transcript": session.transcript,
    }

    session.feedback = feedback_report.get("feedback", [])
    session.feedback_report = feedback_report_with_transcript
    session.scoring = feedback_report.get("scoring")
    session.overall_score = feedback_report.get("overall_score")
    session.final_verdict = feedback_report.get("final_verdict")
    session.state = "completed"

    db.commit()
    db.refresh(session)

    return feedback_report_with_transcript


@router.get("/sessions/{session_id}/feedback", response_model=FeedbackReportRead)
def get_session_feedback(session_id: UUID, db: Session = Depends(get_db)):
    session = db.query(HotSeatSession).filter(HotSeatSession.id == session_id).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if not session.feedback_report:
        raise HTTPException(
            status_code=404, detail="Feedback has not been generated yet"
        )

    return session.feedback_report
