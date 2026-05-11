from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models.project import Project
from app.schemas.upload import UploadResponse
from app.services.source_extraction_service import (
    SourceExtractionError,
    clean_extracted_text,
    extract_text_from_source,
)
from app.services.supabase_storage_service import (
    SupabaseStorageError,
    upload_bytes_to_supabase,
)

router = APIRouter(tags=["uploads"])

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "text/plain",
}

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt",
}


def _validate_filename(filename: str | None) -> str:
    if not filename:
        raise HTTPException(status_code=400, detail="File must have a filename")

    lower = filename.lower()

    if not any(lower.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400, detail="Only PDF and TXT files are supported"
        )

    return filename


@router.post("/projects/{project_id}/uploads", response_model=UploadResponse)
async def upload_project_file(
    project_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    filename = _validate_filename(file.filename)
    content_type = file.content_type or "application/octet-stream"

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400, detail="Only PDF and TXT files are supported"
        )

    content = await file.read()

    max_size_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(content) > max_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size is {settings.max_upload_size_mb} MB.",
        )

    cleaned_text = ""

    try:
        extracted_text = extract_text_from_source(
            content=content,
            filename=filename,
            content_type=content_type,
        )
        cleaned_text = clean_extracted_text(extracted_text)
    except SourceExtractionError:
        # Fallback: keep the upload even if extraction fails. The raw file is still useful.
        cleaned_text = ""

    try:
        file_url = upload_bytes_to_supabase(
            content=content,
            original_filename=filename,
            content_type=content_type,
            project_id=str(project.id),
        )
    except SupabaseStorageError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    project.file_urls = [*project.file_urls, file_url]
    if cleaned_text:
        project.extracted_context = [*project.extracted_context, cleaned_text]

    db.commit()
    db.refresh(project)

    return {
        "file_url": file_url,
        "filename": filename,
        "content_type": content_type,
        "extracted_text": cleaned_text,
    }
