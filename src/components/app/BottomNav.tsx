import { Home, Map, Bell, User, Mic, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'map', icon: <Map size={24} />, label: 'Map' },
    { id: 'assistant', icon: <Mic size={24} />, label: 'AI' },
    { id: 'alerts', icon: <Bell size={24} />, label: 'Alerts' },
    { id: 'admin', icon: <ShieldCheck size={24} />, label: 'Admin' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-6 pb-8 pointer-events-none">
      <nav 
        aria-label="App Navigation"
        className="flex w-full max-w-md items-center justify-around rounded-3xl bg-white/90 p-2 shadow-2xl shadow-slate-200 backdrop-blur-xl border border-white/50 pointer-events-auto"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center p-3 transition-all active:scale-90"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl bg-blue-50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  aria-hidden="true"
                />
              )}
              <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                {tab.icon}
              </div>
              <span className={`relative z-10 mt-1 text-[10px] font-bold uppercase tracking-tighter transition-colors duration-300 ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
