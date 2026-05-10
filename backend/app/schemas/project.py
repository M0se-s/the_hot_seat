from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    session_type_id: UUID
    file_urls: list[str] = []
    pasted_texts: list[str] = []


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    session_type_id: UUID | None = None
    file_urls: list[str] | None = None
    pasted_texts: list[str] | None = None
    extracted_context: list[str] | None = None
    suggested_questions: list[str] | None = None
    status: str | None = None


class ProjectRead(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: str | None = None
    session_type_id: UUID
    file_urls: list[str]
    pasted_texts: list[str]
    extracted_context: list[str]
    suggested_questions: list[str]
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
