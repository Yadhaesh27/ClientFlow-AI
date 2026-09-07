import React, { useState, useEffect } from 'react';
import {
  FolderKanban, CheckSquare, Clock, AlertTriangle, Plus,
  ArrowUpRight, Sparkles, ShieldCheck, FileCheck, Activity, Users, DollarSign,
  TrendingUp, BarChart2, CheckCircle2, UserCheck, Upload, FileText
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { projectsApi, approvalsApi, notificationsApi, authApi } from '../services/api';
import { Project, Approval, ActivityLog, User } from '../types';
import { HealthBadge } from '../components/HealthBadge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface DashboardPageProps {
  onSelectProject: (projectId: string) => void;
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectProject, onNavigate }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for Project creation
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedDeveloperIds, setSelectedDeveloperIds] = useState<string[]>([]);
  const [newDeadline, setNewDeadline] = useState('');
  const [newBudget, setNewBudget] = useState(25000);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projList, actions, users] = await Promise.all([
        projectsApi.list(),
        approvalsApi.getActionCenter(),
        authApi.getOrgUsers(),
      ]);
      setProjects(projList);
      setPendingApprovals(actions);
      setOrgUsers(users);

      if (projList.length > 0) {
        const logs = await notificationsApi.getProjectActivity(projList[0].id);
        setActivityLogs(logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleToggleDeveloper = (userId: string) => {
    if (selectedDeveloperIds.includes(userId)) {
      setSelectedDeveloperIds(selectedDeveloperIds.filter(id => id !== userId));
    } else {
      setSelectedDeveloperIds([...selectedDeveloperIds, userId]);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await projectsApi.create({
        name: newName,
        description: newDesc,
        client_user_id: selectedClientId || undefined,
        assigned_member_ids: selectedDeveloperIds,
        deadline: newDeadline,
        budget: newBudget
      });
      setShowCreateModal(false);
      setNewName('');
      setNewDesc('');
      setSelectedClientId('');
      setSelectedDeveloperIds([]);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const clientsList = orgUsers.filter(u => u.role === 'CLIENT');
  const developersList = orgUsers.filter(u => u.role === 'TEAM_MEMBER' || u.role === 'PROJECT_MANAGER' || u.role === 'ADMIN');

  // Realistic Demo Data for 8 Analytics Graphs
  const chartColors = {
    indigo: isDark ? '#818cf8' : '#4f46e5',
    violet: isDark ? '#a78bfa' : '#7c3aed',
    emerald: isDark ? '#34d399' : '#10b981',
    amber: isDark ? '#fbbf24' : '#f59e0b',
    rose: isDark ? '#f87171' : '#ef4444',
    sky: isDark ? '#38bdf8' : '#0284c7',
    grid: isDark ? '#1e293b' : '#f1f5f9',
    text: isDark ? '#94a3b8' : '#64748b'
  };

  // Graph 1: Project Progress Over Time (5 Weeks)
  const progressData = [
    { week: 'Week 1', AI_Ecommerce: 20, Mobile_Banking: 15, Telehealth: 30, Streaming: 10, Branding: 5 },
    { week: 'Week 2', AI_Ecommerce: 45, Mobile_Banking: 30, Telehealth: 55, Streaming: 20, Branding: 10 },
    { week: 'Week 3', AI_Ecommerce: 65, Mobile_Banking: 45, Telehealth: 75, Streaming: 30, Branding: 15 },
    { week: 'Week 4', AI_Ecommerce: 78, Mobile_Banking: 55, Telehealth: 88, Streaming: 35, Branding: 20 },
    { week: 'Week 5', AI_Ecommerce: 85, Mobile_Banking: 60, Telehealth: 95, Streaming: 40, Branding: 25 },
  ];

  // Graph 2: Monthly Revenue (5 Months in $k)
  const revenueData = [
    { month: 'May', Revenue: 45.0 },
    { month: 'Jun', Revenue: 75.0 },
    { month: 'Jul', Revenue: 95.0 },
    { month: 'Aug', Revenue: 110.0 },
    { month: 'Sep', Revenue: 120.0 },
  ];

  // Graph 3: Task Completion Status (5 Categories)
  const taskStatusData = [
    { name: 'Completed', value: 10, color: chartColors.emerald },
    { name: 'In Progress', value: 6, color: chartColors.indigo },
    { name: 'Pending Review', value: 5, color: chartColors.amber },
    { name: 'Backlog', value: 3, color: chartColors.sky },
    { name: 'Overdue', value: 1, color: chartColors.rose },
  ];

  // Graph 4: Client Interaction Activity (5 Days)
  const clientActivityData = [
    { day: 'Mon', Approvals: 4, Feedback: 8, Messages: 15 },
    { day: 'Tue', Approvals: 6, Feedback: 12, Messages: 22 },
    { day: 'Wed', Approvals: 3, Feedback: 7, Messages: 14 },
    { day: 'Thu', Approvals: 8, Feedback: 15, Messages: 28 },
    { day: 'Fri', Approvals: 5, Feedback: 9, Messages: 18 },
  ];

  // Graph 5: Approval Velocity (5 Categories in Hours)
  const approvalVelocityData = [
    { category: 'UI Design', Hours: 2.4 },
    { category: 'API Backend', Hours: 4.8 },
    { category: 'Security Spec', Hours: 1.5 },
    { category: 'QA Signoff', Hours: 3.2 },
    { category: 'Content', Hours: 1.8 },
  ];

  // Graph 6: Team Productivity (5 Developers)
  const teamProductivityData = [
    { dev: 'Aarav S.', Tasks: 9 },
    { dev: 'Priya P.', Tasks: 8 },
    { dev: 'Marcus V.', Tasks: 7 },
    { dev: 'Alex R.', Tasks: 6 },
    { dev: 'Sarah J.', Tasks: 5 },
  ];

  // Graph 7: Project Health Distribution (5 Tiers)
  const healthDistData = [
    { name: '90-100% Elite', value: 2, color: chartColors.emerald },
    { name: '80-89% Healthy', value: 2, color: chartColors.indigo },
    { name: '70-79% On Track', value: 1, color: chartColors.sky },
    { name: '60-69% At Risk', value: 0, color: chartColors.amber },
    { name: '<60% Delayed', value: 0, color: chartColors.rose },
  ];

  // Graph 8: Client Satisfaction Trend (5 Months)
  const csatData = [
    { month: 'May', Rating: 4.6 },
    { month: 'Jun', Rating: 4.7 },
    { month: 'Jul', Rating: 4.8 },
    { month: 'Aug', Rating: 4.9 },
    { month: 'Sep', Rating: 5.0 },
  ];

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900 dark:text-white">
      {/* Morning Greeting & Quick Actions Header */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-200/80 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Good morning, {user?.name || 'Administrator'} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-2">
            <span>Here's what needs your attention today.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formattedDate}</span>
          </p>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {user?.role !== 'CLIENT' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          )}
          <button
            onClick={() => onNavigate('/clients')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" /> New Client
          </button>
          <button
            onClick={() => onNavigate('/kanban')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-sky-500" /> Create Task
          </button>
          <button
            onClick={() => onNavigate('/files')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-violet-500" /> Upload File
          </button>
          <button
            onClick={() => onNavigate('/approvals')}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-500" /> Request Approval
          </button>
        </div>
      </div>

      {/* Dynamic Scale KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Clients</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{clientsList.length}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{clientsList.length > 0 ? '+12 this month' : 'No clients'}</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Developers</span>
            <UserCheck className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{developersList.length}</div>
          <div className="text-[10px] text-slate-400 font-medium">Team Members</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Active Proj</span>
            <FolderKanban className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{projects.filter(p => p.status === 'ACTIVE').length}</div>
          <div className="text-[10px] text-slate-400 font-medium">{projects.filter(p => p.status === 'COMPLETED').length} Completed</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Open Tasks</span>
            <CheckSquare className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{projects.reduce((acc, p) => acc + (p.progress < 100 ? 3 : 0), 0)}</div>
          <div className="text-[10px] text-slate-400 font-medium">Active Tasks</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Approvals</span>
            <FileCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">{pendingApprovals.length}</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{pendingApprovals.length > 0 ? 'Pending client' : 'Zero pending'}</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-500">0</div>
          <div className="text-[10px] text-slate-400 font-medium">Clear status</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {projects.length > 0 ? `₹${(projects.reduce((acc, p) => acc + (p.budget || 0), 0) / 100000).toFixed(1)}L` : '₹0'}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{projects.length > 0 ? '+18% MoM' : '0%'}</div>
        </div>

        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px] font-bold">
            <span>CSAT</span>
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black text-violet-600 dark:text-violet-400">{projects.length > 0 ? '4.9 / 5' : '0.0 / 5'}</div>
          <div className="text-[10px] text-slate-400 font-medium">{projects.length > 0 ? '98% Satisfaction' : 'No ratings yet'}</div>
        </div>
      </div>

      {/* 8 Business Analytics Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Graph 1: Project Progress */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Project Progress Velocity</h3>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Sprint Weeks</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="week" stroke={chartColors.text} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartColors.text} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="ECommerce" stroke={chartColors.indigo} fill={chartColors.indigo} fillOpacity={0.2} />
                <Area type="monotone" dataKey="Marketing" stroke={chartColors.emerald} fill={chartColors.emerald} fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Monthly Revenue */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Monthly Revenue (Lakhs ₹)</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+18% Growth</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" stroke={chartColors.text} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartColors.text} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="Revenue" fill={chartColors.indigo} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Task Status Breakdown */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Task Completion Status</h3>
            <span className="text-[10px] text-slate-400 font-bold">184 Tasks</span>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Client Activity Interactions */}
        <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">Weekly Client Activity</h3>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">Interactions</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="day" stroke={chartColors.text} tick={{ fontSize: 10 }} />
                <YAxis stroke={chartColors.text} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="Messages" stroke={chartColors.sky} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Approvals" stroke={chartColors.emerald} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Main Column Grid: Active Projects & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Projects List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Active Client Workspaces</h2>
            <button
              onClick={() => onNavigate('/projects')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
            >
              View all projects <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading active projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-3xl text-slate-500 text-xs">
              No active projects found. Create your first workspace.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4 cursor-pointer transition-all hover:border-indigo-500/40 hover:shadow-xl group bg-white/80 dark:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px]">
                        [{proj.key_prefix || 'PROJ'}]
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1">
                        {proj.name}
                      </h3>
                    </div>
                    <HealthBadge score={proj.health_score} projectId={proj.id} />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {proj.description || 'No description provided.'}
                  </p>

                  {/* Client & Member Indicators */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Client: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{proj.client?.name || 'Northstar Labs'}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {proj.members?.length || 4} Devs
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span>Sprint Progress</span>
                      <span className="text-slate-900 dark:text-white font-extrabold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800 pt-3">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Deadline: {proj.deadline || 'Flexible'}
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">
                      Budget: ₹{proj.budget ? proj.budget.toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Workspace Activity Feed
            </h2>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3 bg-white/80 dark:bg-slate-900/80">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent activity events recorded.</p>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-medium leading-tight">
                      {log.metadata_json
                        ? JSON.parse(log.metadata_json).detail || JSON.parse(log.metadata_json).name || log.metadata_json
                        : 'Project updated'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Create Project Workspace Modal with Client & Developer Assignment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleCreateProject}
            className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl bg-white dark:bg-slate-900"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Create New Client Workspace</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Assign client stakeholder account and select developer team members
              </p>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Project Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. E-Commerce Platform Overhaul"
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Assign Client Account</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none bg-white dark:bg-slate-800"
              >
                <option value="">-- Select Client Account --</option>
                {clientsList.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Assign Developer / Team Members</label>
              <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl">
                {developersList.map(dev => (
                  <label key={dev.id} className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedDeveloperIds.includes(dev.id)}
                      onChange={() => handleToggleDeveloper(dev.id)}
                      className="rounded border-slate-300 bg-white text-indigo-600 focus:ring-0"
                    />
                    <span>{dev.name} ({dev.role})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Project Description</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief project scope, goals, and key deliverables..."
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Target Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Budget (₹)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md cursor-pointer"
              >
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
