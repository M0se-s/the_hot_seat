from sqlalchemy.orm import Session

from app import models  # noqa: F401
from app.db import SessionLocal
from app.models.judge import Judge
from app.models.session_type import SessionType, SessionTypeJudge
from app.models.user import User


def seed() -> None:
    db: Session = SessionLocal()

    try:
        demo_user = db.query(User).filter(User.email == "demo@hotseat.local").first()
        if not demo_user:
            demo_user = User(
                name="Demo User",
                email="demo@hotseat.local",
                role="user",
            )
            db.add(demo_user)

        judge_specs = [
            {
                "name": "Mara Vale",
                "role_name": "Journalist",
                "personality": "Sharp, composed, skeptical, press-room energy.",
                "description": "Tracks public trust, direct answers, evasions, and harm acknowledgment.",
                "signature_pressure": "Answer the question directly.",
            },
            {
                "name": "Priya Stone",
                "role_name": "Operator",
                "personality": "Practical, impatient, execution-first.",
                "description": "Tracks ownership, deadlines, next steps, remediation, and execution.",
                "signature_pressure": "Who owns the fix, and by when?",
            },
            {
                "name": "Elias Cross",
                "role_name": "Evidence Judge",
                "personality": "Cold, precise, legalistic, evidence-obsessed.",
                "description": "Tracks unsupported claims, contradictions, source mismatch, and timeline gaps.",
                "signature_pressure": "The record does not support that.",
            },
            {
                "name": "Nova Reed",
                "role_name": "Product Judge",
                "personality": "Curious but brutal, allergic to vague product claims.",
                "description": "Tracks user pain, workflow clarity, product value, and differentiation.",
                "signature_pressure": "Who is this painfully for?",
            },
            {
                "name": "Victor Quell",
                "role_name": "Finance Judge",
                "personality": "Blunt, numbers-first, skeptical of hype.",
                "description": "Tracks pricing, buyer logic, revenue assumptions, and defensibility.",
                "signature_pressure": "Who pays, how much, and why now?",
            },
            {
                "name": "Rowan Pierce",
                "role_name": "Demo Judge",
                "personality": "Theatrical but practical, obsessed with memorability.",
                "description": "Tracks story, wow moment, technical depth, demo clarity, and hackathon fit.",
                "signature_pressure": "What is the moment people will remember?",
            },
        ]

        judges_by_name = {}
        for spec in judge_specs:
            judge = db.query(Judge).filter(Judge.name == spec["name"]).first()
            if not judge:
                judge = Judge(**spec)
                db.add(judge)
                db.flush()
            judges_by_name[judge.name] = judge

        session_type_specs = [
            {
                "name": "Crisis Panel",
                "description": "For crisis responses, public apologies, incident explanations, outage responses, and product recall responses.",
                "judges": ["Mara Vale", "Priya Stone", "Elias Cross"],
            },
            {
                "name": "Pitch Panel",
                "description": "For startup ideas, product pitches, business concepts, and investor-style pitch pressure tests.",
                "judges": ["Nova Reed", "Victor Quell", "Elias Cross"],
            },
            {
                "name": "Demo Panel",
                "description": "For hackathon demos, product walkthroughs, technical demos, and competition pitches.",
                "judges": ["Rowan Pierce", "Nova Reed", "Victor Quell"],
            },
        ]

        for spec in session_type_specs:
            session_type = (
                db.query(SessionType).filter(SessionType.name == spec["name"]).first()
            )

            if not session_type:
                session_type = SessionType(
                    name=spec["name"],
                    description=spec["description"],
                    default_duration_seconds=300,
                    rubric={},
                    is_active=True,
                )
                db.add(session_type)
                db.flush()

            for index, judge_name in enumerate(spec["judges"]):
                judge = judges_by_name[judge_name]
                existing_link = (
                    db.query(SessionTypeJudge)
                    .filter(
                        SessionTypeJudge.session_type_id == session_type.id,
                        SessionTypeJudge.judge_id == judge.id,
                    )
                    .first()
                )

                if not existing_link:
                    db.add(
                        SessionTypeJudge(
                            session_type_id=session_type.id,
                            judge_id=judge.id,
                            order_index=index,
                            weight=1.0,
                        )
                    )

        db.commit()
        print("Seed complete.")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
