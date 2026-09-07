import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  User, 
  Lock, 
  Mail, 
  Building, 
  AlertCircle, 
  Sun, 
  Moon,
  Layers,
  X,
  LogIn,
  CheckCircle2,
  FolderKanban,
  Zap,
  FileCheck,
  TrendingUp,
  FileText,
  BookOpen,
  Palette,
  ShieldCheck,
  Key,
  Smartphone,
  Fingerprint,
  Activity,
  Globe,
  Send,
  Building2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../services/api';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  // Active Login Portal View (Agency vs Client Portal)
  const [portalType, setPortalType] = useState<'AGENCY' | 'CLIENT'>('AGENCY');

  // Pop-up Login Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoginTab, setModalLoginTab] = useState<'PASSWORD' | 'OTP' | 'PROJECT_KEY'>('PASSWORD');

  // Carousel / Slider State for "SLIDE TO STUDY"
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Form Fields
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Client Portal Companies Demo Accounts
  const clientAccounts = [
    {
      id: 'usr_client_1',
      name: 'David Vance',
      company: 'Northstar Tech Solutions',
      role: 'VP of Product',
      email: 'client@clientflow.demo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      activeProjects: 1,
      pendingApprovals: 1,
    },
    {
      id: 'usr_client_2',
      name: 'Sarah Lin',
      company: 'Vertex Digital Studio',
      role: 'Creative Director',
      email: 'sarah@vertex.demo',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      activeProjects: 1,
      pendingApprovals: 1,
    },
    {
      id: 'usr_client_3',
      name: 'Robert Sterling',
      company: 'Quantum Financial Group',
      role: 'Head of Ops',
      email: 'robert@quantum.demo',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      activeProjects: 1,
      pendingApprovals: 1,
    },
    {
      id: 'usr_client_4',
      name: 'Emma Watson',
      company: 'Horizon Media Networks',
      role: 'Brand Manager',
      email: 'emma@horizon.demo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      activeProjects: 1,
      pendingApprovals: 1,
    },
    {
      id: 'usr_client_5',
      name: 'Dr. Michael Chang',
      company: 'Aura Health Systems',
      role: 'Chief Medical Officer',
      email: 'michael@aura.demo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      activeProjects: 1,
      pendingApprovals: 1,
    },
  ];

  // Product Showcase Study Slides Data
  const studySlides = [
    {
      id: 1,
      tag: 'CLIENT MODULE 1: ACTION CENTER',
      icon: <FileCheck className="w-6 h-6 text-emerald-500" />,
      title: '1-Click Deliverable Sign-Off & Approvals',
      subtitle: 'Review design mockups, sprint builds, and code releases directly with versioning (v1, v2, v3)',
      description: 'Clients can review uploaded project assets, inspect revision changes, request targeted feedback redlines, and sign off on milestone deliverables with instant audit logging.',
      highlights: ['Versioned asset review (v1, v2, v3)', 'Instant client sign-off audit trail', 'Change request feedback threads'],
      bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-200 dark:border-emerald-900/60',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 2,
      tag: 'CLIENT MODULE 2: AI REVISION EXTRACTOR',
      icon: <Zap className="w-6 h-6 text-indigo-500" />,
      title: 'Gemini AI Client Feedback Processor',
      subtitle: 'Converts client chat messages into structured engineering tasks automatically',
      description: 'Clients communicate naturally without filling long bug forms. Gemini AI reads client notes and creates developer sprint items complete with priority and acceptance criteria.',
      highlights: ['Automated text-to-ticket conversion', 'Human PM confirmation workflow', 'Priority & SLA classification'],
      bgGradient: 'from-indigo-500/10 via-sky-500/5 to-transparent',
      borderColor: 'border-indigo-200 dark:border-indigo-900/60',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-sky-300',
    },
    {
      id: 3,
      tag: 'CLIENT MODULE 3: HEALTH TELEMETRY',
      icon: <TrendingUp className="w-6 h-6 text-violet-500" />,
      title: 'Real-Time Project Health & Budget Telemetry',
      subtitle: 'Transparent 0 - 100 health metrics, velocity tracking, and milestone timelines',
      description: 'Zero opacity. Clients track sprint progress, budget utilization, release milestones, and health scores (35% Velocity + 25% Deadline Safety + 20% Approval Speed).',
      highlights: ['Deterministic 0-100 score engine', 'Sprint burn-down & budget tracking', 'Automated SLA risk alerts'],
      bgGradient: 'from-violet-500/10 via-fuchsia-500/5 to-transparent',
      borderColor: 'border-violet-200 dark:border-violet-900/60',
      badgeColor: 'bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300',
    },
    {
      id: 4,
      tag: 'CLIENT MODULE 4: SPRINT KANBAN',
      icon: <FolderKanban className="w-6 h-6 text-sky-500" />,
      title: 'Collaborative Sprint Kanban & Backlog',
      subtitle: 'Real-time visibility into active developer tasks, backlog, and review queues',
      description: 'Clients gain live visibility into sprint columns (To Do, In Progress, Review, Done). View developer assignments, story points, and targeted completion dates.',
      highlights: ['Live swimlane visibility', 'Story point sprint estimation', 'Developer workload capacity'],
      bgGradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
      borderColor: 'border-sky-200 dark:border-sky-900/60',
      badgeColor: 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300',
    },
    {
      id: 5,
      tag: 'CLIENT MODULE 5: EXECUTIVE REPORTS',
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      title: 'Printable Executive Reports & Audit Logs',
      subtitle: 'Export audit-ready project completion certificates for accounting & stakeholders',
      description: 'Generate 1-click PDF status reports with milestone sign-offs, activity logs, financial breakdowns, and compliance certification ready for executive distribution.',
      highlights: ['1-Click PDF export', 'Milestone completion summary', 'Audit log verification'],
      bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-200 dark:border-amber-900/60',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300',
    },
  ];

  // Auto-Play Carousel Slider
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % studySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, studySlides.length]);

  const handleNextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % studySlides.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + studySlides.length) % studySlides.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (modalLoginTab === 'PROJECT_KEY') {
        if (!projectKey.trim()) {
          setError('Please enter a valid 6-digit Client Project Access Key.');
          setLoading(false);
          return;
        }
        await quickDemoLogin('CLIENT');
        return;
      }

      if (modalLoginTab === 'OTP') {
        if (!otpSent) {
          setOtpSent(true);
          setError(null);
          setLoading(false);
          return;
        }
        if (!otpCode || otpCode.length < 4) {
          setError('Please enter the 6-digit verification code sent to your email.');
          setLoading(false);
          return;
        }
        await quickDemoLogin('CLIENT');
        return;
      }

      if (isRegistering) {
        const res = await authApi.register(name, email, password, orgName, 'ADMIN');
        login(res.access_token, res.user);
      } else {
        const res = await authApi.login(email, password);
        login(res.access_token, res.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER' | 'CLIENT', customEmail?: string) => {
    setError(null);
    setLoading(true);

    let targetEmail = customEmail || 'client@clientflow.demo';
    if (!customEmail) {
      if (role === 'ADMIN') targetEmail = 'admin@clientflow.demo';
      if (role === 'PROJECT_MANAGER') targetEmail = 'manager@clientflow.demo';
      if (role === 'TEAM_MEMBER') targetEmail = 'developer@clientflow.demo';
    }

    setEmail(targetEmail);
    setPassword('Demo@123');

    try {
      await quickDemoLogin(role);
    } catch (err) {
      setError('Demo sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-500 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-body)' }}
    >
      
      {/* Ambient Glassmorphism Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[950px] h-[600px] bg-gradient-to-b from-indigo-500/15 via-sky-400/10 to-transparent dark:from-indigo-900/30 dark:via-sky-950/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-teal-400/15 dark:bg-teal-900/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute top-40 left-10 w-[450px] h-[450px] bg-violet-400/10 dark:bg-violet-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-3.5 px-6 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 shadow-sm animate-fade-in-up">
        
        {/* Enhanced Website Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              CLIENTFLOW <span className="font-normal text-indigo-600 dark:text-sky-400">AI</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-900/60 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-teal-500" />
              <span>Client Portal Security</span>
            </span>
          </div>
        </div>

        {/* Right Navigation Controls & Color Theme Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Theme Color Dots */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Palette className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <button onClick={() => setAccent('indigo')} className={`w-3.5 h-3.5 rounded-full bg-indigo-600 cursor-pointer transition-transform ${accent === 'indigo' ? 'scale-125 ring-2 ring-indigo-400' : ''}`} title="Indigo Theme" />
            <button onClick={() => setAccent('blue')} className={`w-3.5 h-3.5 rounded-full bg-blue-600 cursor-pointer transition-transform ${accent === 'blue' ? 'scale-125 ring-2 ring-blue-400' : ''}`} title="Atlassian Blue Theme" />
            <button onClick={() => setAccent('emerald')} className={`w-3.5 h-3.5 rounded-full bg-emerald-500 cursor-pointer transition-transform ${accent === 'emerald' ? 'scale-125 ring-2 ring-emerald-400' : ''}`} title="Emerald Mint Theme" />
            <button onClick={() => setAccent('violet')} className={`w-3.5 h-3.5 rounded-full bg-violet-600 cursor-pointer transition-transform ${accent === 'violet' ? 'scale-125 ring-2 ring-violet-400' : ''}`} title="Deep Violet Theme" />
            <button onClick={() => setAccent('amber')} className={`w-3.5 h-3.5 rounded-full bg-amber-500 cursor-pointer transition-transform ${accent === 'amber' ? 'scale-125 ring-2 ring-amber-400' : ''}`} title="Sunset Amber Theme" />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Sign In Button */}
          <button
            onClick={() => { setIsModalOpen(true); setError(null); }}
            className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto my-auto py-6 space-y-8 text-center animate-fade-in-up">
        
        {/* Portal Access Selector Tabs */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700 backdrop-blur-md shadow-sm">
          <button
            onClick={() => setPortalType('AGENCY')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              portalType === 'AGENCY'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-sky-300 shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Company & Agency Login</span>
          </button>

          <button
            onClick={() => setPortalType('CLIENT')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              portalType === 'CLIENT'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-teal-500" />
            <span>Client Portal Login</span>
          </button>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/70 text-xs font-medium text-indigo-700 dark:text-sky-300 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>System Status: 🟢 99.99% Uptime • SOC2 Type II Certified</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {portalType === 'CLIENT' ? (
              <>Enterprise <span className="text-teal-600 dark:text-teal-400 font-normal">Client Portal</span></>
            ) : (
              <>CLIENTFLOW <span className="text-indigo-600 dark:text-sky-400 font-normal">Company Workspace</span></>
            )}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            {portalType === 'CLIENT' 
              ? 'Secure client portal for reviewing deliverables, 1-click approvals, milestone tracking, and real-time project health telemetry.'
              : 'Collaborative company suite for engineering teams, sprint management, Gemini AI revision extraction, and executive client reporting.'
            }
          </p>
        </div>

        {/* Client Demo Quick Launch Company Cards */}
        {portalType === 'CLIENT' && (
          <div className="space-y-3 max-w-4xl mx-auto text-left">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-500" />
                <span>Quick Client Sign-In Portals:</span>
              </span>
              <span className="text-[11px] font-normal text-teal-600 dark:text-teal-300">Click any account to enter portal</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {clientAccounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => { setPortalType('CLIENT'); setIsModalOpen(true); handleDemoSelect('CLIENT', account.email); }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-400 dark:hover:border-teal-500 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={account.avatar} 
                      alt={account.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-xs group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {account.name}
                      </h4>
                      <p className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
                        {account.company}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{account.activeProjects} Active Projects</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">{account.pendingApprovals} Approvals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "SLIDE TO STUDY" Interactive Product Carousel */}
        <div className="relative w-full max-w-3xl mx-auto">
          
          {/* Carousel Card Container */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${studySlides[currentSlide].bgGradient} bg-white/90 dark:bg-slate-900/90 border ${studySlides[currentSlide].borderColor} shadow-xl backdrop-blur-xl transition-all duration-500 text-left relative overflow-hidden`}>
            
            {/* Emblem Accent */}
            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
              {studySlides[currentSlide].icon}
            </div>

            <div className="space-y-4">
              {/* Module Tag Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border border-teal-100 dark:border-teal-900/60 ${studySlides[currentSlide].badgeColor}`}>
                  {studySlides[currentSlide].tag}
                </span>

                <span className="text-xs font-medium text-slate-400">
                  Slide {currentSlide + 1} of {studySlides.length}
                </span>
              </div>

              {/* Slide Heading */}
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
                  {studySlides[currentSlide].icon}
                  <span>{studySlides[currentSlide].title}</span>
                </h3>
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  {studySlides[currentSlide].subtitle}
                </p>
              </div>

              {/* Slide Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                {studySlides[currentSlide].description}
              </p>

              {/* Slide Key Capabilities */}
              <div className="pt-2 flex flex-wrap gap-2">
                {studySlides[currentSlide].highlights.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Carousel Slider Controls */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrevSlide}
              className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 shadow-sm hover:scale-105 transition-all cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {studySlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setIsAutoPlay(false); setCurrentSlide(idx); }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx 
                      ? 'w-8 bg-teal-600 dark:bg-teal-400' 
                      : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  title={`Go to Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 shadow-sm hover:scale-105 transition-all cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Hero Dual Sign-In Options */}
        <div className="pt-2 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => { setPortalType('AGENCY'); setIsModalOpen(true); setError(null); }}
              className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Company Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setPortalType('CLIENT'); setIsModalOpen(true); setError(null); }}
              className="px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Client Portal Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Role Quick Sign-in Bar */}
          <div className="p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-2.5 backdrop-blur-md">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Direct Role Quick Launch:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
              <button
                onClick={() => { setIsModalOpen(true); handleDemoSelect('CLIENT'); }}
                className="p-2.5 rounded-2xl bg-teal-50/70 hover:bg-teal-100/70 dark:bg-teal-950/40 dark:hover:bg-teal-900/40 border border-teal-100 dark:border-teal-900/50 text-teal-700 dark:text-teal-300 transition-all text-center cursor-pointer"
              >
                💼 Client Portal
              </button>

              <button
                onClick={() => { setIsModalOpen(true); handleDemoSelect('ADMIN'); }}
                className="p-2.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-sky-300 transition-all text-center cursor-pointer"
              >
                👑 Admin Workspace
              </button>

              <button
                onClick={() => { setIsModalOpen(true); handleDemoSelect('PROJECT_MANAGER'); }}
                className="p-2.5 rounded-2xl bg-violet-50/70 hover:bg-violet-100/70 dark:bg-violet-950/40 dark:hover:bg-violet-900/40 border border-violet-100 dark:border-violet-900/50 text-violet-700 dark:text-violet-300 transition-all text-center cursor-pointer"
              >
                🎯 Project Lead
              </button>

              <button
                onClick={() => { setIsModalOpen(true); handleDemoSelect('TEAM_MEMBER'); }}
                className="p-2.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 border border-sky-100 dark:border-sky-900/50 text-sky-700 dark:text-sky-300 transition-all text-center cursor-pointer"
              >
                ⚡ Senior Dev
              </button>
            </div>
          </div>
        </div>

        {/* Security & Compliance Trust Badges */}
        <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-normal">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> SOC2 Type II Certified
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-teal-500" /> 256-bit AES Data Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <Fingerprint className="w-4 h-4 text-indigo-500" /> Biometric WebAuthn Ready
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sky-500" /> ISO27001 Infrastructure
          </span>
        </div>

      </main>

      {/* Smooth Animated Login Pop-Up Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

          {/* Pop-up Card */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-up z-10 text-left">
            
            {/* Modal Header & Close Button */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  <span>{isRegistering ? 'Create Workspace' : portalType === 'CLIENT' ? 'Client Portal Sign In' : 'Company & Agency Sign In'}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  {isRegistering ? 'Setup your organization' : 'Select your portal and enter your credentials'}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Portal Switcher Tabs in Modal */}
            {!isRegistering && (
              <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl text-xs font-bold border border-slate-300/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setPortalType('AGENCY')}
                  className={`flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    portalType === 'AGENCY'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-sky-300 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Company Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPortalType('CLIENT')}
                  className={`flex-1 py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    portalType === 'CLIENT'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-500" />
                  <span>Client Portal Sign In</span>
                </button>
              </div>
            )}

            {/* Modal Sign-in Method Tabs */}
            {!isRegistering && (
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-medium border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setModalLoginTab('PASSWORD')}
                  className={`flex-1 py-1.5 rounded-xl transition-all text-center cursor-pointer ${
                    modalLoginTab === 'PASSWORD' 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => setModalLoginTab('OTP')}
                  className={`flex-1 py-1.5 rounded-xl transition-all text-center cursor-pointer ${
                    modalLoginTab === 'OTP' 
                      ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-300 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Magic Link / OTP
                </button>
                <button
                  onClick={() => setModalLoginTab('PROJECT_KEY')}
                  className={`flex-1 py-1.5 rounded-xl transition-all text-center cursor-pointer ${
                    modalLoginTab === 'PROJECT_KEY' 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-sky-300 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Project Key
                </button>
              </div>
            )}

            {/* Quick Demo Accounts Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                Quick Demo Sign-In Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => handleDemoSelect('CLIENT')}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300 font-medium hover:border-teal-400 transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-500" />
                  <span>Client Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('ADMIN')}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-sky-300 font-medium hover:border-indigo-400 transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Admin Role</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('TEAM_MEMBER')}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-700 dark:text-sky-300 font-medium hover:border-sky-400 transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-sky-500" />
                  <span>Senior Dev</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSelect('PROJECT_MANAGER')}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-violet-700 dark:text-violet-300 font-medium hover:border-violet-400 transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-violet-500" />
                  <span>Project PM</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 rounded-2xl flex items-center gap-2 font-normal">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalLoginTab === 'PROJECT_KEY' && !isRegistering ? (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Client Project Access Key
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={projectKey}
                      onChange={(e) => setProjectKey(e.target.value)}
                      placeholder="e.g. KEY-948271"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 uppercase tracking-widest"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    Enter the access key provided by your project manager for direct room access.
                  </p>
                </div>
              ) : modalLoginTab === 'OTP' && !isRegistering ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Client Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-teal-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@clientflow.demo"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-1 animate-fade-in">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        6-Digit OTP Verification Code
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-teal-500 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="e.g. 582914"
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-teal-200 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/40 text-xs text-slate-800 dark:text-slate-100 font-semibold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {isRegistering && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="David Vance"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          Organization / Company Name
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Northstar Labs"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="client@clientflow.demo"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      {!isRegistering && (
                        <a 
                          href="#forgot" 
                          onClick={(e) => { e.preventDefault(); alert("Password reset link sent to " + (email || "your email")); }}
                          className="text-[11px] font-normal text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                      />
                    </div>
                  </div>
                </>
              )}

              {!isRegistering && modalLoginTab === 'PASSWORD' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 font-normal cursor-pointer">
                    Remember client session
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Authenticating Client Session...' : (
                  modalLoginTab === 'OTP' ? (otpSent ? 'Verify OTP & Enter' : 'Send Verification OTP') :
                  modalLoginTab === 'PROJECT_KEY' ? 'Enter Client Project Room' :
                  isRegistering ? 'Create Client Workspace' : 'Sign In To Client Portal'
                )}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-normal">
              {isRegistering ? 'Already have an account?' : "Don't have a client account?"}{' '}
              <button
                onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                className="font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer ml-1"
              >
                {isRegistering ? 'Sign In' : 'Create workspace'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-4 text-center text-xs text-slate-500 dark:text-slate-400 font-normal border-t border-slate-200/50 dark:border-slate-800/50">
        © 2026 CLIENTFLOW AI • Enterprise Client Portal & Team Workspace Suite
      </footer>
    </div>
  );
};
