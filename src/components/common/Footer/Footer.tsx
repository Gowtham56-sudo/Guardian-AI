import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield size={20} className="text-blue-600" />
          <span className="font-bold text-slate-900">GuardianAI</span>
        </div>
        <p className="text-sm text-slate-500">© 2026 GuardianAI Technologies. Your safety is our intelligence.</p>
      </div>
    </footer>
  );
}
