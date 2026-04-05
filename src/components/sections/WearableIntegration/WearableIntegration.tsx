import { motion } from 'motion/react';
import { Watch } from 'lucide-react';

export default function WearableIntegration() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row-reverse py-12">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <Watch size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Wearable Integration</h2>
        <p className="text-lg leading-relaxed text-slate-600">
          Extend your safety net to your wrist. GuardianAI integrates seamlessly with major smartwatches, allowing for discreet SOS activation without ever reaching for your phone.
        </p>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            One-tap SOS complication for watch faces
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            Haptic safety check vibrations
          </li>
        </ul>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-200/50 p-8">
        <div className="aspect-video rounded-2xl bg-white shadow-inner flex items-center justify-center">
          <div className="relative">
            <Watch className="text-blue-600" size={64} />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-blue-400 -z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
