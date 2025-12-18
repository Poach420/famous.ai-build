from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
import uuid
import json

from models.schemas import DeploymentRequest, DeploymentResponse
from api.auth import get_current_user
from utils.database import get_database

router = APIRouter()

@router.post("/prepare")
async def prepare_deployment(
    request: DeploymentRequest,
    current_user: dict = Depends(get_current_user)
):
    """Prepare deployment bundle for Vercel or Render."""
    
    provider = request.provider.lower()
    
    if provider not in ['vercel', 'render']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provider must be 'vercel' or 'render'"
        )
    
    # Build deployment configuration
    bundle = build_deployment_bundle(
        app_name=request.app_name,
        provider=provider,
        generated_code=request.generated_code
    )
    
    return {"bundle": bundle}

@router.post("/status")
async def get_deployment_status(
    app_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get deployment status for an app or all user apps."""
    db = await get_database()
    user_id = current_user["sub"]
    
    query = {"user_id": user_id}
    if app_id:
        query["app_id"] = app_id
    
    deployments_cursor = db.deployments.find(query)
    deployments = await deployments_cursor.to_list(length=100)
    
    return [
        DeploymentResponse(
            id=d["id"],
            app_id=d["app_id"],
            provider=d["provider"],
            status=d["status"],
            url=d.get("url"),
            created_at=d["created_at"]
        )
        for d in deployments
    ]

@router.post("/update-status")
async def update_deployment_status(
    deployment_id: str,
    status: str,
    url: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Update deployment status."""
    db = await get_database()
    user_id = current_user["sub"]
    
    update_data = {"status": status}
    if url:
        update_data["url"] = url
    
    result = await db.deployments.update_one(
        {"id": deployment_id, "user_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deployment not found"
        )
    
    return {"success": True, "message": "Deployment status updated"}

def build_deployment_bundle(
    app_name: str,
    provider: str,
    generated_code: Optional[str] = None
) -> dict:
    """Build deployment bundle with configuration files."""
    
    safe_name = app_name.lower().replace(' ', '-').replace('_', '-')
    
    # Base configuration
    config = {
        "name": safe_name,
        "framework": "react",
        "buildCommand": "npm run build",
        "outputDirectory": "dist",
        "installCommand": "npm install",
        "nodeVersion": "18.x"
    }
    
    # Provider-specific configuration
    if provider == "vercel":
        config["vercel"] = {
            "version": 2,
            "builds": [
                {
                    "src": "package.json",
                    "use": "@vercel/static-build",
                    "config": {"distDir": "dist"}
                }
            ]
        }
        config["instructions"] = [
            "1. Install Vercel CLI: npm i -g vercel",
            "2. Login: vercel login",
            "3. Deploy: vercel --prod",
            "4. Set environment variables in Vercel dashboard if needed"
        ]
    else:  # render
        config["render"] = {
            "services": [
                {
                    "type": "web",
                    "name": safe_name,
                    "env": "static",
                    "buildCommand": "npm install && npm run build",
                    "staticPublishPath": "./dist"
                }
            ]
        }
        config["instructions"] = [
            "1. Go to render.com and create a new Static Site",
            "2. Connect your GitHub repository",
            "3. Set build command: npm run build",
            "4. Set publish directory: dist",
            "5. Deploy"
        ]
    
    # File templates
    files = {
        "README.md": generate_readme(app_name, provider),
        "vercel.json" if provider == "vercel" else "render.yaml": json.dumps(
            config.get(provider, {}), indent=2
        )
    }
    
    return {
        "config": config,
        "files": files,
        "generatedCode": generated_code
    }

def generate_readme(app_name: str, provider: str) -> str:
    """Generate README for deployment."""
    return f"""# {app_name}

## Deployment Instructions ({provider.title()})

This application is ready to be deployed to {provider.title()}.

### Prerequisites
- Node.js 18+
- npm or yarn
- {provider.title()} account

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Deploy to {provider.title()}
Follow the instructions in the deployment bundle.

---
Built with Digital Ninja App Builder
"""
