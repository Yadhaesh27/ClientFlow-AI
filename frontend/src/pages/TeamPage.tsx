import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, Filter, Mail, Code, CheckSquare, ArrowUpRight, BarChart2, X, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  skills: string[];
  projects: number;
  tasks: number;
  workload: number;
  status: string;
  avatar: string;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Aarav Sharma', role: 'Senior Full Stack Developer', email: 'aarav@novaworks.io', skills: ['React', 'Node', 'Python', 'FastAPI'], projects: 3, tasks: 14, workload: 82, status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: '2', name: 'Sarah Jenkins', role: 'Lead Frontend Architect', email: 'sarah@novaworks.io', skills: ['TypeScript', 'Tailwind', 'Next.js', 'Vite'], projects: 4, tasks: 18, workload: 91, status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: '3', name: 'Alex Rivera', role: 'Project Manager', email: 'alex@novaworks.io', skills: ['Scrum', 'Client Comm', 'Agile', 'Sprint AI'], projects: 5, tasks: 12, workload: 75, status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
  { id: '4', name: 'Elena Rostova', role: 'UI/UX Product Designer', email: 'elena@novaworks.io', skills: ['Figma', 'Prototyping', 'Design Systems'], projects: 3, tasks: 9, workload: 68, status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: '5', name: 'Marcus Chen', role: 'Backend & Cloud Engineer', email: 'marcus@novaworks.io', skills: ['Python', 'PostgreSQL', 'Docker', 'GCP'], projects: 2, tasks: 11, workload: 64, status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: '6', name: 'Priya Patel', role: 'QA Automation Engineer', email: 'priya@novaworks.io', skills: ['Cypress', 'Playwright', 'Jest', 'CI/CD'], projects: 4, tasks: 15, workload: 78, status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
];

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('clientflow_team');
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  const [search, setSearch] = useState('');

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('Senior Full Stack Developer');
  const [memberSkills, setMemberSkills] = useState('React, TypeScript, FastAPI');
  const [assignedProjects, setAssignedProjects] = useState('2');

  useEffect(() => {
    try {
      localStorage.setItem('clientflow_team', JSON.stringify(team));
    } catch (e) {
      console.error(e);
    }
  }, [team]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;

    const skillsArray = memberSkills.split(',').map(s => s.trim()).filter(Boolean);

    const newMember: TeamMember = {
      id: `dev_${Date.now()}`,
      name: memberName,
      email: memberEmail,
      role: memberRole,
      skills: skillsArray.length ? skillsArray : ['React', 'TypeScript', 'FastAPI'],
      projects: parseInt(assignedProjects) || 2,
      tasks: 6,
      workload: 65,
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-${1500648767791 + (team.length * 120)}?w=150`,
    };

    setTeam([newMember, ...team]);
    setShowInviteModal(false);
    setMemberName('');
    setMemberEmail('');
    setMemberSkills('React, TypeScript, FastAPI');
  };

  const filtered = team.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.role.toLowerCase().includes(search.toLowerCase()) ||
    t.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] uppercase border border-indigo-200 dark:border-indigo-800">
              {team.length} Active Developers & Engineers
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Engineering & Team Capacity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor developer workload, skills allocation, active task queues, and project assignments.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Invite Team Member
        </button>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Team</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{team.length}</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <span className="font-bold">{dev.projects} Active Projects</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">{dev.tasks} Tasks</span>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Team Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleInviteSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" /> Invite Engineering Team Member
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Add developers, QA engineers, or designers to team workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Rohan Gupta"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Email Address</label>
              <input
                type="email"
                required
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="rohan@novaworks.io"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Role / Title</label>
              <select
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none"
              >
                <option value="Senior Full Stack Developer">Senior Full Stack Developer</option>
                <option value="Lead Frontend Architect">Lead Frontend Architect</option>
                <option value="Backend & Cloud Engineer">Backend & Cloud Engineer</option>
                <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                <option value="QA Automation Engineer">QA Automation Engineer</option>
                <option value="DevOps & Infrastructure Lead">DevOps & Infrastructure Lead</option>
                <option value="AI & Machine Learning Engineer">AI & Machine Learning Engineer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Tech Skills (Comma Separated)</label>
              <input
                type="text"
                value={memberSkills}
                onChange={(e) => setMemberSkills(e.target.value)}
                placeholder="React, TypeScript, Python, FastAPI"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md"
              >
                Send Invite & Add Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
