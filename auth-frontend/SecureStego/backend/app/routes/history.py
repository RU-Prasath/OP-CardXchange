"""History endpoint — list a user's past hide/reveal operations."""
from fastapi import APIRouter, Query

from app.core.dependencies import CurrentUser, DatabaseDep
from app.models.stego_models import HistoryEntry, HistoryListResponse
from app.services.history_service import list_history, serialize_history_entry


router = APIRouter()


@router.get(
    "/",
    response_model=HistoryListResponse,
    summary="List the current user's recent operations",
)
async def get_history(
    db: DatabaseDep,
    current_user: CurrentUser,
    limit: int = Query(default=50, ge=1, le=200),
):
    """
    Return the user's history of hide and reveal operations, newest first.
    """
    docs = await list_history(
        db=db,
        user_id=str(current_user["_id"]),
        limit=limit,
    )

    items = [HistoryEntry(**serialize_history_entry(d)) for d in docs]

    return HistoryListResponse(count=len(items), items=items)