# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings, loaded from .env file."""

    # App metadata
    APP_NAME: str = "SecureStego"
    ENV: str = "development"
    APP_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # MongoDB
    MONGO_URI: str
    DB_NAME: str = "naru_hina"

    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 10080  # 7 days

    # Cryptography
    PBKDF2_ITERATIONS: int = 100000

    # Upload limits
    MAX_UPLOAD_MB: int = 20

    # CORS (frontend URL)
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

# Singleton settings instance
settings = Settings()