from io import BytesIO

from pypdf import PdfReader


class SourceExtractionError(Exception):
    pass


def extract_text_from_txt(content: bytes) -> str:
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        try:
            return content.decode("latin-1")
        except UnicodeDecodeError as exc:
            raise SourceExtractionError("Could not decode TXT file") from exc


def extract_text_from_pdf(content: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(content))
        pages = []

        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text.strip())

        extracted = "\n\n".join(pages).strip()

        if not extracted:
            raise SourceExtractionError(
                "No selectable text found in PDF. OCR is not supported in MVP."
            )

        return extracted
    except SourceExtractionError:
        raise
    except Exception as exc:
        raise SourceExtractionError("Could not extract text from PDF") from exc


def extract_text_from_source(
    *,
    content: bytes,
    filename: str,
    content_type: str,
) -> str:
    lower_filename = filename.lower()

    if lower_filename.endswith(".txt") or content_type == "text/plain":
        return extract_text_from_txt(content)

    if lower_filename.endswith(".pdf") or content_type == "application/pdf":
        return extract_text_from_pdf(content)

    raise SourceExtractionError("Only PDF and TXT files are supported")


def clean_extracted_text(text: str, max_chars: int = 12000) -> str:
    clean = "\n".join(line.strip() for line in text.splitlines() if line.strip())
    clean = clean.strip()

    if len(clean) > max_chars:
        return clean[:max_chars] + "\n\n[Truncated for MVP upload limit.]"

    return clean