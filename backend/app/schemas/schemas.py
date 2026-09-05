from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# --- Auth Schemas ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    organization_name: str
    role: Optional[str] = "ADMIN"

class UserResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Project Schemas ---
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    client_user_id: Optional[str] = None
    assigned_member_ids: Optional[List[str]] = []
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    budget: Optional[float] = 0.0

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    client_user_id: Optional[str] = None
    assigned_member_ids: Optional[List[str]] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    budget: Optional[float] = None

class MilestoneResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class ProjectMemberResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    role_in_project: str
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    id: str
    organization_id: str
    client_user_id: Optional[str] = None
    key_prefix: Optional[str] = "PROJ"
    name: str
    description: Optional[str] = None
    status: str
    progress: int
    health_score: int
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    budget: Optional[float] = 0.0
    created_at: datetime
    updated_at: datetime
    client: Optional[UserResponse] = None
    milestones: List[MilestoneResponse] = []
    members: List[ProjectMemberResponse] = []

    class Config:
        from_attributes = True

# --- Task Schemas ---
class TaskCreate(BaseModel):
    project_id: str
    title: str
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    issue_type: Optional[str] = "STORY"  # STORY, BUG, TASK, EPIC
    story_points: Optional[int] = 3
    priority: str = "MEDIUM"
    status: str = "TO_DO"
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    issue_type: Optional[str] = None
    story_points: Optional[int] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    project_id: str
    assignee_id: Optional[str] = None
    created_by: str
    issue_key: Optional[str] = "PROJ-1"
    issue_type: Optional[str] = "STORY"
    story_points: Optional[int] = 3
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    due_date: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- File & Version Schemas ---
class FileVersionResponse(BaseModel):
    id: str
    file_id: str
    version_number: int
    storage_url: str
    uploaded_by: str
    comment: Optional[str] = None
    created_at: datetime
    uploader: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class FileResponse(BaseModel):
    id: str
    project_id: str
    uploaded_by: str
    folder: str
    filename: str
    storage_url: str
    mime_type: str
    size_bytes: int
    current_version: int
    approval_status: str
    created_at: datetime
    uploader: Optional[UserResponse] = None
    versions: List[FileVersionResponse] = []

    class Config:
        from_attributes = True

# --- Approval Schemas ---
class ApprovalCreate(BaseModel):
    project_id: str
    file_id: Optional[str] = None
    milestone_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    requested_from_user_id: str

class ApprovalDecision(BaseModel):
    status: str  # APPROVED or CHANGES_REQUESTED
    feedback: Optional[str] = None

class ApprovalResponse(BaseModel):
    id: str
    project_id: str
    file_id: Optional[str] = None
    milestone_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: str
    requested_from_user_id: str
    decided_by_user_id: Optional[str] = None
    feedback: Optional[str] = None
    created_at: datetime
    decided_at: Optional[datetime] = None
    requested_from: Optional[UserResponse] = None
    decided_by: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- Message & Comment Schemas ---
class MessageCreate(BaseModel):
    message: str
    attachment_url: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    project_id: str
    sender_id: str
    message: str
    attachment_url: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None
    sender: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    task_id: Optional[str] = None
    file_id: Optional[str] = None
    body: str

class CommentResponse(BaseModel):
    id: str
    project_id: str
    task_id: Optional[str] = None
    file_id: Optional[str] = None
    user_id: str
    body: str
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- Notification & Activity Schemas ---
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ActivityLogResponse(BaseModel):
    id: str
    organization_id: str
    project_id: Optional[str] = None
    user_id: str
    action: str
    entity_type: str
    entity_id: str
    metadata_json: Optional[str] = None
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- AI & Health Schemas ---
class AIExtractTasksRequest(BaseModel):
    text: str

class AIChatRequest(BaseModel):
    message: str

class ExtractedTaskItem(BaseModel):
    title: str
    description: str
    priority: str = "MEDIUM"
    suggested_due_date: Optional[str] = None
    source_text: str

class AISummaryResponse(BaseModel):
    summary: str
    completed_work: List[str]
    pending_work: List[str]
    risks: List[str]
    next_action: str

class AIRiskResponse(BaseModel):
    health_score: int
    status: str
    breakdown: dict
    reasons: List[str]
    recommended_actions: List[str]

class ProjectReportResponse(BaseModel):
    project: ProjectResponse
    task_stats: dict
    approval_stats: dict
    health_breakdown: dict
    recent_activity: List[ActivityLogResponse]
    completion_summary: str
