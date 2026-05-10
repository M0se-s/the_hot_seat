import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    session_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("session_types.id"),
        nullable=False,
    )
    file_urls: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    pasted_texts: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    extracted_context: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    suggested_questions: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    status: Mapped[str] = mapped_column(String, default="draft", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user = relationship("User", back_populates="projects")
    session_type = relationship("SessionType", back_populates="projects")
    sessions = relationship("HotSeatSession", back_populates="project")
