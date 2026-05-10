from fastapi import APIRouter

from app.data.seed_data import DEMO_USER

router = APIRouter(tags=["demo-user"])


@router.get("/demo-user")
def get_demo_user():
    return DEMO_USER
