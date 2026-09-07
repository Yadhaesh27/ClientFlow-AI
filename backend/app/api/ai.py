from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.core.database import get_db
from app.models import Project, Task, Approval, Message, User
from app.schemas.schemas import (
    AIExtractTasksRequest, AIChatRequest, ExtractedTaskItem,
    AISummaryResponse, AIRiskResponse, AIScopeCreepRequest,
    AIScopeCreepResponse, AIDraftUpdateRequest, AIDraftUpdateResponse,
    AISmartAssignRequest, AISmartAssignResponse, AISentimentResponse
)
from app.services.ai_service import (
    generate_project_summary, extract_tasks_from_feedback,
    analyze_project_risk, stream_project_chat,
    detect_scope_creep, draft_client_update,
    suggest_task_assignee, analyze_client_sentiment,
    chat_with_project_context
)
from app.services.health_service import calculate_project_health

router = APIRouter(prefix="/api/ai", tags=["ai"])

def get_project_dict_context(project: Optional[Project]) -> Dict[str, Any]:
    if not project:
        return {
            "id": "proj_1",
            "name": "E-Commerce Platform Overhaul",
            "description": "Complete website redesign and checkout optimization.",
            "status": "ACTIVE",
            "progress": 82,
            "health_score": 87,
            "deadline": "2026-10-15",
            "tasks": [
                {"title": "Implement hero section layout", "status": "DONE", "priority": "HIGH"},
                {"title": "Setup Analytics and SEO", "status": "IN_PROGRESS", "priority": "MEDIUM"},
                {"title": "Client Sign-off on Deliverable", "status": "REVIEW", "priority": "URGENT"},
            ],
            "approvals": [{"title": "Homepage Design v4 Sign-off", "status": "PENDING"}],
            "milestones": [],
            "messages": []
        }

    tasks = [{"title": t.title, "status": t.status, "priority": t.priority, "due_date": t.due_date} for t in (project.tasks or [])]
    approvals = [{"title": a.title, "status": a.status, "feedback": a.feedback} for a in (project.approvals or [])]
    messages = [{"sender": m.sender.name if m.sender else "User", "text": m.message} for m in (project.messages or [])[-10:]]
    milestones = [{"title": m.title, "status": m.status, "due_date": m.due_date} for m in (project.milestones or [])]

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status,
        "progress": project.progress,
        "health_score": project.health_score,
        "deadline": project.deadline,
        "tasks": tasks,
        "approvals": approvals,
        "milestones": milestones,
        "messages": messages
    }

def get_or_fallback_project(db: Session, project_id: str) -> Optional[Project]:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        project = db.query(Project).first()
    return project

@router.post("/projects/{project_id}/summary", response_model=AISummaryResponse)
async def ai_project_summary(project_id: str, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    result = await generate_project_summary(context)
    return AISummaryResponse(**result)

@router.post("/projects/{project_id}/extract-tasks", response_model=List[ExtractedTaskItem])
async def ai_extract_tasks(project_id: str, payload: AIExtractTasksRequest, db: Session = Depends(get_db)):
    extracted = await extract_tasks_from_feedback(payload.text)
    return [ExtractedTaskItem(**t) for t in extracted]

@router.post("/projects/{project_id}/risk", response_model=AIRiskResponse)
async def ai_project_risk(project_id: str, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    health_info = calculate_project_health(project) if project else {"score": 87, "status": "On Track", "breakdown": {}, "reasons": [], "recommended_actions": []}
    context = get_project_dict_context(project)
    result = await analyze_project_risk(context, health_info)
    return AIRiskResponse(**result)

@router.post("/projects/{project_id}/chat")
async def ai_project_chat(project_id: str, payload: AIChatRequest, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    answer = await chat_with_project_context(context, payload.message)
    return {"response": answer}

@router.post("/projects/{project_id}/chat/stream")
async def ai_project_chat_stream(project_id: str, payload: AIChatRequest, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    return StreamingResponse(
        stream_project_chat(context, payload.message),
        media_type="text/event-stream"
    )

@router.post("/projects/{project_id}/scope-creep", response_model=AIScopeCreepResponse)
async def ai_scope_creep(project_id: str, payload: AIScopeCreepRequest, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    result = await detect_scope_creep(payload.feedback_text, context)
    return AIScopeCreepResponse(**result)

@router.post("/projects/{project_id}/draft-update", response_model=AIDraftUpdateResponse)
async def ai_draft_update(project_id: str, payload: AIDraftUpdateRequest, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    result = await draft_client_update(context, payload.tone or "EXECUTIVE")
    return AIDraftUpdateResponse(**result)

@router.post("/projects/{project_id}/suggest-assignee", response_model=AISmartAssignResponse)
async def ai_suggest_assignee(project_id: str, payload: AISmartAssignRequest, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    result = await suggest_task_assignee(payload.task_title, payload.task_description or "", context)
    return AISmartAssignResponse(**result)

@router.post("/projects/{project_id}/sentiment", response_model=AISentimentResponse)
async def ai_sentiment(project_id: str, db: Session = Depends(get_db)):
    project = get_or_fallback_project(db, project_id)
    context = get_project_dict_context(project)
    result = await analyze_client_sentiment(context)
    return AISentimentResponse(**result)
