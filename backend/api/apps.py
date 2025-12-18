from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime
import uuid

from models.schemas import AppCreate, AppUpdate, AppResponse
from api.auth import get_current_user
from utils.database import get_database

router = APIRouter()

@router.get("/", response_model=List[AppResponse])
async def list_apps(current_user: dict = Depends(get_current_user)):
    """List all apps for the current user."""
    db = await get_database()
    user_id = current_user["sub"]
    
    apps_cursor = db.apps.find({"user_id": user_id})
    apps = await apps_cursor.to_list(length=100)
    
    return [
        AppResponse(
            id=app["id"],
            user_id=app["user_id"],
            name=app["name"],
            description=app["description"],
            features=app.get("features", []),
            entities=app.get("entities", []),
            target_audience=app.get("target_audience", ""),
            framework=app.get("framework", "react"),
            styling=app.get("styling", "tailwind"),
            status=app.get("status", "draft"),
            generated_code=app.get("generated_code"),
            deployment_url=app.get("deployment_url"),
            deployment_provider=app.get("deployment_provider"),
            created_at=app["created_at"],
            updated_at=app["updated_at"]
        )
        for app in apps
    ]

@router.get("/{app_id}", response_model=AppResponse)
async def get_app(app_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific app."""
    db = await get_database()
    user_id = current_user["sub"]
    
    app = await db.apps.find_one({"id": app_id, "user_id": user_id})
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    return AppResponse(
        id=app["id"],
        user_id=app["user_id"],
        name=app["name"],
        description=app["description"],
        features=app.get("features", []),
        entities=app.get("entities", []),
        target_audience=app.get("target_audience", ""),
        framework=app.get("framework", "react"),
        styling=app.get("styling", "tailwind"),
        status=app.get("status", "draft"),
        generated_code=app.get("generated_code"),
        deployment_url=app.get("deployment_url"),
        deployment_provider=app.get("deployment_provider"),
        created_at=app["created_at"],
        updated_at=app["updated_at"]
    )

@router.post("/", response_model=AppResponse)
async def create_app(app_data: AppCreate, current_user: dict = Depends(get_current_user)):
    """Create a new app."""
    db = await get_database()
    user_id = current_user["sub"]
    
    app_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    app = {
        "id": app_id,
        "user_id": user_id,
        "name": app_data.name,
        "description": app_data.description,
        "features": app_data.features,
        "entities": [entity.dict() for entity in app_data.entities],
        "target_audience": app_data.target_audience,
        "framework": app_data.framework,
        "styling": app_data.styling,
        "status": "draft",
        "generated_code": None,
        "deployment_url": None,
        "deployment_provider": None,
        "created_at": now,
        "updated_at": now
    }
    
    await db.apps.insert_one(app)
    
    return AppResponse(**app)

@router.put("/{app_id}", response_model=AppResponse)
async def update_app(
    app_id: str, 
    app_data: AppUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update an existing app."""
    db = await get_database()
    user_id = current_user["sub"]
    
    app = await db.apps.find_one({"id": app_id, "user_id": user_id})
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Prepare update data
    update_data = app_data.dict(exclude_unset=True)
    if "entities" in update_data and update_data["entities"]:
        update_data["entities"] = [entity.dict() for entity in app_data.entities]
    
    update_data["updated_at"] = datetime.utcnow()
    
    # Update in database
    await db.apps.update_one(
        {"id": app_id, "user_id": user_id},
        {"$set": update_data}
    )
    
    # Fetch updated app
    updated_app = await db.apps.find_one({"id": app_id, "user_id": user_id})
    
    return AppResponse(
        id=updated_app["id"],
        user_id=updated_app["user_id"],
        name=updated_app["name"],
        description=updated_app["description"],
        features=updated_app.get("features", []),
        entities=updated_app.get("entities", []),
        target_audience=updated_app.get("target_audience", ""),
        framework=updated_app.get("framework", "react"),
        styling=updated_app.get("styling", "tailwind"),
        status=updated_app.get("status", "draft"),
        generated_code=updated_app.get("generated_code"),
        deployment_url=updated_app.get("deployment_url"),
        deployment_provider=updated_app.get("deployment_provider"),
        created_at=updated_app["created_at"],
        updated_at=updated_app["updated_at"]
    )

@router.delete("/{app_id}")
async def delete_app(app_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an app."""
    db = await get_database()
    user_id = current_user["sub"]
    
    result = await db.apps.delete_one({"id": app_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    return {"success": True, "message": "App deleted"}
