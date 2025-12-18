from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime
import uuid

from models.schemas import UserCreate, UserResponse, TokenResponse
from utils.auth import hash_password, verify_password, create_access_token, create_refresh_token, verify_token
from utils.database import get_database

router = APIRouter()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user from token."""
    token = credentials.credentials
    payload = verify_token(token, "access")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return payload

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    db = await get_database()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": hash_password(user_data.password),
        "plan": "free",
        "created_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user)
    
    # Create tokens
    token_data = {"sub": user_id, "email": user_data.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        plan="free",
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/login", response_model=TokenResponse)
async def login(email: str, password: str):
    """Login user."""
    db = await get_database()
    
    # Find user
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create tokens
    token_data = {"sub": user["id"], "email": user["email"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        plan=user.get("plan", "free"),
        created_at=user["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token."""
    payload = verify_token(refresh_token, "refresh")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    token_data = {"sub": payload["sub"], "email": payload["email"]}
    access_token = create_access_token(token_data)
    
    return {"access_token": access_token}

@router.post("/verify")
async def verify_access_token(current_user: dict = Depends(get_current_user)):
    """Verify access token."""
    return {"valid": True, "user_id": current_user["sub"]}
