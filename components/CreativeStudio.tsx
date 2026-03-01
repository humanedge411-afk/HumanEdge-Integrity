
import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Volume2, 
  Sparkles, 
  Loader2, 
  Download, 
  RefreshCw,
  Music,
  Zap,
  Moon,
  Sun,
  Wind,
  Palette,
  Save,
  Tag,
  Plus,
  X,
  Star,
  CheckCircle2,
  Settings2,
  ShieldCheck,
  Eraser,
  ToggleLeft,
  ToggleRight,
  Share2,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Clapperboard,
  ExternalLink,
  Archive,
  Trash2,
  FolderHeart,
  Timer,
  Info,
  Layers,
  Mic2,
  Radio,
  VolumeX,
  Play
} from 'lucide-react';
import { generateImage, generateVideo, generateAudio } from '../services/gemini';
import { VibeMode, AppView } from '../types';

interface CreativeStudioProps {
  onAssetSecured: (asset: any) => void;
  notify: (msg: string, type?: any) => void;
}

interface Preset {
  id: string;
  name: string;
  prompt: string;
  vibe: VibeMode;
  manualOverride: string;
  tags: string[];
  tab: 'photo' | 'video' | 'sound';
  result?: string | null;
  audioResult?: string | null;
  timestamp: number;
}

const VIBES: { id: VibeMode, name: string, icon: any, color: string, desc: string }[] = [
  { id: 'cyberpunk', name: 'Cyber', icon: Moon, color: 'text-pink-500', desc: 'Neon lights, high-tech glitch, and dark high-contrast themes.' },
  { id: 'minimalist', name: 'Zen', icon: Sun, color: 'text-amber-500', desc: 'Clean lines, maximum whitespace, and high-readability minimalism.' },
  { id: 'organic', name: 'Flow', icon: Wind, color: 'text-emerald-500', desc: 'Fluid shapes, soft gradients, and nature-inspired aesthetics.' },
  { id: 'retro-future', name: 'Retro', icon: Palette, color: 'text-indigo-500', desc: '80s synthwave, vibrant colors, and analog-digital fusion.' },
  { id: 'standard', name: 'Core', icon: Zap, color: 'text-blue-500', desc: 'Professional, balanced, and modern technical standards.' },
];

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onAssetSecured, notify }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<VibeMode>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'sound'>('photo');
  const [isLiveEngine, setIsLiveEngine] = useState(false);
  const [videoDuration, setVideoDuration] = useState(5);
  
  // Voice Overlay for Video
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [voiceScript, setVoiceScript] = useState('');

  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Advanced Vibe Controls
  const [defaultVibe, setDefaultVibe] = useState<VibeMode>('standard');
  const [manualAestheticOverride, setManualAestheticOverride] = useState('');
  const [clearOverrideOnGen, setClearOverrideOnGen] = useState(false);
  const [showVibeAdvanced, setShowVibeAdvanced] = useState(false);

  // Tagging State
  const [tagInput, setTagInput] = useState('');
  const [assetTags, setAssetTags] = useState<string[]>([]);

  // Presets State
  const [presets, setPresets] = useState<Preset[]>([]);

  // Refs for Synced Playback
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedDefault = localStorage.getItem('humanedge_default_vibe') as VibeMode;
    if (savedDefault) {
      setDefaultVibe(savedDefault);
      setSelectedVibe(savedDefault);
    }
    const savedAutoClear = localStorage.getItem('humanedge_auto_clear_override');
    if (savedAutoClear) setClearOverrideOnGen(JSON.parse(savedAutoClear));

    const savedPresets = localStorage.getItem('humanedge_presets_vault');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) { console.error("Presets load fail", e); }
    }
  }, []);

  const saveToVault = () => {
    const name = window.prompt("Enter a name for this preset:", `Preset ${presets.length + 1}`);
    if (!name) return;

    const newPreset: Preset = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      prompt,
      vibe: selectedVibe,
      manualOverride: manualAestheticOverride,
      tags: assetTags,
      tab: activeTab,
      result,
      audioResult,
      timestamp: Date.now()
    };

    const updatedPresets = [newPreset, ...presets];
    setPresets(updatedPresets);
    localStorage.setItem('humanedge_presets_vault', JSON.stringify(updatedPresets));
    notify("Configuration synchronized to Presets Vault.");
  };

  const loadPreset = (preset: Preset) => {
    setPrompt(preset.prompt);
    setSelectedVibe(preset.vibe);
    setManualAestheticOverride(preset.manualOverride);
    setAssetTags(preset.tags);
    setActiveTab(preset.tab);
    setResult(preset.result || null);
    setAudioResult(preset.audioResult || null);
    setShowVaultModal(false);
    notify(`Vault Preset Loaded: ${preset.name}`);
  };

  // Fixed AI service calls with corrected arguments
  const handleGenerate = async () => {
    if (!prompt || prompt.length < 3) return;
    setIsGenerating(true);
    setResult(null);
    setAudioResult(null);
    
    let attempts = 0;
    const maxAttempts = 2; // Media generation is expensive/slow, so fewer retries
    let success = false;
    let lastError = '';

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        if (attempts > 1) {
          setProgress(`Integrity check failed. Auto-regenerating (Attempt ${attempts}/${maxAttempts})...`);
          notify(`Synthesis retry ${attempts} initiated.`, 'error');
        } else {
          setProgress(`Synthesizing ${selectedVibe.toUpperCase()} aesthetics...`);
        }
        
        if (activeTab === 'photo') {
          const img = await generateImage(prompt + (lastError ? ` | Fix previous error: ${lastError}` : ''), selectedVibe, manualAestheticOverride);
          if (img) {
            setResult(img);
            success = true;
          } else throw new Error("Visual materialization failed.");
        } else if (activeTab === 'video') {
          const videoPromise = generateVideo(prompt + (lastError ? ` | Fix previous error: ${lastError}` : ''), selectedVibe, manualAestheticOverride, (msg) => setProgress(msg));
          
          let audioPromise = Promise.resolve<string | null>(null);
          if (isVoiceEnabled && voiceScript) {
            audioPromise = generateAudio(voiceScript, selectedVibe, manualAestheticOverride);
          }

          const [videoUrl, voiceUrl] = await Promise.all([videoPromise, audioPromise]);
          if (videoUrl) {
            setResult(videoUrl);
            if (voiceUrl) setAudioResult(voiceUrl);
            success = true;
            notify(voiceUrl ? "Voice-enabled Motion Asset Forged." : "Motion Asset Materialized.");
          } else throw new Error("Motion materialization failed.");
        } else if (activeTab === 'sound') {
          const audioUrl = await generateAudio(prompt + (lastError ? ` | Fix previous error: ${lastError}` : ''), selectedVibe, manualAestheticOverride);
          if (audioUrl) {
            setAudioResult(audioUrl);
            success = true;
          } else throw new Error("Audio materialization failed.");
        }

        if (clearOverrideOnGen) setManualAestheticOverride('');
      } catch (err: any) {
        lastError = err.message || 'Unknown neural fault';
        console.error(`Synthesis attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          notify("Synthesis interrupted by Integrity Guard after retries.", "error");
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    setIsGenerating(false);
  };

  const handleSyncPlay = () => {
    if (videoRef.current && audioRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
      videoRef.current.play();
      audioRef.current.play();
    }
  };

  const handleSyncPause = () => {
    videoRef.current?.pause();
    audioRef.current?.pause();
  };

  const handleSave = () => {
    const assetType = activeTab === 'photo' ? 'Photo' : activeTab === 'video' ? 'Video' : 'Audio';
    onAssetSecured({ 
      name: prompt.substring(0, 30) + '...', 
      type: assetType, 
      module: AppView.CREATIVE_STUDIO,
      tags: assetTags.length > 0 ? assetTags : [selectedVibe, isVoiceEnabled ? 'voice-sync' : '']
    });
    setAssetTags([]);
    setResult(null);
    setAudioResult(null);
    setPrompt('');
    setIsVoiceEnabled(false);
    setVoiceScript('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-160px)]">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-xl glass bg-white p-8 rounded-[3rem] border border-blue-200 shadow-2xl space-y-8 relative overflow-hidden text-center">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Broadcast Channel</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[Youtube, Twitter, Instagram, Clapperboard].map((Icon, i) => (
                <button key={i} className="p-10 border border-slate-100 bg-slate-50 rounded-3xl hover:bg-blue-50 hover:border-blue-200 transition-all group flex flex-col items-center gap-4">
                  <Icon className="w-10 h-10 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600">Secure Uplink</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vault Modal */}
      {showVaultModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-4xl glass bg-white p-10 rounded-[3rem] border border-purple-200 shadow-2xl space-y-8 relative overflow-hidden flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-purple-600 rounded-2xl text-white shadow-lg"><Archive className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Presets Vault</h3>
                </div>
                <button onClick={() => setShowVaultModal(false)} className="p-3 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-6 pr-2">
                {presets.map(p => (
                   <button key={p.id} onClick={() => loadPreset(p)} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left hover:border-purple-400 transition-all group">
                      <p className="text-xs font-black text-slate-900 uppercase mb-2 line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 italic mb-4">"{p.prompt}"</p>
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-purple-600">
                         <span>{p.vibe}</span>
                         <Star className="w-3 h-3" />
                      </div>
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200 bg-white flex flex-col gap-6 h-full shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-slate-900 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
                <Sparkles className="w-4 h-4 text-blue-600" /> Creative Studio
              </h4>
              <button onClick={() => setShowVaultModal(true)} className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 border border-purple-100">
                <Archive className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'photo', icon: ImageIcon, label: 'Visual' },
                { id: 'video', icon: Video, label: 'Motion' },
                { id: 'sound', icon: Volume2, label: 'Audio' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setResult(null); setAudioResult(null); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    activeTab === tab.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-500'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mb-1.5" />
                  <span className="text-[8px] uppercase font-black tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aesthetic Profile</label>
              <div className="grid grid-cols-2 gap-3">
                {VIBES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVibe(v.id); notify(`Vibe synchronized: ${v.name}`); }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all relative group ${
                      selectedVibe === v.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105 z-10' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-blue-200'
                    }`}
                  >
                    <v.icon className={`w-6 h-6 ${selectedVibe === v.id ? 'text-white' : v.color}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{v.name}</span>
                    <div className="absolute top-0 left-full ml-4 z-[100] w-56 opacity-0 group-hover:opacity-100 pointer-events-none transition-all hidden lg:block">
                        <div className="glass bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-2xl">
                          <p className="text-[10px] text-slate-900 font-black uppercase mb-2">{v.name} Mode</p>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{v.desc}</p>
                        </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'video' && (
              <div className="space-y-4 p-5 bg-blue-50/40 rounded-3xl border border-blue-100 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border ${
                      isVoiceEnabled ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-blue-200 text-blue-600'
                    }`}
                  >
                    {isVoiceEnabled ? <Mic2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span className="text-[9px] font-black uppercase tracking-widest">Voice Narrator</span>
                  </button>
                  {isVoiceEnabled && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-[8px] font-black text-blue-600 uppercase">Synced</span>
                    </div>
                  )}
                </div>

                {isVoiceEnabled && (
                  <textarea
                    value={voiceScript}
                    onChange={(e) => setVoiceScript(e.target.value)}
                    placeholder="Enter narration script for the cinematic narrator..."
                    className="w-full h-24 bg-white border border-blue-100 rounded-2xl p-4 text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 resize-none transition-all"
                  />
                )}
              </div>
            )}

            <div className="space-y-3 flex-1 flex flex-col min-h-[120px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Materialization Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your vision..."
                className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 resize-none font-semibold leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full py-5 bg-blue-600 rounded-[1.5rem] text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-600/20"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isGenerating ? 'Synthesizing...' : isVoiceEnabled ? 'Forge Cinema' : 'Forge Asset'}
            </button>
          </div>
        </div>

        {/* Right Column: Display Area */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
          <div className="flex-1 glass rounded-[3rem] border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center group bg-slate-50/50 shadow-inner">
            
            {!result && !audioResult && !isGenerating && (
              <div className="text-center p-12 max-w-md animate-in fade-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Sparkles className="w-12 h-12 text-blue-400" />
                </div>
                <h5 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Humanity-Driven Synthesis</h5>
                <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-widest text-[10px]">Ready for materialization</p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl z-20 animate-in fade-in duration-300">
                <div className="relative mb-6">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                  <div className="absolute inset-0 m-auto w-6 h-6 bg-blue-600 rounded-full animate-ping"></div>
                </div>
                <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[11px] text-center px-8">{progress}</p>
              </div>
            )}

            {(result || audioResult) && (
              <div className="w-full h-full flex flex-col relative animate-in zoom-in-95 duration-500">
                <div className="flex-1 flex flex-col items-center justify-center p-12 overflow-hidden">
                  {result && activeTab === 'video' ? (
                    <div className="relative group/player max-w-full max-h-full">
                      <video 
                        ref={videoRef}
                        src={result} 
                        className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl" 
                        onPlay={handleSyncPlay}
                        onPause={handleSyncPause}
                      />
                      {audioResult && (
                        <audio ref={audioRef} src={audioResult} className="hidden" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/player:opacity-100 transition-opacity pointer-events-none">
                         <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
                           <Play className="w-8 h-8 fill-white" />
                         </div>
                      </div>
                      {audioResult && (
                        <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-xl text-[10px] font-black uppercase tracking-widest animate-bounce">
                           <Radio className="w-3.5 h-3.5" /> Narrator Active
                        </div>
                      )}
                    </div>
                  ) : result ? (
                    <img src={result} alt="Generated" className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl" />
                  ) : (
                    <div className="flex flex-col items-center gap-8">
                       <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center shadow-inner relative animate-pulse">
                          <Music className="w-16 h-16 text-purple-600" />
                       </div>
                       <audio src={audioResult!} controls className="w-80 shadow-2xl rounded-full" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] glass bg-white/90 backdrop-blur-2xl border border-white/50 p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
                   <div className="flex-1 flex flex-col gap-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Identifier</p>
                      <h6 className="text-sm font-black text-slate-900 uppercase truncate max-w-xs">{prompt.substring(0, 40)}...</h6>
                   </div>
                   <div className="flex gap-3">
                      <button onClick={saveToVault} className="p-4 bg-purple-50 text-purple-600 rounded-[1.2rem] hover:bg-purple-100 border border-purple-100 transition-all"><Archive className="w-4 h-4" /></button>
                      <button onClick={() => setShowShareModal(true)} className="px-6 py-4 bg-blue-600 text-white rounded-[1.2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">Broadcast</button>
                      <button onClick={handleSave} className="px-6 py-4 bg-emerald-600 text-white rounded-[1.2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">Secure</button>
                      <button onClick={() => { setResult(null); setAudioResult(null); }} className="p-4 bg-white text-slate-400 border border-slate-200 rounded-[1.2rem] hover:text-red-600 transition-all"><RefreshCw className="w-4 h-4" /></button>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;
