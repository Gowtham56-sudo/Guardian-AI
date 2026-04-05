import { motion } from 'motion/react';
import CommunityAlerts from '../../components/sections/CommunityAlerts/CommunityAlerts';
import CTA from '../../components/sections/CTA/CTA';

export default function Community() {
  return (
    <motion.div
      key="community"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-20"
    >
      <div className="space-y-4 text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
          Stronger Together
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          A Global <span className="text-blue-600">Safety Network.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          GuardianAI is powered by millions of users who look out for one another.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-3 text-center">
        <div className="space-y-2">
          <div className="text-4xl font-bold text-blue-600">2.4M+</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Active Guardians</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-blue-600">150k+</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Incidents Prevented</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-blue-600">45k+</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">Safe Zones Verified</div>
        </div>
      </div>

      <CommunityAlerts />
      <CTA />
    </motion.div>
  );
}
