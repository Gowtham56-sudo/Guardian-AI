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
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button 
          onClick={() => onPageChange('home')}
          aria-label="GuardianAI Home"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-100" aria-hidden="true">
            <Shield size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">GuardianAI</span>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onPageChange(link.id)}
              aria-current={currentPage === link.id ? 'page' : undefined}
              className={`text-sm font-medium transition-colors hover:text-blue-700 ${
                currentPage === link.id ? 'text-blue-700' : 'text-slate-700'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
