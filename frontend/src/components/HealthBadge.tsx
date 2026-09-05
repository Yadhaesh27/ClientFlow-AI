import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, X, ArrowRight } from 'lucide-react';
import { projectsApi } from '../services/api';
import { ProjectHealthDetail } from '../types';

interface HealthBadgeProps {
  score: number;
  projectId?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ score, projectId }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ProjectHealthDetail | null>(null);

  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let Icon = ShieldCheck;
  let label = 'On Track';

  if (score < 60) {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    Icon = AlertCircle;
    label = 'Delayed';
  } else if (score < 80) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = AlertTriangle;
    label = 'At Risk';
  }

  const handleOpenDetail = async () => {
    if (!projectId) return;
    setShowModal(true);
    setLoading(true);
    try {
      const data = await projectsApi.getHealth(projectId);
      setDetail(data);
    } catch (e) {
      console.error('Failed to load health breakdown:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={projectId ? handleOpenDetail : undefined}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold cursor-pointer transition-all hover:scale-105 shadow-sm ${badgeColor}`}
        title="Click to view Health Score breakdown"
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{score}/100</span>
        <span className="opacity-75">• {label}</span>
        {projectId && <Info className="w-3 h-3 ml-0.5 opacity-60 hover:opacity-100" />}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-white/90">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${badgeColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Project Health Score</h3>
                  <p className="text-xs text-slate-500 font-medium">Deterministic scoring breakdown based on live metrics</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading || !detail ? (
              <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
                Calculating scoring metrics...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Overall Health</span>
                    <div className="text-2xl font-black text-slate-900">{detail.score}<span className="text-sm font-normal text-slate-500"> / 100</span></div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-xl ${badgeColor}`}>
                    {detail.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Formula Weight Breakdown</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-600 font-medium">Task Progress (35%)</span>
                      <span className="font-bold text-slate-900">{detail.breakdown.task_progress}%</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-600 font-medium">Deadline Safety (25%)</span>
                      <span className="font-bold text-slate-900">{detail.breakdown.deadline_safety}%</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-600 font-medium">Approvals (20%)</span>
                      <span className="font-bold text-slate-900">{detail.breakdown.approval_readiness}%</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                      <span className="text-slate-600 font-medium">Client Response (10%)</span>
                      <span className="font-bold text-slate-900">{detail.breakdown.client_responsiveness}%</span>
                    </div>
                  </div>
                </div>

                {detail.reasons.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scoring Observations</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {detail.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
