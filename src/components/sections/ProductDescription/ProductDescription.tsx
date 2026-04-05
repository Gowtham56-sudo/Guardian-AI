import { motion } from 'motion/react';
import { PhoneCall, Globe } from 'lucide-react';

export default function ProductDescription() {
  const features = [
    { icon: <PhoneCall className="text-blue-600" />, title: "Fake Call Escape", desc: "Discreet exit from uncomfortable situations with a realistic simulated call." },
    { icon: <Globe className="text-blue-600" />, title: "Multilingual AI", desc: "Support in your preferred language for global accessibility." },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
            {feature.icon}
          </div>
          <h3 className="mb-2 font-bold text-slate-900">{feature.title}</h3>
          <p className="text-sm text-slate-600">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
