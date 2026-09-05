import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  FolderKanban, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Users, 
  Building,
  Award,
  Sparkles,
  FileCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { reportsApi, projectsApi, tasksApi, approvalsApi } from '../services/api';
import { ProjectReport, Project, Task, Approval } from '../types';

interface ReportsPageProps {
  projectId?: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ projectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [reportType, setReportType] = useState<'EXECUTIVE' | 'TASKS' | 'APPROVALS' | 'TEAM' | 'FINANCIAL'>('EXECUTIVE');
  
  const [report, setReport] = useState<ProjectReport | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectApprovals, setProjectApprovals] = useState<Approval[]>([]);
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

  const loadReportData = async (pId: string) => {
    if (!pId) return;
    setLoading(true);
    try {
      const [repData, taskList, appList] = await Promise.all([
        reportsApi.getCompletionReport(pId),
        tasksApi.list(pId),
        approvalsApi.list(pId)
      ]);
      setReport(repData);
      setProjectTasks(taskList);
      setProjectApprovals(appList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadReportData(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    if (!report) return;

    const reportTitle = `${report.project.name} - ${reportType} Report`;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let reportContentHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #1e1b4b; margin: 0; }
          .subtitle { font-size: 14px; color: #6366f1; margin-top: 5px; }
          .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
          .meta-item { font-size: 12px; }
          .meta-label { color: #64748b; font-weight: bold; }
          .summary-box { background: #eef2ff; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 4px; margin-bottom: 30px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; color: #334155; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { margin-top: 50px; border-top: 1px solid #cbd5e1; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; }
          .badge-done { background: #dcfce7; color: #166534; }
          .badge-progress { background: #e0f2fe; color: #075985; }
          .badge-urgent { background: #ffe4e6; color: #9f1239; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">CLIENTFLOW AI • AUDIT & COMPLETION REPORT</div>
          <div class="subtitle">${report.project.name} (${reportType} REPORT)</div>
        </div>

        <div class="meta-grid">
          <div class="meta-item"><span class="meta-label">Document ID:</span> RPT-${Date.now().toString().slice(-6)}</div>
          <div class="meta-item"><span class="meta-label">Generated Date:</span> ${dateStr}</div>
          <div class="meta-item"><span class="meta-label">Organization:</span> ClientFlow Workspace</div>
          <div class="meta-item"><span class="meta-label">Health Score:</span> ${report.health_breakdown.score}/100 (${report.health_breakdown.status})</div>
        </div>

        <div class="summary-box">
          <strong>Executive Summary:</strong> ${report.completion_summary}
        </div>

        <h3>Report Data Matrix (${reportType})</h3>
        <table>
          <thead>
            <tr>
              <th>Item / Task Title</th>
              <th>Status / Category</th>
              <th>Priority / Points</th>
              <th>Date / Assigned</th>
            </tr>
          </thead>
          <tbody>
            ${projectTasks.map(t => `
              <tr>
                <td><strong>${t.title}</strong><br/><span style="color:#64748b; font-size:11px;">${t.description || ''}</span></td>
                <td><span class="badge badge-done">${t.status}</span></td>
                <td>${t.priority} (${t.story_points || 3} pts)</td>
                <td>${new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px; padding: 20px; border: 1px dashed #cbd5e1; border-radius: 8px;">
          <div style="font-size: 12px; font-weight: bold; margin-bottom: 30px;">AUTHORIZATION & SIGN-OFF CERTIFICATE</div>
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; width: 50%;">
                ___________________________________<br/>
                <strong>Authorized Agency Lead</strong><br/>
                Date: ________________________
              </td>
              <td style="border: none; width: 50%;">
                ___________________________________<br/>
                <strong>Client Stakeholder Sign-Off</strong><br/>
                Date: ________________________
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          Confidential • Generated by ClientFlow AI Enterprise Workspace Suite • SOC2 Type II Certified
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.project.name.replace(/\s+/g, '_')}_${reportType}_Report.html`;
    a.click();
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6 animate-fade-in-up text-left">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 no-print">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-sky-400" /> 
            <span>Executive Reports & Audit Documents</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">
            Generate printable PDF completion certificates, task audit matrices, deliverable sign-offs, and financial statements.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Select Project */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Download Text / HTML Document */}
          <button
            onClick={handleDownloadDoc}
            className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            title="Download formatted text document"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Doc</span>
          </button>

          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Category Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm no-print">
        <button
          onClick={() => setReportType('EXECUTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'EXECUTIVE'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Executive Certificate</span>
        </button>

        <button
          onClick={() => setReportType('TASKS')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'TASKS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Sprint Tasks Audit</span>
        </button>

        <button
          onClick={() => setReportType('APPROVALS')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'APPROVALS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Deliverable Sign-Offs</span>
        </button>

        <button
          onClick={() => setReportType('TEAM')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'TEAM'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Capacity & Velocity</span>
        </button>

        <button
          onClick={() => setReportType('FINANCIAL')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
            reportType === 'FINANCIAL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Financial Statement</span>
        </button>
      </div>

      {/* Printable Report Document Box */}
      {loading || !report ? (
        <div className="py-16 text-center text-slate-400 text-xs animate-pulse font-normal">
          Generating publication-grade audit report...
        </div>
      ) : (
        <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl space-y-8 shadow-xl print:shadow-none print:border-none print:p-0 print-container text-left">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-sky-400 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>ClientFlow AI • Enterprise Report Certificate</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {report.project.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {report.project.description || 'Enterprise software workspace status & milestone audit log.'}
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Document Metadata</div>
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200">ID: RPT-2026-{selectedProjectId.slice(-4).toUpperCase()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Health Status</span>
              <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{report.health_breakdown.score}/100</div>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">{report.health_breakdown.status}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Task Velocity</span>
              <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{report.task_stats.done} / {report.task_stats.total}</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Completed Sprint Items</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Deliverable Sign-Offs</span>
              <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{report.approval_stats.approved} / {report.approval_stats.total}</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Approved Deliverables</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Allocated Budget</span>
              <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">${(report.project.budget || 50000).toLocaleString()}</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Total Project Value</span>
            </div>
          </div>

          {/* Executive Summary Banner */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
            <h4 className="text-xs font-semibold text-indigo-700 dark:text-sky-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Executive Completion Summary</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
              {report.completion_summary}
            </p>
          </div>

          {/* Tab-Specific Content Sections */}
          {reportType === 'EXECUTIVE' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Project Health Score Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-normal">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Task Velocity (35% Weight)</span>
                    <span className="text-emerald-600 font-semibold">{report.health_breakdown.breakdown.task_progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${report.health_breakdown.breakdown.task_progress}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Deadline Safety Margin (25% Weight)</span>
                    <span className="text-indigo-600 dark:text-sky-400 font-semibold">{report.health_breakdown.breakdown.deadline_safety}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${report.health_breakdown.breakdown.deadline_safety}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Client Approval Speed (20% Weight)</span>
                    <span className="text-amber-600 font-semibold">{report.health_breakdown.breakdown.approval_readiness}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${report.health_breakdown.breakdown.approval_readiness}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Client Responsiveness (10% Weight)</span>
                    <span className="text-teal-600 font-semibold">{report.health_breakdown.breakdown.client_responsiveness}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${report.health_breakdown.breakdown.client_responsiveness}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'TASKS' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Sprint Tasks & Backlog Matrix ({projectTasks.length} Items)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-2">Task Title</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2">Priority</th>
                      <th className="py-3 px-2">Points</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-normal text-slate-700 dark:text-slate-300">
                    {projectTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-100">
                          {t.title}
                          {t.description && <p className="text-[11px] text-slate-400 font-normal line-clamp-1">{t.description}</p>}
                        </td>
                        <td className="py-3 px-2 font-medium text-indigo-600 dark:text-sky-300">{t.issue_type}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.priority === 'URGENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                            t.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium">{t.story_points || 3} pts</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.status === 'DONE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            t.status === 'IN_PROGRESS' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'APPROVALS' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Client Deliverables & File Sign-Off Audit Log
              </h3>

              <div className="space-y-3">
                {projectApprovals.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 text-center font-normal">
                    No deliverable approval sign-offs on record for this workspace yet.
                  </div>
                ) : (
                  projectApprovals.map((app) => (
                    <div key={app.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{app.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 font-normal">{app.description || 'Version approval deliverable'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        app.status === 'CHANGES_REQUESTED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {reportType === 'FINANCIAL' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Financial Expenditure & Budget Statement
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-500 font-medium">Total Contract Budget</span>
                  <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">${(report.project.budget || 50000).toLocaleString()}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-500 font-medium">Allocated Sprint Hours</span>
                  <div className="text-2xl font-semibold text-indigo-600 dark:text-sky-400">
                    {Math.round((report.project.budget || 50000) / 125)} hrs
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-500 font-medium">Milestone Release Status</span>
                  <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {report.project.progress}% Released
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Audit Log */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Project Activity Audit Log
            </h4>
            <div className="space-y-2">
              {report.recent_activity.slice(0, 5).map((act) => (
                <div key={act.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs flex justify-between items-center font-normal">
                  <span className="font-semibold text-indigo-600 dark:text-sky-400 uppercase text-[10px] tracking-wider">
                    {act.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(act.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Sign-Off Block */}
          <div className="pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Authorization & Compliance Sign-Off Certificate
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-normal">
              <div className="space-y-4 pt-6 border-t border-slate-300 dark:border-slate-700">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Authorized Agency Workspace Lead</div>
                  <div className="text-[11px] text-slate-400">ClientFlow AI Engineering Manager</div>
                </div>
                <div className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-300 dark:border-slate-700">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Client Organization Representative</div>
                  <div className="text-[11px] text-slate-400">Client Stakeholder Sign-Off</div>
                </div>
                <div className="text-[11px] text-slate-400">Date: ________________________</div>
              </div>
            </div>
          </div>

          {/* Footer Clearance */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 font-normal">
            CONFIDENTIAL • CLIENTFLOW AI WORKSPACE ENTERPRISE REPORT CERTIFICATE • SOC2 TYPE II CERTIFIED
          </div>

        </div>
      )}
    </div>
  );
};
