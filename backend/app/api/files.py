from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File as FastAPIFile, Form
from fastapi.responses import FileResponse as FastAPIFileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import os
from app.core.database import get_db
from app.models import File, FileVersion, Project, ActivityLog, User, Notification
from app.schemas.schemas import FileResponse, FileVersionResponse
from app.api.auth import get_current_user
from app.services.storage_service import save_uploaded_file
from app.core.config import settings

router = APIRouter(tags=["files"])

@router.get("/api/projects/{project_id}/files", response_model=List[FileResponse])
def list_project_files(project_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    files = db.query(File).filter(File.project_id == project_id).order_by(File.created_at.desc()).all()
    return files

@router.post("/api/projects/{project_id}/files", response_model=FileResponse)
def upload_file(
    project_id: str,
    file: UploadFile = FastAPIFile(...),
    folder: str = Form("General"),
    comment: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    storage_url, size_bytes = save_uploaded_file(file)

    new_file = File(
        id=str(uuid.uuid4()),
        project_id=project_id,
        uploaded_by=current_user.id,
        folder=folder,
        filename=file.filename or "file",
        storage_url=storage_url,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=size_bytes,
        current_version=1,
        approval_status="NONE"
    )
    db.add(new_file)

    # Initial Version
    v1 = FileVersion(
        id=str(uuid.uuid4()),
        file_id=new_file.id,
        version_number=1,
        storage_url=storage_url,
        uploaded_by=current_user.id,
        comment=comment or "Initial upload v1"
    )
    db.add(v1)

    # Activity log
    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=project_id,
        user_id=current_user.id,
        action="FILE_UPLOADED",
        entity_type="file",
        entity_id=new_file.id,
        metadata_json=f'{{"filename": "{new_file.filename}", "version": 1}}'
    )
    db.add(log)

    # Notify project client if uploaded by team
    if project.client_user_id and current_user.id != project.client_user_id:
        notif = Notification(
            id=str(uuid.uuid4()),
            user_id=project.client_user_id,
            type="FILE_UPLOADED",
            title="New File Uploaded",
            message=f"New file '{new_file.filename}' uploaded to {project.name}",
            entity_type="file",
            entity_id=new_file.id
        )
        db.add(notif)

    db.commit()
    db.refresh(new_file)
    return new_file

@router.post("/api/files/{file_id}/versions", response_model=FileResponse)
def upload_file_version(
    file_id: str,
    file: UploadFile = FastAPIFile(...),
    comment: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_file = db.query(File).filter(File.id == file_id).first()
    if not existing_file:
        raise HTTPException(status_code=404, detail="File not found")

    storage_url, size_bytes = save_uploaded_file(file)
    next_ver = existing_file.current_version + 1

    existing_file.current_version = next_ver
    existing_file.storage_url = storage_url
    existing_file.size_bytes = size_bytes
    if existing_file.approval_status == "CHANGES_REQUESTED":
        existing_file.approval_status = "PENDING"  # Reset approval status for review

    new_version = FileVersion(
        id=str(uuid.uuid4()),
        file_id=existing_file.id,
        version_number=next_ver,
        storage_url=storage_url,
        uploaded_by=current_user.id,
        comment=comment or f"Updated to version v{next_ver}"
    )
    db.add(new_version)

    log = ActivityLog(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        project_id=existing_file.project_id,
        user_id=current_user.id,
        action="FILE_VERSION_UPLOADED",
        entity_type="file",
        entity_id=existing_file.id,
        metadata_json=f'{{"filename": "{existing_file.filename}", "version": {next_ver}}}'
    )
    db.add(log)

    db.commit()
    db.refresh(existing_file)
    return existing_file

@router.get("/api/files/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
    return FastAPIFileResponse(file_path, filename=filename)
