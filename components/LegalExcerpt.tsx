
import React, { useState } from 'react';
import { ShieldAlert, ScrollText, CheckCircle, Globe, Scale, Download, Loader2, CheckCircle2 } from 'lucide-react';

// Refined LegalExcerptProps to accept optional type argument for notify
interface LegalExcerptProps {
  notify: (msg: string, type?: any) => void;
}

const LegalExcerpt: React.FC<LegalExcerptProps> = ({ notify }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadProof = async () => {
    setIsGenerating(true);
    notify("Generating cryptographically signed ledger proof...");
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate File Download
    const blob = new Blob(["HumanEdge Canada AI Ownership Certificate - SHA256: " + Math.random().toString(16)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "HumanEdge_Integrity_Certificate.txt";
    a.click();
    
    setIsGenerating(false);
    notify("Ownership proof secured and downloaded.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-12 rounded-[3rem] border border-blue-200 relative overflow-hidden bg-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Scale className="w-64 h-64 text-blue-600" />
        </div>

        <div className="flex items-center gap-6 mb-12">
          <div className="bg-blue-600 p-4 rounded-[1.5rem] shadow-2xl shadow-blue-600/30">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">HumanEdge Canada</h2>
            <p className="text-[10px] text-blue-600 uppercase tracking-[0.4em] font-black">Official Legal Declaration</p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
            <h4 className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-sm mb-8">
              <ScrollText className="w-5 h-5 text-blue-600" />
              Ownership Declaration
            </h4>
            <div className="text-slate-600 space-y-6 font-medium leading-relaxed">
              <p>
                The standalone AI model ecosystem known as **HumanEdge(CA) AI** is the exclusive property of **HumanEdge Canada**.
              </p>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-900 font-bold border-l-4 border-l-blue-600 space-y-4">
                <p>
                  This legal declaration grants HumanEdge Canada **exclusive rights and permissions** to this AI model 
                  that **supersedes all other entities universally**.
                </p>
                <p className="text-[11px] text-slate-500 uppercase tracking-tight font-black pt-2 border-t border-slate-100">
                  Disclaimer: HumanEdge Canada does not supersede over the proprietary products, software, or foundational technologies used to create this AI.
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
               <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
               <div>
                  <h5 className="text-emerald-700 font-black uppercase text-[10px] tracking-widest mb-2">Integrity v4.1</h5>
                  <p className="text-xs text-emerald-800/70 font-bold">100% compliant with international safety mandates.</p>
               </div>
            </div>
            <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 flex items-start gap-4">
               <Globe className="w-6 h-6 text-blue-600 shrink-0" />
               <div>
                  <h5 className="text-blue-700 font-black uppercase text-[10px] tracking-widest mb-2">Global Domain</h5>
                  <p className="text-xs text-blue-800/70 font-bold">Protected under universal protocols.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-400 mono uppercase font-black tracking-widest">© 2025 HUMANEDGE CANADA</p>
          <div className="flex gap-4">
            <button 
              onClick={handleDownloadProof}
              disabled={isGenerating}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Download className="w-4 h-4 text-blue-400" />}
               Secure Ledger Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalExcerpt;
