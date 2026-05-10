from uuid import UUID

from pydantic import BaseModel, ConfigDict


class JudgeRead(BaseModel):
    id: UUID
    name: str
    role_name: str
    personality: str
    description: str | None = None
    signature_pressure: str | None = None
    avatar_id: str | None = None
    voice_preset: str | None = None
    base_prompt: str | None = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
