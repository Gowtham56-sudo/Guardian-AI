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
        return <AppDashboard />;
    }
  };

  if (viewMode === 'app') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {/* App Header (Minimal) */}
        <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-100" aria-hidden="true">
               <span className="font-bold text-sm">G</span>
             </div>
             <span className="font-bold tracking-tight">GuardianAI</span>
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="mx-auto max-w-4xl px-6 py-20 md:py-32 overflow-hidden" role="main">
        <div className="mb-12 flex justify-center">
          <button 
            onClick={() => setViewMode('app')}
            aria-label="Launch Guardian Safety App"
            className="group relative inline-flex items-center gap-2 rounded-full bg-blue-700 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-800 hover:shadow-blue-300 active:scale-95"
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
          {renderLandingPage()}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
