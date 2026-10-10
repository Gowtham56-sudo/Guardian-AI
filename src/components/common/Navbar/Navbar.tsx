import { Shield } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: any) => void;
}

export default function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const navLinks = [
    { id: 'home', label: 'Features' },
    { id: 'technology', label: 'Technology' },
    { id: 'community', label: 'Community' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav 
      aria-label="Main Navigation"
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button 
          onClick={() => onPageChange('home')}
          aria-label="GuardianAI Home"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" aria-hidden="true">
            <Shield size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">GuardianAI</span>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onPageChange(link.id)}
              aria-current={currentPage === link.id ? 'page' : undefined}
              className={`text-sm font-semibold transition-colors hover:text-blue-400 ${
                currentPage === link.id ? 'text-blue-400' : 'text-slate-300'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 transition-all hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
