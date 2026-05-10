from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SessionCreate(BaseModel):
    pass


class SessionEnd(BaseModel):
    transcript: list[str] = []


class SessionRead(BaseModel):
    id: UUID
    project_id: UUID
    user_id: UUID
    session_type_id: UUID
    active_judge_id: UUID | None
    state: str
    duration_seconds: int
    runway_session_id: str | None = None
    runway_conversation_id: str | None = None
    transcript: list[str]
    feedback: list[str]
    scoring: dict | None = None
    overall_score: float | None = None
    final_verdict: str | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
