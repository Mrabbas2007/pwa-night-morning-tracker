import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  onComplete: (profile: UserProfile) => void;
  initialName?: string;
  initialLang?: UserProfile['lang'];
}

export default function Onboarding({ onComplete, initialName = '', initialLang = 'fa' }: Props) {
  const [step, setStep] = useState<1 | 2>(initialName ? 2 : 1);
  const [lang, setLang] = useState<'fa' | 'en'>(initialLang);
  const [name, setName] = useState(initialName);

  const handleLangSelect = (selected: 'fa' | 'en') => {
    setLang(selected);
    setStep(2);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name.trim()) {
      onComplete({ name: name.trim(), lang });
    }
  };

  return (
    <div className={cn("min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col items-center justify-center p-6 relative overflow-hidden", lang === 'fa' ? 'font-sans' : 'font-serif')} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[400px] md:h-[400px] bg-primary rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md flex flex-col gap-10 z-10 relative">
        <AnimatePresence mode="wait">
          {step === 1 ? (
             <motion.div key="step-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-10">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_20%,transparent)]">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  </div>
                  <h1 className="text-3xl font-light text-foreground font-sans">زبان خود را انتخاب کنید</h1>
                  <p className="text-secondary text-sm font-serif italic">Please select your preferred language</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                  <button onClick={() => handleLangSelect('fa')} className="w-full sm:w-1/2 py-5 rounded-2xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/30 transition-all group flex flex-col items-center gap-2 active:scale-95 cursor-pointer">
                     <span className="text-2xl font-sans text-foreground">فارسی</span>
                  </button>
                  <button onClick={() => handleLangSelect('en')} className="w-full sm:w-1/2 py-5 rounded-2xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/30 transition-all group flex flex-col items-center gap-2 active:scale-95 cursor-pointer">
                     <span className="text-2xl font-serif text-foreground">English</span>
                  </button>
                </div>
             </motion.div>
          ) : (
             <motion.div key="step-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-10">
                 <div className="text-center space-y-4 relative">
                  {!initialName && (
                    <button onClick={() => setStep(1)} className={cn("absolute top-0 w-10 h-10 flex items-center justify-center border border-border rounded-full text-lg text-secondary hover:text-foreground hover:bg-surface-hover transition-colors font-mono hover:scale-105 active:scale-95 cursor-pointer", lang === 'fa' ? 'right-0' : 'left-0')}>{lang === 'fa' ? '→' : '←'}</button>
                  )}
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_20%,transparent)]">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  </div>
                  <h1 className="text-3xl font-light text-foreground">
                    {lang === 'fa' ? (initialName ? 'تغییر نام' : 'شما را چه بنامیم؟') : (initialName ? 'Change your name' : 'What should I call you?')}
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="relative group w-full bg-surface border border-border-strong rounded-2xl p-2 focus-within:border-primary/50 focus-within:bg-surface-hover transition-all">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'fa' ? 'نام شما...' : 'Your name...'}
                    className="w-full bg-transparent py-4 px-6 text-xl md:text-2xl font-light focus:outline-none focus:border-primary transition-colors placeholder:text-border-strong text-center"
                    style={{ fontSize: '16px' }} // Prevent iOS Zoom
                    autoFocus
                  />
                  <button type="submit" className="hidden">Submit</button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-muted text-[10px] font-mono tracking-widest uppercase opacity-0 group-focus-within:opacity-100 transition-opacity hidden md:block">
                    [ Press Enter ]
                  </div>
                </form>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
