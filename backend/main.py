from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api import auth, apps, generate, deploy
from utils.database import connect_to_mongo, close_mongo_connection

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Digital Ninja App Builder API",
    description="Self-hosted backend for building and deploying apps with AI",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and shutdown events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(apps.router, prefix="/api/apps", tags=["Apps"])
app.include_router(generate.router, prefix="/api/generate", tags=["AI Generation"])
app.include_router(deploy.router, prefix="/api/deploy", tags=["Deployment"])

@app.get("/")
async def root():
    return {
        "message": "Digital Ninja App Builder API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )
