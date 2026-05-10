from pydantic import BaseModel


class RunwayStartResponse(BaseModel):
    session_id: str
    session_key: str | None = None
    conversation_id: str | None = None
    state: str = "running"
    raw: dict | None = None