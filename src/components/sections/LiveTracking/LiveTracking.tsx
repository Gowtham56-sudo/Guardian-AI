import { MapPin, Activity } from 'lucide-react';

export default function LiveTracking() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row py-12" aria-labelledby="live-tracking-title">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-100" aria-hidden="true">
          <Activity size={32} />
        </div>
        <h2 id="live-tracking-title" className="text-3xl font-bold tracking-tight text-slate-900">Live Tracking</h2>
        <p className="text-lg leading-relaxed text-slate-700">
          Share your real-time location with trusted contacts. Our low-latency engine ensures your position is updated every 10 seconds with meter-level precision.
        </p>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-200/50 p-8" aria-hidden="true">
        <div className="aspect-video rounded-2xl bg-white shadow-inner relative overflow-hidden flex items-center justify-center">
          <MapPin className="text-blue-600 animate-pulse" size={48} />
        </div>
      </div>
    </section>
  );
}
