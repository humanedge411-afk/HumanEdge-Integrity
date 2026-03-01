
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  ChevronRight, 
  Terminal,
  Cpu,
  ShieldCheck,
  Zap,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { createChatSession } from '../services/gemini';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Welcome to HumanEdge(CA) AI Support Core. I am your integrated assistant for product synthesis and platform navigation, powered by HumanEdge Canada Core. How can I facilitate your vision today?", 
      timestamp: Date.now() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleToggle = () => {
    if (!isOpen) {
      chatRef.current = createChatSession();
    }
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = createChatSession();
      }

      const stream = await chatRef.current.sendMessageStream({ message: input });
      let fullResponse = '';
      
      // Add a placeholder message for the streaming response
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: Date.now() }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        fullResponse += c.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullResponse;
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Signal interrupted. Integrity protocols suggest re-initializing the chat session.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Brainstorm an app idea",
    "How to use Vibe Coding?",
    "Security check my code",
    "Create a retro game"
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={handleToggle}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] shadow-2xl shadow-blue-600/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <MessageSquare className="w-8 h-8 relative z-10" />
        <div className="absolute top-0 right-0 p-2">
           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse border-2 border-blue-600"></div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 z-[100] w-[400px] glass bg-white rounded-[2.5rem] border border-blue-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-8 ${isMinimized ? 'h-[80px]' : 'h-[600px]'}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">Support Core</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Integrity Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4 text-slate-400" /> : <Minimize2 className="w-4 h-4 text-slate-400" />}
          </button>
          <button onClick={handleToggle} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-100' : 'bg-blue-600'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-slate-500" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white border-slate-800' 
                      : 'bg-white text-slate-700 border-slate-100'
                  }`}>
                    {msg.text || (isLoading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin opacity-40" /> : '')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          {messages.length < 3 && !isLoading && (
            <div className="px-6 pb-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              {quickActions.map(action => (
                <button 
                  key={action}
                  onClick={() => { setInput(action); }}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors uppercase tracking-widest"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="p-6 pt-2 border-t border-slate-100">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Synchronize with Support Core..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-4 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between opacity-40">
               <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                 <ShieldCheck className="w-2.5 h-2.5" /> Secure Stream
               </div>
               <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                 <Cpu className="w-2.5 h-2.5" /> Core v4.1
               </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatAssistant;
