from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    api_title: str = "The Hot Seat API"
    cors_origins: str = "http://localhost:3000"
    database_url: str
    featherless_api_key: str | None = None
    featherless_base_url: str = "https://api.featherless.ai/v1"
    featherless_model: str = "openai/gpt-oss-120b"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings() # type: ignore
