import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="space-y-4 text-center">
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600"
      >
        Next-Gen Personal Safety
      </motion.span>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
      >
        Intelligent Protection for <br />
        <span className="text-blue-600">Every Journey.</span>
      </motion.h1>
    </div>
  );
}
