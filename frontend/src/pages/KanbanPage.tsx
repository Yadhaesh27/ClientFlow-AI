import React, { useState, useEffect } from 'react';
import {
  Plus, CheckSquare, Clock, ArrowRight, ArrowLeft, Trash2,
  Bookmark, AlertOctagon, CheckCircle2, Zap, Filter, Search, User as UserIcon
} from 'lucide-react';
import { tasksApi, projectsApi, authApi } from '../services/api';
import { Task, Project, TaskStatus, TaskPriority, IssueType, User } from '../types';
import { useAuth } from '../context/AuthContext';

interface KanbanPageProps {
  projectId?: string;
}

export const KanbanPage: React.FC<KanbanPageProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskIssueType, setTaskIssueType] = useState<IssueType>('STORY');
  const [taskStoryPoints, setTaskStoryPoints] = useState<number>(3);
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('MEDIUM');
  const [taskAssigneeId, setTaskAssigneeId] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState('');

  useEffect(() => {
    const init = async () => {
      const pList = await projectsApi.list();
      setProjects(pList);
      const uList = await authApi.getOrgUsers();
      setOrgUsers(uList);

      if (pList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(pList[0].id);
      }
    };
    init();
  }, []);

  const loadTasks = async (pId: string) => {
    if (!pId) return;
    setLoading(true);
    try {
      const list = await tasksApi.list(pId);
      setTasks(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await tasksApi.update(taskId, { status: newStatus });
      loadTasks(selectedProjectId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksApi.delete(taskId);
      loadTasks(selectedProjectId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !selectedProjectId) return;
    try {
      await tasksApi.create(selectedProjectId, {
        title: taskTitle,
        description: taskDesc,
        issue_type: taskIssueType,
        story_points: taskStoryPoints,
        priority: taskPriority,
        assignee_id: taskAssigneeId || undefined,
        due_date: taskDueDate,
        status: 'TO_DO'
      });
      setShowCreateModal(false);
      setTaskTitle('');
      setTaskDesc('');
      loadTasks(selectedProjectId);
    } catch (e) {
      console.error(e);
    }
  };

  const renderIssueIcon = (type?: IssueType) => {
    if (type === 'BUG') return <span title="Bug"><AlertOctagon className="w-3.5 h-3.5 text-rose-500 shrink-0" /></span>;
    if (type === 'EPIC') return <span title="Epic"><Zap className="w-3.5 h-3.5 text-purple-500 shrink-0" /></span>;
    if (type === 'TASK') return <span title="Task"><CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" /></span>;
    return <span title="Story"><Bookmark className="w-3.5 h-3.5 text-emerald-500 shrink-0" /></span>;
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.issue_key && t.issue_key.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || t.issue_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns: { id: TaskStatus; label: string; bg: string; border: string; headerBadge: string }[] = [
    { id: 'BACKLOG', label: 'Backlog', bg: 'bg-slate-100/60 dark:bg-slate-900/60', border: 'border-slate-300 dark:border-slate-800', headerBadge: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200' },
    { id: 'TO_DO', label: 'Selected for Dev', bg: 'bg-sky-50/60 dark:bg-sky-950/20', border: 'border-sky-300 dark:border-sky-900', headerBadge: 'bg-sky-100 dark:bg-sky-900/80 text-sky-900 dark:text-sky-200' },
    { id: 'IN_PROGRESS', label: 'In Progress', bg: 'bg-indigo-50/60 dark:bg-indigo-950/20', border: 'border-indigo-300 dark:border-indigo-900', headerBadge: 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200' },
    { id: 'REVIEW', label: 'In Review / QA', bg: 'bg-amber-50/60 dark:bg-amber-950/20', border: 'border-amber-300 dark:border-amber-900', headerBadge: 'bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200' },
    { id: 'DONE', label: 'Done', bg: 'bg-emerald-50/60 dark:bg-emerald-950/20', border: 'border-emerald-300 dark:border-emerald-900', headerBadge: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white">
      {/* Header & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800">
              ClientFlow Agile Workspace
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Tasks & Workflow Board
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none bg-white dark:bg-slate-800"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name} [{p.key_prefix || 'PROJ'}]</option>
            ))}
          </select>

          {user?.role !== 'CLIENT' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Task
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 glass-panel p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by task key e.g. WEB-101 or summary..."
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none bg-white dark:bg-slate-800"
          >
            <option value="ALL">All Task Types</option>
            <option value="STORY">User Story</option>
            <option value="BUG">Bug Fix</option>
            <option value="TASK">General Task</option>
            <option value="EPIC">Feature Epic</option>
          </select>
        </div>
      </div>

      {/* Kanban Board 5-Column Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading task workflow board...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => (t.status === col.id) || (col.id === 'TO_DO' && t.status === 'TO_DO'));
            return (
              <div key={col.id} className={`p-3.5 rounded-3xl border ${col.border} ${col.bg} min-h-[480px] space-y-3 shadow-sm`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    {col.label}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${col.headerBadge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2.5 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all text-left"
                    >
                      {/* Task Key & Type Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {renderIssueIcon(t.issue_type)}
                          <span className="font-extrabold text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                            {t.issue_key || 'WEB-101'}
                          </span>
                        </div>
                        {user?.role !== 'CLIENT' && (
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">{t.title}</h4>

                      {t.description && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{t.description}</p>
                      )}

                      {/* Meta Footer Row */}
                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-extrabold uppercase ${
                              t.priority === 'URGENT'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                : t.priority === 'HIGH'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {t.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border border-slate-200 dark:border-slate-700">
                            {t.story_points || 3} pts
                          </span>
                        </div>

                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs" title={`Assignee: ${t.assignee?.name || 'Aarav Sharma'}`}>
                          {t.assignee?.name ? t.assignee.name[0].toUpperCase() : <UserIcon className="w-3 h-3" />}
                        </div>
                      </div>

                      {/* Status Movement Controls */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px]">
                        {col.id !== 'BACKLOG' ? (
                          <button
                            onClick={() => {
                              const prev = col.id === 'DONE' ? 'REVIEW' : col.id === 'REVIEW' ? 'IN_PROGRESS' : col.id === 'IN_PROGRESS' ? 'TO_DO' : 'BACKLOG';
                              handleStatusChange(t.id, prev);
                            }}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back
                          </button>
                        ) : <span />}

                        {col.id !== 'DONE' ? (
                          <button
                            onClick={() => {
                              const next = col.id === 'BACKLOG' ? 'TO_DO' : col.id === 'TO_DO' ? 'IN_PROGRESS' : col.id === 'IN_PROGRESS' ? 'REVIEW' : 'DONE';
                              handleStatusChange(t.id, next);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center gap-0.5 px-2.5 py-1 rounded-xl shadow-xs transition-all cursor-pointer"
                          >
                            Next <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : <span />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleCreateTask}
            className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl bg-white dark:bg-slate-900 text-left"
          >
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Create New Workspace Task</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Log User Story, Bug, Task, or Feature Epic</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Task Type</label>
                <select
                  value={taskIssueType}
                  onChange={(e) => setTaskIssueType(e.target.value as IssueType)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none bg-white dark:bg-slate-800"
                >
                  <option value="STORY">User Story</option>
                  <option value="BUG">Bug Fix</option>
                  <option value="TASK">General Task</option>
                  <option value="EPIC">Feature Epic</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Points Estimate</label>
                <select
                  value={taskStoryPoints}
                  onChange={(e) => setTaskStoryPoints(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none bg-white dark:bg-slate-800"
                >
                  <option value={1}>1 Point</option>
                  <option value={2}>2 Points</option>
                  <option value={3}>3 Points</option>
                  <option value={5}>5 Points</option>
                  <option value={8}>8 Points</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Summary / Title</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Implement OAuth2 Google Login integration"
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Assignee</label>
              <select
                value={taskAssigneeId}
                onChange={(e) => setTaskAssigneeId(e.target.value)}
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-semibold focus:outline-none bg-white dark:bg-slate-800"
              >
                <option value="">-- Unassigned --</option>
                {orgUsers.filter(u => u.role !== 'CLIENT').map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Description / Acceptance Criteria</label>
              <textarea
                rows={3}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Detailed sprint issue description..."
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none bg-white dark:bg-slate-800"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-bold">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
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
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
