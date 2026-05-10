from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    api_title: str = "The Hot Seat API"
    cors_origins: str = "http://localhost:3000"
    database_url: str
    featherless_api_key: str | None = None
    featherless_base_url: str = "https://api.featherless.ai/v1"
    featherless_model: str = "openai/gpt-oss-120b"
    runway_env: str = "test"
    runway_api_key_test: str | None = None
    runway_api_key_hackathon: str | None = None
    runway_base_url: str = "https://api.dev.runwayml.com"
    max_dev_session_seconds: int = 60
    allow_long_test_sessions: bool = False
    runway_default_avatar_id: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()  # type: ignore
