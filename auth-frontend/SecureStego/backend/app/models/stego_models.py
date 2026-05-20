"""Pydantic models for steganography API contracts."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ===== Response sub-models =====

class QualityMetrics(BaseModel):
    """Visual fidelity metrics between cover and stego image."""
    mse: float
    psnr_db: Optional[float] = None  # None when images are identical (PSNR = ∞)
    psnr_label: str
    verdict: str


class ImageDimensions(BaseModel):
    """Width and height of an image."""
    width: int
    height: int


# ===== Hide endpoint =====

class HideResponse(BaseModel):
    """
    Metadata about a successful hide operation.
    The stego image itself is sent in a separate file response.
    """
    success: bool = True
    message: str
    operation_id: str
    cover_size: ImageDimensions
    secret_size: ImageDimensions
    payload_bytes: int
    capacity_bytes: int
    capacity_utilization_pct: float
    quality: QualityMetrics
    secret_hash: str
    created_at: datetime


# ===== Reveal endpoint =====

class RevealResponse(BaseModel):
    """
    Metadata about a successful reveal operation.
    The recovered secret image is sent in a separate file response.
    """
    success: bool = True
    message: str
    operation_id: str
    secret_size: ImageDimensions
    secret_hash: str
    integrity_ok: bool
    created_at: datetime


# ===== History entry =====

class HistoryEntry(BaseModel):
    """A single past operation as shown in the history list."""
    id: str = Field(..., alias="_id")
    user_id: str
    operation: str  # "HIDE" or "REVEAL"
    cover_size: Optional[ImageDimensions] = None
    secret_size: Optional[ImageDimensions] = None
    payload_bytes: Optional[int] = None
    quality: Optional[QualityMetrics] = None
    secret_hash: Optional[str] = None
    success: bool
    created_at: datetime

    model_config = ConfigDict(populate_by_name=True)


class HistoryListResponse(BaseModel):
    success: bool = True
    count: int
    items: list[HistoryEntry]