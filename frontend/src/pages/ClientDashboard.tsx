import React, { useState, useEffect } from 'react';
import {
  AlertCircle, 
  CheckCircle2, 
  FolderKanban, 
  FileText, 
  MessageSquare,
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCheck,
  FileCheck,
  Building,
  User,
  Send,
  Download,
  TrendingUp,
  Award,
  Zap
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
  const [quickNote, setQuickNote] = useState('');
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

  const handleSendQuickNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim() || projects.length === 0) return;
    try {
      await messagesApi.send(projects[0].id, quickNote);
      setQuickNote('');
      const updated = await messagesApi.list(projects[0].id);
      setMessages(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up text-left">
      
      {/* Header Greeting Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-900/60 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>Verified Client Portal</span>
            </span>
            <span className="text-xs text-slate-400 font-normal">SOC2 Type II Certified</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-100">
            Welcome back, {user?.name || 'David Vance'} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            Review deliverable sign-offs, inspect project progress, and communicate with your agency engineering team.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/action-center')}
            className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium shadow-md shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Action Center ({pendingApprovals.length})</span>
          </button>

          <button
            onClick={() => onNavigate('/reports')}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-slate-500" />
            <span>PDF Reports</span>
          </button>
        </div>
      </div>

      {/* Prominent Action Center Review Queue */}
      {pendingApprovals.length > 0 ? (
        <div className="p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-500/15 text-amber-600 dark:text-amber-300 rounded-2xl shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                Deliverables Awaiting Your Sign-Off ({pendingApprovals.length} Items)
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-normal">
                Review uploaded design assets and sprint builds to approve or request revision feedback.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/action-center')}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Review Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
            All deliverable sign-offs are up to date! Your agency team is currently advancing your next sprint milestones.
          </div>
        </div>
      )}

      {/* Main Grid: Projects & Agency Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Active Client Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
              <FolderKanban className="w-5 h-5 text-teal-600 dark:text-teal-400" /> 
              <span>Your Active Client Workspaces ({projects.length})</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">Click workspace for details</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs animate-pulse font-normal">Loading client workspaces...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-normal">
              No projects currently assigned to your client account.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group space-y-4 text-left border-l-4 border-l-teal-500"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Active Workspace</span>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors leading-tight">
                        {proj.name}
                      </h3>
                    </div>
                    <HealthBadge score={proj.health_score} projectId={proj.id} />
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                    {proj.description || 'No description provided.'}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      <span>Milestone Progress</span>
                      <span className="text-slate-800 dark:text-slate-100 font-semibold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="flex items-center gap-1 font-normal">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Target: {proj.deadline || '2026-11-30'}
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Room <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Direct Agency Contact & Live Chat */}
        <div className="space-y-6">
          
          {/* Agency Lead Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                alt="Alex Rivera" 
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-500" 
              />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Alex Rivera</h4>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Assigned Engineering PM</p>
                <span className="text-[10px] text-slate-400 font-normal">🟢 Online • Responds in ~15 mins</span>
              </div>
            </div>

            {/* Send Quick Note Form */}
            <form onSubmit={handleSendQuickNote} className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Send Direct Message to Agency Team:
              </label>
              <textarea
                rows={3}
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="Ask a question or request a status update..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Recent Workspace Messages Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-500" />
              <span>Recent Client Discussions</span>
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 font-normal py-4 text-center">No recent messages in this workspace thread.</p>
              ) : (
                messages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{msg.sender?.name || 'Agency PM'}</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-normal line-clamp-2">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
