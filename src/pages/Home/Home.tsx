import { motion } from 'motion/react';
import Hero from '../../components/sections/Hero/Hero';
import ProductDescription from '../../components/sections/ProductDescription/ProductDescription';
import AIThreatDetection from '../../components/sections/AIThreatDetection/AIThreatDetection';
import SafeNavigation from '../../components/sections/SafeNavigation/SafeNavigation';
import SmartSOS from '../../components/sections/SmartSOS/SmartSOS';
import WearableIntegration from '../../components/sections/WearableIntegration/WearableIntegration';

export default function Home() {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-24"
    >
      <Hero />
      <ProductDescription />
      <div className="space-y-24">
        <AIThreatDetection />
        <SafeNavigation />
        <SmartSOS />
        <WearableIntegration />
      </div>
    </motion.div>
  );
}
