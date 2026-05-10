from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserRead(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    job_title: str | None = None

    model_config = ConfigDict(from_attributes=True)
