import os

from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models.judge import Judge


def set_avatar() -> None:
    avatar_id = os.getenv("RUNWAY_DEFAULT_AVATAR_ID")

    if not avatar_id:
        raise RuntimeError("RUNWAY_DEFAULT_AVATAR_ID is not configured")

    db: Session = SessionLocal()

    try:
        for judge_name in ["Rowan Pierce", "Mara Vale", "Nova Reed"]:
            judge = db.query(Judge).filter(Judge.name == judge_name).first()
            if judge:
                judge.avatar_id = avatar_id

        db.commit()
        print("Runway avatar IDs updated.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    set_avatar()
