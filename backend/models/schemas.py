from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    plan: str = "free"
    created_at: datetime

class User(UserResponse):
    hashed_password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class AppEntity(BaseModel):
    name: str
    fields: List[str]

class AppBase(BaseModel):
    name: str
    description: str
    features: List[str] = []
    entities: List[AppEntity] = []
    target_audience: str = ""
    framework: str = "react"
    styling: str = "tailwind"

class AppCreate(AppBase):
    pass

class AppUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    entities: Optional[List[AppEntity]] = None
    target_audience: Optional[str] = None
    framework: Optional[str] = None
    styling: Optional[str] = None
    status: Optional[str] = None
    generated_code: Optional[str] = None
    deployment_url: Optional[str] = None
    deployment_provider: Optional[str] = None

class AppResponse(AppBase):
    id: str
    user_id: str
    status: str = "draft"
    generated_code: Optional[str] = None
    deployment_url: Optional[str] = None
    deployment_provider: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class GenerateCodeRequest(BaseModel):
    app_spec: AppBase
    custom_prompt: Optional[str] = None

class DeploymentRequest(BaseModel):
    app_name: str
    provider: str
    generated_code: Optional[str] = None

class DeploymentResponse(BaseModel):
    id: str
    app_id: str
    provider: str
    status: str
    url: Optional[str] = None
    created_at: datetime
