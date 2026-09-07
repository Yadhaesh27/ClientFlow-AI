import React, { useState, useEffect } from 'react';
import { Search, X, FolderKanban, Users, CheckSquare, FileText, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
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

  const [results, setResults] = useState<{ type: string; title: string; sub: string; link: string }[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSearchItems = async () => {
      try {
        const { projectsApi, tasksApi } = await import('../services/api');
        const projList = await projectsApi.list();
        const taskList = await tasksApi.list();

        const projItems = projList.map(p => ({
          type: 'project',
          title: p.name,
          sub: `Status: ${p.status} • Health: ${p.health_score || 90}/100`,
          link: '/projects'
        }));

        const taskItems = taskList.map(t => ({
          type: 'task',
          title: t.title,
          sub: `Priority: ${t.priority} • Status: ${t.status}`,
          link: '/kanban'
        }));

        setResults([...projItems, ...taskItems]);
      } catch {
        setResults([]);
      }
    };
    fetchSearchItems();
  }, [isOpen]);

  const filtered = query.trim()
    ? results.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.sub.toLowerCase().includes(query.toLowerCase())
      )
    : results.slice(0, 5);

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-4 h-4 text-indigo-500" />;
      case 'client':
        return <Users className="w-4 h-4 text-emerald-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-sky-500" />;
      case 'file':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, clients, tasks, deliverables..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 px-3 py-1">
            {query.trim() ? 'Matching Results' : 'Recent Searches & Quick Links'}
          </p>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-slate-400 text-xs">
              No matching clients, projects, or tasks found.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (onNavigate) onNavigate(item.link);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono text-[10px]">Esc</kbd> to exit</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">ClientFlow AI Global Search</span>
        </div>
      </div>
    </div>
  );
};
