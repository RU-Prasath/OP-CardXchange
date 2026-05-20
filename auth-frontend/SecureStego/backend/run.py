"""
Entry point to start the FastAPI server.
Usage: python run.py
"""
# pyrefly: ignore [missing-import]
import uvicorn

from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENV == "development",
        log_level="info",
    )