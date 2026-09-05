import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Flag } from 'lucide-react';
import { projectsApi, tasksApi } from '../services/api';
import { Project, Task } from '../types';

export const CalendarPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const pList = await projectsApi.list();
        setProjects(pList);
        let allT: Task[] = [];
        for (const p of pList) {
          const t = await tasksApi.list(p.id);
          allT = [...allT, ...t];
        }
        setTasks(allT);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const timelineItems = [
    ...projects.map(p => ({
      id: p.id,
      title: `Project Target Deadline: ${p.name}`,
      date: p.deadline || 'Flexible',
      type: 'PROJECT',
      status: p.status
    })),
    ...tasks.filter(t => t.due_date).map(t => ({
      id: t.id,
      title: `Task Target Due: ${t.title}`,
      date: t.due_date!,
      type: 'TASK',
      status: t.status
    }))
  ].sort((a, b) => (a.date > b.date ? 1 : -1));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" /> Calendar & Milestone Timeline
        </h1>
        <p className="text-xs text-slate-500 font-medium">Milestones and upcoming deliverable due dates in chronological view</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading timeline events...</div>
      ) : timelineItems.length === 0 ? (
        <div className="p-8 text-center glass-card rounded-3xl text-slate-500 text-xs">
          No calendar events or due dates scheduled.
        </div>
      ) : (
        <div className="space-y-3">
          {timelineItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl glass-card border border-slate-200/80 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${item.type === 'PROJECT' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'}`}>
                  {item.type === 'PROJECT' ? <Flag className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{item.title}</h4>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{item.type} • Status: {item.status}</span>
                </div>
              </div>

              <div className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-extrabold text-indigo-700 shadow-sm">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
