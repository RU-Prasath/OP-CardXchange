"""Pydantic models for user-related API contracts."""
from datetime import datetime
from typing import Optional

# pyrefly: ignore [missing-import]
from pydantic import BaseModel, EmailStr, Field, ConfigDict
# pyrefly: ignore [missing-import]
from pydantic_settings import SettingsConfigDict

# ==== Request models ====

class RegisterRequest(BaseModel):
    """Body for POST /api/auth/register"""
    name: str = Field(..., min_length=2, examples=["Shalini"])
    email: EmailStr = Field(..., examples=["shalini@gmail.com"])
    password: str = Field(..., min_length=6, max_length=100, examples=["Shalini@123"])

class LoginRequest(BaseModel):
    """Body for POST /api/auth/login"""
    email: EmailStr
    password: str

# === Response models ===
class UserPublic(BaseModel):
    """Safe user representation - never includes password hash."""
    id: str = Field(..., alias="_id")
    name: str
    email: EmailStr
    created_at: Optional[datetime] = None

    # Pydantic 2.x config - allow population by alias for the _id mapping
    model_config = ConfigDict(populate_by_name=True)

class AuthResponse(BaseModel):
    """Returned by both register and login."""
    success: bool = True
    message: str
    user: UserPublic
    token: str

class MessageResponse(BaseModel):
    """Simple success/failure response."""
    success: bool
    message: str