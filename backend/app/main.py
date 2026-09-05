import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import (
    auth, projects, tasks, files, approvals,
    messages, notifications, ai, reports, health
)
from app.seed import seed_database

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

# Auto seed database for zero-config hackathon demo
try:
    seed_database()
except Exception as e:
    print(f"Seed database warning: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ClientFlow AI - Hackathon ready production client collaboration portal API",
    version="1.0.0"
)

# Configure CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(files.router)
app.include_router(approvals.router)
app.include_router(messages.router)
app.include_router(notifications.router)
app.include_router(ai.router)
app.include_router(reports.router)
app.include_router(health.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to ClientFlow AI API",
        "docs": "/docs",
        "health": "/health"
    }
