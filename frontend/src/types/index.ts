export type UserRole = 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER' | 'CLIENT';

export interface User {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role_in_project: string;
  user?: User;
}

export interface Project {
  id: string;
  organization_id: string;
  client_user_id?: string;
  key_prefix?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  health_score: number;
  start_date?: string;
  deadline?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
  client?: User;
  milestones?: Milestone[];
  members?: ProjectMember[];
}

export type TaskStatus = 'BACKLOG' | 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type IssueType = 'STORY' | 'BUG' | 'TASK' | 'EPIC' | 'FEATURE';

export interface Task {
  id: string;
  project_id: string;
  assignee_id?: string;
  created_by: string;
  issue_key?: string;
  issue_type?: IssueType;
  story_points?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  created_at: string;
  updated_at: string;
  assignee?: User;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version_number: number;
  storage_url: string;
  uploaded_by: string;
  comment?: string;
  created_at: string;
  uploader?: User;
}

export type ApprovalStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED';

export interface ProjectFile {
  id: string;
  project_id: string;
  uploaded_by: string;
  folder: string;
  filename: string;
  storage_url: string;
  mime_type: string;
  size_bytes: number;
  current_version: number;
  approval_status: ApprovalStatus;
  created_at: string;
  uploader?: User;
  versions?: FileVersion[];
}

export interface Approval {
  id: string;
  project_id: string;
  file_id?: string;
  milestone_id?: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED';
  requested_by_user_id?: string;
  requested_by_name?: string;
  requested_by_role?: string;
  target_recipient?: 'EVERYONE' | 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT' | string;
  requested_from_user_id: string;
  decided_by_user_id?: string;
  feedback?: string;
  created_at: string;
  decided_at?: string;
  requested_from?: User;
  decided_by?: User;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  attachment_url?: string;
  created_at: string;
  read_at?: string;
  sender?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  entity_type?: string;
  entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  organization_id: string;
  project_id?: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata_json?: string;
  created_at: string;
  user?: User;
}

export interface ProjectHealthDetail {
  score: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
  status_code: 'GREEN' | 'YELLOW' | 'RED';
  breakdown: {
    task_progress: number;
    deadline_safety: number;
    approval_readiness: number;
    client_responsiveness: number;
    recent_activity: number;
  };
  reasons: string[];
  recommended_actions: string[];
}

export interface AISummary {
  summary: string;
  completed_work: string[];
  pending_work: string[];
  risks: string[];
  next_action: string;
}

export interface ExtractedTask {
  title: string;
  description: string;
  priority: TaskPriority;
  suggested_due_date?: string;
  source_text: string;
}

export interface ProjectReport {
  project: Project;
  task_stats: {
    total: number;
    done: number;
    in_progress: number;
    review: number;
    to_do: number;
  };
  approval_stats: {
    total: number;
    approved: number;
    changes_requested: number;
    pending: number;
  };
  health_breakdown: ProjectHealthDetail;
  recent_activity: ActivityLog[];
  completion_summary: string;
}
