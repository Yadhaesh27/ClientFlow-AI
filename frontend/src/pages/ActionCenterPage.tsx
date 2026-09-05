import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import { approvalsApi, aiApi, tasksApi } from '../services/api';
import { Approval, ExtractedTask } from '../types';

export const ActionCenterPage: React.FC = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});

  // AI Extraction Modal State
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [extractingForApproval, setExtractingForApproval] = useState<Approval | null>(null);
  const [extractLoading, setExtractLoading] = useState(false);

  const loadActions = async () => {
    setLoading(true);
    try {
      const pending = await approvalsApi.getActionCenter();
      setApprovals(pending);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  const handleApprove = async (approvalId: string) => {
    try {
      const fb = feedbackText[approvalId] || 'Approved without changes';
      await approvalsApi.approve(approvalId, fb);
      loadActions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestChanges = async (approval: Approval) => {
    const fb = feedbackText[approval.id];
    if (!fb) {
      alert('Please enter your feedback notes for requested changes.');
      return;
    }
    try {
      await approvalsApi.requestChanges(approval.id, fb);
      loadActions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleExtractAITasks = async (approval: Approval) => {
    const text = feedbackText[approval.id];
    if (!text) {
      alert('Please enter feedback text first to extract tasks.');
      return;
    }
    setExtractingForApproval(approval);
    setExtractLoading(true);
    try {
      const tasks = await aiApi.extractTasks(approval.project_id, text);
      setExtractedTasks(tasks);
    } catch (e) {
      console.error(e);
    } finally {
      setExtractLoading(false);
    }
  };

  const handleConfirmTaskCreation = async (task: ExtractedTask) => {
    if (!extractingForApproval) return;
    try {
      await tasksApi.create(extractingForApproval.project_id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: 'TO_DO'
      });
      alert(`Task '${task.title}' added to Kanban!`);
      setExtractedTasks(extractedTasks.filter(t => t.title !== task.title));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-800 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-amber-900">Client Action Center</h1>
            <p className="text-xs text-amber-800 mt-0.5 font-medium">
              Explicit review queue. Items here require your approval, feedback notes, or decision sign-off.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading action items...</div>
      ) : approvals.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-3xl space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">You are completely up to date!</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            There are no pending deliverable approvals awaiting your review right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl glass-card border border-slate-200/80 space-y-4 shadow-sm hover:border-amber-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Pending Client Action</span>
                  <h3 className="text-lg font-bold text-slate-900">{app.title}</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Requested: {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {app.description || 'No detailed instructions attached.'}
              </p>

              {/* Feedback Input & AI Conversion Demo */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                  <span>Your Feedback / Revision Notes</span>
                  <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Task Extraction Available
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={feedbackText[app.id] || ''}
                  onChange={(e) => setFeedbackText({ ...feedbackText, [app.id]: e.target.value })}
                  placeholder="e.g. Please adjust primary button colors and fix footer padding."
                  className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => handleExtractAITasks(app)}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Extract Tasks from Feedback
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRequestChanges(app)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Request Changes
                  </button>

                  <button
                    onClick={() => handleApprove(app.id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Deliverable
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Task Extraction Modal */}
      {extractingForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel border border-white/90 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">AI Task Extractor Result</h3>
                <p className="text-xs text-slate-500 font-medium">Structured tasks generated from client feedback</p>
              </div>
            </div>

            {extractLoading ? (
              <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
                Parsing feedback into structured work items...
              </div>
            ) : extractedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No tasks extracted.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {extractedTasks.map((t, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        {t.priority} Priority
                      </span>
                    </div>
                    <p className="text-slate-600">{t.description}</p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleConfirmTaskCreation(t)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1"
                      >
                        Confirm & Create Task <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setExtractingForApproval(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
