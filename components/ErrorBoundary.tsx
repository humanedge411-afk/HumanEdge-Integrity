
import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 shadow-xl shadow-red-600/5">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Neural Link Interrupted</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
              An unexpected exception occurred in the standalone logic core.
            </p>
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
              <p className="text-[9px] font-mono text-red-600 break-all leading-relaxed">
                {this.state.error?.message || 'Unknown integrity violation'}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            <RefreshCw className="w-4 h-4" />
            Re-Synchronize System
          </button>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;
