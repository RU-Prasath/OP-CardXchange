"""Authentication endpoints."""
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, status

from app.core.dependencies import CurrentUser, DatabaseDep
from app.core.security import create_access_token, verify_password
from app.models.user_models import (
    AuthResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    UserPublic,
)
from app.services.user_service import (
    create_user,
    find_user_by_email,
    serialize_user,
)


router = APIRouter()


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register(payload: RegisterRequest, db: DatabaseDep):
    """
    Create a new user account.

    - Validates email format and password length via Pydantic.
    - Stores password as a bcrypt hash.
    - Returns a JWT token for immediate login.
    """
    # Check for duplicate email
    existing = await find_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    # Create user
    user = await create_user(
        db=db,
        name=payload.name,
        email=payload.email,
        password=payload.password,
    )

    # Generate JWT
    token = create_access_token(subject=str(user["_id"]))

    print(f"✅ User registered: {payload.email}")

    return AuthResponse(
        message="User registered successfully",
        user=UserPublic(**serialize_user(user)),
        token=token,
    )


@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Log in with email and password",
)
async def login(payload: LoginRequest, db: DatabaseDep):
    """
    Authenticate a user and return a JWT token.
    """
    user = await find_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(subject=str(user["_id"]))

    print(f"✅ User logged in: {payload.email}")

    return AuthResponse(
        message="Login successful",
        user=UserPublic(**serialize_user(user)),
        token=token,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Log out current user",
)
async def logout(current_user: CurrentUser):
    """
    Logout endpoint.

    Note: JWT is stateless — the client should simply delete the token.
    This endpoint exists for API completeness and audit logging.
    """
    print(f"👋 User logged out: {current_user['email']}")
    return MessageResponse(success=True, message="Logged out successfully")


@router.get(
    "/me",
    response_model=UserPublic,
    summary="Get the currently authenticated user",
)
async def get_me(current_user: CurrentUser):
    """
    Return the profile of the currently authenticated user.
    Used by the frontend to restore session on page refresh.
    """
    return UserPublic(**serialize_user(current_user))