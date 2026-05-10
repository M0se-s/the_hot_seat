from pydantic import BaseModel


class UploadResponse(BaseModel):
    file_url: str
    filename: str
    content_type: str
    extracted_text: str