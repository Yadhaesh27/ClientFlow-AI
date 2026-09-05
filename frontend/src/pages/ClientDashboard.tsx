import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, FolderKanban, FileText, MessageSquare,
  Clock, ArrowRight, ShieldCheck, Sparkles, CheckCheck
} from 'lucide-react';
import { projectsApi, approvalsApi, messagesApi } from '../services/api';
import { Project, Approval, Message } from '../types';
import { HealthBadge } from '../components/HealthBadge';
import { useAuth } from '../context/AuthContext';

interface ClientDashboardProps {
  onSelectProject: (projectId: string) => void;
  onNavigate: (path: string) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onSelectProject, onNavigate }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClientData = async () => {
    setLoading(true);
    try {
      const projList = await projectsApi.list();
      setProjects(projList);

      const actions = await approvalsApi.getActionCenter();
      setPendingApprovals(actions);

      if (projList.length > 0) {
        const msgs = await messagesApi.list(projList[0].id);
        setMessages(msgs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Greeting Banner */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              Client Portal Account
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review deliverable sign-offs, inspect project progress, and communicate with your agency team.
          </p>
        </div>
      </div>

      {/* Prominent Action Center Box */}
      {pendingApprovals.length > 0 ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-700 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Action Center: Deliverables Awaiting Your Approval</h3>
              <p className="text-xs text-amber-800/80 mt-0.5">
                You have {pendingApprovals.length} item(s) waiting for review. Click below to approve or request revision notes.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/action-center')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
          >
            Open Action Center <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-3xl glass-card border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs text-emerald-900 font-semibold">
            All deliverable approvals are up to date! Your agency team is currently working on upcoming project milestones.
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-indigo-600" /> Active Client Projects
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading project status...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-3xl text-slate-500 text-xs">
            No projects currently assigned.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="p-6 rounded-3xl glass-card border border-slate-200/80 space-y-4 cursor-pointer transition-all hover:border-indigo-500/40 hover:shadow-xl group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Assigned Project</span>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      {proj.name}
                    </h3>
                  </div>
                  <HealthBadge score={proj.health_score} projectId={proj.id} />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Milestone Completion</span>
                    <span className="text-slate-900 font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-3">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Target Deadline: {proj.deadline || 'Flexible'}
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    Open Project Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
