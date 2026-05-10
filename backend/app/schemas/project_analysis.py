from pydantic import BaseModel


class ProjectContextResponse(BaseModel):
    extracted_context: list[str]
    weak_spots: list[str]
    unsupported_risks: list[str]


class ProjectQuestionsResponse(BaseModel):
    suggested_questions: list[str]
    follow_up_angles: list[str]
