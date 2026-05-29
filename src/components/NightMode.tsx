import React, { useState } from 'react';
import { DailyLog, Task, UserProfile } from '../types';
import { cn, toPersianNum } from '../lib/utils';
import { Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  log: DailyLog;
  onUpdate: (log: DailyLog) => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const CATEGORY_ICONS = {
  important: '❗',
  routine: '🔄',
  idea: '💡',
  reminder: '🔔',
  none: '○',
};

export default function NightMode({ log, onUpdate, user, onUpdateUser }: Props) {
  const lang = user.lang || 'fa';
  const isFa = lang === 'fa';
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState<Task['category']>('none');
  const [energy, setEnergy] = useState<number>(3); // 1-5

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: text.trim(),
        category: activeCategory,
        completed: false,
      };
      
      onUpdate({
        ...log,
        tasks: [...log.tasks, newTask]
      });
      setText('');
      setActiveCategory('none');
    }
  };

  const handleRemove = (taskId: string) => {
    onUpdate({
        ...log,
        tasks: log.tasks.filter((t) => t.id !== taskId)
    });
  }

  const handleGoToSleep = () => {
    onUpdate({
      ...log,
      nightMood: {
        energyPrediction: energy,
        bedTime: new Date().toISOString()
      }
    });
  };

  const now = new Date();
  const dateFormatter = new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={cn("min-h-screen bg-background text-foreground selection:bg-primary/30 p-6 md:p-12 flex flex-col transition-colors duration-1000 w-full mx-auto relative overflow-hidden", isFa ? 'font-sans' : 'font-serif')} dir={isFa ? 'rtl' : 'ltr'}>
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-950 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[400px] bg-orange-950 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className={cn("absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent pointer-events-none", isFa ? 'right-0' : 'left-0')}></div>
      <div className={cn("absolute top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] text-border-strong uppercase tracking-[1em] font-light pointer-events-none hidden xl:block", isFa ? 'right-8' : 'left-8 rotate-180')}>
        {isFa ? 'سازماندهی ذهن به سبکی نوین' : 'Non-Linear Organization'}
      </div>

      <header className="flex flex-col sm:flex-row justify-between items-start z-10 w-full max-w-2xl mx-auto mb-12 border-b border-border-strong pb-8 gap-6 sm:gap-0">
        <div className="flex flex-col w-full sm:w-auto">
          <div className="flex justify-between sm:justify-start items-center w-full">
            <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
              <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_50%,transparent)]"></span>
              {isFa ? `شب خوش، ${user.name}` : `Good evening, ${user.name}`}
            </h1>
            <div className="flex items-center gap-1 sm:hidden bg-surface-hover rounded p-1" dir="ltr">
              <button onClick={() => onUpdateUser({...user, lang: 'en'})} className={cn("text-[10px] font-mono px-2 rounded transition-colors", !isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>EN</button>
              <button onClick={() => onUpdateUser({...user, lang: 'fa'})} className={cn("text-[12px] font-sans px-2 rounded transition-colors", isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>فا</button>
            </div>
          </div>
          <p className="text-secondary font-mono text-[10px] mt-2 uppercase tracking-widest" dir="ltr">System Status: Night Protocol Active</p>
        </div>
        <div className={`flex flex-col items-start ${isFa ? 'sm:items-end text-left sm:text-right' : 'sm:items-end text-right'} font-sans text-foreground w-full sm:w-auto`} dir="ltr">
            <div className="hidden sm:flex items-center gap-1 mb-2 bg-surface-hover rounded p-1">
              <button onClick={() => onUpdateUser({...user, lang: 'en'})} className={cn("text-[10px] font-mono px-2 py-[2px] rounded transition-colors", !isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>EN</button>
              <button onClick={() => onUpdateUser({...user, lang: 'fa'})} className={cn("text-[12px] font-sans px-2 py-[2px] rounded transition-colors", isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>فا</button>
            </div>
            <p className="text-xl md:text-2xl font-serif italic">{dateFormatter.format(now)}</p>
            <p className="text-secondary text-xs mt-1 w-full flex justify-between sm:justify-end gap-2">{isFa ? 'تسک‌های ثبت شده:' : 'Tasks logged:'} <span className="text-primary">{toPersianNum(log.tasks.length, lang)}</span></p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center z-10 max-w-2xl mx-auto w-full gap-8">
        <div className="w-full">
          <label className="text-secondary text-xs uppercase tracking-widest mb-4 block text-center">
            {isFa ? 'ذهن خود را خالی کنید' : 'Unload your mind'}
          </label>
          <form onSubmit={handleSubmit} className="relative group bg-surface rounded-2xl border border-border p-2 focus-within:border-primary/50 transition-colors flex items-center">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isFa ? "فردا چه کارهایی دارم؟" : "What's on your mind for tomorrow?"}
              className="w-full bg-transparent py-4 px-4 text-xl md:text-2xl font-light focus:outline-none focus:border-primary transition-colors placeholder:text-border-strong"
            />
            <button type="submit" className="hidden">Submit</button>
            <div className={cn("absolute top-1/2 -translate-y-1/2 flex gap-4 opacity-40 focus-within:opacity-100 xl:hover:opacity-100 transition-opacity flex-row-reverse", isFa ? "left-4" : "right-4")}>
              {(Object.keys(CATEGORY_ICONS) as Array<Task['category']>).filter(cat => cat !== 'none').map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? 'none' : cat)}
                  className={cn(
                    "hover:text-primary transition-colors text-xl",
                    activeCategory === cat ? "text-primary scale-110" : ""
                  )}
                  title={cat}
                >
                  {CATEGORY_ICONS[cat]}
                </button>
              ))}
            </div>
          </form>
        </div>

        <ul className="w-full space-y-4 flex-1 pb-8 px-1">
          {log.tasks.map((task) => (
            <motion.li 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={task.id} 
              className="flex items-center justify-between p-4 border border-border bg-surface rounded-xl group hover:border-border-strong transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-primary text-xs w-6 text-center">{CATEGORY_ICONS[task.category] !== '○' ? CATEGORY_ICONS[task.category] : '—'}</span>
                <span className="text-lg font-light text-foreground">{task.text}</span>
              </div>
              <button 
                 onClick={() => handleRemove(task.id)}
                 className="opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all px-2 font-mono text-[10px]"
              >
                  ✕
              </button>
            </motion.li>
          ))}
        </ul>
      </main>

      <footer className="z-10 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-border pt-8 mt-auto w-full max-w-2xl mx-auto pb-8 gap-8 md:gap-0 pointer-events-auto bg-background/95 backdrop-blur-md px-6 md:px-8 rounded-3xl sm:rounded-none">
            <div className="flex flex-col gap-4 items-center md:items-start w-full md:w-auto">
               <label className="text-secondary text-[10px] uppercase tracking-widest">{isFa ? 'پیش‌بینی انرژی فردا' : 'Predicted Energy for Tomorrow'}</label>
               <div className="flex gap-2" dir="ltr">
                 {[1, 2, 3, 4, 5].map((level) => (
                   <button
                     key={level}
                     onClick={() => setEnergy(level)}
                     className={cn(
                       "w-8 h-12 md:w-10 md:h-16 border rounded flex flex-col-reverse p-1 bg-black transition-all",
                       energy >= level ? "border-primary/50 ring-2 ring-primary/20" : "border-border-strong"
                     )}
                   >
                     <div className={cn("w-full rounded-sm transition-all", energy >= level ? "bg-primary h-full opacity-100" : "bg-border-strong h-full opacity-10")}></div>
                   </button>
                 ))}
               </div>
            </div>

            <button 
              onClick={handleGoToSleep}
              className="group flex flex-col items-center gap-3 w-full md:w-auto"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-primary/30 flex items-center justify-center bg-black hover:bg-primary/5 transition-all duration-300">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-primary/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-primary">{isFa ? 'ذهنم خلوت شد، استراحت' : 'Mind Empty, Sleep'}</span>
            </button>

            <div className="text-center md:text-left flex-col gap-1 hidden md:flex min-w-[120px]" dir="ltr">
               <p className="text-[10px] text-muted font-mono tracking-tighter uppercase">Local DB: Active</p>
               <p className="text-[10px] text-muted font-mono tracking-tighter uppercase">Sync: Offline</p>
            </div>
         </footer>
    </div>
  );
}
