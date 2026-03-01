
import React, { useState } from 'react';
import { Gamepad2, Rocket, Loader2, RefreshCw, Layout, Layers, Box, Terminal, ChevronRight, MousePointer2, Move, Trash2, Cpu, Zap, Boxes, Sparkles, Target, Globe, Info, ShieldCheck, Save, Tag, Plus, X, ImageIcon } from 'lucide-react';
import { generateGameConcept, generateImage } from '../services/gemini';
import { AppView, VibeMode } from '../types';

// Added GameEngineProps to match App.tsx pass-through
interface GameEngineProps {
  onAssetSecured: (asset: any) => void;
  notify: (msg: string, type?: any) => void;
}

interface SceneAsset {
  id: string;
  typeId: string;
  name: string;
  x: number;
  y: number;
  icon: any;
}

const ASSET_LIBRARY = [
  { id: 'char_mesh', name: 'Sovereign Character', icon: Box, type: 'Static Mesh' },
  { id: 'env_shader', name: 'Global Shader', icon: Layers, type: 'Material' },
  { id: 'env_base', name: 'Canada Domain Base', icon: Globe, type: 'World Instance' },
  { id: 'dyn_light', name: 'Integrity Light', icon: Sparkles, type: 'Dynamic Light' },
  { id: 'audio_amb', name: 'Spatial Harmony', icon: Target, type: 'Spatial Sound' },
  { id: 'phys_vol', name: 'Mass Constraint', icon: Move, type: 'Collision Volume' },
  { id: 'ui_canvas', name: 'Citizen Interface', icon: Layout, type: 'Widget Component' },
  { id: 'logic_bp', name: 'Regeneration Node', icon: Terminal, type: 'Blueprint Script' },
];

const GameEngine: React.FC<GameEngineProps> = ({ onAssetSecured, notify }) => {
  const [genre, setGenre] = useState('');
  const [tweak, setTweak] = useState('');
  const [concept, setConcept] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'assets' | 'specs'>('blueprint');
  const [sceneAssets, setSceneAssets] = useState<SceneAsset[]>([]);

  // Tagging State
  const [tagInput, setTagInput] = useState('');
  const [gameTags, setGameTags] = useState<string[]>([]);

  const handleGenerate = async (isRefining: boolean = false) => {
    if (!genre) return;
    if (isRefining) setIsRegenerating(true);
    else setLoading(true);
    
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let lastError = '';

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        if (attempts > 1) notify(`Reality forge unstable. Auto-repairing (Attempt ${attempts}/${maxAttempts})...`, 'error');
        
        const result = await generateGameConcept(
          genre + (lastError ? ` | Fix previous error: ${lastError}` : ''), 
          isRefining ? concept : undefined, 
          isRefining ? tweak : undefined
        );

        if (result && result.title) {
          setConcept(result);
          if (isRefining) {
            notify(`Architecture regenerated: ${result.title}`);
            setTweak('');
          } else {
            notify(`Game architecture for ${genre} forged.`);
            setHeroImage(null);
          }
          success = true;
        } else {
          throw new Error("Incomplete architecture manifest.");
        }
      } catch (err: any) {
        lastError = err.message || 'Unknown neural fault';
        console.error(`Forge attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          notify("Reality forge failed after multiple attempts.", "error");
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    setLoading(false);
    setIsRegenerating(false);
  };

  const handleGenerateHeroImage = async () => {
    if (!concept) return;
    setIsGeneratingImage(true);
    try {
      const img = await generateImage(`Hero image for a ${genre} game titled "${concept.title}". ${concept.tagline}. ${concept.story}`, 'cyberpunk');
      setHeroImage(img);
      notify("Aesthetic shard materialized.");
    } catch (err) {
      console.error(err);
      notify("Visual materialization failed.", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const assetTypeId = e.dataTransfer.getData('assetTypeId');
    const assetType = ASSET_LIBRARY.find(a => a.id === assetTypeId);
    if (assetType) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSceneAssets([...sceneAssets, { 
        id: Math.random().toString(36).substr(2, 9), 
        typeId: assetType.id, 
        name: assetType.name, 
        icon: assetType.icon, 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      }]);
    }
  };

  const handleSaveProject = () => {
    if (!concept) return;
    onAssetSecured({
      name: concept.title,
      type: 'Game',
      module: AppView.GAME_ENGINE,
      tags: gameTags.length > 0 ? gameTags : [genre, 'forge']
    });
    setGameTags([]);
    setTagInput('');
  };

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !gameTags.includes(tag)) {
      setGameTags([...gameTags, tag]);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 glass p-8 rounded-3xl border border-slate-200 bg-white space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl text-white">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h4 className="text-slate-900 font-black uppercase tracking-tight text-sm">Architect</h4>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {['RPG', 'FPS', 'Sim', 'Sandbox'].map(g => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all text-left flex justify-between items-center group ${
                  genre === g ? 'bg-purple-600 border-purple-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {g} <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerate(false)}
            disabled={loading || !genre}
            className="w-full py-4 bg-purple-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-purple-600/10 hover:bg-purple-700 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Forge Reality'}
          </button>

          {concept && (
            <div className="pt-8 border-t border-slate-100 space-y-8">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} /> 
                  Regeneration Hub
                </h5>
                <textarea
                  placeholder="Describe refinements (e.g., 'Make it darker', 'Add multiplayer mechanics')..."
                  value={tweak}
                  onChange={(e) => setTweak(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/10 min-h-[100px] resize-none"
                />
                <button
                  onClick={() => handleGenerate(true)}
                  disabled={isRegenerating || !tweak}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] tracking-[0.2em] hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isRegenerating ? 'Regenerating...' : 'Apply Refinement'}
                </button>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> 
                  Aesthetic Shard
                </h5>
                {heroImage ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={heroImage} alt="Hero" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={handleGenerateHeroImage}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-black uppercase tracking-widest"
                    >
                      Regenerate Visual
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateHeroImage}
                    disabled={isGeneratingImage}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black uppercase text-[9px] tracking-widest hover:border-purple-300 hover:text-purple-600 transition-all flex flex-col items-center gap-2"
                  >
                    {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        Materialize Hero Image
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag className="w-3 h-3" /> Categorize Forge</h5>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {gameTags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 pl-2 pr-1 py-1 bg-purple-50 text-purple-600 text-[9px] font-black rounded-lg border border-purple-100">
                        {tag.toUpperCase()}
                        <button onClick={() => setGameTags(gameTags.filter(t => t !== tag))} className="p-0.5 hover:bg-purple-100 rounded-md">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <form onSubmit={addTag} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add tag..." 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600/10"
                    />
                    <button type="submit" className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                  <button 
                    onClick={handleSaveProject}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Secure Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {!concept && !loading ? (
            <div className="h-full min-h-[500px] glass rounded-[2.5rem] border border-slate-200 flex flex-col items-center justify-center bg-white">
              <Rocket className="w-16 h-16 text-purple-600/20 mb-6" />
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Enter The Forge</h4>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[500px] glass rounded-[2.5rem] border border-slate-200 flex flex-col items-center justify-center bg-white space-y-4">
              <RefreshCw className="w-10 h-10 text-purple-600 animate-spin" />
              <p className="text-[10px] font-black text-slate-900 uppercase">Colliding Particles...</p>
            </div>
          ) : (
            <div className="glass p-10 rounded-[2.5rem] border border-slate-200 bg-white space-y-8 min-h-[600px] flex flex-col">
               <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{concept.title}</h3>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">{concept.tagline}</p>
                  </div>
                  <div className="flex gap-2">
                    {['blueprint', 'assets', 'specs'].map((t: any) => (
                      <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
               </div>

               {activeTab === 'blueprint' ? (
                 <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Story Lattice</p>
                      <p className="text-xl text-slate-700 font-bold leading-relaxed italic">"{concept.story}"</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       {concept.mechanics.map((m: any, i: number) => (
                         <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-black text-slate-600 uppercase tracking-widest group hover:bg-white hover:border-purple-200 transition-all cursor-default flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-purple-600 group-hover:animate-ping"></div>
                           {m}
                         </div>
                       ))}
                    </div>
                 </div>
               ) : activeTab === 'specs' ? (
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Stack</p>
                      <div className="flex flex-wrap gap-2">
                        {concept.technicalStack.map((tech: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Target Audience</p>
                      <p className="text-sm font-bold text-slate-700">{concept.targetAudience}</p>
                    </div>
                    <div className="space-y-4 col-span-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Monetization Strategy</p>
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <p className="text-sm font-bold text-emerald-800">{concept.monetization}</p>
                      </div>
                    </div>
                  </div>
                </div>
               ) : (
                 <div className="flex-1 grid grid-cols-4 gap-6 animate-in fade-in zoom-in-95">
                    <div className="col-span-1 space-y-2">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Toolbox</p>
                      {ASSET_LIBRARY.map((a, idx) => (
                        <div 
                          key={a.id} 
                          className="relative group animate-in fade-in zoom-in-95 fill-mode-both"
                          style={{ animationDelay: `${idx * 50}ms`, animationDuration: '400ms' }}
                        >
                          <div 
                            draggable 
                            onDragStart={(e) => e.dataTransfer.setData('assetTypeId', a.id)} 
                            className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 cursor-grab hover:bg-slate-200 transition-colors"
                          >
                            <a.icon className="w-4 h-4 text-purple-600" />
                            <span className="text-[10px] font-black text-slate-700 uppercase">{a.name}</span>
                          </div>
                          
                          {/* Toolbox Asset Tooltip */}
                          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[60] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <div className="glass bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] min-w-[180px]">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <ShieldCheck className="w-2 h-2" /> Verified
                                </span>
                                <Info className="w-3 h-3 text-slate-300" />
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Asset Name</p>
                                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{a.name}</p>
                                </div>
                                <div className="h-[1px] w-full bg-slate-100"></div>
                                <div>
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Module Type</p>
                                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">{a.type}</p>
                                </div>
                              </div>
                            </div>
                            <div className="w-3 h-3 bg-white border-l border-b border-slate-200 absolute left-[-6px] top-1/2 -translate-y-1/2 rotate-45"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div 
                      className="col-span-3 bg-slate-100 rounded-3xl border border-dashed border-slate-300 relative overflow-hidden shadow-inner"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      {sceneAssets.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                          <MousePointer2 className="w-12 h-12 mb-4" />
                          <p className="text-xs font-black uppercase tracking-widest">Drag and drop assets into reality</p>
                        </div>
                      )}
                      {sceneAssets.map(a => {
                        const assetDef = ASSET_LIBRARY.find(lib => lib.id === a.typeId);
                        return (
                          <div 
                            key={a.id} 
                            className="absolute p-3 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col items-center group cursor-pointer hover:border-purple-400 transition-all active:scale-95 animate-in fade-in zoom-in-90 duration-300" 
                            style={{ left: a.x - 20, top: a.y - 20 }}
                          >
                            <a.icon className="w-5 h-5 text-purple-600" />
                            <span className="text-[8px] font-black text-slate-400 mt-1 uppercase">{a.name}</span>
                            
                            {/* Scene Asset Tooltip */}
                            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-[60] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                              <div className="glass bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] min-w-[160px] text-center">
                                <div className="flex justify-center mb-2">
                                  <div className="p-2 bg-purple-50 rounded-lg">
                                    <a.icon className="w-4 h-4 text-purple-600" />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-tight">{a.name}</p>
                                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{assetDef?.type || 'Generic Asset'}</p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
                                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Integrity Valid</span>
                                </div>
                              </div>
                              <div className="w-3 h-3 bg-white border-r border-b border-slate-200 absolute left-1/2 -bottom-[6px] -translate-x-1/2 rotate-45"></div>
                            </div>
                            <button onClick={() => setSceneAssets(sceneAssets.filter(sa => sa.id !== a.id))} className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameEngine;
