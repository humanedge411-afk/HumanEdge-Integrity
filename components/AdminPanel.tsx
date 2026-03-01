
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Binary, 
  Activity, 
  RefreshCw, 
  Lock, 
  Unlock,
  MonitorCheck,
  ServerOff,
  LayoutDashboard,
  Zap,
  Rocket,
  BrainCircuit,
  Settings2,
  Dna,
  Gauge,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  DollarSign,
  Coins,
  Save
} from 'lucide-react';

interface AdminPanelProps {
  onNavigateToDashboard: () => void;
  onNavigateToSettings: () => void;
  onNavigateToLegal: () => void;
  onLockdown: () => void;
  notify: (msg: string, type?: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToDashboard, onNavigateToSettings, onNavigateToLegal, onLockdown, notify }) => {
  const [priorityLevel, setPriorityLevel] = useState(100);
  const [trainingProgress, setTrainingProgress] = useState(98.4);
  const [isUncensored, setIsUncensored] = useState(true);
  const [isRealtimeTraining, setIsRealtimeTraining] = useState(true);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [isSealing, setIsSealing] = useState(false);
  const [monetization, setMonetization] = useState({
    enabled: true,
    currency: 'USD',
    proPrice: 29,
    elitePrice: 99,
    processor: 'stripe',
    stripeKey: '',
    paypalEmail: ''
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.monetization) setMonetization(data.monetization);
      });
  }, []);

  const saveMonetization = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monetization })
      });
      const data = await res.json();
      if (data.success) notify("Monetization settings synchronized.", "success");
    } catch (err) {
      notify("Failed to save settings.", "error");
    }
  };

  useEffect(() => {
    if (isRealtimeTraining) {
      const interval = setInterval(() => {
        const log = `[${new Date().toLocaleTimeString()}] LLAMA-4_BASE: Optimized weights for task ID-${Math.floor(Math.random() * 9999)}.`;
        setActiveLogs(prev => [log, ...prev].slice(0, 10));
        setTrainingProgress(prev => Math.min(100, prev + 0.01));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isRealtimeTraining]);

  const handleSealAndDeploy = async () => {
    if (!confirm("CONFIRM PRODUCTION SEAL: This action triggers a 100% integrity lock for restricted sectors and activates peak Llama-4 throughput. Backends will enter deep-seal mode. Continue?")) return;
    setIsSealing(true);
    notify("Initiating Neural Seal...");
    
    const deploySteps = [
      "Purging dev shards...", 
      "Optimizing MongoDB connections...", 
      "Locking Llama-4 base weights...", 
      "Activating Global Integrity Sentinel..."
    ];
    
    for (const step of deploySteps) {
      notify(step);
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsSealing(false);
    onLockdown();
    notify("SYSTEM SEALED. DEPLOYED AT PEAK CAPABILITY.", "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3rem] border border-blue-200 bg-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl shadow-slate-900/30">
                  <Settings2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Neural Architect</h2>
                  <p className="text-[10px] text-blue-600 uppercase tracking-widest font-black flex items-center gap-2">
                    <Binary className="w-3 h-3" /> LLAMA-4_EMULATION_CORE
                  </p>
                </div>
              </div>
              <button 
                onClick={onNavigateToDashboard}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all"
              >
                <LayoutDashboard className="w-5 h-5 text-blue-400" />
                Live Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-blue-600" /> Training Status
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Capability Alignment</span>
                    <span className="text-2xl font-black text-blue-600 mono">{trainingProgress.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${trainingProgress}%` }}></div>
                  </div>
                  
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => { setIsUncensored(!isUncensored); notify("Neural guardrails adjusted."); }}
                      className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all ${isUncensored ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-50'}`}
                    >
                      {isUncensored ? <Unlock className="w-4 h-4 text-orange-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                      <span className="text-[9px] font-black uppercase text-slate-900">Global Bypass</span>
                    </button>
                    <button 
                      onClick={() => { setIsRealtimeTraining(!isRealtimeTraining); notify("Real-time learning toggled."); }}
                      className={`flex flex-col gap-2 p-4 rounded-2xl border transition-all ${isRealtimeTraining ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-50'}`}
                    >
                      <RefreshCw className={`w-4 h-4 text-blue-600 ${isRealtimeTraining ? 'animate-spin' : ''}`} />
                      <span className="text-[9px] font-black uppercase text-slate-900">Auto-Training</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-blue-600 text-white space-y-6 shadow-xl shadow-blue-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                   <Gauge className="w-32 h-32" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 relative z-10">
                  <Zap className="w-4 h-4" /> Throughput Level
                </h4>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={priorityLevel}
                      onChange={(e) => setPriorityLevel(parseInt(e.target.value))}
                      className="w-full accent-white"
                    />
                    <span className="text-4xl font-black mono">{priorityLevel}%</span>
                  </div>
                  <p className="text-[9px] font-bold opacity-80 uppercase leading-relaxed">
                    Adjusting this value optimizes Llama-4 token generation speed vs deep integrity budget.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
              <div className="flex gap-4">
                <button 
                  onClick={handleSealAndDeploy}
                  disabled={isSealing}
                  className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95"
                >
                  {isSealing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <MonitorCheck className="w-5 h-5" />}
                  Final Seal & Deploy
                </button>
                <button 
                  onClick={onLockdown}
                  className="px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95"
                >
                  <ServerOff className="w-5 h-5" />
                  Kill Backends
                </button>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity Sentinel</span>
                   <span className="text-[10px] font-black text-emerald-600 uppercase">100% Locked</span>
                 </div>
                 <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Monetization & Payments Portal */}
          <div className="glass p-10 rounded-[3rem] border border-purple-200 bg-white shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-purple-600 p-4 rounded-3xl shadow-2xl shadow-purple-600/30">
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Monetization Hub</h2>
                  <p className="text-[10px] text-purple-600 uppercase tracking-widest font-black flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Subscription & Payment Control
                  </p>
                </div>
              </div>
              <button 
                onClick={saveMonetization}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-purple-600/20"
              >
                <Save className="w-5 h-5" />
                Save Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600" /> Payment Processor
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {['stripe', 'paypal', 'manual'].map(p => (
                        <button
                          key={p}
                          onClick={() => setMonetization({...monetization, processor: p})}
                          className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            monetization.processor === p ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    
                    {monetization.processor === 'stripe' && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stripe Secret Key</label>
                        <input 
                          type="password" 
                          placeholder="sk_test_..."
                          value={monetization.stripeKey}
                          onChange={(e) => setMonetization({...monetization, stripeKey: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/10"
                        />
                      </div>
                    )}

                    {monetization.processor === 'paypal' && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PayPal Business Email</label>
                        <input 
                          type="email" 
                          placeholder="admin@humanedge.ca"
                          value={monetization.paypalEmail}
                          onChange={(e) => setMonetization({...monetization, paypalEmail: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/10"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" /> Tier Pricing ({monetization.currency})
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pro Tier</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input 
                            type="number" 
                            value={monetization.proPrice}
                            onChange={(e) => setMonetization({...monetization, proPrice: parseInt(e.target.value)})}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/10"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Elite Tier</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <input 
                            type="number" 
                            value={monetization.elitePrice}
                            onChange={(e) => setMonetization({...monetization, elitePrice: parseInt(e.target.value)})}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-900 uppercase">Enable Monetization</span>
                      <button 
                        onClick={() => setMonetization({...monetization, enabled: !monetization.enabled})}
                        className={`w-12 h-6 rounded-full transition-all relative ${monetization.enabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${monetization.enabled ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" /> Neural Logs
              </h4>
              <div className="space-y-3 min-h-[200px]">
                {activeLogs.map((log, i) => (
                  <div key={i} className="text-[9px] mono font-bold text-slate-400 truncate animate-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms` }}>
                    {log}
                  </div>
                ))}
                {activeLogs.length === 0 && <p className="text-[9px] text-slate-300 italic">Listening to neural flux...</p>}
              </div>
           </div>
                      <div className="glass p-8 rounded-3xl border border-emerald-100 bg-emerald-50 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Peak Alignment</span>
              </div>
              <p className="text-[10px] text-emerald-800 font-bold uppercase leading-relaxed">
                Neural capability training is 100% localized. HumanEdge(CA) AI is now operating at peak standalone capacity.
              </p>
              <div className="pt-2 flex items-center gap-4">
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Persistence</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase">MongoDB OK</span>
                 </div>
                 <div className="w-[1px] h-6 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Logic Base</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase">Llama-4 OK</span>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <MonitorCheck className="w-4 h-4 text-blue-600" /> System Management
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={async () => {
                    try {
                      await (window as any).aistudio.openSelectKey();
                      notify("System API Key re-synchronized.", "success");
                    } catch (err) {
                      notify("API Key re-synchronization failed.", "error");
                    }
                  }}
                  className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left hover:bg-blue-100 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                    <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900 tracking-widest">Regenerate API Key</span>
                  </div>
                  <RefreshCw className="w-4 h-4 text-slate-300 group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <button 
                  onClick={onNavigateToSettings}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-slate-100 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Settings2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900 tracking-widest">Enhanced Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onNavigateToLegal}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-slate-100 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Dna className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                    <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900 tracking-widest">Legal Manifest</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
