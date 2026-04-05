import { motion } from 'motion/react';
import { Cpu, Lock, Zap, Activity } from 'lucide-react';

export default function Technology() {
  return (
    <motion.div
      key="technology"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-20"
    >
      <div className="space-y-4 text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
          The Engine of Safety
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Advanced AI <span className="text-blue-600">Architecture.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          GuardianAI isn't just an app; it's a sophisticated neural network designed to protect you in real-time.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Cpu className="mb-6 text-blue-600" size={40} />
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Edge-AI Processing</h3>
          <p className="text-slate-600">
            We process audio and motion data locally on your device. This ensures zero-latency response times and absolute privacy.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Lock className="mb-6 text-blue-600" size={40} />
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Military-Grade Encryption</h3>
          <p className="text-slate-600">
            All evidence collected during an SOS event is encrypted with AES-256 before being uploaded to our secure cloud.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Zap className="mb-6 text-blue-600" size={40} />
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Low-Latency Mesh</h3>
          <p className="text-slate-600">
            Our global server network ensures that location updates are transmitted in under 100ms.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Activity className="mb-6 text-blue-600" size={40} />
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Neural Threat Analysis</h3>
          <p className="text-slate-600">
            Our models are trained on thousands of hours of acoustic data to distinguish between normal noise and genuine distress.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
