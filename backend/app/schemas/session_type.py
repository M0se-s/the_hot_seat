from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.judge import JudgeRead


class SessionTypeRead(BaseModel):
    id: UUID
    name: str
    description: str | None = None
    default_duration_seconds: int
    rubric: dict | None = None
    is_active: bool
    judges: list[JudgeRead] = []

    model_config = ConfigDict(from_attributes=True)
