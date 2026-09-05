from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.core.database import get_db
from app.models import Message, Comment, Project, User, ActivityLog
from app.schemas.schemas import MessageCreate, MessageResponse, CommentCreate, CommentResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["messages"])

@router.get("/api/projects/{project_id}/messages", response_model=List[MessageResponse])
def get_project_messages(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    messages = db.query(Message).filter(Message.project_id == project_id).order_by(Message.created_at.asc()).all()
    return messages

@router.post("/api/projects/{project_id}/messages", response_model=MessageResponse)
def post_project_message(project_id: str, data: MessageCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_msg = Message(
        id=str(uuid.uuid4()),
        project_id=project_id,
        sender_id=current_user.id,
        message=data.message,
        attachment_url=data.attachment_url
    )
    db.add(new_msg)

    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=project_id,
        user_id=current_user.id,
        action="MESSAGE_SENT",
        entity_type="message",
        entity_id=new_msg.id
    )
    db.add(log)

    db.commit()
    db.refresh(new_msg)
    return new_msg

@router.get("/api/projects/{project_id}/comments", response_model=List[CommentResponse])
def get_project_comments(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.project_id == project_id).order_by(Comment.created_at.desc()).all()
    return comments

@router.post("/api/projects/{project_id}/comments", response_model=CommentResponse)
def post_project_comment(project_id: str, data: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_comment = Comment(
        id=str(uuid.uuid4()),
        project_id=project_id,
        task_id=data.task_id,
        file_id=data.file_id,
        user_id=current_user.id,
        body=data.body
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment
