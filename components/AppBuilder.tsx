
import React, { useState, useRef, useEffect } from 'react';
import { 
  Rocket, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  Eye, 
  Code, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  X, 
  Tag, 
  ChevronRight, 
  Layout, 
  Sparkles, 
  Command, 
  Layers, 
  CheckCircle2, 
  ArrowUpCircle,
  History,
  Save,
  Palette
} from 'lucide-react';
import { generateAppManifest } from '../services/gemini';
import { VibeMode, AppView } from '../types';

interface AppBuilderProps {
  onAssetSecured: (asset: any) => void;
  notify: (msg: string, type?: any) => void;
}

const VIBES: { id: VibeMode, name: string, icon: any, color: string }[] = [
  { id: 'standard', name: 'Elite Core', icon: Command, color: 'text-blue-500' },
  { id: 'minimalist', name: 'Architectural', icon: Layout, color: 'text-slate-500' },
  { id: 'cyberpunk', name: 'High-Velocity', icon: Zap, color: 'text-pink-500' },
  { id: 'organic', name: 'Fluid Design', icon: Layers, color: 'text-emerald-500' },
];

const AppBuilder: React.FC<AppBuilderProps> = ({ onAssetSecured, notify }) => {
  const [prompt, setPrompt] = useState('');
  const [updatePrompt, setUpdatePrompt] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<VibeMode>('standard');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState('');
  const [outputCode, setOutputCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'dna'>('preview');
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [appTags, setAppTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const cleanCode = (raw: string) => {
    return raw.replace(/```html/gi, '').replace(/```/g, '').trim();
  };

  const handleBuild = async (isUpdate: boolean = false) => {
    if (isUpdate ? !updatePrompt : !prompt) return;
    
    setIsBuilding(true);
    setBuildStep(isUpdate ? "Analyzing Existing DNA..." : "Initializing Reality Shards...");
    
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let lastError = '';

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        if (attempts > 1) {
          setBuildStep(`Integrity Breach Detected. Auto-Repairing (Attempt ${attempts}/${maxAttempts})...`);
          notify(`Regeneration cycle ${attempts} initiated for perfection.`, 'error');
        }

        const steps = isUpdate 
          ? ["Surgical Regeneration Active...", "Maintaining Core Integrity...", "Applying Fluid Upgrades..."]
          : ["Materializing Product Blueprint...", "Injecting Aesthetic DNA...", "Validating Functional Integrity..."];

        for (const step of steps) {
          if (attempts === 1) {
            setBuildStep(step);
            await new Promise(r => setTimeout(r, 600));
          }
        }

        const manifest = await generateAppManifest(
          prompt + (lastError ? `\nFIX PREVIOUS ERROR: ${lastError}` : ''), 
          selectedVibe, 
          isUpdate ? (outputCode || undefined) : undefined, 
          isUpdate ? updatePrompt : undefined
        );
        
        const cleaned = cleanCode(manifest);
        if (cleaned && cleaned.length > 200) { // Basic sanity check for HTML
          setOutputCode(cleaned);
          if (isUpdate) setUpdatePrompt('');
          success = true;
          notify(isUpdate ? "Regeneration Cycle Complete." : "App Materialization Complete.");
        } else {
          throw new Error("Incomplete DNA manifest generated.");
        }
      } catch (err: any) {
        lastError = err.message || 'Unknown neural fault';
        console.error(`Build attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          notify("Synthesis failure after multiple attempts. Check grounding.", "error");
        }
        await new Promise(r => setTimeout(r, 1000)); // Cool down
      }
    }
    setIsBuilding(false);
  };

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tagInput.trim() && !appTags.includes(tagInput.trim())) {
      setAppTags([...appTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSave = () => {
    onAssetSecured({
      name: prompt.substring(0, 30) || 'Materialized Shard',
      type: 'FullApp',
      module: AppView.APP_BUILDER,
      tags: [...appTags, selectedVibe]
    });
    setAppTags([]);
    notify("Product Blueprint secured to Vault.");
  };

  return (
    <div className="min-h-[700px] flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Sidebar: Control Panel */}
      <div className="lg:w-96 flex flex-col gap-6">
        <div className="glass bg-white p-8 rounded-[3rem] border border-slate-200/50 shadow-sm space-y-8 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> App Materializer
            </h4>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase">100% Integrity</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aesthetic Alignment</label>
            <div className="grid grid-cols-2 gap-3">
              {VIBES.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVibe(v.id)}
                  className={`p-4 rounded-2xl border transition-all text-left group relative ${
                    selectedVibe === v.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <v.icon className={`w-5 h-5 mb-3 ${selectedVibe === v.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{v.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Human Intent Blueprint</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your product vision (e.g. A premium fitness tracker with a nutrition vault)..."
              className="w-full flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 resize-none placeholder:text-slate-300 leading-relaxed"
            />
          </div>

          <button
            onClick={() => handleBuild(false)}
            disabled={isBuilding || !prompt}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
            {isBuilding ? 'Synthesizing...' : 'Launch Product'}
          </button>
        </div>
      </div>

      {/* Main Content Area: Viewer & Regeneration */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="glass bg-white rounded-[3rem] border border-slate-200/50 flex-1 flex flex-col overflow-hidden relative shadow-sm">
          
          <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                  activeTab === 'preview' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Reality Viewer
              </button>
              <button 
                onClick={() => setActiveTab('dna')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                  activeTab === 'dna' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> DNA Manifest
              </button>
            </div>
            {outputCode && (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowUpgradePanel(!showUpgradePanel)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    showUpgradePanel ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" /> 
                  {showUpgradePanel ? 'Regeneration Active' : 'Upgrade Product'}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 relative bg-slate-50">
            {!outputCode && !isBuilding ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner animate-pulse">
                  <Layout className="w-10 h-10 text-blue-400" />
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Portal Standing By</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Initialize Architect Shard to Materialize</p>
              </div>
            ) : isBuilding ? (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="relative mb-6">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <div className="absolute inset-0 m-auto w-4 h-4 bg-blue-600 rounded-full animate-ping"></div>
                </div>
                <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[11px] text-center">{buildStep}</p>
              </div>
            ) : activeTab === 'preview' ? (
              <iframe
                srcDoc={outputCode!}
                title="Product Preview"
                className="w-full h-full border-none bg-white animate-in fade-in duration-700"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 p-10 overflow-hidden">
                <pre className="mono text-[11px] text-blue-300 overflow-y-auto h-full custom-scrollbar leading-relaxed">
                  <code>{outputCode}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Upgrade / Regeneration Panel Overlay */}
          {showUpgradePanel && outputCode && !isBuilding && (
            <div className="absolute bottom-0 left-0 right-0 glass-dark bg-slate-900/90 backdrop-blur-2xl p-8 border-t border-white/10 animate-in slide-in-from-bottom-full duration-500 z-30">
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <History className="w-4 h-4" /> Iteration Engine
                  </h5>
                  <button onClick={() => setShowUpgradePanel(false)} className="text-white opacity-40 hover:opacity-100 transition-opacity">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={updatePrompt}
                    onChange={(e) => setUpdatePrompt(e.target.value)}
                    placeholder="Describe upgrade intent (e.g. Add a dark mode toggle or an analytics tab)..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:ring-4 focus:ring-blue-600/20"
                  />
                  <button 
                    onClick={() => handleBuild(true)}
                    disabled={!updatePrompt}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-700 transition-all disabled:opacity-30"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Regeneration cycles maintain all existing functionality with 100% logic integrity.</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar: Tagging & Securing */}
        {outputCode && (
          <div className="glass bg-white p-6 rounded-[2.5rem] border border-slate-200/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex-1 flex flex-col gap-3 w-full">
              <div className="flex items-center gap-4">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Meta-Tags</label>
                 <div className="flex flex-wrap gap-1.5">
                   {appTags.map(t => (
                     <span key={t} className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg border border-blue-100 flex items-center gap-1.5">
                       {t.toUpperCase()}
                       <button onClick={() => setAppTags(appTags.filter(tag => tag !== t))} className="p-0.5 hover:bg-blue-100 rounded-md"><X className="w-3 h-3" /></button>
                     </span>
                   ))}
                 </div>
              </div>
              <form onSubmit={addTag} className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add metadata (e.g. v1.0, alpha, prod)..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                />
                <button type="submit" className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md"><Plus className="w-4 h-4" /></button>
              </form>
            </div>
            
            <div className="flex gap-4 shrink-0">
               <button 
                onClick={handleSave}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
               >
                 <Save className="w-4 h-4" /> Secure Shard
               </button>
               <button 
                onClick={() => window.open('', '_blank')?.document.write(outputCode!)}
                className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
               >
                 <ExternalLink className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppBuilder;
