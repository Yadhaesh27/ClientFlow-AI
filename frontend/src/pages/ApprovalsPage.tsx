import React, { useState, useEffect } from 'react';
import { FileCheck, Plus, Check, X, User, MessageSquare, Send, ShieldCheck, UserCheck } from 'lucide-react';
import { approvalsApi, projectsApi } from '../services/api';
import { Approval, Project } from '../types';
import { useAuth } from '../context/AuthContext';

interface ApprovalsPageProps {
  projectId?: string;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  // Request Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [targetRecipient, setTargetRecipient] = useState<'EVERYONE' | 'ADMIN' | 'PROJECT_MANAGER' | 'CLIENT'>('EVERYONE');
  const [submitting, setSubmitting] = useState(false);

  // Feedback Modal State for Approve/Reject
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [feedbackNote, setFeedbackNote] = useState('');

  const loadApprovals = async (pId: string) => {
    if (!pId) return;
    setLoading(true);
    try {
      const list = await approvalsApi.list(pId);
      setApprovals(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const pList = await projectsApi.list();
      setProjects(pList);
      if (pList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(pList[0].id);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadApprovals(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleCreateApprovalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !selectedProjectId) return;
    setSubmitting(true);

    try {
      await approvalsApi.create({
        project_id: selectedProjectId,
        title: reqTitle,
        description: reqDesc,
        target_recipient: targetRecipient,
        requested_by_user_id: user?.id || 'usr_dev',
        requested_by_name: user?.name ? `${user.name} (${user.role})` : 'Aarav Sharma (Developer)',
        requested_by_role: user?.role || 'TEAM_MEMBER',
        requested_from_user_id: targetRecipient === 'CLIENT' ? 'usr_client' : 'usr_admin',
      });

      setShowRequestModal(false);
      setReqTitle('');
      setReqDesc('');
      loadApprovals(selectedProjectId);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecisionSubmit = async () => {
    if (!activeDecisionId) return;
    try {
      if (decisionType === 'APPROVE') {
        await approvalsApi.approve(activeDecisionId, feedbackNote);
      } else {
        await approvalsApi.requestChanges(activeDecisionId, feedbackNote);
      }
      setActiveDecisionId(null);
      setFeedbackNote('');
      loadApprovals(selectedProjectId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-500" /> Deliverable & Verification Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Developers, Project Leads, and Admins can broadcast code & deliverable verification requests to Clients and Team Members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Request Verification
          </button>
        </div>
      </div>

      {/* Approvals List */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading verification audit log...</div>
      ) : approvals.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-3xl text-slate-500 text-xs">
          No approval items logged for this project yet. Click "Request Verification" to send one!
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-amber-400/50 transition-all bg-white/80 dark:bg-slate-900/80"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{app.title}</span>
                  
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                        : app.status === 'CHANGES_REQUESTED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {app.status}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-500" />
                    Requested by: {app.requested_by_name || 'Developer'}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-500" />
                    Target: {app.target_recipient || 'EVERYONE (Admin & Client)'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{app.description || 'No notes attached.'}</p>

                {app.feedback && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Reviewer Feedback Note: </span>
                      "{app.feedback}"
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                <div className="text-right text-[10px] text-slate-400 font-medium">
                  <div>Requested: {new Date(app.created_at).toLocaleDateString()}</div>
                  {app.decided_at && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      Verified: {new Date(app.decided_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {app.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveDecisionId(app.id);
                        setDecisionType('REJECT');
                        setFeedbackNote('');
                      }}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Request Revisions
                    </button>

                    <button
                      onClick={() => {
                        setActiveDecisionId(app.id);
                        setDecisionType('APPROVE');
                        setFeedbackNote('');
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Verify & Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Verification Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleCreateApprovalRequest}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-500" /> Send Verification Request
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Request code verification, QA sign-off, or client approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Title / Deliverable Name</label>
              <input
                type="text"
                required
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                placeholder="e.g. Approve Sprint 14 Mobile Auth API Code"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Target Verifiers / Audience</label>
              <select
                value={targetRecipient}
                onChange={(e: any) => setTargetRecipient(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none font-bold"
              >
                <option value="EVERYONE">📢 Broadcast to Everyone (Admin, PM & Client)</option>
                <option value="CLIENT">💼 Client Portal Sign-off (David Vance)</option>
                <option value="ADMIN">🛡️ Admin & Lead Architect (Sarah Jenkins)</option>
                <option value="PROJECT_MANAGER">📋 Project Manager (Alex Rivera)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Notes / Code Changes / Instructions</label>
              <textarea
                rows={3}
                value={reqDesc}
                onChange={(e) => setReqDesc(e.target.value)}
                placeholder="Describe changes, links to PRs, or specific test cases for signoff..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl text-xs font-black shadow-md"
              >
                {submitting ? 'Broadcasting...' : 'Send Request Now'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Decision / Feedback Confirmation Modal */}
      {activeDecisionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              {decisionType === 'APPROVE' ? (
                <>
                  <Check className="w-5 h-5 text-emerald-500" /> Confirm Approval & Sign-Off
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-rose-500" /> Request Revisions / Code Changes
                </>
              )}
            </h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Feedback / Sign-Off Note</label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder={
                  decisionType === 'APPROVE'
                    ? 'e.g. Code looks clean and test cases pass. Verified!'
                    : 'e.g. Please update error handling on network timeouts before approval.'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveDecisionId(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecisionSubmit}
                className={`px-5 py-2 rounded-2xl text-xs font-black text-white shadow-md ${
                  decisionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Submit {decisionType === 'APPROVE' ? 'Approval' : 'Revision Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
