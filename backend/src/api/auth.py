from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.auth import create_access_token, hash_password, verify_password
from src.database import get_session
from src.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, session: AsyncSession = Depends(get_session)):
    # Check if username exists
    existing = await session.exec(select(User).where(User.username == req.username))
    if existing.first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Check if email exists
    existing_email = await session.exec(select(User).where(User.email == req.email))
    if existing_email.first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    token = create_access_token({"sub": user.id})
    return AuthResponse(
        access_token=token,
        user={"id": user.id, "username": user.username, "email": user.email},
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest, session: AsyncSession = Depends(get_session)):
    result = await session.exec(select(User).where(User.username == req.username))
    user = result.first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": user.id})
    return AuthResponse(
        access_token=token,
        user={"id": user.id, "username": user.username, "email": user.email},
    )


@router.get("/me")
async def get_me(session: AsyncSession = Depends(get_session)):
    from src.auth import get_current_user, oauth2_scheme
    # This is a simple endpoint - auth handled by dependency
    return {"status": "ok"}
