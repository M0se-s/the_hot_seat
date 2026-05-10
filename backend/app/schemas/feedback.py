from pydantic import BaseModel


class FeedbackReportRead(BaseModel):
    final_verdict: str
    overall_score: float
    scoring: dict
    feedback: list[str]
    strengths: list[str]
    weaknesses: list[str]
    best_moment: str
    weakest_moment: str
    suggested_stronger_answers: list[str]
    transcript: list[str] = []
