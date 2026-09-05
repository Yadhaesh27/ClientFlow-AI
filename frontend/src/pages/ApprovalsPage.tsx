import React, { useState, useEffect } from 'react';
import { FileCheck } from 'lucide-react';
import { approvalsApi, projectsApi } from '../services/api';
import { Approval, Project } from '../types';

interface ApprovalsPageProps {
  projectId?: string;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ projectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (selectedProjectId) {
      loadApprovals(selectedProjectId);
    }
  }, [selectedProjectId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-600" /> Deliverable Approvals Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium">Audit trail of client approvals and revision feedback history</p>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 font-bold focus:outline-none"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading approval audit log...</div>
      ) : approvals.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-3xl text-slate-500 text-xs">
          No approval items logged for this project yet.
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-3xl glass-card border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{app.title}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : app.status === 'CHANGES_REQUESTED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{app.description || 'No notes attached.'}</p>

                {app.feedback && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 mt-2 font-medium">
                    <span className="font-bold text-slate-900">Client Feedback Note: </span>
                    "{app.feedback}"
                  </div>
                )}
              </div>

              <div className="text-right text-[10px] text-slate-500 shrink-0 font-medium">
                <div>Requested: {new Date(app.created_at).toLocaleDateString()}</div>
                {app.decided_at && (
                  <div className="text-slate-700 font-bold">Decided: {new Date(app.decided_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
