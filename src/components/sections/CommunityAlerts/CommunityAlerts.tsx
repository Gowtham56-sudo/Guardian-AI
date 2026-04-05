import { MessageSquare, Heart } from 'lucide-react';

export default function CommunityAlerts() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">Community Impact</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-blue-600 p-8 text-white">
          <MessageSquare className="mb-4 opacity-50" size={32} />
          <p className="mb-6 text-lg italic">
            "GuardianAI alerted me to a route deviation when my daughter was taking a cab home. The peace of mind was worth everything."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-400" />
            <div>
              <div className="font-bold">Sarah M.</div>
              <div className="text-xs opacity-70">Verified User</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-8 text-white">
          <Heart className="mb-4 opacity-50" size={32} />
          <p className="mb-6 text-lg italic">
            "The community alerts helped me avoid a protest area that had turned violent. The real-time updates are much faster than news."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-700" />
            <div>
              <div className="font-bold">David L.</div>
              <div className="text-xs opacity-70">Verified User</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
