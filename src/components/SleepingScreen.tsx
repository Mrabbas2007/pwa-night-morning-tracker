import { motion } from "motion/react";

interface Props {
  onWake: () => void;
  lang: 'fa' | 'en';
}

export default function SleepingScreen({ onWake, lang }: Props) {
  const isFa = lang === 'fa';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background flex flex-col items-center justify-center text-foreground cursor-pointer group select-none"
      onClick={onWake}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-950 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-40"></div>
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-32 h-32 rounded-full border border-primary/20 flex items-center justify-center font-mono text-[10px] tracking-[0.4em] uppercase text-primary bg-black shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_5%,transparent)] transition-all group-hover:border-primary/50 group-hover:scale-110"
      >
        {isFa ? 'Resting' : 'REST'}
      </motion.div>
      <p className="absolute bottom-12 text-muted text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        {isFa ? 'برای بیدار شدن کلیک کنید' : 'Click to wake up'}
      </p>
    </motion.div>
  );
}
