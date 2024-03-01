import pathlib
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "inventory management system backend"
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_URL: str

    model_config = SettingsConfigDict(env_file=f"{pathlib.Path(__file__).resolve().parent}/.env")

settings = Settings()
