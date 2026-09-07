import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Minimize2, Maximize2, Zap } from 'lucide-react';
import { aiApi, projectsApi } from '../services/api';
import { Project } from '../types';

export const AiCopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [messages, setMessages] = useState<{ sender: 'USER' | 'AI'; text: string }[]>([
    { sender: 'AI', text: '👋 Hi! I am your global ClientFlow AI Copilot. Ask me about project health, tasks, client sentiment, or request draft updates!' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const list = await projectsApi.list();
      setProjects(list);
      if (list.length > 0) setSelectedProjectId(list[0].id);
    };
    fetchProjects();
  }, []);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isStreaming || !selectedProjectId) return;

    setMessages((prev) => [...prev, { sender: 'USER', text: promptText }]);
    setInput('');
    setIsStreaming(true);

    // Initialize empty AI message for token accumulation
    setMessages((prev) => [...prev, { sender: 'AI', text: '' }]);

    await aiApi.streamChat(selectedProjectId, promptText, (chunkText) => {
      setMessages((prev) => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0 && copy[lastIdx].sender === 'AI') {
          copy[lastIdx] = {
            ...copy[lastIdx],
            text: copy[lastIdx].text + chunkText,
          };
        }
        return copy;
      });
    });

    setIsStreaming(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 group border border-white/20"
        title="Open ClientFlow AI Copilot"
      >
        <Bot className="w-6 h-6 animate-bounce" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-black tracking-wider uppercase pr-1">
          AI Copilot
        </span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300 ${
        isExpanded ? 'w-[640px] h-[720px]' : 'w-[380px] h-[520px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-t-3xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              ClientFlow Real-Time Copilot <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-[10px] font-bold bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer max-w-[180px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-all"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => handleSendPrompt('What is the project progress & health score?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-200 transition-all shrink-0 cursor-pointer flex items-center gap-1"
        >
          <Zap className="w-3 h-3 text-amber-500" /> Health Audit
        </button>
        <button
          onClick={() => handleSendPrompt('Draft a concise executive email update for the client.')}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-200 transition-all shrink-0 cursor-pointer flex items-center gap-1"
        >
          ✉️ Draft Update
        </button>
        <button
          onClick={() => handleSendPrompt('Which team member has the lowest workload for new tasks?')}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-200 transition-all shrink-0 cursor-pointer flex items-center gap-1"
        >
          👤 Workload Match
        </button>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed font-medium shadow-xs ${
                m.sender === 'USER'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
              }`}
            >
              {m.text || (isStreaming && idx === messages.length - 1 ? <span className="animate-pulse text-indigo-500">Writing response...</span> : '')}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(input);
        }}
        className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Copilot live..."
          className="flex-1 px-3.5 py-2.5 glass-input rounded-2xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none bg-slate-50 dark:bg-slate-800"
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
