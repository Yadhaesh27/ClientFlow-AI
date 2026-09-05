import os
import shutil
import uuid
from fastapi import UploadFile
from app.core.config import settings

def ensure_upload_dir():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

def save_uploaded_file(file: UploadFile) -> tuple[str, int]:
    ensure_upload_dir()
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    destination_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    with open(destination_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    size_bytes = os.path.getsize(destination_path)
    storage_url = f"/api/files/download/{unique_filename}"
    return storage_url, size_bytes
