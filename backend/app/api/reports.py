from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Project, Task, Approval, ActivityLog, User
from app.schemas.schemas import ProjectReportResponse, ProjectResponse, ActivityLogResponse
from app.api.auth import get_current_user
from app.services.health_service import calculate_project_health

router = APIRouter(prefix="/api/projects", tags=["reports"])

@router.get("/{project_id}/report", response_model=ProjectReportResponse)
def get_project_completion_report(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    approvals = db.query(Approval).filter(Approval.project_id == project_id).all()
    activity = db.query(ActivityLog).filter(ActivityLog.project_id == project_id).order_by(ActivityLog.created_at.desc()).limit(15).all()

    health_info = calculate_project_health(project)

    task_stats = {
        "total": len(tasks),
        "done": sum(1 for t in tasks if t.status == "DONE"),
        "in_progress": sum(1 for t in tasks if t.status == "IN_PROGRESS"),
        "review": sum(1 for t in tasks if t.status == "REVIEW"),
        "to_do": sum(1 for t in tasks if t.status == "TO_DO"),
    }

    approval_stats = {
        "total": len(approvals),
        "approved": sum(1 for a in approvals if a.status == "APPROVED"),
        "changes_requested": sum(1 for a in approvals if a.status == "CHANGES_REQUESTED"),
        "pending": sum(1 for a in approvals if a.status == "PENDING"),
    }

    completion_summary = (
        f"Project '{project.name}' is currently at {project.progress}% completion with a health score of "
        f"{health_info['score']}/100 ({health_info['status']}). A total of {task_stats['done']} out of {task_stats['total']} tasks "
        f"have been finalized and {approval_stats['approved']} deliverable approvals signed off."
    )

    return ProjectReportResponse(
        project=ProjectResponse.model_validate(project),
        task_stats=task_stats,
        approval_stats=approval_stats,
        health_breakdown=health_info,
        recent_activity=[ActivityLogResponse.model_validate(a) for a in activity],
        completion_summary=completion_summary
    )
