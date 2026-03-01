
import React, { useState } from 'react';
import { Code2, Zap, CheckCircle, Loader2, RefreshCw, Layout, Monitor, Smartphone, Copy } from 'lucide-react';
import { generateCodeSolution, refineCode } from '../services/gemini';

// Added CodeRepairProps to match App.tsx pass-through
interface CodeRepairProps {
  onAssetSecured: (asset: any) => void;
  notify: (msg: string, type?: any) => void;
}

const CodeRepair: React.FC<CodeRepairProps> = ({ onAssetSecured, notify }) => {
  const [problem, setProblem] = useState('');
  const [tweak, setTweak] = useState('');
  const [solution, setSolution] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [showTweak, setShowTweak] = useState(false);

  const handleFix = async (isRefining: boolean = false) => {
    const context = isRefining ? tweak : problem;
    if (!context) return;
    setIsFixing(true);
    
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let lastError = '';

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        if (attempts > 1) notify(`Integrity check failed. Auto-regenerating (Attempt ${attempts}/${maxAttempts})...`, 'error');
        
        let code = '';
        if (isRefining && solution) {
          code = await refineCode(solution, tweak + (lastError ? `\nFIX ERROR: ${lastError}` : ''));
        } else {
          code = await generateCodeSolution(problem + (lastError ? `\nFIX ERROR: ${lastError}` : ''));
        }

        if (code && code.length > 50) { // Basic sanity check
          setSolution(code);
          if (isRefining) {
            setTweak('');
            setShowTweak(false);
          }
          success = true;
          notify(attempts > 1 ? "Integrity restored. Product materialized." : "Foundation materialized successfully.");
        } else {
          throw new Error("Incomplete materialization detected.");
        }
      } catch (err: any) {
        lastError = err.message || 'Unknown neural fault';
        console.error(`Attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          notify("Regeneration cycle failed after multiple attempts.", "error");
        }
      }
    }
    setIsFixing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-8 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-2xl">
              <Code2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Regeneration Hub</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">HumanEdge Professional Build Core</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Build Specs</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your web product foundations..."
              className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 mono focus:outline-none focus:ring-2 focus:ring-emerald-600/10 font-bold resize-none"
            />
            <button
              onClick={() => handleFix(false)}
              disabled={isFixing || !problem}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
            >
              {isFixing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isFixing ? 'Synthesizing...' : 'Materialize Foundation'}
            </button>
          </div>

          <div className="glass rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden h-[500px] flex flex-col">
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Integrity Verified Output</span>
               {solution && (
                 <button onClick={() => { navigator.clipboard.writeText(solution); notify("Code copied to clipboard."); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                   <Copy className="w-4 h-4 text-slate-400" />
                 </button>
               )}
            </div>
            <div className="flex-1 p-6 overflow-y-auto mono text-xs text-slate-700 font-bold whitespace-pre-wrap leading-relaxed">
               {!solution && !isFixing && (
                 <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <Layout className="w-16 h-16 mb-4" />
                    <p className="font-black uppercase tracking-widest">Awaiting Context</p>
                 </div>
               )}
               {solution}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRepair;
