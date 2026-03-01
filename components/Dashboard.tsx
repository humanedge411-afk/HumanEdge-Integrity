
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
// Fix: Added CheckCircle2 to lucide-react imports
import { Cpu, Globe, Zap, ShieldCheck, Activity, Server, Database, HardDrive, Binary, FileText, Tag, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ProjectAsset } from '../types';

interface DashboardProps {
  assets: ProjectAsset[];
}

const performanceData = [
  { name: '00:00', speed: 4500, accuracy: 100 },
  { name: '04:00', speed: 4800, accuracy: 100 },
  { name: '08:00', speed: 5200, accuracy: 100 },
  { name: '12:00', speed: 6100, accuracy: 100 },
  { name: '16:00', speed: 5900, accuracy: 100 },
  { name: '20:00', speed: 6500, accuracy: 100 },
];

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Metric Grid - Clean Landscape */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Integrity Rating', value: '100.00%', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'Neural Bandwidth', value: '1.2 ExaFLOPS', icon: Cpu, color: 'text-blue-500' },
          { label: 'Secured Assets', value: assets.length.toString(), icon: Database, color: 'text-purple-500' },
          { label: 'Llama-4 Logic', value: 'Standalone', icon: Binary, color: 'text-slate-800' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-110">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{stat.label}</p>
            </div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
            <div className="mt-4 flex items-center gap-2">
               <TrendingUp className="w-3 h-3 text-emerald-500" />
               <span className="text-[9px] font-black text-emerald-600 uppercase">System Optimized</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Operational Velocity Stream
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time throughput analysis</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                     <span className="text-[9px] font-black text-slate-500 uppercase">Throughput</span>
                  </div>
               </div>
            </div>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.1)', background: '#fff' }}
                    itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSpeed)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-1000">
                <ShieldCheck className="w-48 h-48 fill-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-400" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Global Sentinel</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-4">OPTIMIZED</h3>
                <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase">
                  Current integrity index matches peak standalone training benchmarks. Standalone Llama-4 emulation is operating at maximum fidelity.
                </p>
                <div className="mt-12 flex items-center gap-4">
                   <div className="flex-1 h-[1px] bg-white/10"></div>
                   <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               <FileText className="w-4 h-4 text-slate-800" /> Audit Ledger
             </h4>
             <div className="space-y-4">
                {assets.slice(0, 3).map(asset => (
                  <div key={asset.id} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <Tag className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-slate-900 uppercase truncate max-w-[120px]">{asset.name}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase">{asset.type}</p>
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-slate-300 mono">{new Date(asset.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
                {assets.length === 0 && (
                   <div className="py-10 text-center opacity-30">
                      <p className="text-[10px] font-black uppercase tracking-widest">Vault Sealed</p>
                   </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
