from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Notification, ActivityLog, User
from app.schemas.schemas import NotificationResponse, ActivityLogResponse
from app.api.auth import get_current_user

router = APIRouter(tags=["notifications_and_activity"])

@router.get("/api/notifications", response_model=List[NotificationResponse])
def list_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    return notifs

@router.patch("/api/notifications/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@router.post("/api/notifications/read-all")
def mark_all_notifications_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == current_user.id).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.get("/api/projects/{project_id}/activity", response_model=List[ActivityLogResponse])
def get_project_activity(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    activity = db.query(ActivityLog).filter(ActivityLog.project_id == project_id).order_by(ActivityLog.created_at.desc()).limit(50).all()
    return activity
