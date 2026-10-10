import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';
import Home from './pages/Home/Home';
import Technology from './pages/Technology/Technology';
import Community from './pages/Community/Community';
import About from './pages/About/About';

// App Pages
import AppDashboard from './pages/AppDashboard';
import AppMap from './pages/AppMap';
import AppAlerts from './pages/AppAlerts';
import AppProfile from './pages/AppProfile';
import AppAssistant from './pages/AppAssistant';
import AppAdminPanel from './pages/AppAdminPanel';
import BottomNav from './components/app/BottomNav';

type ViewMode = 'landing' | 'app';
type Page = 'home' | 'technology' | 'community' | 'about';
type AppTab = 'home' | 'map' | 'assistant' | 'alerts' | 'profile' | 'admin';
type ThemeMode = 'light' | 'dark';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('app'); // Default to app mode for the user request
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  useEffect(() => {
    const applyTheme = (themeMode: ThemeMode) => {
      const root = document.documentElement;
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(themeMode === 'dark' ? 'theme-dark' : 'theme-light');
      root.style.colorScheme = themeMode;
    };

    const storedTheme = window.localStorage.getItem('guardian-theme');
    applyTheme(storedTheme === 'dark' ? 'dark' : 'light');

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeMode>;
      applyTheme(customEvent.detail === 'dark' ? 'dark' : 'light');
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'guardian-theme') {
        applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
      }
    };

    window.addEventListener('guardian-theme-change', handleThemeChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('guardian-theme-change', handleThemeChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const renderLandingPage = () => {
    switch (currentPage) {
      case 'technology':
        return <Technology />;
      case 'community':
        return <Community />;
      case 'about':
        return <About />;
      default:
        return <Home />;
    }
  };

  const renderAppPage = () => {
    switch (activeTab) {
      case 'map':
        return <AppMap />;
      case 'assistant':
        return <AppAssistant />;
      case 'alerts':
        return <AppAlerts />;
      case 'profile':
        return <AppProfile />;
      case 'admin':
        return <AppAdminPanel />;
      default:
        return <AppDashboard onOpenMap={() => setActiveTab('map')} />;
    }
  };

  if (viewMode === 'app') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
        {/* App Header (Premium Glassmorphism) */}
        <header className="sticky top-0 z-40 bg-white/50 backdrop-blur-xl border-b border-white/80 px-6 py-4 flex items-center justify-between shadow-sm shadow-blue-900/5">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-blue-400/20" aria-hidden="true">
               <span className="font-bold text-sm tracking-tighter">G</span>
             </div>
             <span className="font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">GuardianAI</span>
           </div>
           <button 
             onClick={() => setViewMode('landing')}
             aria-label="Exit App and return to landing page"
             className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors uppercase tracking-widest"
           >
             Exit App
           </button>
        </header>

        <main className="mx-auto max-w-md px-6 pt-4 pb-32" role="main" aria-label="App Content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderAppPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as AppTab)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" aria-hidden="true" />
      
      <div className="relative z-10">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

        <main className="mx-auto max-w-5xl px-6 py-20 md:py-32" role="main">
          <div className="mb-16 flex justify-center">
            <button 
              onClick={() => setViewMode('app')}
              aria-label="Launch Guardian Safety App"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-10 py-5 text-xl font-bold text-white shadow-2xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95"
            >
            Launch Guardian App
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              aria-hidden="true"
            >
              →
            </motion.div>
          </button>
        </div>

        <AnimatePresence mode="wait">
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}
