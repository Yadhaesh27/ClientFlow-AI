import React, { useEffect } from 'react';
import { Command, X, Search, Layout, FolderKanban, Users, FileCheck, CheckSquare, Sparkles, MessageSquare, Settings } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.shiftKey || e.metaKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutsList = [
    { key: 'Ctrl + K', desc: 'Open Global Command & Search Modal', icon: <Search className="w-4 h-4 text-indigo-500" /> },
    { key: 'Shift + ?', desc: 'Toggle Keyboard Shortcuts Cheat Sheet', icon: <Command className="w-4 h-4 text-teal-500" /> },
    { key: 'G + D', desc: 'Navigate to Main Executive Dashboard', icon: <Layout className="w-4 h-4 text-sky-500" />, path: '/' },
    { key: 'G + K', desc: 'Navigate to Sprint Tasks & Kanban Board', icon: <CheckSquare className="w-4 h-4 text-emerald-500" />, path: '/kanban' },
    { key: 'G + A', desc: 'Navigate to Client Action Center', icon: <FileCheck className="w-4 h-4 text-amber-500" />, path: '/action-center' },
    { key: 'G + P', desc: 'Navigate to Projects Overview', icon: <FolderKanban className="w-4 h-4 text-violet-500" />, path: '/projects' },
    { key: 'G + C', desc: 'Navigate to Clients Directory', icon: <Users className="w-4 h-4 text-rose-500" />, path: '/clients' },
    { key: 'G + M', desc: 'Navigate to Team Messages & Chat', icon: <MessageSquare className="w-4 h-4 text-[#0052CC]" />, path: '/messages' },
    { key: 'G + S', desc: 'Navigate to Workspace Settings', icon: <Settings className="w-4 h-4 text-slate-500" />, path: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 z-10 animate-scale-up text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-sky-400">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Quick actions and navigation hotkeys
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {shortcutsList.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (item.path && onNavigate) onNavigate(item.path);
                onClose();
              }}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-xs text-slate-700 dark:text-slate-200 font-medium group-hover:text-indigo-600 dark:group-hover:text-sky-400">
                  {item.desc}
                </span>
              </div>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 shadow-xs">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 font-normal border-t border-slate-100 dark:border-slate-800 pt-3">
          Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 rounded">Esc</kbd> anytime to close
        </div>
      </div>
    </div>
  );
};
