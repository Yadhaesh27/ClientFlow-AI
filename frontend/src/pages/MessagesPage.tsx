import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User as UserIcon } from 'lucide-react';
import { messagesApi, projectsApi } from '../services/api';
import { Message, Project } from '../types';
import { useAuth } from '../context/AuthContext';

interface MessagesPageProps {
  projectId?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ projectId }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const pList = await projectsApi.list();
      setProjects(pList);
      if (pList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(pList[0].id);
      }
    };
    init();
  }, []);

  const loadMessages = async (pId: string) => {
    if (!pId) return;
    setLoading(true);
    try {
      const list = await messagesApi.list(pId);
      setMessages(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      loadMessages(selectedProjectId);
      const interval = setInterval(() => loadMessages(selectedProjectId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedProjectId) return;

    try {
      await messagesApi.send(selectedProjectId, inputMsg);
      setInputMsg('');
      loadMessages(selectedProjectId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-6.5rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Project Discussion & Chat
          </h1>
          <p className="text-xs text-slate-500 font-medium">Direct message thread between agency team and client stakeholders</p>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 font-bold focus:outline-none shrink-0"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 glass-card rounded-3xl p-5 overflow-y-auto space-y-4 border border-slate-200/80">
        {loading && messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading discussion thread...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No messages in this project thread yet. Start the conversation!</div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender_id === user?.id;
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                  {m.sender?.name ? m.sender.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                    <span className="font-extrabold text-slate-900">{m.sender?.name || 'User'}</span>
                    <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded-full">{m.sender?.role}</span>
                    <span className="font-medium">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-3 shrink-0">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type your message or project question..."
          className="flex-1 px-4 py-3 glass-input rounded-2xl text-xs text-slate-900 font-medium focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
