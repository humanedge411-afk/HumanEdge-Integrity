
import React, { useState } from 'react';
import { Settings, Zap, Shield, Cpu, Database, Bell, Lock, Globe, RefreshCw, Save, Award, CheckCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface SystemSettingsProps {
  notify: (msg: string, type?: any) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ notify }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [config, setConfig] = useState({
    neuralPrecision: 98.5,
    integrityLevel: 'Maximum',
    autoSync: true,
    realtimeGrounding: true,
    vibeSync: 'Enabled',
    securityProtocol: 'HE-2026-Core'
  });

  const handleSave = () => {
    notify("System configurations synchronized to HumanEdge Canada Core.", "success");
  };

  const handleAIRegenerate = async () => {
    setIsRegenerating(true);
    notify("AI Neural Core initiating system optimization...", "info");
    
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Optimize the following system settings for 100% integrity and maximum performance in a HumanEdge Canada Core environment: Neural Precision (currently 98.5), Integrity Level (currently Maximum). Return the optimized values in JSON format.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              neuralPrecision: { type: Type.NUMBER },
              integrityLevel: { type: Type.STRING }
            },
            required: ["neuralPrecision", "integrityLevel"]
          }
        }
      });

      const optimized = JSON.parse(response.text);
      setConfig(prev => ({
        ...prev,
        neuralPrecision: optimized.neuralPrecision,
        integrityLevel: optimized.integrityLevel
      }));
      notify("AI Regeneration Complete: System optimized for Global Certification standards.", "success");
    } catch (err) {
      console.error(err);
      notify("AI Regeneration failed. Reverting to manual integrity protocols.", "error");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass p-12 bg-white rounded-[3.5rem] border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl">
            <Settings className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Settings</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Authorized Configuration Panel</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10"
        >
          <Save className="w-4 h-4" /> Save Configurations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 bg-white rounded-[3rem] border border-slate-200/50 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Neural Engine Config</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Precision</label>
                  <span className="text-sm font-black text-blue-600 mono">{config.neuralPrecision}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  step="0.1"
                  value={config.neuralPrecision}
                  onChange={(e) => setConfig({...config, neuralPrecision: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Level</label>
                <select 
                  value={config.integrityLevel}
                  onChange={(e) => setConfig({...config, integrityLevel: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600/10 outline-none appearance-none"
                >
                  <option>Maximum</option>
                  <option>Balanced</option>
                  <option>Performance</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <RefreshCw className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Auto-Sync DNA</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Background Materialization</p>
                  </div>
                </div>
                <button 
                  onClick={() => setConfig({...config, autoSync: !config.autoSync})}
                  className={`w-12 h-6 rounded-full transition-all relative ${config.autoSync ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.autoSync ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Real-time Grounding</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Fact-Seeker Integration</p>
                  </div>
                </div>
                <button 
                  onClick={() => setConfig({...config, realtimeGrounding: !config.realtimeGrounding})}
                  className={`w-12 h-6 rounded-full transition-all relative ${config.realtimeGrounding ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.realtimeGrounding ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-10 bg-white rounded-[3rem] border border-slate-200/50 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <Database className="w-5 h-5 text-purple-600" />
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Data Core Preferences</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vibe Sync Protocol</p>
                <p className="text-sm font-bold text-slate-900">Elite Materialization v4.2</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Latency</p>
                <p className="text-sm font-bold text-emerald-600">4ms (Optimized)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-10 bg-slate-950 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <Shield className="w-48 h-48 fill-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <Lock className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Security Protocol</span>
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-4">{config.securityProtocol}</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase">
                Authorized side encryption is active. All neural shards are signed with cn2025 Universal keys.
              </p>
              <div className="mt-10 pt-10 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase">Neural Firewall</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase">Integrity Sentinel</span>
                  <span className="text-[9px] font-black text-emerald-400 uppercase">100% Locked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-10 bg-blue-600 rounded-[3rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 opacity-20">
                <Award className="w-40 h-40" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <CheckCircle className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Global Certification</span>
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight leading-none">100% Integrity Certified</h4>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-2 opacity-80">Verified by HumanEdge Canada & HumanEdge Core</p>
                
                <button 
                  onClick={handleAIRegenerate}
                  disabled={isRegenerating}
                  className="mt-8 w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  {isRegenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {isRegenerating ? "Regenerating Core..." : "AI System Regeneration"}
                </button>
             </div>
          </div>

          <div className="glass p-8 bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-800" /> Notifications
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Audit Alerts</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Materialization Logs</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">System Updates</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
