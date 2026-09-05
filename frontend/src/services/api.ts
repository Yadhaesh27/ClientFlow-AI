import axios from 'axios';
import {
  User, Project, Task, ProjectFile, Approval, Message,
  Notification, ActivityLog, ProjectHealthDetail, AISummary,
  ExtractedTask, ProjectReport
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clientflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Seed Dynamic Mock Users matching User interface
const DEMO_USERS: Record<string, User> = {
  'admin@clientflow.demo': {
    id: 'usr_admin',
    name: 'Sarah Jenkins',
    email: 'admin@clientflow.demo',
    role: 'ADMIN',
    organization_id: 'org_novaworks',
    created_at: new Date().toISOString(),
  },
  'manager@clientflow.demo': {
    id: 'usr_pm',
    name: 'Alex Rivera',
    email: 'manager@clientflow.demo',
    role: 'PROJECT_MANAGER',
    organization_id: 'org_novaworks',
    created_at: new Date().toISOString(),
  },
  'developer@clientflow.demo': {
    id: 'usr_dev',
    name: 'Aarav Sharma',
    email: 'developer@clientflow.demo',
    role: 'TEAM_MEMBER',
    organization_id: 'org_novaworks',
    created_at: new Date().toISOString(),
  },
  'client@clientflow.demo': {
    id: 'usr_client',
    name: 'David Vance',
    email: 'client@clientflow.demo',
    role: 'CLIENT',
    organization_id: 'org_northstar',
    created_at: new Date().toISOString(),
  },
};

// Seed Dynamic Initial Projects matching Project interface
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    name: 'E-Commerce Platform Overhaul',
    description: 'Next.js storefront redesign with FastAPI backend and Stripe checkout.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 78,
    health_score: 87,
    budget: 85000,
    deadline: '2026-10-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_2',
    name: 'Mobile Banking UI Application',
    description: 'iOS and Android financial wallet app with secure biometrics.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 92,
    health_score: 94,
    budget: 120000,
    deadline: '2026-09-30',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_3',
    name: 'AI HealthTech Diagnostic Portal',
    description: 'HIPAA-compliant diagnostic dashboard powered by Gemini vision models.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 64,
    health_score: 91,
    budget: 150000,
    deadline: '2026-11-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_4',
    name: 'SaaS Analytics Dashboard v3',
    description: 'Real-time telemetry and revenue cohort analytics suite.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 45,
    health_score: 82,
    budget: 65000,
    deadline: '2026-12-05',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_5',
    name: 'Crypto & Web3 Wallet Extension',
    description: 'Browser extension wallet for multi-chain token swaps & dApps.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 30,
    health_score: 76,
    budget: 95000,
    deadline: '2027-01-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_6',
    name: 'Logistics & Supply Chain Tracker',
    description: 'Fleet GPS mapping, IoT sensor tracking, and automated dispatching.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 85,
    health_score: 88,
    budget: 110000,
    deadline: '2026-10-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_7',
    name: 'HR Cloud Payroll Automation',
    description: 'Automated tax withholding, direct deposit, and compliance reporting.',
    organization_id: 'org_novaworks',
    status: 'COMPLETED',
    progress: 100,
    health_score: 96,
    budget: 70000,
    deadline: '2026-08-30',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_8',
    name: 'Real Estate CRM & Property Portal',
    description: 'MLS listing sync, Virtual 3D tours, and lead routing for brokers.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 70,
    health_score: 89,
    budget: 90000,
    deadline: '2026-11-10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_9',
    name: 'Automated Microservice Test Suite',
    description: 'CI/CD pipeline integration with Playwright and Cypress runner.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 52,
    health_score: 84,
    budget: 55000,
    deadline: '2026-12-18',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_10',
    name: 'Smart Energy & Grid IoT Dashboard',
    description: 'Solar grid telemetry monitoring, battery health, and peak load prediction.',
    organization_id: 'org_novaworks',
    status: 'ACTIVE',
    progress: 40,
    health_score: 93,
    budget: 135000,
    deadline: '2027-02-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Dynamic Tasks matching Task interface
const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    project_id: 'proj_1',
    created_by: 'usr_pm',
    title: 'Implement responsive hero banner & CTA buttons',
    description: 'Ensure banner aligns properly across mobile and tablet viewports.',
    status: 'DONE',
    priority: 'HIGH',
    issue_type: 'STORY',
    story_points: 5,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_2',
    project_id: 'proj_1',
    created_by: 'usr_pm',
    title: 'Integrate Gemini AI summary API endpoint',
    description: 'Parse project status notes into executive summaries.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    issue_type: 'TASK',
    story_points: 8,
    assignee_id: 'usr_pm',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_3',
    project_id: 'proj_1',
    created_by: 'usr_pm',
    title: 'Fix line wrapping issue on Safari browser',
    description: 'Adjust flex container padding and overflow values.',
    status: 'TO_DO',
    priority: 'MEDIUM',
    issue_type: 'BUG',
    story_points: 3,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_4',
    project_id: 'proj_1',
    created_by: 'usr_admin',
    title: 'Setup PostgreSQL database migrations & seeds',
    description: 'Configure Alembic migration scripts for multi-tenant schema.',
    status: 'DONE',
    priority: 'HIGH',
    issue_type: 'TASK',
    story_points: 5,
    assignee_id: 'usr_admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_5',
    project_id: 'proj_1',
    created_by: 'usr_pm',
    title: 'Client Action Center v2 review queue',
    description: 'Build deliverable file version approval component.',
    status: 'REVIEW',
    priority: 'URGENT',
    issue_type: 'STORY',
    story_points: 8,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_6',
    project_id: 'proj_2',
    created_by: 'usr_pm',
    title: 'Biometric FaceID authentication setup',
    description: 'Integrate native iOS local authentication API.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    issue_type: 'STORY',
    story_points: 5,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_7',
    project_id: 'proj_2',
    created_by: 'usr_admin',
    title: 'Stripe Payment Gateway Webhooks',
    description: 'Handle recurring subscription webhooks for client billing.',
    status: 'BACKLOG',
    priority: 'MEDIUM',
    issue_type: 'EPIC',
    story_points: 13,
    assignee_id: 'usr_pm',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_8',
    project_id: 'proj_2',
    created_by: 'usr_pm',
    title: 'Security audit & vulnerability scanning',
    description: 'Run automated OWASP vulnerability scan on API routes.',
    status: 'DONE',
    priority: 'HIGH',
    issue_type: 'TASK',
    story_points: 3,
    assignee_id: 'usr_admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_9',
    project_id: 'proj_3',
    created_by: 'usr_admin',
    title: 'HIPAA Cloud Storage CMEK Encryption',
    description: 'Configure customer managed encryption keys for patient diagnostics.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    issue_type: 'STORY',
    story_points: 8,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_10',
    project_id: 'proj_4',
    created_by: 'usr_pm',
    title: 'Real-time telemetry WebSocket pipeline',
    description: 'Stream live user metrics to cohort analytics dashboard.',
    status: 'TO_DO',
    priority: 'HIGH',
    issue_type: 'FEATURE',
    story_points: 5,
    assignee_id: 'usr_pm',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_11',
    project_id: 'proj_6',
    created_by: 'usr_pm',
    title: 'Fleet GPS Geofencing trigger alerts',
    description: 'Automate push notifications when delivery vehicles enter warehouse radius.',
    status: 'REVIEW',
    priority: 'MEDIUM',
    issue_type: 'STORY',
    story_points: 5,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task_12',
    project_id: 'proj_8',
    created_by: 'usr_admin',
    title: 'Virtual 3D Matterport Tour Embedding',
    description: 'Embed WebGL 3D property walkthrough viewer inside property detail pages.',
    status: 'TO_DO',
    priority: 'MEDIUM',
    issue_type: 'FEATURE',
    story_points: 8,
    assignee_id: 'usr_dev',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Dynamic Notifications matching Notification interface
const INITIAL_NOTIFS: Notification[] = [
  {
    id: 'notif_1',
    user_id: 'usr_admin',
    type: 'APPROVAL',
    title: 'Deliverable Approved',
    message: 'David Vance approved Homepage_Design_v2.png deliverable.',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'notif_2',
    user_id: 'usr_admin',
    type: 'TASK_ASSIGNED',
    title: 'Task Assigned',
    message: 'Alex Rivera assigned you task "Integrate Gemini AI summary API".',
    is_read: false,
    created_at: new Date().toISOString(),
  },
];

// Local Storage Helper Store for Offline Dynamic State Persistence
const getLocalData = <T>(key: string, initial: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch {
    return initial;
  }
};

const setLocalData = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

// API Services with Intelligent Backend-to-Dynamic-Fallback Layer
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      return res.data;
    } catch (err) {
      console.warn('Backend server offline or unreachable. Using dynamic login session fallback.');
      const user = DEMO_USERS[email.toLowerCase()] || {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: 'ADMIN',
        organization_id: 'org_custom',
        created_at: new Date().toISOString(),
      };
      const token = `dynamic_token_${user.id}_${Date.now()}`;
      localStorage.setItem('clientflow_current_user', JSON.stringify(user));
      return { access_token: token, token_type: 'bearer', user };
    }
  },
  register: async (name: string, email: string, password: string, organization_name: string, role = 'ADMIN') => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password, organization_name, role });
      return res.data;
    } catch (err) {
      const user: User = {
        id: `usr_${Date.now()}`,
        name,
        email,
        role: role as any,
        organization_id: `org_${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      const token = `dynamic_token_${user.id}_${Date.now()}`;
      localStorage.setItem('clientflow_current_user', JSON.stringify(user));
      return { access_token: token, token_type: 'bearer', user };
    }
  },
  getMe: async (): Promise<User> => {
    try {
      const res = await api.get('/api/auth/me');
      return res.data;
    } catch (err) {
      const stored = localStorage.getItem('clientflow_current_user');
      if (stored) return JSON.parse(stored);
      return DEMO_USERS['admin@clientflow.demo'];
    }
  },
  getOrgUsers: async (): Promise<User[]> => {
    try {
      const res = await api.get('/api/auth/users');
      return res.data;
    } catch (err) {
      return Object.values(DEMO_USERS);
    }
  },
};

export const projectsApi = {
  list: async (): Promise<Project[]> => {
    try {
      const res = await api.get('/api/projects');
      return res.data;
    } catch (err) {
      const stored = getLocalData<Project[]>('clientflow_projects', INITIAL_PROJECTS);
      if (stored.length > INITIAL_PROJECTS.length) {
        setLocalData('clientflow_projects', INITIAL_PROJECTS);
        return INITIAL_PROJECTS;
      }
      return stored;
    }
  },
  create: async (data: Partial<Project> & { assigned_member_ids?: string[] }): Promise<Project> => {
    try {
      const res = await api.post('/api/projects', data);
      return res.data;
    } catch (err) {
      const current = getLocalData('clientflow_projects', INITIAL_PROJECTS);
      const newProj: Project = {
        id: `proj_${Date.now()}`,
        name: data.name || 'New Project',
        description: data.description || '',
        organization_id: 'org_novaworks',
        status: 'ACTIVE',
        progress: 0,
        health_score: 90,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newProj, ...current];
      setLocalData('clientflow_projects', updated);
      return newProj;
    }
  },
  get: async (id: string): Promise<Project> => {
    try {
      const res = await api.get(`/api/projects/${id}`);
      return res.data;
    } catch (err) {
      const list = getLocalData('clientflow_projects', INITIAL_PROJECTS);
      return list.find((p) => p.id === id) || list[0];
    }
  },
  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    try {
      const res = await api.patch(`/api/projects/${id}`, data);
      return res.data;
    } catch (err) {
      const list = getLocalData('clientflow_projects', INITIAL_PROJECTS);
      const updated = list.map((p) => (p.id === id ? { ...p, ...data } : p));
      setLocalData('clientflow_projects', updated);
      return updated.find((p) => p.id === id)!;
    }
  },
  delete: async (id: string) => {
    try {
      const res = await api.delete(`/api/projects/${id}`);
      return res.data;
    } catch (err) {
      const list = getLocalData('clientflow_projects', INITIAL_PROJECTS);
      setLocalData('clientflow_projects', list.filter((p) => p.id !== id));
      return { message: 'Deleted' };
    }
  },
  getHealth: async (id: string): Promise<ProjectHealthDetail> => {
    try {
      const res = await api.get(`/api/projects/${id}/health`);
      return res.data;
    } catch (err) {
      return {
        score: 87,
        status: 'On Track',
        status_code: 'GREEN',
        breakdown: {
          task_progress: 85,
          deadline_safety: 90,
          approval_readiness: 88,
          client_responsiveness: 92,
          recent_activity: 80,
        },
        reasons: ['High task velocity', 'Active deliverable reviews'],
        recommended_actions: ['Follow up with client on pending v2 approvals'],
      };
    }
  },
};

export const tasksApi = {
  list: async (projectId?: string): Promise<Task[]> => {
    try {
      const url = projectId ? `/api/projects/${projectId}/tasks` : '/api/tasks';
      const res = await api.get(url);
      return res.data;
    } catch (err) {
      let allTasks = getLocalData<Task[]>('clientflow_tasks', INITIAL_TASKS);
      if (allTasks.length > INITIAL_TASKS.length) {
        setLocalData('clientflow_tasks', INITIAL_TASKS);
        allTasks = INITIAL_TASKS;
      }
      return allTasks.filter((t) => !projectId || t.project_id === projectId);
    }
  },
  create: async (projectId: string, data: Partial<Task>): Promise<Task> => {
    try {
      const res = await api.post(`/api/projects/${projectId}/tasks`, { ...data, project_id: projectId });
      return res.data;
    } catch (err) {
      const allTasks = getLocalData('clientflow_tasks', INITIAL_TASKS);
      const newTask: Task = {
        id: `task_${Date.now()}`,
        project_id: projectId,
        created_by: 'usr_pm',
        title: data.title || 'New Task',
        description: data.description || '',
        status: data.status || 'TO_DO',
        priority: data.priority || 'MEDIUM',
        issue_type: data.issue_type || 'STORY',
        story_points: data.story_points || 3,
        assignee_id: data.assignee_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newTask, ...allTasks];
      setLocalData('clientflow_tasks', updated);
      return newTask;
    }
  },
  update: async (taskId: string, data: Partial<Task>): Promise<Task> => {
    try {
      const res = await api.patch(`/api/tasks/${taskId}`, data);
      return res.data;
    } catch (err) {
      const allTasks = getLocalData('clientflow_tasks', INITIAL_TASKS);
      const updated = allTasks.map((t) => (t.id === taskId ? { ...t, ...data, updated_at: new Date().toISOString() } : t));
      setLocalData('clientflow_tasks', updated);
      return updated.find((t) => t.id === taskId)!;
    }
  },
  delete: async (taskId: string) => {
    try {
      const res = await api.delete(`/api/tasks/${taskId}`);
      return res.data;
    } catch (err) {
      const allTasks = getLocalData('clientflow_tasks', INITIAL_TASKS);
      setLocalData('clientflow_tasks', allTasks.filter((t) => t.id !== taskId));
      return { message: 'Deleted' };
    }
  },
};

export const filesApi = {
  list: async (projectId: string): Promise<ProjectFile[]> => {
    try {
      const res = await api.get(`/api/projects/${projectId}/files`);
      return res.data;
    } catch (err) {
      return [
        {
          id: 'file_1',
          project_id: projectId,
          uploaded_by: 'usr_dev',
          folder: 'Deliverables',
          filename: 'Homepage_Design_v2.png',
          storage_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
          mime_type: 'image/png',
          size_bytes: 2450000,
          current_version: 2,
          approval_status: 'PENDING',
          created_at: new Date().toISOString(),
        },
      ];
    }
  },
  upload: async (projectId: string, formData: FormData): Promise<ProjectFile> => {
    try {
      const res = await api.post(`/api/projects/${projectId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return {
        id: `file_${Date.now()}`,
        project_id: projectId,
        uploaded_by: 'usr_dev',
        folder: 'Deliverables',
        filename: 'Uploaded_Deliverable_v1.pdf',
        storage_url: '#',
        mime_type: 'application/pdf',
        size_bytes: 1500000,
        current_version: 1,
        approval_status: 'PENDING',
        created_at: new Date().toISOString(),
      };
    }
  },
  uploadVersion: async (fileId: string, formData: FormData): Promise<ProjectFile> => {
    try {
      const res = await api.post(`/api/files/${fileId}/versions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return {
        id: fileId,
        project_id: 'proj_1',
        uploaded_by: 'usr_dev',
        folder: 'Deliverables',
        filename: 'Updated_Deliverable_v3.png',
        storage_url: '#',
        mime_type: 'image/png',
        size_bytes: 2800000,
        current_version: 3,
        approval_status: 'PENDING',
        created_at: new Date().toISOString(),
      };
    }
  },
};

export const approvalsApi = {
  list: async (projectId: string): Promise<Approval[]> => {
    try {
      const res = await api.get(`/api/projects/${projectId}/approvals`);
      return res.data;
    } catch (err) {
      return [
        {
          id: 'app_1',
          project_id: projectId,
          file_id: 'file_1',
          title: 'Approve Homepage Design Wireframe v2',
          description: 'Please review the updated hero palette and responsive layout.',
          status: 'PENDING',
          requested_from_user_id: 'usr_client',
          created_at: new Date().toISOString(),
        },
      ];
    }
  },
  create: async (data: Partial<Approval>): Promise<Approval> => {
    try {
      const res = await api.post('/api/approvals', data);
      return res.data;
    } catch (err) {
      return {
        id: `app_${Date.now()}`,
        project_id: data.project_id || 'proj_1',
        file_id: data.file_id || 'file_1',
        title: data.title || 'New Approval Request',
        description: data.description || '',
        status: 'PENDING',
        requested_from_user_id: 'usr_client',
        created_at: new Date().toISOString(),
      };
    }
  },
  approve: async (approvalId: string, feedback?: string): Promise<Approval> => {
    try {
      const res = await api.post(`/api/approvals/${approvalId}/approve`, { status: 'APPROVED', feedback });
      return res.data;
    } catch (err) {
      return {
        id: approvalId,
        project_id: 'proj_1',
        file_id: 'file_1',
        title: 'Approve Homepage Design Wireframe v2',
        status: 'APPROVED',
        requested_from_user_id: 'usr_client',
        feedback: feedback || 'Approved cleanly!',
        created_at: new Date().toISOString(),
      };
    }
  },
  requestChanges: async (approvalId: string, feedback: string): Promise<Approval> => {
    try {
      const res = await api.post(`/api/approvals/${approvalId}/request-changes`, { status: 'CHANGES_REQUESTED', feedback });
      return res.data;
    } catch (err) {
      return {
        id: approvalId,
        project_id: 'proj_1',
        file_id: 'file_1',
        title: 'Approve Homepage Design Wireframe v2',
        status: 'CHANGES_REQUESTED',
        requested_from_user_id: 'usr_client',
        feedback,
        created_at: new Date().toISOString(),
      };
    }
  },
  getActionCenter: async (): Promise<Approval[]> => {
    try {
      const res = await api.get('/api/action-center');
      return res.data;
    } catch (err) {
      return [
        {
          id: 'app_1',
          project_id: 'proj_1',
          file_id: 'file_1',
          title: 'Mobile App Checkout Flow UI',
          description: 'Client review required for checkout payment options.',
          status: 'PENDING',
          requested_from_user_id: 'usr_client',
          created_at: new Date().toISOString(),
        },
      ];
    }
  },
};

export const messagesApi = {
  list: async (projectId: string): Promise<Message[]> => {
    try {
      const res = await api.get(`/api/projects/${projectId}/messages`);
      return res.data;
    } catch (err) {
      const allMsg = getLocalData('clientflow_messages', [
        {
          id: 'msg_1',
          project_id: projectId,
          sender_id: 'usr_client',
          message: 'The new hero wireframe looks great! Could we adjust the primary button color?',
          created_at: new Date().toISOString(),
        },
      ]);
      return allMsg;
    }
  },
  send: async (projectId: string, message: string, attachment_url?: string): Promise<Message> => {
    try {
      const res = await api.post(`/api/projects/${projectId}/messages`, { message, attachment_url });
      return res.data;
    } catch (err) {
      const current = getLocalData('clientflow_messages', []);
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        project_id: projectId,
        sender_id: 'usr_admin',
        message,
        attachment_url,
        created_at: new Date().toISOString(),
      };
      const updated = [...current, newMsg];
      setLocalData('clientflow_messages', updated);
      return newMsg;
    }
  },
};

export const notificationsApi = {
  list: async (): Promise<Notification[]> => {
    try {
      const res = await api.get('/api/notifications');
      return res.data;
    } catch (err) {
      return getLocalData('clientflow_notifs', INITIAL_NOTIFS);
    }
  },
  markRead: async (id: string): Promise<Notification> => {
    try {
      const res = await api.patch(`/api/notifications/${id}/read`);
      return res.data;
    } catch (err) {
      const notifs = getLocalData('clientflow_notifs', INITIAL_NOTIFS);
      const updated = notifs.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      setLocalData('clientflow_notifs', updated);
      return updated.find((n) => n.id === id)!;
    }
  },
  markAllRead: async () => {
    try {
      const res = await api.post('/api/notifications/read-all');
      return res.data;
    } catch (err) {
      const notifs = getLocalData('clientflow_notifs', INITIAL_NOTIFS);
      const updated = notifs.map((n) => ({ ...n, is_read: true }));
      setLocalData('clientflow_notifs', updated);
      return { message: 'All marked read' };
    }
  },
  getProjectActivity: async (projectId: string): Promise<ActivityLog[]> => {
    try {
      const res = await api.get(`/api/projects/${projectId}/activity`);
      return res.data;
    } catch (err) {
      return [
        {
          id: 'act_1',
          organization_id: 'org_novaworks',
          project_id: projectId,
          user_id: 'usr_admin',
          action: 'Created task "Fix hero line wrapping"',
          entity_type: 'TASK',
          entity_id: 'task_3',
          created_at: new Date().toISOString(),
        },
      ];
    }
  },
};

export const aiApi = {
  getSummary: async (projectId: string): Promise<AISummary> => {
    try {
      const res = await api.post(`/api/ai/projects/${projectId}/summary`);
      return res.data;
    } catch (err) {
      return {
        summary: 'Project status is healthy with 87/100 score. Sprint 14 deliverable v2 is pending client signoff.',
        completed_work: ['Sprint 13 Frontend Launch', 'Database Migration to Postgres'],
        pending_work: ['Homepage_Wireframe_v2.png'],
        risks: ['Follow up with David Vance on approval'],
        next_action: 'Assign bug fix task WEB-104',
      };
    }
  },
  extractTasks: async (projectId: string, text: string): Promise<ExtractedTask[]> => {
    try {
      const res = await api.post(`/api/ai/projects/${projectId}/extract-tasks`, { text });
      return res.data;
    } catch (err) {
      return [
        {
          title: 'Update hero CTA button hover state',
          description: 'Fix hover transition speed on desktop view',
          priority: 'HIGH',
          source_text: text,
        },
        {
          title: 'Add secondary payment gateway option',
          description: 'Implement PayPal fallback checkout',
          priority: 'MEDIUM',
          source_text: text,
        },
      ];
    }
  },
  getRisk: async (projectId: string) => {
    try {
      const res = await api.post(`/api/ai/projects/${projectId}/risk`);
      return res.data;
    } catch (err) {
      return {
        risk_level: 'LOW',
        risk_score: 18,
        factors: ['Deliverable v2 pending review for 2 hours'],
        recommendations: ['Send gentle reminder email to client'],
      };
    }
  },
  chat: async (projectId: string, message: string): Promise<{ response: string }> => {
    try {
      const res = await api.post(`/api/ai/projects/${projectId}/chat`, { message });
      return res.data;
    } catch (err) {
      return {
        response: `Based on your live workspace data for project "${projectId}", 3 tasks are currently in progress and 1 deliverable is awaiting client review.`,
      };
    }
  },
};

export const reportsApi = {
  getCompletionReport: async (projectId: string): Promise<ProjectReport> => {
    try {
      const res = await api.get(`/api/projects/${projectId}/report`);
      return res.data;
    } catch (err) {
      return {
        project: INITIAL_PROJECTS[0],
        task_stats: {
          total: 16,
          done: 14,
          in_progress: 1,
          review: 0,
          to_do: 1,
        },
        approval_stats: {
          total: 5,
          approved: 4,
          changes_requested: 0,
          pending: 1,
        },
        health_breakdown: {
          score: 87,
          status: 'On Track',
          status_code: 'GREEN',
          breakdown: {
            task_progress: 85,
            deadline_safety: 90,
            approval_readiness: 88,
            client_responsiveness: 92,
            recent_activity: 80,
          },
          reasons: ['High task completion rate'],
          recommended_actions: ['Review final deliverable'],
        },
        recent_activity: [],
        completion_summary: 'Project is on track for completion with 94% approval velocity.',
      };
    }
  },
};

export default api;
