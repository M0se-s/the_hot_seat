from fastapi import APIRouter

from app.data.seed_data import JUDGES

router = APIRouter(tags=["judges"])


@router.get("/judges")
def get_judges():
    return JUDGES
