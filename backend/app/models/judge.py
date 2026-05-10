import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Judge(Base):
    __tablename__ = "judges"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    role_name: Mapped[str] = mapped_column(String, nullable=False)
    personality: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    signature_pressure: Mapped[str | None] = mapped_column(Text, nullable=True)
    avatar_id: Mapped[str | None] = mapped_column(String, nullable=True)
    voice_preset: Mapped[str | None] = mapped_column(String, nullable=True)
    base_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    session_type_links = relationship("SessionTypeJudge", back_populates="judge")
    active_sessions = relationship("HotSeatSession", back_populates="active_judge")
