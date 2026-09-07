import axios from 'axios';
import {
  User, Project, Task, ProjectFile, Approval, Message,
  Notification, ActivityLog, ProjectHealthDetail, AISummary,
  ExtractedTask, ProjectReport, AIScopeCreep, AIDraftUpdate,
  AISmartAssign, AISentiment
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 600, // Reduced from 4000 to 600ms for ultra-fast response & instant offline fallback
});

// Fast Offline Circuit Breaker: Cache offline status to avoid repeated 1-4s network timeouts
let isBackendOffline = false;
let lastOfflineCheck = 0;

const tryApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  const now = Date.now();
  // If backend was marked offline within the last 15 seconds, skip network call immediately (0ms latency)
  if (isBackendOffline && now - lastOfflineCheck < 15000) {
    return null;
  }
  try {
    const res = await apiCall();
    isBackendOffline = false;
    return res;
  } catch (err) {
    isBackendOffline = true;
    lastOfflineCheck = now;
    return null;
  }
};

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
    organization_id: 'org_novaworks',
    client_user_id: 'usr_client_1',
    name: 'NextGen AI E-Commerce Platform',
    key_prefix: 'ECOMM',
    description: 'High-throughput e-commerce platform with Gemini AI dynamic product recommendations and streaming search.',
    status: 'ACTIVE',
    progress: 85,
    health_score: 92,
    budget: 120000,
    deadline: '2026-11-30',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_2',
    organization_id: 'org_novaworks',
    client_user_id: 'usr_client_3',
    name: 'Mobile Banking & Wealth App',
    key_prefix: 'BANK',
    description: 'Biometric mobile banking portal featuring encrypted microservice API integration.',
    status: 'ACTIVE',
    progress: 60,
    health_score: 88,
    budget: 185000,
    deadline: '2026-12-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_3',
    organization_id: 'org_novaworks',
    client_user_id: 'usr_client_4',
    name: 'Cloud Media Streaming Portal',
    key_prefix: 'STREAM',
    description: 'Low-latency streaming video delivery network with real-time video transcoding.',
    status: 'ACTIVE',
    progress: 40,
    health_score: 75,
    budget: 95000,
    deadline: '2026-10-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_4',
    organization_id: 'org_novaworks',
    client_user_id: 'usr_client_5',
    name: 'Telehealth Patient Care Dashboard',
    key_prefix: 'HEALTH',
    description: 'HIPAA-compliant doctor consultation dashboard and patient record synchronization.',
    status: 'ACTIVE',
    progress: 95,
    health_score: 96,
    budget: 140000,
    deadline: '2026-09-30',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'proj_5',
    organization_id: 'org_novaworks',
    client_user_id: 'usr_client_2',
    name: 'Brand Design & Interactive UI Suite',
    key_prefix: 'BRAND',
    description: 'Complete brand guidelines, dark mode design tokens, and vector icon suite.',
    status: 'ACTIVE',
    progress: 25,
    health_score: 82,
    budget: 65000,
    deadline: '2026-12-01',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Dynamic Tasks matching Task interface (5 tasks per project)
const INITIAL_TASKS: Task[] = [
  // Project 1 Tasks
  { id: 'task_1', project_id: 'proj_1', issue_key: 'ECOMM-101', title: 'Implement Gemini AI product recommendation API', description: 'Integrate real-time embeddings for similar product drawer', status: 'IN_PROGRESS', priority: 'HIGH', issue_type: 'STORY', story_points: 5, assignee_id: 'usr_dev_1', created_by: 'usr_pm', due_date: '2026-10-15', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_2', project_id: 'proj_1', issue_key: 'ECOMM-102', title: 'Fix mobile checkout button overlap', description: 'Adjust sticky bottom container on Safari iOS', status: 'REVIEW', priority: 'URGENT', issue_type: 'BUG', story_points: 3, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-10-10', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_3', project_id: 'proj_1', issue_key: 'ECOMM-103', title: 'Stripe Payment Gateway webhook handler', description: 'Setup webhook signature verification and idempotency keys', status: 'DONE', priority: 'HIGH', issue_type: 'STORY', story_points: 8, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-09-28', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_4', project_id: 'proj_1', issue_key: 'ECOMM-104', title: 'Add Redis cache layer for product catalog', description: 'Cache top 1000 inventory items with 15min TTL', status: 'TO_DO', priority: 'MEDIUM', issue_type: 'TASK', story_points: 3, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-11-01', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_5', project_id: 'proj_1', issue_key: 'ECOMM-105', title: 'Audit accessibility compliance (WCAG 2.1 AA)', description: 'Ensure screen reader ARIA labels on modal dialogs', status: 'BACKLOG', priority: 'LOW', issue_type: 'TASK', story_points: 2, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-11-15', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Project 2 Tasks
  { id: 'task_6', project_id: 'proj_2', issue_key: 'BANK-101', title: 'Implement Biometric WebAuthn authentication', description: 'Enable fingerprint and FaceID sign-in flow', status: 'IN_PROGRESS', priority: 'URGENT', issue_type: 'STORY', story_points: 8, assignee_id: 'usr_dev_1', created_by: 'usr_pm', due_date: '2026-10-20', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_7', project_id: 'proj_2', issue_key: 'BANK-102', title: 'Encrypt transaction payload with AES-256', description: 'Add payload level encryption for wire transfers', status: 'DONE', priority: 'HIGH', issue_type: 'TASK', story_points: 5, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-09-30', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_8', project_id: 'proj_2', issue_key: 'BANK-103', title: 'Fix currency formatting decimal bug', description: 'Format JPY and EUR currencies according to locale', status: 'REVIEW', priority: 'MEDIUM', issue_type: 'BUG', story_points: 2, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-10-05', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_9', project_id: 'proj_2', issue_key: 'BANK-104', title: 'Design investment portfolio performance graph', description: 'Interactive area chart for historical stock yields', status: 'TO_DO', priority: 'HIGH', issue_type: 'STORY', story_points: 5, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-11-10', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_10', project_id: 'proj_2', issue_key: 'BANK-105', title: 'Automated SMS push notification service', description: 'Trigger SMS alerts on debit transactions exceeding $500', status: 'BACKLOG', priority: 'LOW', issue_type: 'TASK', story_points: 3, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-11-25', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Project 3 Tasks
  { id: 'task_11', project_id: 'proj_3', issue_key: 'STREAM-101', title: 'HLS Video player adaptive bitrate switching', description: 'Smoothly toggle 1080p, 720p, 480p streams based on network speed', status: 'IN_PROGRESS', priority: 'HIGH', issue_type: 'STORY', story_points: 5, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-10-12', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_12', project_id: 'proj_3', issue_key: 'STREAM-102', title: 'Transcoding pipeline microservice setup', description: 'Deploy FFmpeg container on GCP Cloud Run', status: 'TO_DO', priority: 'URGENT', issue_type: 'TASK', story_points: 8, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-10-18', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_13', project_id: 'proj_3', issue_key: 'STREAM-103', title: 'Fix audio sync drift on Safari HLS player', description: 'Prevent audio/video desync after seeking forward', status: 'REVIEW', priority: 'HIGH', issue_type: 'BUG', story_points: 3, assignee_id: 'usr_dev_1', created_by: 'usr_pm', due_date: '2026-10-08', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_14', project_id: 'proj_3', issue_key: 'STREAM-104', title: 'Subtitles and Closed Captioning VTT parser', description: 'Support multi-language SRT and VTT files', status: 'DONE', priority: 'MEDIUM', issue_type: 'STORY', story_points: 3, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-09-25', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_15', project_id: 'proj_3', issue_key: 'STREAM-105', title: 'User watch history & continue watching API', description: 'Persist timestamp progress every 5 seconds', status: 'BACKLOG', priority: 'LOW', issue_type: 'TASK', story_points: 3, assignee_id: 'usr_dev_1', created_by: 'usr_pm', due_date: '2026-11-05', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Project 4 Tasks
  { id: 'task_16', project_id: 'proj_4', issue_key: 'HEALTH-101', title: 'HIPAA-compliant WebRTC video consultation room', description: 'Peer-to-peer encrypted medical video call pipeline', status: 'DONE', priority: 'URGENT', issue_type: 'STORY', story_points: 8, assignee_id: 'usr_dev_1', created_by: 'usr_pm', due_date: '2026-09-20', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_17', project_id: 'proj_4', issue_key: 'HEALTH-102', title: 'E-Prescription PDF generator & digital sign', description: 'Generate signed medical prescription documents for pharmacy', status: 'DONE', priority: 'HIGH', issue_type: 'TASK', story_points: 5, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-09-25', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_18', project_id: 'proj_4', issue_key: 'HEALTH-103', title: 'Doctor schedule calendar booking sync', description: 'Sync appointment slots with Google Calendar and Outlook', status: 'IN_PROGRESS', priority: 'HIGH', issue_type: 'STORY', story_points: 5, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-10-02', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_19', project_id: 'proj_4', issue_key: 'HEALTH-104', title: 'Fix vital signs chart tooltips on mobile', description: 'Improve heart rate & blood pressure graph readability', status: 'REVIEW', priority: 'MEDIUM', issue_type: 'BUG', story_points: 2, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-09-29', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_20', project_id: 'proj_4', issue_key: 'HEALTH-105', title: 'Patient medical history audit log export', description: 'Export access log records for compliance verification', status: 'DONE', priority: 'MEDIUM', issue_type: 'TASK', story_points: 3, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-09-15', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // Project 5 Tasks
  { id: 'task_21', project_id: 'proj_5', issue_key: 'BRAND-101', title: 'Dark mode design token color palette system', description: 'Generate CSS custom properties for primary, surface, and semantic colors', status: 'IN_PROGRESS', priority: 'HIGH', issue_type: 'STORY', story_points: 3, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-10-25', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_22', project_id: 'proj_5', issue_key: 'BRAND-102', title: 'Vector icon set SVG export & React component library', description: 'Package 120 custom UI icons into NPM component package', status: 'TO_DO', priority: 'MEDIUM', issue_type: 'TASK', story_points: 5, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-11-05', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_23', project_id: 'proj_5', issue_key: 'BRAND-103', title: 'Brand typography stylesheet & Google Fonts integration', description: 'Setup Inter & Outfit variable font loading specs', status: 'DONE', priority: 'LOW', issue_type: 'TASK', story_points: 2, assignee_id: 'usr_dev_1', created_by: 'usr_pm', due_date: '2026-09-18', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_24', project_id: 'proj_5', issue_key: 'BRAND-104', title: 'Interactive Storybook UI component showcase', description: 'Deploy Storybook documentation site on Vercel', status: 'TO_DO', priority: 'MEDIUM', issue_type: 'STORY', story_points: 5, assignee_id: 'usr_dev_3', created_by: 'usr_pm', due_date: '2026-11-20', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'task_25', project_id: 'proj_5', issue_key: 'BRAND-105', title: 'Fix logo SVG clipping path on Safari browsers', description: 'Ensure viewBox bounds render without cropped edges', status: 'REVIEW', priority: 'HIGH', issue_type: 'BUG', story_points: 2, assignee_id: 'usr_dev_2', created_by: 'usr_pm', due_date: '2026-10-15', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// Seed Dynamic Notifications matching Notification interface
const INITIAL_NOTIFS: Notification[] = [];

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
    const data = await tryApiCall(async () => {
      const res = await api.post('/api/auth/login', { email, password });
      return res.data;
    });
    if (data) return data;

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
  },
  register: async (name: string, email: string, password: string, organization_name: string, role = 'ADMIN') => {
    const data = await tryApiCall(async () => {
      const res = await api.post('/api/auth/register', { name, email, password, organization_name, role });
      return res.data;
    });
    if (data) return data;

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
  },
  getMe: async (): Promise<User> => {
    const data = await tryApiCall(async () => {
      const res = await api.get('/api/auth/me');
      return res.data;
    });
    if (data) return data;

    const stored = localStorage.getItem('clientflow_current_user');
    if (stored) return JSON.parse(stored);
    return DEMO_USERS['admin@clientflow.demo'];
  },
  getOrgUsers: async (): Promise<User[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get('/api/auth/users');
      return res.data;
    });
    if (data) return data;

    return Object.values(DEMO_USERS);
  },
};

export const projectsApi = {
  list: async (): Promise<Project[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get('/api/projects');
      return res.data;
    });
    if (data) return data;

    const stored = getLocalData<Project[]>('clientflow_projects', INITIAL_PROJECTS);
    if (stored.length > INITIAL_PROJECTS.length) {
      setLocalData('clientflow_projects', INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    return stored;
  },
  create: async (data: Partial<Project> & { assigned_member_ids?: string[] }): Promise<Project> => {
    const resData = await tryApiCall(async () => {
      const res = await api.post('/api/projects', data);
      return res.data;
    });
    if (resData) return resData;

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
  },
  get: async (id: string): Promise<Project> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${id}`);
      return res.data;
    });
    if (data) return data;

    const list = getLocalData('clientflow_projects', INITIAL_PROJECTS);
    return list.find((p) => p.id === id) || list[0];
  },
  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const resData = await tryApiCall(async () => {
      const res = await api.patch(`/api/projects/${id}`, data);
      return res.data;
    });
    if (resData) return resData;

    const list = getLocalData('clientflow_projects', INITIAL_PROJECTS);
    const updated = list.map((p) => (p.id === id ? { ...p, ...data } : p));
    setLocalData('clientflow_projects', updated);
    return updated.find((p) => p.id === id)!;
  },
  delete: async (id: string) => {
    const resData = await tryApiCall(async () => {
      const res = await api.delete(`/api/projects/${id}`);
      return res.data;
    });
    if (resData) return resData;

    const list = getLocalData('clientflow_projects', INITIAL_PROJECTS);
    setLocalData('clientflow_projects', list.filter((p) => p.id !== id));
    return { message: 'Deleted' };
  },
  getHealth: async (id: string): Promise<ProjectHealthDetail> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${id}/health`);
      return res.data;
    });
    if (data) return data;

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
  },
};

export const tasksApi = {
  list: async (projectId?: string): Promise<Task[]> => {
    const data = await tryApiCall(async () => {
      const url = projectId ? `/api/projects/${projectId}/tasks` : '/api/tasks';
      const res = await api.get(url);
      return res.data;
    });
    if (data) return data;

    let allTasks = getLocalData<Task[]>('clientflow_tasks', INITIAL_TASKS);
    if (allTasks.length > INITIAL_TASKS.length) {
      setLocalData('clientflow_tasks', INITIAL_TASKS);
      allTasks = INITIAL_TASKS;
    }
    return allTasks.filter((t) => !projectId || t.project_id === projectId);
  },
  create: async (projectId: string, data: Partial<Task>): Promise<Task> => {
    const resData = await tryApiCall(async () => {
      const res = await api.post(`/api/projects/${projectId}/tasks`, { ...data, project_id: projectId });
      return res.data;
    });
    if (resData) return resData;

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
  },
  update: async (taskId: string, data: Partial<Task>): Promise<Task> => {
    const resData = await tryApiCall(async () => {
      const res = await api.patch(`/api/tasks/${taskId}`, data);
      return res.data;
    });
    if (resData) return resData;

    const allTasks = getLocalData('clientflow_tasks', INITIAL_TASKS);
    const updated = allTasks.map((t) => (t.id === taskId ? { ...t, ...data, updated_at: new Date().toISOString() } : t));
    setLocalData('clientflow_tasks', updated);
    return updated.find((t) => t.id === taskId)!;
  },
  delete: async (taskId: string) => {
    const resData = await tryApiCall(async () => {
      const res = await api.delete(`/api/tasks/${taskId}`);
      return res.data;
    });
    if (resData) return resData;

    const allTasks = getLocalData('clientflow_tasks', INITIAL_TASKS);
    setLocalData('clientflow_tasks', allTasks.filter((t) => t.id !== taskId));
    return { message: 'Deleted' };
  },
};

export const filesApi = {
  list: async (projectId: string): Promise<ProjectFile[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${projectId}/files`);
      return res.data;
    });
    if (data) return data;

    return [];
  },
  upload: async (projectId: string, formData: FormData): Promise<ProjectFile> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/projects/${projectId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    });
    if (data) return data;

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
  },
  uploadVersion: async (fileId: string, formData: FormData): Promise<ProjectFile> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/files/${fileId}/versions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    });
    if (data) return data;

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
  },
};

const INITIAL_APPROVALS: Approval[] = [];

export const approvalsApi = {
  list: async (projectId: string): Promise<Approval[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${projectId}/approvals`);
      return res.data;
    });
    if (data) return data;

    const list = getLocalData<Approval[]>('clientflow_approvals', INITIAL_APPROVALS);
    return list.filter((a) => a.project_id === projectId);
  },
  create: async (data: Partial<Approval>): Promise<Approval> => {
    const resData = await tryApiCall(async () => {
      const res = await api.post('/api/approvals', data);
      return res.data;
    });
    if (resData) return resData;

    const current = getLocalData<Approval[]>('clientflow_approvals', INITIAL_APPROVALS);
    const newApproval: Approval = {
      id: `app_${Date.now()}`,
      project_id: data.project_id || 'proj_1',
      file_id: data.file_id,
      title: data.title || 'New Verification / Approval Request',
      description: data.description || '',
      status: 'PENDING',
      requested_by_user_id: data.requested_by_user_id || 'usr_dev',
      requested_by_name: data.requested_by_name || 'Developer',
      requested_by_role: data.requested_by_role || 'TEAM_MEMBER',
      target_recipient: data.target_recipient || 'EVERYONE',
      requested_from_user_id: data.requested_from_user_id || 'usr_client',
      created_at: new Date().toISOString(),
    };
    const updated = [newApproval, ...current];
    setLocalData('clientflow_approvals', updated);
    return newApproval;
  },
  approve: async (approvalId: string, feedback?: string): Promise<Approval> => {
    const resData = await tryApiCall(async () => {
      const res = await api.post(`/api/approvals/${approvalId}/approve`, { status: 'APPROVED', feedback });
      return res.data;
    });
    if (resData) return resData;

    const current = getLocalData<Approval[]>('clientflow_approvals', INITIAL_APPROVALS);
    const updated = current.map((a) =>
      a.id === approvalId
        ? {
            ...a,
            status: 'APPROVED' as const,
            feedback: feedback || 'Approved and verified cleanly!',
            decided_at: new Date().toISOString(),
          }
        : a
    );
    setLocalData('clientflow_approvals', updated);
    return updated.find((a) => a.id === approvalId)!;
  },
  requestChanges: async (approvalId: string, feedback: string): Promise<Approval> => {
    const resData = await tryApiCall(async () => {
      const res = await api.post(`/api/approvals/${approvalId}/request-changes`, { status: 'CHANGES_REQUESTED', feedback });
      return res.data;
    });
    if (resData) return resData;

    const current = getLocalData<Approval[]>('clientflow_approvals', INITIAL_APPROVALS);
    const updated = current.map((a) =>
      a.id === approvalId
        ? {
            ...a,
            status: 'CHANGES_REQUESTED' as const,
            feedback: feedback || 'Revisions needed.',
            decided_at: new Date().toISOString(),
          }
        : a
    );
    setLocalData('clientflow_approvals', updated);
    return updated.find((a) => a.id === approvalId)!;
  },
  getActionCenter: async (): Promise<Approval[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get('/api/action-center');
      return res.data;
    });
    if (data) return data;

    const list = getLocalData<Approval[]>('clientflow_approvals', INITIAL_APPROVALS);
    return list.filter((a) => a.status === 'PENDING');
  },
};

export const messagesApi = {
  list: async (projectId: string): Promise<Message[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${projectId}/messages`);
      return res.data;
    });
    if (data) return data;

    const allMsg = getLocalData<Message[]>('clientflow_messages', []);
    return allMsg.filter(m => m.project_id === projectId);
  },
  send: async (projectId: string, message: string, attachment_url?: string): Promise<Message> => {
    const resData = await tryApiCall(async () => {
      const res = await api.post(`/api/projects/${projectId}/messages`, { message, attachment_url });
      return res.data;
    });
    if (resData) return resData;

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
  },
};

export const notificationsApi = {
  list: async (): Promise<Notification[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get('/api/notifications');
      return res.data;
    });
    if (data) return data;

    return getLocalData('clientflow_notifs', INITIAL_NOTIFS);
  },
  markRead: async (id: string): Promise<Notification> => {
    const resData = await tryApiCall(async () => {
      const res = await api.patch(`/api/notifications/${id}/read`);
      return res.data;
    });
    if (resData) return resData;

    const notifs = getLocalData('clientflow_notifs', INITIAL_NOTIFS);
    const updated = notifs.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    setLocalData('clientflow_notifs', updated);
    return updated.find((n) => n.id === id)!;
  },
  markAllRead: async () => {
    const resData = await tryApiCall(async () => {
      const res = await api.post('/api/notifications/read-all');
      return res.data;
    });
    if (resData) return resData;

    const notifs = getLocalData('clientflow_notifs', INITIAL_NOTIFS);
    const updated = notifs.map((n) => ({ ...n, is_read: true }));
    setLocalData('clientflow_notifs', updated);
    return { message: 'All marked read' };
  },
  getProjectActivity: async (projectId: string): Promise<ActivityLog[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${projectId}/activity`);
      return res.data;
    });
    if (data) return data;

    return [];
  },
};

export const aiApi = {
  getSummary: async (projectId: string): Promise<AISummary> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/summary`);
      return res.data;
    });
    if (data) return data;

    return {
      summary: 'Project status is healthy with 87/100 score. Sprint 14 deliverable v2 is pending client signoff.',
      completed_work: ['Sprint 13 Frontend Launch', 'Database Migration to Postgres'],
      pending_work: ['Homepage_Wireframe_v2.png'],
      risks: ['Follow up with David Vance on approval'],
      next_action: 'Assign bug fix task WEB-104',
    };
  },
  extractTasks: async (projectId: string, text: string): Promise<ExtractedTask[]> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/extract-tasks`, { text });
      return res.data;
    });
    if (data) return data;

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
  },
  getRisk: async (projectId: string) => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/risk`);
      return res.data;
    });
    if (data) return data;

    return {
      risk_level: 'LOW',
      risk_score: 18,
      factors: ['Deliverable v2 pending review for 2 hours'],
      recommendations: ['Send gentle reminder email to client'],
    };
  },
  chat: async (projectId: string, message: string): Promise<{ response: string }> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/chat`, { message });
      return res.data;
    });
    if (data) return data;

    return {
      response: `Based on your live workspace data for project "${projectId}", 3 tasks are currently in progress and 1 deliverable is awaiting client review.`,
    };
  },
  streamChat: async (projectId: string, message: string, onChunk: (chunk: string) => void) => {
    try {
      const token = localStorage.getItem('clientflow_token');
      const response = await fetch(`${API_BASE}/api/ai/projects/${projectId}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok || !response.body) throw new Error('Stream request failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const rawJson = line.slice(6);
            try {
              const parsed = JSON.parse(rawJson);
              if (parsed.text) {
                onChunk(parsed.text);
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Realtime streaming fallback triggered.');
      const msgLower = message.toLowerCase();
      let fallbackText = '';
      if (msgLower.includes('hi') || msgLower.includes('hello') || msgLower.includes('help')) {
        fallbackText = `Hello! I am your ClientFlow AI Copilot. Ask me about tasks, deadlines, team workload, or draft reports!`;
      } else if (msgLower.includes('health') || msgLower.includes('score')) {
        fallbackText = `Project health score is currently 87/100 (On Track). All milestones are proceeding smoothly with high task velocity.`;
      } else if (msgLower.includes('team') || msgLower.includes('dev') || msgLower.includes('assign')) {
        fallbackText = `Aarav Sharma (Lead Dev) has the lowest active task load (45% capacity) and is recommended for new tasks.`;
      } else if (msgLower.includes('budget') || msgLower.includes('cost')) {
        fallbackText = `Project budget is $245,000.00. Current sprint expenditures are tracking strictly within parameters.`;
      } else if (msgLower.includes('draft') || msgLower.includes('email') || msgLower.includes('update')) {
        fallbackText = `Executive Update Draft: Progress stands at 82%. Deliverable v4 has been uploaded and is pending client sign-off.`;
      } else {
        fallbackText = `Regarding "${message}": Progress is 82%, Health Score is 87/100, and 1 approval deliverable is awaiting client sign-off.`;
      }

      for (const word of fallbackText.split(' ')) {
        onChunk(word + ' ');
        await new Promise((r) => setTimeout(r, 20));
      }
    }
  },
  detectScopeCreep: async (projectId: string, feedbackText: string): Promise<AIScopeCreep> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/scope-creep`, { feedback_text: feedbackText });
      return res.data;
    });
    if (data) return data;

    const isCreep = feedbackText.toLowerCase().includes('add') || feedbackText.toLowerCase().includes('new') || feedbackText.toLowerCase().includes('integration');
    return {
      is_scope_creep: isCreep,
      confidence_score: isCreep ? 94 : 30,
      category: isCreep ? 'ADDITIONAL_FEATURE' : 'IN_SCOPE_REVISION',
      estimated_extra_hours: isCreep ? 14 : 2,
      estimated_cost_impact: isCreep ? 1400 : 0,
      analysis_reason: isCreep
        ? 'Client comment requests additional functional modules outside core sprint contract bounds.'
        : 'Requested adjustments are within standard revision allocations.',
      recommended_action: isCreep
        ? 'Issue Change Order for client approval & additional budget allocation.'
        : 'Incorporate into next sprint task queue.',
    };
  },
  draftUpdate: async (projectId: string, tone: 'EXECUTIVE' | 'FRIENDLY' | 'URGENT' = 'EXECUTIVE'): Promise<AIDraftUpdate> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/draft-update`, { tone });
      return res.data;
    });
    if (data) return data;

    if (tone === 'FRIENDLY') {
      return {
        tone: 'FRIENDLY',
        subject: '🚀 Great progress update on your project!',
        body: 'Hi Team!\n\nWe have made awesome strides this week! Core features are deployed and responsive viewports are verified.\n\nPlease take a quick minute to review the open deliverable in your Action Center so we can keep the momentum rolling!\n\nBest regards,\nYour ClientFlow Team',
      };
    } else if (tone === 'URGENT') {
      return {
        tone: 'URGENT',
        subject: '⚠️ Action Required: Immediate Sign-off Needed',
        body: 'Dear Partner,\n\nWe are currently awaiting client sign-off on open deliverable items. Progress is currently paused pending this verification.\n\nTo avoid timeline delays, please review and approve the pending deliverable today.\n\nThank you,\nClientFlow Project Manager',
      };
    }
    return {
      tone: 'EXECUTIVE',
      subject: 'Executive Progress Report (78% Complete)',
      body: 'Hello,\n\nPlease find the executive status report for your active project.\n\n• Progress Velocity: 78%\n• Project Health Score: 87/100 (On Track)\n• Deliverable Status: Sprint 14 assets uploaded & awaiting final sign-off.\n\nSincerely,\nClientFlow Enterprise Management',
    };
  },
  suggestAssignee: async (projectId: string, taskTitle: string, taskDescription?: string): Promise<AISmartAssign> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/suggest-assignee`, {
        task_title: taskTitle,
        task_description: taskDescription,
      });
      return res.data;
    });
    if (data) return data;

    return {
      task_title: taskTitle,
      recommended_assignee_id: 'usr_dev',
      recommendations: [
        {
          user_id: 'usr_dev',
          user_name: 'Aarav Sharma',
          role: 'Lead Frontend Developer',
          match_score: 95,
          current_workload_pct: 45,
          skill_match: ['React', 'TypeScript', 'Tailwind CSS'],
          recommendation_reason: 'Low current workload (45%) and expert proficiency in UI components.',
        },
        {
          user_id: 'usr_pm',
          user_name: 'Alex Rivera',
          role: 'Project Manager',
          match_score: 82,
          current_workload_pct: 60,
          skill_match: ['Sprint Management', 'API Specs'],
          recommendation_reason: 'Moderate workload and owner of client scope alignment.',
        },
      ],
    };
  },
  getSentiment: async (projectId: string): Promise<AISentiment> => {
    const data = await tryApiCall(async () => {
      const res = await api.post(`/api/ai/projects/${projectId}/sentiment`);
      return res.data;
    });
    if (data) return data;

    return {
      sentiment_score: 88,
      sentiment_label: 'POSITIVE',
      friction_points: [
        'Approval review lag of 3 days on Homepage Wireframe v2 deliverable',
        'Minor clarification requested on mobile font sizing',
      ],
      client_response_lag_hours: 14,
      suggested_retention_action: 'Send quick video preview or schedule a 5-minute sync call to answer layout questions.',
    };
  },
};

export const reportsApi = {
  getCompletionReport: async (projectId: string): Promise<ProjectReport> => {
    const data = await tryApiCall(async () => {
      const res = await api.get(`/api/projects/${projectId}/report`);
      return res.data;
    });
    if (data) return data;

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
  },
};

export default api;
