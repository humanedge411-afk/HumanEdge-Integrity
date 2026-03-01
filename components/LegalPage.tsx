
import React from 'react';
import { Shield, Scale, FileText, Info, CheckCircle2 } from 'lucide-react';

const LegalPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass p-16 bg-white rounded-[4rem] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col items-center text-center space-y-8 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        
        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
          <Shield className="w-12 h-12" />
        </div>

        <div className="max-w-3xl space-y-6">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
            LEGAL <span className="text-blue-600">MANIFEST</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Official legal documentation and ownership protocols for the HumanEdge(CA) Neural Ecosystem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-12 bg-white rounded-[3rem] border border-slate-200/50 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ownership & Rights</h3>
          </div>
          
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
              "All authorizations, legal rights, and permissions associated with this AI platform, its materialization shards, and neural logic belong exclusively to HumanEdge Canada (Universal) Products and Services and HumanEdge Canada Core only."
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Ownership Protocol Active (2026)</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intellectual Property</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              The architecture, design patterns, and standalone Llama-4 emulation logic are proprietary assets of HumanEdge Canada Core. Any unauthorized reproduction or neural extraction is strictly prohibited under HE-2026 Integrity Protocols.
            </p>
          </div>
        </div>

        <div className="glass p-12 bg-white rounded-[3rem] border border-slate-200/50 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Terms of Authorization</h3>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Authorized Entry', desc: 'Access to the Root Core is restricted to verified creators with valid HumanEdge Canada Core credentials.' },
              { title: 'Neural Integrity', desc: 'Users are responsible for the ethical materialization of assets within the ecosystem.' },
              { title: 'Data Sovereignty', desc: 'All data processed via Omni Core remains under the jurisdiction of HumanEdge Canada Core.' },
              { title: 'Liability Limitation', desc: 'HumanEdge Canada Core is not liable for reality-distortions caused by ungrounded neural prompts.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 group-hover:scale-150 transition-transform"></div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">{item.title}</h5>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <Info className="w-4 h-4" />
              Last Updated: February 2026 | HE-2026-v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
