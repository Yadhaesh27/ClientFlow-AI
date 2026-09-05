import React, { useState } from 'react';
import { Users, Search, Plus, Filter, Mail, Phone, ExternalLink, Star, CheckCircle2, ArrowUpRight, FolderKanban, Clock } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const demoClients = [
    { id: '1', name: 'Northstar Labs', contact: 'David Vance', email: 'david@northstarlabs.io', projects: 12, rating: 4.9, status: 'ACTIVE', lastActive: '10 mins ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '2', name: 'Vertex Studio', contact: 'Elena Rostova', email: 'elena@vertexstudio.com', projects: 8, rating: 4.8, status: 'ACTIVE', lastActive: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: '3', name: 'BluePeak Technologies', contact: 'Marcus Chen', email: 'marcus@bluepeak.tech', projects: 6, rating: 4.7, status: 'ACTIVE', lastActive: '3 hours ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: '4', name: 'Nova Digital', contact: 'Sarah Jenkins', email: 'sarah@novadigital.agency', projects: 14, rating: 5.0, status: 'ACTIVE', lastActive: '25 mins ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: '5', name: 'Apex Systems', contact: 'Robert Sterling', email: 'rsterling@apexsystems.com', projects: 5, rating: 4.6, status: 'ACTIVE', lastActive: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { id: '6', name: 'Orbit Media', contact: 'Jessica Walsh', email: 'jessica@orbitmedia.co', projects: 9, rating: 4.9, status: 'ACTIVE', lastActive: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { id: '7', name: 'PixelForge', contact: 'Michael Chang', email: 'm.chang@pixelforge.design', projects: 4, rating: 4.8, status: 'ACTIVE', lastActive: '4 hours ago', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { id: '8', name: 'Crestline Consulting', contact: 'Amanda Hayes', email: 'amanda@crestline.org', projects: 11, rating: 4.9, status: 'ACTIVE', lastActive: '12 mins ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: '9', name: 'GreenByte Solutions', contact: 'Vikram Patel', email: 'vikram@greenbyte.io', projects: 7, rating: 4.7, status: 'ACTIVE', lastActive: '5 hours ago', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { id: '10', name: 'UrbanStack', contact: 'Chloe Bennett', email: 'chloe@urbanstack.net', projects: 15, rating: 4.9, status: 'ACTIVE', lastActive: 'Just now', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: '11', name: 'BioCare Systems', contact: 'Dr. Evelyn Reed', email: 'evelyn@biocare.org', projects: 8, rating: 5.0, status: 'ACTIVE', lastActive: '15 mins ago', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150' },
    { id: '12', name: 'DataPulse Corp', contact: 'Nathan Drake', email: 'nathan@datapulse.io', projects: 6, rating: 4.8, status: 'ACTIVE', lastActive: '45 mins ago', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { id: '13', name: 'SolanaPay Inc', contact: 'Tariq Al-Mansoor', email: 'tariq@solanapay.io', projects: 10, rating: 4.9, status: 'ACTIVE', lastActive: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
    { id: '14', name: 'OmniFreight Global', contact: 'Hannah Schmidt', email: 'hannah@omnifreight.de', projects: 11, rating: 4.7, status: 'ACTIVE', lastActive: '3 hours ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  ];

  const filtered = demoClients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.contact.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 dark:text-white text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] uppercase border border-emerald-200 dark:border-emerald-800">
              128 Total Accounts
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Client Relationships & Stakeholders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage client accounts, project assignments, satisfaction scores, and activity logs.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Add New Client Account
        </button>
      </div>

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Clients</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">128</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+14 new this month</span>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Workspaces</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">34</div>
          <span className="text-[10px] text-slate-400">Collaborating live</span>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Avg Satisfaction</span>
          <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
            4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-slate-400">98% positive rating</span>
        </div>
        <div className="p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pending Approvals</span>
          <div className="text-2xl font-black text-sky-500">11</div>
          <span className="text-[10px] text-slate-400">Review queue items</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact person or email..."
            className="w-full pl-10 pr-4 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-xl text-xs font-bold ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Clients Directory View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-indigo-500/40 hover:shadow-xl transition-all group bg-white/80 dark:bg-slate-900/80"
            >
              <div className="flex items-center gap-3">
                <img src={c.avatar} alt={c.contact} className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs" />
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{c.contact}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Active Workspaces:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{c.projects} Projects</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Satisfaction Rating:</span>
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    {c.rating} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {c.lastActive}
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline flex items-center gap-1">
                  Open Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Company</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Email</th>
                <th className="p-4">Projects</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <img src={c.avatar} alt={c.contact} className="w-7 h-7 rounded-xl object-cover" />
                    {c.name}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{c.contact}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{c.email}</td>
                  <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{c.projects} Active</td>
                  <td className="p-4 font-bold text-amber-500">{c.rating} ★</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
