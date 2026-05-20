from contextlib import asynccontextmanager
from datetime import datetime
# pyrefly: ignore [missing-import]
from fastapi.openapi.utils import get_openapi

# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.mongo import connect_to_mongo, close_mongo_connection
from app.routes import auth, stego, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages startup and shutdown events.
    Runs before the first request and after the last.
    """
    # === Startup ===
    print(f"Starting {settings.APP_NAME} in {settings.ENV} mode...")
    await connect_to_mongo()
    yield
    # === Shutdown ===
    await close_mongo_connection()
    print(f"{settings.APP_NAME} shutdown complete")

# Create FastAPI app with metadata (powers /docs)
app = FastAPI(
    title=settings.APP_NAME,
    description="Hybrid Image-in-Image Steganography with AES Cryptography",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS - allow React frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint to verify server is running."""
    return {
        "success": True,
        "message": f"{settings.APP_NAME} API is running",
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat(),
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all error handler returning JSON instead of HTML stack traces."""
    print(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": str(exc) or "Internal Server Error",
            "timestamp": datetime.utcnow().isoformat(),
        }
    )

def custom_openapi():
    """Custom OpenAPI schema to enable JWT authorization in Swagger UI."""
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Apply security to all routes (frontend can opt-out per route if needed)
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return openapi_schema


app.openapi = custom_openapi

# ===== API Routes =====
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(stego.router, prefix="/api/stego", tags=["Steganography"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
