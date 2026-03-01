
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Cpu, 
  Eye, 
  Zap, 
  Database, 
  Lock, 
  Globe, 
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Fingerprint,
  Activity,
  Check,
  ChevronRight,
  LayoutGrid,
  Rocket
} from 'lucide-react';

interface SettingsProps {
  isProMode: boolean;
  setIsProMode: (val: boolean) => void;
  notify: (msg: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ isProMode, setIsProMode, notify }) => {
  const [activeSection, setActiveSection] = useState<'neural' | 'security' | 'interface' | 'notifications'>('neural');
  
  const [neuralSensitivity, setNeuralSensitivity] = useState(75);
  const [integrityLevel, setIntegrityLevel] = useState('High');
  const [vibePreference, setVibePreference] = useState('Cyberpunk');
  const [autoSync, setAutoSync] = useState(true);

  const sections = [
    { id: 'neural', label: 'Neural Link', icon: Cpu },
    { id: 'security', label: 'Integrity & Security', icon: Shield },
    { id: 'interface', label: 'Citizen Interface', icon: LayoutGrid },
    { id: 'notifications', label: 'Comms & Alerts', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 glass p-6 rounded-[2.5rem] border border-slate-200 bg-white h-fit space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                activeSection === section.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-900'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{section.label}</span>
              {activeSection === section.id && <ChevronRight className="w-4 h-4 ml-auto opacity-40" />}
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-slate-100">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-[9px] font-black text-blue-600 uppercase">Pro Tier Status</span>
              </div>
              <p className="text-[10px] text-blue-800 font-bold mb-4">
                {isProMode ? 'Full Neural Access Enabled' : 'Standard Citizen Access'}
              </p>
              <button
                onClick={() => { setIsProMode(!isProMode); notify(isProMode ? 'Downgraded to Standard' : 'Upgraded to Pro Tier'); }}
                className={`w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  isProMode ? 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                }`}
              >
                {isProMode ? 'Manage Subscription' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass p-10 rounded-[3rem] border border-slate-200 bg-white min-h-[600px]">
            {activeSection === 'neural' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Neural Link Configuration</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimize your direct brain-to-AI interface</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Interface Sensitivity</label>
                      <span className="text-[10px] font-black text-blue-600 uppercase">{neuralSensitivity}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={neuralSensitivity}
                      onChange={(e) => setNeuralSensitivity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Higher sensitivity increases materialization speed but may cause neural fatigue.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Sync Frequency</span>
                      </div>
                      <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/10">
                        <option>Real-time (4ms)</option>
                        <option>Batch (100ms)</option>
                        <option>Eco (500ms)</option>
                      </select>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Logic Engine</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600 uppercase">Llama-4 Standalone</span>
                        <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-lg uppercase tracking-widest border border-emerald-100">Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Integrity Sentinel</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage your security and data integrity protocols</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><Fingerprint className="w-4 h-4 text-slate-400" /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Biometric Neural Auth</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Require neural fingerprint for all materializations</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAutoSync(!autoSync)}
                      className={`w-12 h-6 rounded-full transition-all relative ${autoSync ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoSync ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Integrity Protocol Level</p>
                    <div className="grid grid-cols-3 gap-3">
                      {['Standard', 'High', 'Absolute'].map(level => (
                        <button
                          key={level}
                          onClick={() => setIntegrityLevel(level)}
                          className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            integrityLevel === level ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 flex items-start gap-4">
                    <Lock className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                    <div>
                      <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Deep Freeze Protocol</h5>
                      <p className="text-xs text-red-800 font-medium leading-relaxed mb-4">
                        Immediately seal all projects and lock the neural gateway. This action requires Root Core authorization to reverse.
                      </p>
                      <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">
                        Initialize Lockdown
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'interface' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Citizen Interface</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customize your visual and auditory experience</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aesthetic Vibe Preference</p>
                    <div className="space-y-2">
                      {['Cyberpunk', 'Minimalist', 'Organic', 'Retro-Future'].map(vibe => (
                        <button
                          key={vibe}
                          onClick={() => setVibePreference(vibe)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            vibePreference === vibe ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{vibe}</span>
                          {vibePreference === vibe && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Display Mode</p>
                      <div className="flex gap-4">
                        <button className="flex-1 flex flex-col items-center gap-3 p-6 bg-slate-900 text-white rounded-[2rem] border border-slate-800">
                          <Moon className="w-6 h-6" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Dark Core</span>
                        </button>
                        <button className="flex-1 flex flex-col items-center gap-3 p-6 bg-white text-slate-400 rounded-[2rem] border border-slate-200 hover:bg-slate-50 transition-all">
                          <Sun className="w-6 h-6" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Light Landscape</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Audio Feedback</p>
                      <div className="flex items-center gap-4">
                        <Volume2 className="w-5 h-5 text-slate-400" />
                        <input type="range" className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Comms & Alerts</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stay synchronized with system events and project updates</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Project Materialization Complete', desc: 'Notify when an AI generation cycle finishes', icon: Rocket },
                    { label: 'Integrity Sentinel Alerts', desc: 'Critical security and fraud detection notifications', icon: Shield },
                    { label: 'Neural Link Status', desc: 'Updates on connection stability and latency', icon: Activity },
                    { label: 'System Announcements', desc: 'Global HumanEdge(CA) core updates', icon: Globe },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm"><item.icon className="w-4 h-4 text-slate-400" /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{item.desc}</p>
                        </div>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-blue-600 relative">
                        <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
