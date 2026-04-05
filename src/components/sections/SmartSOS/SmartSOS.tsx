import { AlertTriangle, Smartphone } from 'lucide-react';

export default function SmartSOS() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row py-12" aria-labelledby="smart-sos-title">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-100" aria-hidden="true">
          <AlertTriangle size={32} />
        </div>
        <h2 id="smart-sos-title" className="text-3xl font-bold tracking-tight text-slate-900">Smart SOS</h2>
        <p className="text-lg leading-relaxed text-slate-700">
          Safety shouldn't depend on a data connection. GuardianAI's robust offline protocol ensures that even in remote areas, an emergency SMS with GPS coordinates is dispatched.
        </p>
        <ul className="space-y-3 text-slate-700" aria-label="Smart SOS features">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-700" aria-hidden="true" />
            Automated SMS alerts with Google Maps links
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-700" aria-hidden="true" />
            Low-battery emergency location broadcasting
          </li>
        </ul>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-200/50 p-8" aria-hidden="true">
        <div className="aspect-video rounded-2xl bg-white shadow-inner flex items-center justify-center">
          <div className="text-center space-y-2">
            <Smartphone className="mx-auto text-slate-400" size={40} />
            <div className="flex gap-1 justify-center">
              <div className="h-1 w-4 bg-slate-300 rounded-full" />
              <div className="h-1 w-4 bg-slate-300 rounded-full" />
              <div className="h-1 w-4 bg-slate-300 rounded-full" />
            </div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">No Signal Required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
