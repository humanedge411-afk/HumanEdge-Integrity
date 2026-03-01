
import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Wrench, 
  Gamepad2, 
  Zap, 
  Globe, 
  ShieldCheck,
  Cpu,
  RefreshCw,
  Activity,
  Eye,
  Database,
  User,
  ShieldAlert,
  Search,
  X,
  FileText,
  ImageIcon,
  Play,
  Music,
  Code,
  Gamepad,
  Rocket,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  Lock,
  Shield,
  ChevronDown,
  LayoutGrid,
  Settings as SettingsIcon,
  Bell,
  Menu,
  Command,
  Scale,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { AppView, ProjectAsset, SubscriptionTier } from './types';
import Dashboard from './components/Dashboard';
import CreativeStudio from './components/CreativeStudio';
import CodeRepair from './components/CodeRepair';
import GameEngine from './components/GameEngine';
import FraudDetection from './components/FraudDetection';
import DataCore from './components/DataCore';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import AppBuilder from './components/AppBuilder';
import ChatAssistant from './components/ChatAssistant';
import UserPortal from './components/UserPortal';
import LegalPage from './components/LegalPage';
import SystemSettings from './components/SystemSettings';
import SubscriptionPlans from './components/SubscriptionPlans';
import ErrorBoundary from './components/ErrorBoundary';

const INITIAL_ASSETS: ProjectAsset[] = [
  { id: '1', name: 'Cyberpunk Cityscape 4K', type: 'Photo', module: AppView.CREATIVE_STUDIO, timestamp: Date.now() - 3600000, tags: ['cyber', 'neon', '4k'] },
  { id: '2', name: 'Ambient Synth Loop v1', type: 'Audio', module: AppView.CREATIVE_STUDIO, timestamp: Date.now() - 7200000, tags: ['synth', 'lofi'] },
  { id: '3', name: 'Secure RPG Blueprint', type: 'Game', module: AppView.GAME_ENGINE, timestamp: Date.now() - 10800000, tags: ['rpg', 'logic'] },
  { id: '4', name: 'Auth Module Regenerated', type: 'Code', module: AppView.CODE_REPAIR, timestamp: Date.now() - 14400000, tags: ['security', 'auth'] },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.USER_PORTAL);
  const [isInitializing, setIsInitializing] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [assets, setAssets] = useState<ProjectAsset[]>(INITIAL_ASSETS);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 1500);
    
    // Fetch initial subscription state from backend
    fetch('/api/subscription')
      .then(res => res.json())
      .then(data => {
        if (data.tier) setSubscriptionTier(data.tier as SubscriptionTier);
      })
      .catch(err => console.error('Failed to fetch subscription:', err));

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const addAsset = (asset: Omit<ProjectAsset, 'id' | 'timestamp'>) => {
    const newAsset: ProjectAsset = {
      ...asset,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setAssets(prev => [newAsset, ...prev]);
    notify(`Asset "${asset.name}" secured to Vault.`);
  };

  const navItems = [
    { id: AppView.USER_PORTAL, icon: User, label: 'Consumer Hub', tier: SubscriptionTier.FREE, color: 'text-blue-500' },
    { id: AppView.DASHBOARD, icon: Activity, label: 'Operations Sync', tier: SubscriptionTier.FREE, color: 'text-slate-500' },
    { id: AppView.APP_BUILDER, icon: Rocket, label: 'App Architect', tier: SubscriptionTier.PRO, color: 'text-orange-500' },
    { id: AppView.CREATIVE_STUDIO, icon: Palette, label: 'Creative Studio', tier: SubscriptionTier.PRO, color: 'text-purple-500' },
    { id: AppView.CODE_REPAIR, icon: Wrench, label: 'Regeneration Hub', tier: SubscriptionTier.PRO, color: 'text-cyan-500' },
    { id: AppView.DATA_CORE, icon: Database, label: 'Omni Data Core', tier: SubscriptionTier.ELITE, color: 'text-emerald-500' },
    { id: AppView.GAME_ENGINE, icon: Gamepad2, label: 'World Engine', tier: SubscriptionTier.ELITE, color: 'text-pink-500' },
    { id: AppView.FRAUD_DETECTION, icon: Eye, label: 'Integrity Sentinel', tier: SubscriptionTier.ELITE, color: 'text-red-500' },
    ...(isAdminAuthenticated ? [
      { id: AppView.ADMIN, icon: ShieldCheckIcon, label: 'Neural Architect', tier: SubscriptionTier.ELITE, color: 'text-blue-600' },
      { id: AppView.SETTINGS, icon: SettingsIcon, label: 'Enhanced Settings', tier: SubscriptionTier.ELITE, color: 'text-slate-900' },
      { id: AppView.LEGAL, icon: Scale, label: 'Legal Manifest', tier: SubscriptionTier.FREE, color: 'text-slate-700' },
    ] : []),
  ];

  const checkTierAccess = (requiredTier: SubscriptionTier) => {
    if (requiredTier === SubscriptionTier.FREE) return true;
    if (requiredTier === SubscriptionTier.PRO) return subscriptionTier === SubscriptionTier.PRO || subscriptionTier === SubscriptionTier.ELITE;
    if (requiredTier === SubscriptionTier.ELITE) return subscriptionTier === SubscriptionTier.ELITE;
    return false;
  };

  const handleNavClick = (viewId: AppView, requiredTier: SubscriptionTier) => {
    if (checkTierAccess(requiredTier)) {
      setActiveView(viewId);
      setIsMenuOpen(false);
    } else {
      setShowSubscriptionModal(true);
      notify(`Upgrade to ${requiredTier.toUpperCase()} required for this module.`, 'error');
    }
  };

  const currentNavItem = navItems.find(i => i.id === activeView);

  const handleSystemLockdown = () => {
    setIsSystemLocked(true);
    setIsAdminAuthenticated(false);
    setActiveView(AppView.SYSTEM_LOCKED);
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 border-2 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <Cpu className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <h1 className="text-sm font-bold tracking-[0.4em] text-slate-900 uppercase mono">HumanEdge(CA) AI</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Global Notification */}
      {notification && (
        <div className="fixed top-24 right-8 z-[200] animate-in slide-in-from-right-8 fade-in duration-500">
          <div className={`glass px-6 py-4 rounded-2xl border flex items-center gap-3 shadow-2xl ${
            notification.type === 'success' ? 'border-emerald-100' : 'border-red-100'
          }`}>
            <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {/* Top Navigation - Classy Landscape */}
      <header className="fixed top-0 left-0 right-0 z-[150] glass border-b border-slate-200/50 h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => setActiveView(AppView.USER_PORTAL)}
            className="flex items-center gap-3 group transition-all"
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">HumanEdge(CA) AI</h1>
              <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest leading-none">HumanEdge Canada Core</p>
            </div>
          </button>

          {/* All-in-One Module Switcher */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-4 px-5 py-2.5 rounded-2xl border transition-all ${
                isMenuOpen ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {currentNavItem && <currentNavItem.icon className={`w-4 h-4 ${isMenuOpen ? 'text-white' : currentNavItem.color}`} />}
              <span className="text-xs font-black uppercase tracking-widest">{currentNavItem?.label || 'Select Module'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-180 opacity-60' : 'opacity-40'}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-3 w-72 glass border border-slate-200/50 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-3 grid grid-cols-1 gap-1">
                  {navItems.map((item) => {
                    const isLocked = !checkTierAccess(item.tier);
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id, item.tier)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                          activeView === item.id 
                            ? 'bg-slate-900 text-white' 
                            : isLocked ? 'opacity-40 grayscale' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-white' : item.color}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                        {isLocked ? <Lock className="w-3 h-3" /> : activeView === item.id && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${subscriptionTier !== SubscriptionTier.FREE ? 'bg-blue-600' : 'bg-slate-400'}`}></div>
                      <span className="text-[9px] font-black text-slate-500 uppercase">Tier: {subscriptionTier.toUpperCase()}</span>
                   </div>
                   <button 
                    onClick={() => { setShowSubscriptionModal(true); setIsMenuOpen(false); }}
                    className="text-[9px] font-black text-blue-600 uppercase hover:underline"
                   >
                     Manage Tier
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-12 relative" ref={searchRef}>
          <div className={`w-full flex items-center px-5 h-11 rounded-2xl border transition-all ${
            isSearchFocused ? 'bg-white border-blue-400 shadow-xl shadow-blue-600/5' : 'bg-slate-100 border-transparent'
          }`}>
            <Search className={`w-4 h-4 ${isSearchFocused ? 'text-blue-600' : 'text-slate-400'}`} />
            <input 
              type="text"
              placeholder="Search projects, code, or datasets..."
              className="bg-transparent border-none w-full text-xs font-semibold px-4 text-slate-900 placeholder:text-slate-400"
              onFocus={() => setIsSearchFocused(true)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-200 rounded-full">
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>

          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 glass border border-slate-200 rounded-3xl shadow-2xl z-[160] max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
              <div className="p-4 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100">Search Results</div>
              <div className="p-2 space-y-1">
                 {assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map(a => (
                   <button 
                    key={a.id} 
                    onClick={() => { setActiveView(a.module); setIsSearchFocused(false); }}
                    className="w-full p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all text-left"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400"><FileText className="w-4 h-4" /></div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase">{a.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{a.type}</p>
                        </div>
                     </div>
                     <ArrowRight className="w-4 h-4 text-slate-300" />
                   </button>
                 ))}
                 {assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                   <div className="p-8 text-center text-[10px] text-slate-400 font-bold uppercase">No records secured</div>
                 )}
              </div>
            </div>
          )}
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowLogin(true)}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${
              isAdminAuthenticated ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
            }`}
          >
            {isAdminAuthenticated ? <ShieldAlert className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
              {isAdminAuthenticated ? 'Root Core' : 'Authorized Entry'}
            </span>
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200"></div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></div>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-black text-xs">
              HE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-[1600px] mx-auto px-8 py-8 animate-classy">
          {/* Module Header - Landscape Context */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className={`p-2 rounded-lg bg-white border border-slate-200 shadow-sm ${currentNavItem?.color || 'text-slate-900'}`}>
                    {currentNavItem && <currentNavItem.icon className="w-5 h-5" />}
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                   {currentNavItem?.label || 'HumanEdge Core'}
                 </h2>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-12">
                Operational Latency: 4ms | Integrity Index: 100% | standalone Llama-4 logic
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                  <span className="text-xs font-black text-emerald-600 uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    System Optimized
                  </span>
               </div>
               <button 
                onClick={() => notify('System Re-Synchronized')}
                className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
               >
                 <RefreshCw className="w-4 h-4 text-slate-500" />
               </button>
            </div>
          </div>

          {/* Module Content */}
          <div className="relative z-10">
            <ErrorBoundary>
              {activeView === AppView.USER_PORTAL && (
                <UserPortal 
                  onAction={(view) => {
                    const item = navItems.find(i => i.id === view);
                    if (item) handleNavClick(view, item.tier);
                  }} 
                  onUpgrade={() => setShowSubscriptionModal(true)}
                  currentTier={subscriptionTier}
                />
              )}
              {activeView === AppView.APP_BUILDER && <AppBuilder onAssetSecured={addAsset} notify={notify} />}
              {activeView === AppView.CREATIVE_STUDIO && <CreativeStudio onAssetSecured={addAsset} notify={notify} />}
              {activeView === AppView.CODE_REPAIR && <CodeRepair onAssetSecured={addAsset} notify={notify} />}
              {activeView === AppView.GAME_ENGINE && <GameEngine onAssetSecured={addAsset} notify={notify} />}
              {activeView === AppView.FRAUD_DETECTION && <FraudDetection notify={notify} />}
              {activeView === AppView.DATA_CORE && <DataCore notify={notify} />}
              {activeView === AppView.ADMIN && (
                <AdminPanel 
                  onNavigateToDashboard={() => setActiveView(AppView.DASHBOARD)} 
                  onNavigateToSettings={() => setActiveView(AppView.SETTINGS)}
                  onNavigateToLegal={() => setActiveView(AppView.LEGAL)}
                  onLockdown={handleSystemLockdown} 
                  notify={notify} 
                />
              )}
              {activeView === AppView.SETTINGS && <SystemSettings notify={notify} />}
              {activeView === AppView.LEGAL && <LegalPage />}
              {activeView === AppView.DASHBOARD && <Dashboard assets={assets} />}
              {activeView === AppView.SYSTEM_LOCKED && (
                <div className="min-h-[600px] flex items-center justify-center flex-col text-center space-y-8 animate-in zoom-in-95 duration-700">
                  <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center text-red-600 shadow-2xl shadow-red-600/10">
                    <Shield className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase">System Sealed</h3>
                    <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">100% Integrity Deep Freeze Active</p>
                  </div>
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all"
                  >
                    Authorize Restoration
                  </button>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </div>
      </main>

      {/* Admin Login Modal Overlay */}
      {showLogin && (
        <AdminLogin 
          onSuccess={() => { 
            setIsAdminAuthenticated(true); 
            setShowLogin(false); 
            setActiveView(AppView.ADMIN); 
            notify("Admin Root Authenticated."); 
          }} 
          onCancel={() => setShowLogin(false)} 
        />
      )}

      {/* Persistent Chat - Always Accessible Landscape Assistant */}
      {!isSystemLocked && <ChatAssistant />}

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionPlans 
          currentTier={subscriptionTier}
          onSelect={async (tier) => {
            try {
              const response = await fetch('/api/subscription/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier })
              });
              const data = await response.json();
              if (data.success) {
                setSubscriptionTier(tier);
                setShowSubscriptionModal(false);
                notify(`System upgraded to ${tier.toUpperCase()} authorization.`, 'success');
              }
            } catch (err) {
              notify('Neural synchronization failed. Try again.', 'error');
            }
          }}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      {/* Footer Branding */}
      <footer className="px-8 py-6 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/30 backdrop-blur-sm mt-auto">
        <div className="flex items-center gap-4">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 HumanEdge Canada Core</span>
           <div className="h-3 w-[1px] bg-slate-300"></div>
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">100% Integrity Standalone System</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-slate-400" />
              <span className="text-[9px] font-bold text-slate-500 uppercase">MongoDB Core Active</span>
           </div>
           <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-slate-400" />
              <span className="text-[9px] font-bold text-slate-500 uppercase">Llama-4 Emulation Active</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
