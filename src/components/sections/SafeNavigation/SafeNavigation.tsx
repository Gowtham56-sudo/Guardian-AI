import { Navigation, MapPin } from 'lucide-react';

export default function SafeNavigation() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row-reverse py-12">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <Navigation size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Safe Navigation</h2>
        <p className="text-lg leading-relaxed text-slate-600">
          Travel with confidence using our intelligent routing system. GuardianAI suggests the most secure paths based on real-time community data, lighting conditions, and proximity to safe zones.
        </p>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            Nearby police stations and 24/7 safe zones
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            Route deviation and unusual stop alerts
          </li>
        </ul>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-200/50 p-8">
        <div className="aspect-video rounded-2xl bg-white shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MapPin className="text-blue-600 animate-bounce" size={48} />
          </div>
        </div>
      </div>
    </section>
  );
}
