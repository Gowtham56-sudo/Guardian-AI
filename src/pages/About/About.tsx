import { motion } from 'motion/react';
import { Shield, Target, Eye } from 'lucide-react';

export default function About() {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-20"
    >
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Our <span className="text-blue-600">Mission.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          To build a world where safety is a right, not a privilege, powered by the most advanced intelligence available.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Target size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">The Problem</h2>
          <p className="text-slate-600 leading-relaxed">
            Emergency response is often reactive. By the time help is called, the situation has already escalated. Traditional apps rely on manual triggers that are often impossible to use in high-stress moments.
          </p>
        </div>
        <div className="space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Eye size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            We envision a proactive safety ecosystem. One that detects danger before you even have to ask for help, using AI to analyze patterns and provide a silent, intelligent sentinel for every individual.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-12 text-white">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold">Founded on Privacy</h2>
            <p className="text-slate-400">
              We believe that safety shouldn't come at the cost of surveillance. GuardianAI was built with a privacy-first architecture, ensuring that your data is yours alone, encrypted and protected by the same technology that keeps you safe.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Shield size={120} className="text-blue-500 opacity-50" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
