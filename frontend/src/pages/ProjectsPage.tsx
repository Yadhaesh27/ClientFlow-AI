import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FolderKanban, 
  Clock, 
  Plus, 
  X, 
  Download, 
  DollarSign, 
  Building, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { projectsApi } from '../services/api';
import { Project, ProjectStatus } from '../types';
import { HealthBadge } from '../components/HealthBadge';

interface ProjectsPageProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'health_high' | 'health_low' | 'progress'>('newest');
  const [loading, setLoading] = useState(true);

  // Quick Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjClient, setNewProjClient] = useState('usr_client');
  const [newProjBudget, setNewProjBudget] = useState('50000');
  const [newProjDeadline, setNewProjDeadline] = useState('2026-11-30');
  const [submitting, setSubmitting] = useState(false);

  // Assign Client Modal State
  const [assignModalProject, setAssignModalProject] = useState<Project | null>(null);
  const [assignClientUserId, setAssignClientUserId] = useState('usr_client');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await projectsApi.list();
      setProjects(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    setSubmitting(true);

    try {
      await projectsApi.create({
        name: newProjName,
        description: newProjDesc,
        client_user_id: newProjClient,
        status: 'ACTIVE' as ProjectStatus,
        progress: 0,
        health_score: 90,
        budget: parseFloat(newProjBudget) || 50000,
        deadline: newProjDeadline,
      });
      setShowCreateModal(false);
      setNewProjName('');
      setNewProjDesc('');
      loadProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignClient = async () => {
    if (!assignModalProject) return;
    try {
      await projectsApi.update(assignModalProject.id, { client_user_id: assignClientUserId });
      setAssignModalProject(null);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Status,HealthScore,Progress,Budget,Deadline\n';
    const rows = projects.map(p => `${p.id},"${p.name}",${p.status},${p.health_score},${p.progress}%,$${p.budget || 0},${p.deadline || ''}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Projects_Summary_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'health_high') return b.health_score - a.health_score;
    if (sortBy === 'health_low') return a.health_score - b.health_score;
    if (sortBy === 'progress') return b.progress - a.progress;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6 animate-fade-in-up text-left">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-sky-400" /> 
            <span>Project Workspaces ({projects.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">
            Manage active client projects, sprint deliverables, budget tracking, and real-time health metrics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            title="Download CSV Report"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & Sort Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Projects</option>
            <option value="COMPLETED">Completed Projects</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="health_high">Sort: Highest Health Score</option>
            <option value="health_low">Sort: Lowest Health Score</option>
            <option value="progress">Sort: Highest Progress %</option>
          </select>
        </div>

      </div>

      {/* Projects Grid List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs animate-pulse font-normal">Loading project workspaces...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          No projects matching your search criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group space-y-4 text-left border-l-4 border-l-indigo-600 dark:border-l-sky-400"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors leading-tight">
                    {proj.name}
                  </h3>
                  <span className="text-[10px] font-medium text-indigo-600 dark:text-sky-300">
                    {proj.status === 'COMPLETED' ? '✓ Completed' : 'Active Workspace'}
                  </span>
                </div>
                <HealthBadge score={proj.health_score} projectId={proj.id} />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                {proj.description || 'No project description provided.'}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <span>Progress Velocity</span>
                  <span className="font-semibold text-indigo-600 dark:text-sky-400">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="flex items-center gap-1 font-normal">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  Client: <span className="font-bold text-slate-800 dark:text-slate-200">{proj.client_user_id ? 'Northstar Labs (David Vance)' : 'Vertex Studio'}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAssignModalProject(proj);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-sky-300 font-extrabold text-[10px] hover:bg-indigo-100 transition-all"
                >
                  Edit Client
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-normal">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Due: {proj.deadline || 'Flexible'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  ${proj.budget ? proj.budget.toLocaleString() : '0'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive New Project Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowCreateModal(false)} />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-up z-10 text-left">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100">
                  Create New Project Workspace
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Setup a new project environment for your clients and team.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. AI Customer Service Bot"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Briefly outline project objectives and tech stack..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Assign Client Account
                </label>
                <select
                  value={newProjClient}
                  onChange={(e) => setNewProjClient(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none"
                >
                  <option value="usr_client">Northstar Labs (David Vance - david@northstarlabs.io)</option>
                  <option value="usr_vertex">Vertex Studio (Elena Rostova - elena@vertexstudio.com)</option>
                  <option value="usr_quantum">Quantum Financial (Marcus Chen - marcus@quantum.fin)</option>
                  <option value="usr_horizon">Horizon Media (Sarah Jenkins - sarah@horizon.media)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                    placeholder="75000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={newProjDeadline}
                    onChange={(e) => setNewProjDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? 'Creating Project...' : 'Launch Project Workspace'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Assign Client Modal */}
      {assignModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-left">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-500" /> Assign Client to {assignModalProject.name}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Select Client Account</label>
              <select
                value={assignClientUserId}
                onChange={(e) => setAssignClientUserId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none"
              >
                <option value="usr_client">Northstar Labs (David Vance - david@northstarlabs.io)</option>
                <option value="usr_vertex">Vertex Studio (Elena Rostova - elena@vertexstudio.com)</option>
                <option value="usr_quantum">Quantum Financial (Marcus Chen - marcus@quantum.fin)</option>
                <option value="usr_horizon">Horizon Media (Sarah Jenkins - sarah@horizon.media)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignModalProject(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignClient}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md"
              >
                Save Client Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
