import React, { useState, useEffect } from 'react';
import { Bell, User as UserIcon, LogOut, Sparkles, CheckCheck, ChevronDown, Sun, Moon, Search, Command, Plus, CheckSquare, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationsApi } from '../services/api';
import { Notification } from '../types';
import { ShortcutsModal } from './ShortcutsModal';

interface NavbarProps {
  onOpenSearch?: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifs = async () => {
    try {
      const list = await notificationsApi.list();
      setNotifications(list);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllRead();
    fetchNotifs();
  };

  return (
    <>
      <header className="h-16 glass-panel px-6 flex items-center justify-between sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* Enhanced Website Name & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xl tracking-tight text-slate-800 dark:text-slate-100">
              ClientFlow <span className="font-normal text-indigo-600 dark:text-sky-400">AI</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-sky-300 border border-indigo-100 dark:border-indigo-900/60">
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* Center Actions: Command Search, Shortcuts, & Tasks */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 text-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer shadow-inner"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search clients, projects, tasks...</span>
            <kbd className="ml-4 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">
              Ctrl K
            </kbd>
          </button>

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-sky-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Keyboard Shortcuts Cheat Sheet (Shift + ?)"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Shortcuts</span>
          </button>

          {/* Quick Add Task Button */}
          <button
            onClick={() => { if (onNavigate) onNavigate('/kanban'); }}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-100 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Go to Sprint Kanban Tasks"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tasks</span>
          </button>
        </div>

        {/* Right Actions: Palette Accent Selector, Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-3">
          
          {/* Palette Accent Theme Selector */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Palette className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
            <button onClick={() => setAccent('indigo')} className={`w-3 h-3 rounded-full bg-indigo-600 cursor-pointer transition-transform ${accent === 'indigo' ? 'scale-125 ring-2 ring-indigo-400' : ''}`} title="Indigo Theme" />
            <button onClick={() => setAccent('blue')} className={`w-3 h-3 rounded-full bg-blue-600 cursor-pointer transition-transform ${accent === 'blue' ? 'scale-125 ring-2 ring-blue-400' : ''}`} title="Atlassian Blue Theme" />
            <button onClick={() => setAccent('emerald')} className={`w-3 h-3 rounded-full bg-emerald-500 cursor-pointer transition-transform ${accent === 'emerald' ? 'scale-125 ring-2 ring-emerald-400' : ''}`} title="Emerald Mint Theme" />
            <button onClick={() => setAccent('cyan')} className={`w-3 h-3 rounded-full bg-cyan-500 cursor-pointer transition-transform ${accent === 'cyan' ? 'scale-125 ring-2 ring-cyan-400' : ''}`} title="Vivid Cyan Theme" />
            <button onClick={() => setAccent('violet')} className={`w-3 h-3 rounded-full bg-violet-600 cursor-pointer transition-transform ${accent === 'violet' ? 'scale-125 ring-2 ring-violet-400' : ''}`} title="Deep Violet Theme" />
            <button onClick={() => setAccent('amber')} className={`w-3 h-3 rounded-full bg-amber-500 cursor-pointer transition-transform ${accent === 'amber' ? 'scale-125 ring-2 ring-amber-400' : ''}`} title="Sunset Amber Theme" />
          </div>

          {/* Mode Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-semibold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-4 z-50 border border-slate-200 dark:border-slate-800 animate-fadeIn text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600 dark:text-sky-400" /> Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-indigo-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6 font-normal">No recent notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                          n.is_read
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 font-normal'
                            : 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white font-medium'
                        }`}
                      >
                        <div className="font-medium text-slate-800 dark:text-slate-100 flex justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white text-xs font-semibold shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-indigo-600 dark:text-sky-300 font-normal">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-2 z-50 border border-slate-200 dark:border-slate-800 animate-fadeIn text-left">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={logout}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </header>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        onNavigate={onNavigate}
      />
    </>
  );
};
