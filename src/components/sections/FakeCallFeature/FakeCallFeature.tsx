import { PhoneCall } from 'lucide-react';

export default function FakeCallFeature() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row-reverse py-12">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <PhoneCall size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Fake Call Escape</h2>
        <p className="text-lg leading-relaxed text-slate-600">
          Discreetly exit uncomfortable situations. A simple gesture triggers a realistic incoming call with a pre-recorded voice to provide a natural excuse to leave.
        </p>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-200/50 p-8">
        <div className="aspect-video rounded-2xl bg-white shadow-inner flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm font-bold text-blue-600 mb-1">Incoming Call</div>
            <div className="text-2xl font-bold text-slate-900">GuardianAI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
