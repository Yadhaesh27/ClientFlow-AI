import React, { useState } from 'react';
import { UserCheck, Search, Plus, Filter, Mail, Code, CheckSquare, ArrowUpRight, BarChart2 } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const demoTeam = [
    { id: '1', name: 'Aarav Sharma', role: 'Senior Full Stack Developer', skills: ['React', 'Node', 'Python', 'FastAPI'], projects: 3, tasks: 14, workload: 82, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: '2', name: 'Sarah Jenkins', role: 'Lead Frontend Architect', skills: ['TypeScript', 'Tailwind', 'Next.js', 'Vite'], projects: 4, tasks: 18, workload: 91, status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: '3', name: 'Alex Rivera', role: 'Project Manager', skills: ['Scrum', 'Client Comm', 'Agile', 'Sprint AI'], projects: 5, tasks: 12, workload: 75, status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { id: '4', name: 'Elena Rostova', role: 'UI/UX Product Designer', skills: ['Figma', 'Prototyping', 'Design Systems'], projects: 3, tasks: 9, workload: 68, status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '5', name: 'Marcus Chen', role: 'Backend & Cloud Engineer', skills: ['Python', 'PostgreSQL', 'Docker', 'GCP'], projects: 2, tasks: 11, workload: 64, status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: '6', name: 'Priya Patel', role: 'QA Automation Engineer', skills: ['Cypress', 'Playwright', 'Jest', 'CI/CD'], projects: 4, tasks: 15, workload: 78, status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: '7', name: 'David Kim', role: 'Mobile iOS/Android Engineer', skills: ['React Native', 'Flutter', 'Swift'], projects: 2, tasks: 8, workload: 55, status: 'Available', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { id: '8', name: 'Jessica Taylor', role: 'DevOps & Infrastructure Lead', skills: ['Kubernetes', 'Terraform', 'AWS', 'Security'], projects: 5, tasks: 20, workload: 88, status: 'Active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { id: '9', name: 'Sofia Loren', role: 'Technical Project Manager', skills: ['Agile Scrum', 'Resource Planning', 'Risk Mitigation'], projects: 4, tasks: 11, workload: 70, status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: '10', name: 'James Wilson', role: 'AI & Machine Learning Engineer', skills: ['PyTorch', 'Gemini API', 'Vector DB', 'Python'], projects: 3, tasks: 13, workload: 80, status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { id: '11', name: 'Ananya Roy', role: 'Agile Delivery Manager', skills: ['Sprint Velocity', 'Client Roadmaps', 'Stakeholders'], projects: 6, tasks: 16, workload: 85, status: 'Active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: '12', name: 'Lucas Vance', role: 'Full Stack Web Engineer', skills: ['Next.js', 'FastAPI', 'PostgreSQL', 'Tailwind'], projects: 3, tasks: 10, workload: 62, status: 'Available', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
  ];

  const filtered = demoTeam.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.role.toLowerCase().includes(search.toLowerCase()) ||
    t.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800">
              46 Active Developers & Team Members
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Engineering & Team Capacity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor developer workload, skills allocation, active task queues, and project assignments.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Invite Team Member
        </button>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Team</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">46</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% On-time Delivery</span>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg Workload</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">76%</div>
          <span className="text-[10px] text-slate-400">Optimal capacity balance</span>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Tasks</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">184</div>
          <span className="text-[10px] text-slate-400">Assigned across 34 projects</span>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Available Devs</span>
          <div className="text-2xl font-black text-sky-500">6</div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">Ready for new sprint</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by developer name, role, or tech skills (React, Python, Figma)..."
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          />
        </div>
      </div>

      {/* Developer Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((dev) => (
          <div
            key={dev.id}
            className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-indigo-500/40 hover:shadow-xl transition-all group bg-white/80 dark:bg-slate-900/80"
          >
            <div className="flex items-center gap-3">
              <img src={dev.avatar} alt={dev.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs" />
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {dev.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{dev.role}</p>
              </div>
            </div>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {dev.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Workload Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Workload Capacity</span>
                <span className={`font-extrabold ${dev.workload > 85 ? 'text-rose-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {dev.workload}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    dev.workload > 85
                      ? 'bg-rose-500'
                      : dev.workload > 70
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-indigo-600 to-sky-500'
                  }`}
                  style={{ width: `${dev.workload}%` }}
                />
              </div>
            </div>

            {/* Tasks & Projects Footer */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold">{dev.projects} Projects</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">{dev.tasks} Open Tasks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
