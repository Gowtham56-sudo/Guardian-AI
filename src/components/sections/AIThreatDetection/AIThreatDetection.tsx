import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

export default function AIThreatDetection() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row py-12" aria-labelledby="ai-threat-title">
      <div className="flex-1 space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-100" aria-hidden="true">
          <Mic size={32} />
        </div>
        <h2 id="ai-threat-title" className="text-3xl font-bold tracking-tight text-slate-900">AI Threat Detection</h2>
        <p className="text-lg leading-relaxed text-slate-700">
          GuardianAI's sophisticated audio analysis engine continuously monitors for distress signals, shouting, or specific panic keywords. Using edge-AI processing, the app can distinguish between normal conversation and emergency situations.
        </p>
        <ul className="space-y-3 text-slate-700" aria-label="Detection capabilities">
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-700" aria-hidden="true" />
            Real-time shouting and scream recognition
          </li>
          <li className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-700" aria-hidden="true" />
            Customizable panic keyword triggers
          </li>
        </ul>
      </div>
      <div className="flex-1 rounded-3xl bg-slate-200/50 p-8" aria-hidden="true">
        <div className="aspect-video rounded-2xl bg-white shadow-inner flex items-center justify-center overflow-hidden">
          <div className="flex items-end gap-1 h-12">
            {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.3, 0.7].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h * 40, (1-h) * 40, h * 40] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                className="w-1.5 bg-blue-600 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
