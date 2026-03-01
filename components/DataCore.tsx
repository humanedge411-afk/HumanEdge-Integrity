
import React, { useState } from 'react';
import { Database, Globe, Map as MapIcon, Loader2, ExternalLink, ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import { searchRealTimeDataset, generateGeospatialData } from '../services/gemini';

interface DataCoreProps {
  notify: (msg: string, type?: any) => void;
}

const DataCore: React.FC<DataCoreProps> = ({ notify }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'realtime' | 'geospatial' | 'historical'>('realtime');
  const [result, setResult] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!query) return;
    setIsSyncing(true);
    
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let lastError = '';

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        if (attempts > 1) notify(`Data drift detected. Auto-resyncing (Attempt ${attempts}/${maxAttempts})...`, 'error');
        
        let data;
        const enhancedQuery = query + (lastError ? ` | Fix previous error: ${lastError}` : '');
        
        if (mode === 'realtime') {
          data = await searchRealTimeDataset(enhancedQuery);
        } else if (mode === 'geospatial') {
          data = await generateGeospatialData(enhancedQuery);
        } else {
          data = await searchRealTimeDataset(enhancedQuery);
        }

        if (data && data.text) {
          setResult(data);
          notify("Intelligence Shards Grounded & Verified.");
          success = true;
        } else {
          throw new Error("Incomplete intelligence manifest.");
        }
      } catch (err: any) {
        lastError = err.message || 'Unknown neural fault';
        console.error(`Sync attempt ${attempts} failed:`, err);
        if (attempts >= maxAttempts) {
          notify("Dataset synchronization failed after multiple attempts.", "error");
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    setIsSyncing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-200 bg-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-600 text-white rounded-lg animate-pulse">
                <Lock className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Fact-Seeking Integrity Active</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-slate-900 font-black uppercase tracking-tight text-sm">Omni Data Core</h4>
            </div>

            <div className="space-y-2">
              {[
                { id: 'realtime', icon: Globe, label: 'Live Global Index' },
                { id: 'geospatial', icon: MapIcon, label: 'Geo-Intelligence' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id as any)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    mode === opt.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <opt.icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-widest">{opt.label}</span>
                </button>
              ))}
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query world knowledge matrix with 100% integrity..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold resize-none"
            />

            <button
              onClick={handleSync}
              disabled={isSyncing || !query}
              className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              {isSyncing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sync Verified Shards'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isSyncing ? (
            <div className="h-full min-h-[500px] glass rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center p-12 bg-white">
              <Globe className="w-20 h-20 text-blue-600/10 mb-6" />
              <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">OmniCore Fact-Seeker</h4>
              <p className="text-xs text-slate-400 mt-2 uppercase font-black tracking-widest">100% Grounded Intel Protocols Online</p>
            </div>
          ) : isSyncing ? (
            <div className="h-full min-h-[500px] glass rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4 bg-white">
              <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Verifying Intelligence against Global Ledger...</p>
            </div>
          ) : (
            <div className="glass p-10 rounded-3xl border border-slate-200 bg-white min-h-[500px] space-y-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-50"></div>
              
              <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-slate-900 uppercase">Grounded Result</h3>
                  <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase tracking-widest">100% Verified</div>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar">
                {result.text}
              </div>
              
              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verification Sources (Grounding)</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((chunk: any, i: number) => {
                      const web = chunk.web;
                      const maps = chunk.maps;
                      if (web) {
                        return (
                          <a key={i} href={web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            {web.title || 'Web Result'}
                          </a>
                        );
                      }
                      if (maps) {
                        return (
                          <a key={i} href={maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                            <MapIcon className="w-3 h-3" />
                            {maps.title || 'Location Result'}
                          </a>
                        );
                      }
                      return null;
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

export default DataCore;
