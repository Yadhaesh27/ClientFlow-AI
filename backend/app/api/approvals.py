from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from app.core.database import get_db
from app.models import Approval, File, Project, ActivityLog, Notification, User
from app.schemas.schemas import ApprovalCreate, ApprovalDecision, ApprovalResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["approvals"])

@router.get("/api/projects/{project_id}/approvals", response_model=List[ApprovalResponse])
def list_project_approvals(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    approvals = db.query(Approval).filter(Approval.project_id == project_id).order_by(Approval.created_at.desc()).all()
    return approvals

@router.post("/api/approvals", response_model=ApprovalResponse)
def create_approval_request(data: ApprovalCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == data.project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_approval = Approval(
        id=str(uuid.uuid4()),
        project_id=data.project_id,
        file_id=data.file_id,
        milestone_id=data.milestone_id,
        title=data.title,
        description=data.description,
        status="PENDING",
        requested_from_user_id=data.requested_from_user_id
    )
    db.add(new_approval)

    if data.file_id:
        target_file = db.query(File).filter(File.id == data.file_id).first()
        if target_file:
            target_file.approval_status = "PENDING"

    # Activity log
    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=data.project_id,
        user_id=current_user.id,
        action="APPROVAL_REQUESTED",
        entity_type="approval",
        entity_id=new_approval.id,
        metadata_json=f'{{"title": "{new_approval.title}"}}'
    )
    db.add(log)

    # In-app notification to client / target user
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=data.requested_from_user_id,
        type="APPROVAL_REQUESTED",
        title="Deliverable Approval Required",
        message=f"Action required: '{new_approval.title}' is ready for review in {project.name}",
        entity_type="approval",
        entity_id=new_approval.id
    )
    db.add(notif)

    db.commit()
    db.refresh(new_approval)
    return new_approval

@router.post("/api/approvals/{approval_id}/approve", response_model=ApprovalResponse)
def approve_deliverable(approval_id: str, decision: Optional[ApprovalDecision] = None, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    approval.status = "APPROVED"
    approval.decided_by_user_id = current_user.id
    approval.feedback = decision.feedback if decision else "Approved without changes"
    approval.decided_at = datetime.now(timezone.utc)

    if approval.file_id:
        target_file = db.query(File).filter(File.id == approval.file_id).first()
        if target_file:
            target_file.approval_status = "APPROVED"

    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=approval.project_id,
        user_id=current_user.id,
        action="APPROVAL_APPROVED",
        entity_type="approval",
        entity_id=approval.id,
        metadata_json=f'{{"title": "{approval.title}"}}'
    )
    db.add(log)

    db.commit()
    db.refresh(approval)
    return approval

@router.post("/api/approvals/{approval_id}/request-changes", response_model=ApprovalResponse)
def request_changes_deliverable(approval_id: str, decision: ApprovalDecision, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    approval = db.query(Approval).filter(Approval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    approval.status = "CHANGES_REQUESTED"
    approval.decided_by_user_id = current_user.id
    approval.feedback = decision.feedback or "Changes requested"
    approval.decided_at = datetime.now(timezone.utc)

    if approval.file_id:
        target_file = db.query(File).filter(File.id == approval.file_id).first()
        if target_file:
            target_file.approval_status = "CHANGES_REQUESTED"

    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=approval.project_id,
        user_id=current_user.id,
        action="APPROVAL_CHANGES_REQUESTED",
        entity_type="approval",
        entity_id=approval.id,
        metadata_json=f'{{"title": "{approval.title}", "feedback": "{decision.feedback}"}}'
    )
    db.add(log)

    db.commit()
    db.refresh(approval)
    return approval

@router.get("/api/action-center", response_model=List[ApprovalResponse])
def get_client_action_center(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns all pending approvals requiring action from the current user."""
    pending = db.query(Approval).filter(
        Approval.requested_from_user_id == current_user.id,
        Approval.status == "PENDING"
    ).order_by(Approval.created_at.desc()).all()
    return pending
