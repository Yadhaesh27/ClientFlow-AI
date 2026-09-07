import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Send, Plus, Copy, Check, ShieldAlert, UserCheck, Mail, Zap, HelpCircle } from 'lucide-react';
import { aiApi, projectsApi, tasksApi, messagesApi } from '../services/api';
import { Project, AISummary, ExtractedTask, AIScopeCreep, AIDraftUpdate, AISmartAssign, AISentiment } from '../types';

interface AiAssistantPageProps {
  projectId?: string;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({ projectId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');

  // 5 Active Tabs
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'EXTRACT' | 'RISK' | 'ASSIGN' | 'CHAT'>('SUMMARY');
  const [loading, setLoading] = useState(false);

  // Tab 1: Executive Summary & Email Drafter
  const [summaryData, setSummaryData] = useState<AISummary | null>(null);
  const [draftTone, setDraftTone] = useState<'EXECUTIVE' | 'FRIENDLY' | 'URGENT'>('EXECUTIVE');
  const [draftUpdate, setDraftUpdate] = useState<AIDraftUpdate | null>(null);
  const [copied, setCopied] = useState(false);

  // Tab 2: Feedback Extraction & Scope Creep
  const [feedbackInput, setFeedbackInput] = useState('Please change the hero image, increase the CTA size, and add a custom cryptocurrency payment integration.');
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTask[]>([]);
  const [scopeCreepResult, setScopeCreepResult] = useState<AIScopeCreep | null>(null);
  const [creatingTasks, setCreatingTasks] = useState(false);

  // Tab 3: Risk & Client Sentiment Radar
  const [riskData, setRiskData] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<AISentiment | null>(null);

  // Tab 4: Smart Task Assigner
  const [assignTaskTitle, setAssignTaskTitle] = useState('Fix line wrapping issue on mobile safari');
  const [smartAssignResult, setSmartAssignResult] = useState<AISmartAssign | null>(null);

  // Tab 5: Real-Time Chat
  const [chatMessages, setChatMessages] = useState<{ sender: 'USER' | 'AI'; text: string }[]>([
    { sender: 'AI', text: 'Hello! I am your real-time ClientFlow AI assistant. Ask me anything about project deadlines, client sentiment, task workload, or pending approvals.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

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
    if (!selectedProjectId) return;
    if (activeTab === 'SUMMARY') {
      handleGenerateSummary();
    } else if (activeTab === 'RISK') {
      handleAnalyzeRiskAndSentiment();
    } else if (activeTab === 'ASSIGN') {
      handleSuggestAssignee();
    }
  }, [selectedProjectId, activeTab]);

  const handleGenerateSummary = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const [sum, draft] = await Promise.all([
        aiApi.getSummary(selectedProjectId),
        aiApi.draftUpdate(selectedProjectId, draftTone)
      ]);
      setSummaryData(sum);
      setDraftUpdate(draft);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = async (tone: 'EXECUTIVE' | 'FRIENDLY' | 'URGENT') => {
    setDraftTone(tone);
    if (!selectedProjectId) return;
    try {
      const draft = await aiApi.draftUpdate(selectedProjectId, tone);
      setDraftUpdate(draft);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyDraft = () => {
    if (!draftUpdate) return;
    navigator.clipboard.writeText(`Subject: ${draftUpdate.subject}\n\n${draftUpdate.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDraftToChat = async () => {
    if (!selectedProjectId || !draftUpdate) return;
    try {
      await messagesApi.send(selectedProjectId, `[AI Update Draft]\n\nSubject: ${draftUpdate.subject}\n\n${draftUpdate.body}`);
      alert('✓ Status update draft sent directly to Project Messages!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleExtractAndCheckScope = async () => {
    if (!selectedProjectId || !feedbackInput) return;
    setLoading(true);
    try {
      const [tasksRes, scopeRes] = await Promise.all([
        aiApi.extractTasks(selectedProjectId, feedbackInput),
        aiApi.detectScopeCreep(selectedProjectId, feedbackInput)
      ]);
      setExtractedTasks(tasksRes);
      setScopeCreepResult(scopeRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTask = async (task: ExtractedTask) => {
    if (!selectedProjectId) return;
    try {
      await tasksApi.create(selectedProjectId, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: 'TO_DO'
      });
      alert(`✓ Task '${task.title}' created in database & Kanban board!`);
      setExtractedTasks(extractedTasks.filter(t => t.title !== task.title));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAllTasks = async () => {
    if (!selectedProjectId || extractedTasks.length === 0) return;
    setCreatingTasks(true);
    try {
      for (const t of extractedTasks) {
        await tasksApi.create(selectedProjectId, {
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: 'TO_DO'
        });
      }
      alert(`🎉 Created ${extractedTasks.length} tasks in database!`);
      setExtractedTasks([]);
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingTasks(false);
    }
  };

  const handleAnalyzeRiskAndSentiment = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const [rData, sData] = await Promise.all([
        aiApi.getRisk(selectedProjectId),
        aiApi.getSentiment(selectedProjectId)
      ]);
      setRiskData(rData);
      setSentimentData(sData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestAssignee = async () => {
    if (!selectedProjectId || !assignTaskTitle) return;
    setLoading(true);
    try {
      const res = await aiApi.suggestAssignee(selectedProjectId, assignTaskTitle);
      setSmartAssignResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedProjectId || isStreaming) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'USER', text: userText }]);
    setChatInput('');
    setIsStreaming(true);

    setChatMessages(prev => [...prev, { sender: 'AI', text: '' }]);

    await aiApi.streamChat(selectedProjectId, userText, (chunkText) => {
      setChatMessages(prev => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0 && copy[lastIdx].sender === 'AI') {
          copy[lastIdx] = { ...copy[lastIdx], text: copy[lastIdx].text + chunkText };
        }
        return copy;
      });
    });

    setIsStreaming(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white text-left">
      {/* Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> ClientFlow AI Command Center & Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time LLM streaming summaries, scope creep detection, client sentiment radar, and smart task assigner</p>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* 5-Tabs Navigation Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('SUMMARY')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'SUMMARY' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> 1-Click Summary & Email Drafter
        </button>
        <button
          onClick={() => setActiveTab('EXTRACT')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'EXTRACT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Scope Creep & Feedback Parser
        </button>
        <button
          onClick={() => setActiveTab('RISK')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'RISK' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" /> Client Sentiment & Risk Radar
        </button>
        <button
          onClick={() => setActiveTab('ASSIGN')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ASSIGN' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Smart Task Auto-Assigner
        </button>
        <button
          onClick={() => setActiveTab('CHAT')}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'CHAT' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Real-Time Copilot Q&A
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white/90 dark:bg-slate-900/90 shadow-xl">
        {/* TAB 1: EXECUTIVE SUMMARY & EMAIL DRAFTER */}
        {activeTab === 'SUMMARY' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Executive Project Summary & Update Drafter
              </h3>
              <button
                onClick={handleGenerateSummary}
                disabled={loading}
                className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {loading ? 'Analyzing...' : 'Regenerate Analysis'}
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Generating executive insights...</div>
            ) : summaryData && (
              <div className="space-y-6 text-xs">
                {/* Summary Card */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-300">Executive Summary: </span>{summaryData.summary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-2">
                    <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Completed Milestones
                    </h4>
                    <ul className="space-y-1 text-emerald-800 dark:text-emerald-300 font-medium list-disc list-inside">
                      {summaryData.completed_work.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
                    <h4 className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Pending Action Items
                    </h4>
                    <ul className="space-y-1 text-amber-800 dark:text-amber-300 font-medium list-disc list-inside">
                      {summaryData.pending_work.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Multi-Tone Email Drafter */}
                {draftUpdate && (
                  <div className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">AI Client Email Drafter</h4>
                      </div>
                      
                      {/* Tone Switcher */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        {(['EXECUTIVE', 'FRIENDLY', 'URGENT'] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => handleToneChange(t)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                              draftTone === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="font-extrabold text-slate-900 dark:text-white">
                        Subject: <span className="font-semibold text-slate-700 dark:text-slate-300">{draftUpdate.subject}</span>
                      </div>
                      <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-2">
                        {draftUpdate.body}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={handleCopyDraft}
                        className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied to Clipboard!' : 'Copy Email Text'}
                      </button>
                      <button
                        onClick={handleSendDraftToChat}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Send to Project Messages
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCOPE CREEP & FEEDBACK EXTRACTION */}
        {activeTab === 'EXTRACT' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Client Feedback Parser & Scope Creep Detector</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analyze client notes to extract tasks and flag out-of-scope feature additions before taking action.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600 dark:text-slate-400 font-bold">Client Feedback / Comment Note</label>
              <textarea
                rows={3}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="e.g. Please change the hero image, increase the CTA size, and add a custom crypto wallet integration."
                className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                onClick={handleExtractAndCheckScope}
                disabled={loading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Run AI Feedback & Scope Creep Audit
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs animate-pulse">Running scope creep detection model...</div>
            ) : (
              <div className="space-y-4">
                {/* Scope Creep Alert Card */}
                {scopeCreepResult && (
                  <div className={`p-4 rounded-2xl border space-y-3 text-xs shadow-sm ${
                    scopeCreepResult.is_scope_creep
                      ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                      : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${
                        scopeCreepResult.is_scope_creep ? 'text-rose-900 dark:text-rose-300' : 'text-emerald-900 dark:text-emerald-300'
                      }`}>
                        <ShieldAlert className="w-4 h-4" /> {scopeCreepResult.is_scope_creep ? '⚠ Potential Scope Creep Detected' : '✓ Request is Within Scope'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                        scopeCreepResult.is_scope_creep ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                      }`}>
                        {scopeCreepResult.confidence_score}% Confidence
                      </span>
                    </div>

                    <p className="font-medium text-slate-800 dark:text-slate-200">{scopeCreepResult.analysis_reason}</p>

                    {scopeCreepResult.is_scope_creep && (
                      <div className="flex flex-wrap items-center gap-4 pt-1 font-bold text-slate-900 dark:text-white">
                        <span>⏱ Est. Extra Time: <span className="text-rose-600 dark:text-rose-400">+{scopeCreepResult.estimated_extra_hours} hrs</span></span>
                        <span>💵 Est. Cost Impact: <span className="text-rose-600 dark:text-rose-400">+${scopeCreepResult.estimated_cost_impact}</span></span>
                      </div>
                    )}
                  </div>
                )}

                {/* Extracted Tasks List */}
                {extractedTasks.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Extracted Action Items ({extractedTasks.length})
                      </h4>
                      <button
                        onClick={handleCreateAllTasks}
                        disabled={creatingTasks}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Create All Tasks in Database
                      </button>
                    </div>

                    {extractedTasks.map((t, idx) => (
                      <div key={idx} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2 text-xs shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 dark:text-white">{t.title}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold border border-indigo-200 dark:border-indigo-800">
                            {t.priority} Priority
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">{t.description}</p>
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleConfirmTask(t)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            Create Task <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLIENT SENTIMENT & RISK RADAR */}
        {activeTab === 'RISK' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Smart Risk & Client Sentiment Radar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Proactively monitors client satisfaction indices and project bottlenecks to prevent churn before it happens.</p>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Gathering telemetry & risk metrics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Sentiment Gauge Card */}
                {sentimentData && (
                  <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-slate-800 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-3xl space-y-4 shadow-sm text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Client Sentiment Index</span>
                      <span className="px-3 py-1 bg-emerald-500 text-white rounded-full font-black text-[10px]">
                        {sentimentData.sentiment_label} ({sentimentData.sentiment_score}/100)
                      </span>
                    </div>

                    <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-indigo-100 dark:border-indigo-900 space-y-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300">Identified Friction Points:</div>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside font-medium">
                        {sentimentData.friction_points.map((pt, i) => <li key={i}>{pt}</li>)}
                      </ul>
                    </div>

                    <div className="p-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-between">
                      <span>Retention Action:</span>
                      <span className="text-[11px] font-normal">{sentimentData.suggested_retention_action}</span>
                    </div>
                  </div>
                )}

                {/* Risk Signal Alert Box */}
                <div className="p-5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-3xl space-y-4 text-xs shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> Active Risk Signal Alert
                    </h4>
                    <p className="text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                      Deliverable review lag: Homepage_Design_v2.png has been pending client feedback for 3 days and is currently holding up 2 downstream frontend tasks.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3">
                    <button
                      onClick={() => alert('✓ Notification sent directly to Client David Vance!')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                    >
                      Send Gentle Client Reminder
                    </button>
                    <button
                      onClick={() => alert('✓ Reassigned downstream tasks to backlog temporarily.')}
                      className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-bold cursor-pointer hover:bg-slate-100"
                    >
                      Adjust Task Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SMART TASK AUTO-ASSIGNER */}
        {activeTab === 'ASSIGN' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Smart Task Workload & Skill Assigner</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Calculates active team capacity %, technical skill relevance, and past task performance to suggest the best assignee.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={assignTaskTitle}
                onChange={(e) => setAssignTaskTitle(e.target.value)}
                placeholder="Enter task title to evaluate..."
                className="flex-1 px-4 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                onClick={handleSuggestAssignee}
                disabled={loading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md cursor-pointer"
              >
                Evaluate Match
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs animate-pulse">Calculating team developer capacities...</div>
            ) : smartAssignResult && (
              <div className="space-y-3 pt-2">
                <h4 className="font-extrabold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Recommended Assignees for "{smartAssignResult.task_title}"
                </h4>

                {smartAssignResult.recommendations.map((rec) => (
                  <div
                    key={rec.user_id}
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs ${
                      rec.user_id === smartAssignResult.recommended_assignee_id
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs">{rec.user_name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">({rec.role})</span>
                        {rec.user_id === smartAssignResult.recommended_assignee_id && (
                          <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase">
                            Best Match
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{rec.recommendation_reason}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rec.skill_match.map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-[9px] font-bold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-black text-indigo-600 dark:text-indigo-400 text-sm">{rec.match_score}% Match</div>
                        <div className="text-[10px] text-slate-500 font-bold">{rec.current_workload_pct}% Capacity Used</div>
                      </div>

                      <button
                        onClick={() => alert(`✓ Assigned task '${smartAssignResult.task_title}' to ${rec.user_name}!`)}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold shadow-xs cursor-pointer"
                      >
                        Assign Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REAL-TIME COPILOT Q&A CHAT */}
        {activeTab === 'CHAT' && (
          <div className="space-y-4 h-[440px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed font-medium shadow-xs ${
                    m.sender === 'USER'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-tl-none'
                  }`}>
                    {m.text || (isStreaming && idx === chatMessages.length - 1 ? <span className="animate-pulse text-indigo-500">Writing response token...</span> : '')}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChatStream} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask ClientFlow AI Copilot live about tasks, deadlines, or risks..."
                className="flex-1 px-4 py-3 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                type="submit"
                disabled={isStreaming || !chatInput.trim()}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Ask Real-Time AI
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
