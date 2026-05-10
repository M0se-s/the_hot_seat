import json
from typing import Any

import requests

from app.config import settings


class FeatherlessError(Exception):
    pass


def call_featherless_json(
    *,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
) -> dict[str, Any]:
    if not settings.featherless_api_key:
        raise FeatherlessError("FEATHERLESS_API_KEY is not configured")

    url = f"{settings.featherless_base_url.rstrip('/')}/chat/completions"

    payload: dict[str, Any] = {
        "model": settings.featherless_model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature,
        "response_format": {"type": "json_object"},
    }

    headers = {
        "Authorization": f"Bearer {settings.featherless_api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=120)
    except requests.RequestException as exc:
        raise FeatherlessError(f"Featherless request failed: {exc}") from exc

    if response.status_code >= 400:
        raise FeatherlessError(
            f"Featherless returned {response.status_code}: {response.text}"
        )

    data = response.json()

    try:
        content = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as exc:
        raise FeatherlessError("Featherless response did not include message content") from exc

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as exc:
        raise FeatherlessError("Featherless returned invalid JSON") from exc

    if not isinstance(parsed, dict):
        raise FeatherlessError("Featherless JSON response was not an object")

    return parsed
