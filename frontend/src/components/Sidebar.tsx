import React, { useState } from 'react';
import {
  LayoutDashboard, FolderKanban, CheckSquare, FolderGit2,
  CheckCircle2, MessageSquare, Calendar, Bot, BarChart3, Settings,
  AlertCircle, Users, UserCheck, Activity, Bell, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  pendingActionsCount?: number;
}

interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
  isAi?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, pendingActionsCount = 0 }) => {
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';
  const [collapsed, setCollapsed] = useState(false);

  const clientNavItems: NavItem[] = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    {
      label: 'Action Center',
      path: '/action-center',
      icon: AlertCircle,
      badge: pendingActionsCount > 0 ? pendingActionsCount : 3,
      highlight: true
    },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Deliverables & Files', path: '/files', icon: FolderGit2 },
    { label: 'Approvals', path: '/approvals', icon: CheckCircle2 },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
  ];

  const agencyNavItems: NavItem[] = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Clients', path: '/clients', icon: Users },
    { label: 'Team', path: '/team', icon: UserCheck },
    { label: 'Tasks', path: '/kanban', icon: CheckSquare },
    { label: 'Files', path: '/files', icon: FolderGit2 },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Approvals', path: '/approvals', icon: CheckCircle2, badge: 11 },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Analytics', path: '/reports', icon: BarChart3 },
    { label: 'Activity', path: '/action-center', icon: Activity },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Bot, isAi: true },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems: NavItem[] = isClient ? clientNavItems : agencyNavItems;

  return (
    <aside
      className={`glass-panel border-r border-slate-200/80 dark:border-slate-800 p-3 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="space-y-1">
        {/* Header / Collapse Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-1">
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {isClient ? 'Client Workspace' : 'Agency Portal'}
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between ${
                collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5'
              } rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : item.highlight && isClient
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 hover:bg-amber-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${item.isAi ? 'text-violet-500 dark:text-violet-400' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Account & AI Info */}
      {!collapsed && (
        <div className="p-3 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1 bg-white/40 dark:bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Workspace:</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase text-[10px]">ClientFlow AI</span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-500" /> AI Insights Active
          </div>
        </div>
      )}
    </aside>
  );
};
