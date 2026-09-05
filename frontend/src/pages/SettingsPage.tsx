import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Shield, 
  Bell, 
  Key, 
  Palette, 
  Check, 
  Sun, 
  Moon, 
  Save, 
  Copy, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Globe,
  Mail,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme, ColorAccent } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'organization' | 'notifications' | 'security'>('appearance');

  // Form states
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'admin@clientflow.demo');
  const [jobTitle, setJobTitle] = useState('Lead Workspace Administrator');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApprovals, setNotifApprovals] = useState(true);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifRisk, setNotifRisk] = useState(false);

  // API Key state
  const [copiedKey, setCopiedKey] = useState(false);
  const apiKey = 'cf_live_9f82k3901bc4982a173d';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const colorPalettes: { id: ColorAccent; name: string; hex: string; bgGradient: string; desc: string }[] = [
    { id: 'indigo', name: 'Indigo Enterprise', hex: '#4f46e5', bgGradient: 'from-indigo-600 to-violet-600', desc: 'Sleek corporate default' },
    { id: 'blue', name: 'Atlassian Blue', hex: '#0052cc', bgGradient: 'from-blue-600 to-cyan-600', desc: 'Classic SaaS blue' },
    { id: 'emerald', name: 'Emerald Mint', hex: '#059669', bgGradient: 'from-emerald-600 to-teal-600', desc: 'Fresh mint & green' },
    { id: 'cyan', name: 'Vivid Cyan', hex: '#0891b2', bgGradient: 'from-cyan-600 to-blue-600', desc: 'Neon ocean sky' },
    { id: 'violet', name: 'Deep Violet', hex: '#7c3aed', bgGradient: 'from-violet-600 to-fuchsia-600', desc: 'Electric purple' },
    { id: 'amber', name: 'Sunset Amber', hex: '#d97706', bgGradient: 'from-amber-600 to-orange-600', desc: 'Warm gold & orange' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-sky-400" />
            <span>Workspace & Account Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-1">
            Customize user profile, theme color palettes, notification alerts, and security tokens.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Interactive Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/60 dark:border-slate-800 text-xs font-medium">
        
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'appearance'
              ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance & Color Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>User Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('organization')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'organization'
              ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Organization Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & API</span>
        </button>

      </div>

      {/* Tab 1: Appearance & Color Themes */}
      {activeTab === 'appearance' && (
        <div className="space-y-6 animate-scale-up">
          
          {/* Mode Theme Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span>Base Display Mode</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Choose between Light Mode and Dark Mode for optimal viewing contrast.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  theme === 'light'
                    ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900 font-semibold ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-normal'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Light Theme</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Clean slate canvas background</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  theme === 'dark'
                    ? 'bg-indigo-950/60 border-indigo-700 text-sky-200 font-semibold ring-2 ring-indigo-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-normal'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Dark Theme</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">High contrast dark navy backdrop</div>
                </div>
              </button>
            </div>
          </div>

          {/* Color Accent Palette Selection Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span>Primary Color Accent Palettes</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Selecting a palette updates site-wide buttons, focus rings, active badges, and gradients instantly.
              </p>
            </div>

            {/* Grid of 6 Color Palettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {colorPalettes.map((p) => {
                const isActive = accent === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAccent(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                      isActive
                        ? 'border-indigo-500 dark:border-sky-400 bg-indigo-50/50 dark:bg-slate-800 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full shadow-xs"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {p.name}
                        </span>
                      </div>

                      {isActive && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-1.5">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Live Palette Preview Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Live Palette Accent Preview:</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{accent} palette active</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium shadow-md">
                  Active Button
                </button>
                <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-sky-300 text-xs font-medium border border-indigo-200 dark:border-indigo-900">
                  Badge Highlight
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer">
                  Hyperlink Text →
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: User Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6 animate-scale-up">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {name}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-sky-300 font-medium">
                  {user?.role || 'ADMIN'} • NovaWorks Digital
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Job Title & Bio</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>

          </div>
        </form>
      )}

      {/* Tab 3: Organization & Workspace */}
      {activeTab === 'organization' && (
        <div className="space-y-6 animate-scale-up">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span>Organization Workspace Details</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Multi-tenant organization account settings and workspace identifiers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Organization Name</span>
                <div className="font-semibold text-slate-800 dark:text-slate-100 text-sm">NovaWorks Digital Studio</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Workspace Key ID</span>
                <div className="font-mono font-semibold text-indigo-600 dark:text-sky-300 text-xs">org_novaworks_892</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Custom Subdomain</span>
                <div className="font-medium text-slate-800 dark:text-slate-100 text-xs">novaworks.clientflow.ai</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Active Member Seats</span>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">48 Engineering & Client Seats</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 animate-scale-up">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span>Notification Alert Preferences</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Choose which project events send email digests and in-app alerts.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Deliverable Version Approvals</div>
                  <div className="text-[11px] text-slate-500">Alert when a client approves or requests changes on a file</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifApprovals}
                  onChange={(e) => setNotifApprovals(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Sprint Task Assignments</div>
                  <div className="text-[11px] text-slate-500">Notify when a new task is assigned to your account</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifTasks}
                  onChange={(e) => setNotifTasks(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Daily Project Digest Emails</div>
                  <div className="text-[11px] text-slate-500">Receive morning summary email of project health and activity</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Project Risk Signals Warnings</div>
                  <div className="text-[11px] text-slate-500">Send urgent alert when a project health score drops below 70</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifRisk}
                  onChange={(e) => setNotifRisk(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 5: Security & API Keys */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-scale-up">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <span>Security Credentials & API Tokens</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Manage JWT authentication sessions and developer access API keys.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Developer API Key</span>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-300 hover:bg-indigo-100 font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
                  </button>
                </div>
                <div className="font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold truncate">
                  {apiKey}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Active JWT Auth Session</div>
                  <div className="text-[11px] text-slate-500">Bearer Token • Expire in 24 Hours</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-medium">
                  Active ✓
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
