from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter(tags=["demo-user"])


@router.get("/demo-user", response_model=UserRead)
def get_demo_user(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "demo@hotseat.local").first()

    if not user:
        raise HTTPException(status_code=404, detail="Demo user not seeded")

    return user
