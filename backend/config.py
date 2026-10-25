import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env file from backend or root directory if present
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(ROOT_DIR / ".env")

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    # Default model strictly conforms to Gemma 4 options: gemma-4-26b-a4b-it or gemma-4-31b-it
    GEMMA_MODEL_ID: str = os.getenv("GEMMA_MODEL_ID", "gemma-4-26b-a4b-it")
    APP_NAME: str = "ECHO — Multimodal Evidence Intelligence Engine"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CASE_NAME: str = "Operation Apex Glass - Corporate Server Facility Breach"
    STORAGE_DIR: Path = BASE_DIR / "data"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
