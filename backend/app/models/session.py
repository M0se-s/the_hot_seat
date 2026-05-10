import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class HotSeatSession(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    session_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("session_types.id"),
        nullable=False,
    )
    active_judge_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("judges.id"),
        nullable=True,
    )

    state: Mapped[str] = mapped_column(String, default="created", nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=300, nullable=False)

    runway_session_id: Mapped[str | None] = mapped_column(String, nullable=True)
    runway_conversation_id: Mapped[str | None] = mapped_column(String, nullable=True)

    transcript: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    feedback: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    feedback_report: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    scoring: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    overall_score: Mapped[float | None] = mapped_column(Numeric, nullable=True)
    final_verdict: Mapped[str | None] = mapped_column(String, nullable=True)

    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    project = relationship("Project", back_populates="sessions")
    user = relationship("User", back_populates="sessions")
    session_type = relationship("SessionType", back_populates="sessions")
    active_judge = relationship("Judge", back_populates="active_sessions")
