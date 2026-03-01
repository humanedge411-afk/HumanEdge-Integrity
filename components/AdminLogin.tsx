
import React, { useState } from 'react';
import { Key, ShieldCheck, Lock, ArrowRight, Loader2, Cpu } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(false);

    // Simulated Creator Key Verification
    setTimeout(() => {
      if (passkey === 'HUMANEDGE-CREATOR-2025') {
        onSuccess();
      } else {
        setError(true);
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md p-10 glass bg-white rounded-[2.5rem] border border-blue-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-600/20">
            <Cpu className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Integrity Admin Login</h3>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.3em] mt-1">cn2025-IntegrityADMINLogin/component/Adminlogin.hec#1</p>
          </div>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter cn2025 Creator Passkey"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-2 ${
                  error ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:ring-blue-600/10'
                }`}
              />
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center">Invalid Integrity Credentials</p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating || !passkey}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {isAuthenticating ? 'Verifying Integrity...' : 'Authorize cn2025 Access'}
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Return to User Hub
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 w-full">
            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 font-bold uppercase mono">
               <Key className="w-3 h-3" />
               Integrity Check: ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
