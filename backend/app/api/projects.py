from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.core.database import get_db
from app.models import Project, ProjectMember, ActivityLog, User
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.auth import get_current_user
from app.services.health_service import calculate_project_health

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Project).filter(Project.organization_id == current_user.organization_id)
    if current_user.role == "CLIENT":
        query = query.filter(Project.client_user_id == current_user.id)
    elif current_user.role == "TEAM_MEMBER":
        # Devs see projects where they are assigned as members or creator
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter((Project.id.in_(member_proj_ids)) | (Project.client_user_id == None))
    
    projects = query.order_by(Project.created_at.desc()).all()
    
    # Recalculate health score dynamically
    for p in projects:
        health_info = calculate_project_health(p)
        p.health_score = health_info["score"]
    
    return projects

@router.post("", response_model=ProjectResponse)
def create_project(data: ProjectCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["ADMIN", "PROJECT_MANAGER"]:
        raise HTTPException(status_code=403, detail="Only admins and project managers can create projects")

    # Generate key prefix e.g. "WEB", "MOB", "DES"
    key_prefix = "".join([w[0].upper() for w in data.name.split()[:3]]) or "PROJ"

    new_project = Project(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        client_user_id=data.client_user_id,
        key_prefix=key_prefix,
        name=data.name,
        description=data.description,
        status="ACTIVE",
        progress=0,
        health_score=100,
        start_date=data.start_date,
        deadline=data.deadline,
        budget=data.budget or 0.0
    )
    db.add(new_project)

    # Register assigned developers / team members
    if data.assigned_member_ids:
        for m_id in data.assigned_member_ids:
            pm = ProjectMember(
                id=str(uuid.uuid4()),
                project_id=new_project.id,
                user_id=m_id,
                role_in_project="DEVELOPER"
            )
            db.add(pm)

    # Activity log
    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=new_project.id,
        user_id=current_user.id,
        action="PROJECT_CREATED",
        entity_type="project",
        entity_id=new_project.id,
        metadata_json=f'{{"name": "{new_project.name}", "client_assigned": "{data.client_user_id or "None"}"}}'
    )
    db.add(log)
    db.commit()
    db.refresh(new_project)

    return new_project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role == "CLIENT" and project.client_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied to this project")

    health_info = calculate_project_health(project)
    project.health_score = health_info["score"]

    return project

@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, data: ProjectUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.role not in ["ADMIN", "PROJECT_MANAGER"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit project settings")

    update_dict = data.model_dump(exclude_unset=True)
    assigned_members = update_dict.pop("assigned_member_ids", None)

    for field, val in update_dict.items():
        setattr(project, field, val)

    if assigned_members is not None:
        db.query(ProjectMember).filter(ProjectMember.project_id == project.id).delete()
        for m_id in assigned_members:
            db.add(ProjectMember(id=str(uuid.uuid4()), project_id=project.id, user_id=m_id, role_in_project="DEVELOPER"))

    health_info = calculate_project_health(project)
    project.health_score = health_info["score"]

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can delete projects")

    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.get("/{project_id}/health")
def get_health_detail(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return calculate_project_health(project)
