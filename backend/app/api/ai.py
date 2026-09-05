from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models import Project, Task, Approval, Message, User
from app.schemas.schemas import (
    AIExtractTasksRequest, AIChatRequest, ExtractedTaskItem,
    AISummaryResponse, AIRiskResponse
)
from app.api.auth import get_current_user
from app.services.ai_service import (
    generate_project_summary, extract_tasks_from_feedback,
    analyze_project_risk, chat_with_project_context
)
from app.services.health_service import calculate_project_health

router = APIRouter(prefix="/api/ai", tags=["ai"])

def get_project_dict_context(project: Project) -> Dict[str, Any]:
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

@router.post("/projects/{project_id}/summary", response_model=AISummaryResponse)
async def ai_project_summary(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    context = get_project_dict_context(project)
    result = await generate_project_summary(context)
    return AISummaryResponse(**result)

@router.post("/projects/{project_id}/extract-tasks", response_model=List[ExtractedTaskItem])
async def ai_extract_tasks(project_id: str, payload: AIExtractTasksRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    extracted = await extract_tasks_from_feedback(payload.text)
    return [ExtractedTaskItem(**t) for t in extracted]

@router.post("/projects/{project_id}/risk", response_model=AIRiskResponse)
async def ai_project_risk(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    health_info = calculate_project_health(project)
    context = get_project_dict_context(project)
    result = await analyze_project_risk(context, health_info)
    return AIRiskResponse(**result)

@router.post("/projects/{project_id}/chat")
async def ai_project_chat(project_id: str, payload: AIChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    context = get_project_dict_context(project)
    answer = await chat_with_project_context(context, payload.message)
    return {"response": answer}
