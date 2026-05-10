from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.judge import Judge
from app.schemas.judge import JudgeRead

router = APIRouter(tags=["judges"])


@router.get("/judges", response_model=list[JudgeRead])
def get_judges(db: Session = Depends(get_db)):
    return db.query(Judge).filter(Judge.is_active.is_(True)).order_by(Judge.name).all()
