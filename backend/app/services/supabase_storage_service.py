import uuid
from pathlib import Path

from supabase import create_client

from app.config import settings


class SupabaseStorageError(Exception):
    pass


def _get_supabase_client():
    if not settings.supabase_url:
        raise SupabaseStorageError("SUPABASE_URL is not configured")

    if not settings.supabase_service_role_key:
        raise SupabaseStorageError("SUPABASE_SERVICE_ROLE_KEY is not configured")

    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def upload_bytes_to_supabase(
    *,
    content: bytes,
    original_filename: str,
    content_type: str,
    project_id: str,
) -> str:
    suffix = Path(original_filename).suffix.lower()

    if suffix not in {".pdf", ".txt"}:
        raise SupabaseStorageError("Only PDF and TXT files are supported")

    bucket_name = settings.supabase_storage_bucket
    storage_path = f"projects/{project_id}/sources/{uuid.uuid4()}{suffix}"

    client = _get_supabase_client()

    try:
        client.storage.from_(bucket_name).upload(
            path=storage_path,
            file=content,
            file_options={
                "content-type": content_type,
                "upsert": "false",
            },
        )
    except Exception as exc:
        raise SupabaseStorageError(f"Supabase upload failed: {exc}") from exc

    try:
        public_url = client.storage.from_(bucket_name).get_public_url(storage_path)
    except Exception as exc:
        raise SupabaseStorageError(f"Could not create Supabase public URL: {exc}") from exc

    return public_url