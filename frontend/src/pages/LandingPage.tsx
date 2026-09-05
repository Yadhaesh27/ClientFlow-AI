import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Bot, Layers, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo }) => {
  const { quickDemoLogin } = useAuth();

  const handleLaunch = async (role: 'ADMIN' | 'CLIENT' = 'ADMIN') => {
    await quickDemoLogin(role);
    onStartDemo();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-brand-500 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">ClientFlow <span className="text-brand-400">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLaunch('CLIENT')}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
          >
            Client Portal Demo
          </button>
          <button
            onClick={() => handleLaunch('ADMIN')}
            className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
          >
            Launch Agency Portal <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Hackathon Build Specification • Antigravity Production Web App</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Turn Client Feedback & Approvals into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-400 to-indigo-400">One Transparent Workspace</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Stop chasing status updates across WhatsApp, emails, and cloud drives. ClientFlow AI gives clients visible progress, file versioning, deliverable approvals, and AI feedback-to-task extraction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handleLaunch('ADMIN')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Explore Agency Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => handleLaunch('CLIENT')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Test Client Action Center</span>
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">File Versioning & Approvals</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Upload deliverables with version markers (v1, v2). Clients can approve or request changes with actionable feedback notes.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">AI Task Extractor & Summary</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Extract structured tasks directly from vague client feedback notes using Gemini AI, with human confirmation before creation.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Deterministic Health Engine</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              35% task progress + 25% deadline safety + 20% approval readiness + 10% responsiveness + 10% activity.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        ClientFlow AI © 2026 • Antigravity Hackathon Specification Build
      </footer>
    </div>
  );
};
