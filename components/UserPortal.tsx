
import React, { useState } from 'react';
// Fix: Added Wrench and Eye to lucide-react imports
import { User, Sparkles, ShieldCheck, ArrowRight, Rocket, Gamepad2, Layout, Database, Terminal, Shield, Zap, Wrench, Eye, Edit3, Save, Check, Mail, MapPin, Info, Settings } from 'lucide-react';
import { AppView, SubscriptionTier } from '../types';

interface UserPortalProps {
  onAction: (view: AppView) => void;
  onUpgrade: () => void;
  currentTier: SubscriptionTier;
}

const UserPortal: React.FC<UserPortalProps> = ({ onAction, onUpgrade, currentTier }) => {
  const [profile, setProfile] = useState({
    name: 'Citizen One',
    email: '',
    bio: 'Neural materialization enthusiast and integrity-first architect.',
    location: 'Toronto, Canada'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Landscape Hero */}
      <div className="relative p-16 bg-white rounded-[4rem] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Database className="w-96 h-96 text-blue-600" />
        </div>
        
        <div className="relative z-10 max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Integrity Protocol Online</span>
          </div>
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
            CITIZEN <span className="text-blue-600">HUB</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
            Welcome to HumanEdge(CA) AI, your 100% Integrity Standalone System powered by HumanEdge Canada Core.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                <span className="text-sm font-black text-emerald-600 uppercase tracking-tight">Active Sentinel</span>
             </div>
             <div className="w-[1px] h-10 bg-slate-200"></div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Compute</span>
                <span className="text-sm font-black text-blue-600 uppercase tracking-tight">Llama-4 Logic</span>
             </div>
             <div className="w-[1px] h-10 bg-slate-200"></div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization</span>
                <span className="text-sm font-black text-purple-600 uppercase tracking-tight">{currentTier} Tier</span>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-6 shrink-0">
           <div className="p-10 bg-slate-950 rounded-[3rem] text-white shadow-2xl flex flex-col items-center text-center w-64 h-64 justify-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
              <div>
                 <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.3em] mb-1">Integrity Score</p>
                 <p className="text-5xl font-black tracking-tighter">100%</p>
              </div>
           </div>
           <button 
            onClick={onUpgrade}
            className="p-10 bg-blue-600 rounded-[3rem] text-white shadow-2xl flex flex-col items-center text-center w-64 h-64 justify-center space-y-4 hover:bg-blue-700 transition-all group"
           >
              <Zap className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
              <div>
                 <p className="text-[9px] font-black uppercase text-white/60 tracking-[0.3em] mb-1">Subscription</p>
                 <p className="text-2xl font-black tracking-tight uppercase">Manage Tier</p>
              </div>
           </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="glass p-12 rounded-[3.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Citizen Profile</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Identity Verification: Level 5</p>
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2 ${
              isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isEditing ? (
              <><Save className="w-4 h-4" /> Save Identity</>
            ) : (
              <><Edit3 className="w-4 h-4" /> Edit Profile</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Full Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/10 outline-none"
                />
              ) : (
                <p className="text-lg font-bold text-slate-900 px-2">{profile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Neural Address
              </label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/10 outline-none"
                />
              ) : (
                <p className="text-lg font-bold text-slate-900 px-2">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Physical Node
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={tempProfile.location}
                  onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/10 outline-none"
                />
              ) : (
                <p className="text-lg font-bold text-slate-900 px-2">{profile.location}</p>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3 h-3" /> Identity Bio
              </label>
              {isEditing ? (
                <textarea 
                  value={tempProfile.bio}
                  onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/10 outline-none min-h-[160px] resize-none"
                />
              ) : (
                <p className="text-lg font-bold text-slate-700 leading-relaxed px-2 italic">"{profile.bio}"</p>
              )}
            </div>

            <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Security Note</h5>
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                  Your identity is secured via HumanEdge(CA) Integrity Protocols. Changes are logged to the local neural ledger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Quick Access - Horizontal Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            view: AppView.APP_BUILDER, 
            label: 'App Architect', 
            icon: Rocket, 
            desc: 'Materialize full-stack products from aesthetic blueprints.',
            accent: 'bg-orange-50 text-orange-600',
            hover: 'hover:border-orange-200'
          },
          { 
            view: AppView.CREATIVE_STUDIO, 
            label: 'Creative Studio', 
            icon: Sparkles, 
            desc: 'Forge cinematic visual and audio assets with Vibe Sync.',
            accent: 'bg-purple-50 text-purple-600',
            hover: 'hover:border-purple-200'
          },
          { 
            view: AppView.GAME_ENGINE, 
            label: 'World Engine', 
            icon: Gamepad2, 
            desc: 'Construct immersive worlds and logic nodes instantly.',
            accent: 'bg-pink-50 text-pink-600',
            hover: 'hover:border-pink-200'
          },
        ].map((card, i) => (
          <button 
            key={i}
            onClick={() => onAction(card.view)}
            className={`bg-white p-10 rounded-[3rem] border border-slate-200/50 shadow-sm transition-all group text-left ${card.hover} hover:shadow-2xl hover:shadow-slate-200/30 active:scale-[0.98]`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-sm ${card.accent}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{card.label}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">{card.desc}</p>
            <div className={`inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] ${card.accent.split(' ')[1]}`}>
              Open Module <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Secondary Row - Compact Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { view: AppView.DATA_CORE, label: 'Omni Core', icon: Database, pro: true },
           { view: AppView.CODE_REPAIR, label: 'Code Repair', icon: Wrench, pro: true },
           { view: AppView.FRAUD_DETECTION, label: 'Sentinel', icon: Eye, pro: true },
           { view: AppView.SETTINGS, label: 'Settings', icon: Settings, pro: false },
           { view: AppView.DASHBOARD, label: 'Ops Sync', icon: Zap, pro: false },
         ].map((item, idx) => (
           <button 
            key={idx}
            onClick={() => onAction(item.view)}
            className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-200/50 shadow-sm hover:bg-slate-50 transition-all group"
           >
             <div className="flex items-center gap-4">
                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</span>
             </div>
             {item.pro ? (
               <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-lg uppercase tracking-widest border border-blue-100">Pro</div>
             ) : (
               <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
             )}
           </button>
         ))}
      </div>
    </div>
  );
};

export default UserPortal;
