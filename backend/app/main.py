from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    analysis,
    demo_user,
    health,
    judges,
    projects,
    runway,
    session_types,
    sessions,
    uploads,
)
from app.config import settings

app = FastAPI(title=settings.api_title)

origins = [
    origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(analysis.router)
app.include_router(demo_user.router)
app.include_router(judges.router)
app.include_router(session_types.router)
app.include_router(projects.router)
app.include_router(runway.router)
app.include_router(uploads.router)
app.include_router(sessions.router)
