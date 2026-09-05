import React, { useState, useEffect } from 'react';
import {
  FolderKanban, CheckSquare, FolderGit2, CheckCircle2, MessageSquare,
  Bot, BarChart3, Clock, ArrowLeft, ShieldCheck, Activity, Calendar, Sparkles
} from 'lucide-react';
import { projectsApi } from '../services/api';
import { Project } from '../types';
import { HealthBadge } from '../components/HealthBadge';
import { KanbanPage } from './KanbanPage';
import { FilesPage } from './FilesPage';
import { ApprovalsPage } from './ApprovalsPage';
import { MessagesPage } from './MessagesPage';
import { AiAssistantPage } from './AiAssistantPage';
import { ReportsPage } from './ReportsPage';
import { CalendarPage } from './CalendarPage';
import { ActionCenterPage } from './ActionCenterPage';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onBack }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TASKS' | 'FILES' | 'MESSAGES' | 'APPROVALS' | 'TIMELINE' | 'CALENDAR' | 'ANALYTICS' | 'AI'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const p = await projectsApi.get(projectId);
        setProject(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  if (loading || !project) {
    return <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading project workspace details...</div>;
  }

  const healthMetrics = [
    { label: 'Progress', score: 92, color: 'bg-indigo-600' },
    { label: 'Deadlines', score: 84, color: 'bg-emerald-500' },
    { label: 'Client Response', score: 89, color: 'bg-sky-500' },
    { label: 'Approvals', score: 78, color: 'bg-amber-500' },
    { label: 'Tasks Velocity', score: 91, color: 'bg-violet-500' },
    { label: 'Communication', score: 90, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white text-left">
      {/* Top Header & Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800">
                [{project.key_prefix || 'PROJ'}]
              </span>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">{project.name}</h1>
              <HealthBadge score={project.health_score} projectId={project.id} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Deadline: {project.deadline || 'Flexible'}
          </span>
          <span className="text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs font-extrabold">
            Budget: ₹{project.budget ? project.budget.toLocaleString() : '0'}
          </span>
        </div>
      </div>

      {/* Workspace Navigation Tabs (Overview, Tasks, Files, Messages, Approvals, Timeline, Calendar, Analytics, AI) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'OVERVIEW' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('TASKS')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'TASKS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" /> Tasks
        </button>
        <button
          onClick={() => setActiveTab('FILES')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'FILES' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" /> Files
        </button>
        <button
          onClick={() => setActiveTab('MESSAGES')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'MESSAGES' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Messages
        </button>
        <button
          onClick={() => setActiveTab('APPROVALS')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'APPROVALS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Approvals
        </button>
        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'TIMELINE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Timeline
        </button>
        <button
          onClick={() => setActiveTab('CALENDAR')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'CALENDAR' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Calendar
        </button>
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'ANALYTICS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Analytics
        </button>
        <button
          onClick={() => setActiveTab('AI')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'AI' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-violet-400" /> AI Assistant
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Health Score Breakdown Card (Section 15) */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Circular Gauge Visual */}
                <div className="relative w-28 h-28 rounded-full border-4 border-emerald-500/20 flex items-center justify-center bg-emerald-500/5 shadow-inner shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{project.health_score}</div>
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">/ 100</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800">
                      🟢 HEALTHY
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Calculated Deterministic Health Score</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">Project Health Score Breakdown</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
                    "Project is healthy overall. Approval response time has increased slightly over the past 48 hours."
                  </p>
                </div>
              </div>
            </div>

            {/* Health Score Sub-metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
              {healthMetrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1 text-center">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{m.score}</div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones Card */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3 bg-white/80 dark:bg-slate-900/80">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Sprint Milestones</h3>
            {project.milestones && project.milestones.length > 0 ? (
              <div className="space-y-2">
                {project.milestones.map((m) => (
                  <div key={m.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex justify-between items-center shadow-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No milestones defined yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'TASKS' && <KanbanPage projectId={project.id} />}
      {activeTab === 'FILES' && <FilesPage projectId={project.id} />}
      {activeTab === 'MESSAGES' && <MessagesPage projectId={project.id} />}
      {activeTab === 'APPROVALS' && <ApprovalsPage projectId={project.id} />}
      {activeTab === 'TIMELINE' && <ActionCenterPage />}
      {activeTab === 'CALENDAR' && <CalendarPage />}
      {activeTab === 'ANALYTICS' && <ReportsPage projectId={project.id} />}
      {activeTab === 'AI' && <AiAssistantPage projectId={project.id} />}
    </div>
  );
};
