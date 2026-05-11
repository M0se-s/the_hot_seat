from sqlalchemy.orm import Session

from app.config import settings
from app.db import SessionLocal
from app.models.judge import Judge


JUDGE_AVATAR_MAP = {
    "Mara Vale": "runway_mara_avatar_id",
    "Nova Reed": "runway_nova_avatar_id",
    "Rowan Pierce": "runway_rowan_avatar_id",
}


def _get_avatar_id(setting_name: str) -> str | None:
    specific_avatar_id = getattr(settings, setting_name, None)

    if specific_avatar_id:
        return specific_avatar_id

    return settings.runway_default_avatar_id


def set_avatar_ids() -> None:
    db: Session = SessionLocal()

    try:
        for judge_name, setting_name in JUDGE_AVATAR_MAP.items():
            judge = db.query(Judge).filter(Judge.name == judge_name).first()

            if not judge:
                print(f"Skipped {judge_name}: judge not found")
                continue

            avatar_id = _get_avatar_id(setting_name)

            if not avatar_id:
                print(f"Skipped {judge_name}: no avatar ID configured")
                continue

            judge.avatar_id = avatar_id
            print(f"Updated {judge_name} avatar_id -> {avatar_id}")

        db.commit()
        print("Runway avatar IDs updated.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    set_avatar_ids()
