from fastapi import APIRouter

from app.data.seed_data import JUDGES, SESSION_TYPES

router = APIRouter(tags=["session-types"])


@router.get("/session-types")
def get_session_types():
    judges_by_id = {judge["id"]: judge for judge in JUDGES}

    session_types = []
    for session_type in SESSION_TYPES:
        session_types.append(
            {
                **session_type,
                "judges": [
                    judges_by_id[judge_id]
                    for judge_id in session_type["judge_ids"]
                    if judge_id in judges_by_id
                ],
            }
        )

    return session_types
