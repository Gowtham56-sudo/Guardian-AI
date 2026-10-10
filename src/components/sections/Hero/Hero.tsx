import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="space-y-6 text-center pt-10 pb-20">
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block rounded-full bg-blue-500/10 border border-blue-500/30 px-5 py-2 text-sm font-black uppercase tracking-widest text-blue-400 shadow-lg shadow-blue-500/10"
      >
        Next-Gen Personal Safety
      </motion.span>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight drop-shadow-lg"
      >
        Intelligent Protection for <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Every Journey.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-auto max-w-2xl text-xl text-slate-400 mt-6"
      >
        Your AI-powered safety companion, always listening, always ready.
      </motion.p>
    </div>
  );
}
