from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.core.database import get_db
from app.models import Task, Project, ActivityLog, Notification, User
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["tasks"])

@router.get("/api/projects/{project_id}/tasks", response_model=List[TaskResponse])
def list_project_tasks(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = db.query(Task).filter(Task.project_id == project_id).order_by(Task.created_at.desc()).all()
    return tasks

@router.post("/api/projects/{project_id}/tasks", response_model=TaskResponse)
def create_task(project_id: str, data: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Generate ClientFlow Task Key e.g. WEB-101
    existing_count = db.query(Task).filter(Task.project_id == project_id).count()
    key_prefix = project.key_prefix or "PROJ"
    issue_key = f"{key_prefix}-{100 + existing_count + 1}"

    new_task = Task(
        id=str(uuid.uuid4()),
        project_id=project_id,
        assignee_id=data.assignee_id,
        created_by=current_user.id,
        issue_key=issue_key,
        issue_type=data.issue_type or "STORY",
        story_points=data.story_points or 3,
        title=data.title,
        description=data.description,
        status=data.status or "TO_DO",
        priority=data.priority or "MEDIUM",
        due_date=data.due_date
    )
    db.add(new_task)

    # Activity log
    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=project_id,
        user_id=current_user.id,
        action="TASK_CREATED",
        entity_type="task",
        entity_id=new_task.id,
        metadata_json=f'{{"key": "{issue_key}", "title": "{new_task.title}"}}'
    )
    db.add(log)

    # Notification to assignee if assigned
    if data.assignee_id:
        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=data.assignee_id,
            type="TASK_ASSIGNED",
            title="New Task Assigned",
            message=f"You were assigned to task [{issue_key}]: '{new_task.title}' in {project.name}",
            entity_type="task",
            entity_id=new_task.id
        )
        db.add(notif)

    db.commit()
    db.refresh(new_task)
    return new_task

@router.patch("/api/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, data: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    old_status = task.status
    update_dict = data.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        setattr(task, field, val)

    # Recalculate project overall progress
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if project:
        all_tasks = db.query(Task).filter(Task.project_id == project.id).all()
        if all_tasks:
            done_count = sum(1 for t in all_tasks if t.status == "DONE")
            project.progress = int((done_count / len(all_tasks)) * 100)

    # Activity Log for status changes
    if old_status != task.status:
        log = ActivityLog(
            id=str(uuid.uuid4()),
            organization_id=current_user.organization_id,
            project_id=task.project_id,
            user_id=current_user.id,
            action="TASK_STATUS_CHANGED",
            entity_type="task",
            entity_id=task.id,
            metadata_json=f'{{"key": "{task.issue_key}", "from": "{old_status}", "to": "{task.status}"}}'
        )
        db.add(log)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/api/tasks/{task_id}")
def delete_task(task_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
