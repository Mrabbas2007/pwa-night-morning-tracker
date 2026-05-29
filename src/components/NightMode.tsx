import React, { useState } from 'react';
import { DailyLog, Task, UserProfile } from '../types';
import { cn, toPersianNum, getGreeting } from '../lib/utils';
import { motion } from 'motion/react';
import TaskItem from './ui/TaskItem';

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
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 md:w-[500px] md:h-[500px] bg-indigo-950 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 md:w-[400px] md:h-[400px] bg-orange-950 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className={cn("absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent pointer-events-none", isFa ? 'right-0' : 'left-0')}></div>
      <div className={cn("absolute top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] text-border-strong uppercase tracking-[1em] font-light pointer-events-none hidden xl:block", isFa ? 'right-8' : 'left-8 rotate-180')}>
        {isFa ? 'سازماندهی ذهن به سبکی نوین' : 'Non-Linear Organization'}
      </div>

      <header className="mb-10 w-full max-w-2xl mx-auto z-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-6 sm:gap-0">
           <div className="flex flex-col w-full sm:w-auto">
              <div className="flex justify-between sm:justify-start items-center w-full gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-light tracking-tight flex items-center gap-2 text-foreground">
                      {getGreeting(user.name, isFa)}
                    </h1>
                    <p className="text-secondary font-mono text-[10px] mt-1 uppercase tracking-widest flex items-center gap-2" dir={isFa ? "rtl" : "ltr"}>
                      <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-pulse"></span>
                      {isFa ? 'پروتکل شبانگاهی' : 'Night Protocol'}
                    </p>
                  </div>
                </div>
              </div>
           </div>
           <div className={`flex flex-col items-start ${isFa ? 'sm:items-end text-left sm:text-right' : 'sm:items-end text-right'} font-sans w-full sm:w-auto`} dir="ltr">
              <p className="text-xl md:text-2xl font-serif italic text-foreground leading-none">{dateFormatter.format(now)}</p>
           </div>
        </div>
        
        {/* Minimal Night Stats */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 border border-border bg-surface rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full pointer-events-none"></div>
               <span className="text-2xl font-serif text-foreground">{toPersianNum(log.tasks.length, lang)}</span>
               <span className="text-[10px] font-mono uppercase tracking-widest text-secondary">{isFa ? 'کار برای فردا' : 'Tasks for Tomorrow'}</span>
           </div>
           <div className="p-4 border border-border bg-surface rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden backdrop-blur-sm group cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setEnergy(Math.min(5, energy + 1))}
           >
               <div className="absolute top-0 left-0 w-16 h-16 bg-primary/5 rounded-br-full pointer-events-none"></div>
               <span className="text-2xl font-serif text-primary flex items-center gap-1">
                  {toPersianNum(energy, lang)}<span className="text-sm text-secondary">/5</span>
               </span>
               <span className="text-[10px] font-mono uppercase tracking-widest text-secondary">{isFa ? 'انرژی تخمینی' : 'Est. Energy'}</span>
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center z-10 max-w-2xl mx-auto w-full gap-8">
        <div className="w-full">
          <label className="text-secondary text-xs uppercase tracking-widest mb-4 block text-center">
            {isFa ? 'ذهن خود را خالی کنید' : 'Unload your mind'}
          </label>
          <form onSubmit={handleSubmit} className="relative group bg-surface rounded-2xl border border-border focus-within:border-primary/50 transition-colors flex flex-col p-2">
             {/* Input Area */}
            <div className="flex items-center w-full">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={isFa ? "فردا چه کارهایی دارم؟" : "What's on your mind for tomorrow?"}
                className="flex-1 bg-transparent py-4 px-4 text-base md:text-2xl font-light focus:outline-none placeholder:text-border-strong"
              />
              <button 
                type="submit" 
                disabled={!text.trim()}
                className={cn(
                  "w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-primary text-background transition-all active:scale-95 disabled:opacity-30 disabled:active:scale-100 disabled:cursor-not-allowed hover:bg-primary/90",
                  isFa ? "ml-2" : "mr-2"
                )}
                aria-label={isFa ? "ثبت تسک" : "Add task"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
            
            {/* Category Buttons */}
            <div className="flex w-full flex-row border-t border-border/50 mt-2 pt-3 justify-between sm:justify-start gap-2 sm:gap-6 opacity-60 group-focus-within:opacity-100 xl:hover:opacity-100 transition-opacity px-2 pb-1">
              {(Object.keys(CATEGORY_ICONS) as Array<Task['category']>).filter(cat => cat !== 'none').map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={(e) => { e.preventDefault(); setActiveCategory(activeCategory === cat ? 'none' : cat); }}
                  className={cn(
                    "hover:text-primary transition-colors text-2xl sm:text-xl py-2 px-3 sm:p-0 flex-1 sm:flex-none text-center rounded-lg hover:bg-surface-hover sm:hover:bg-transparent",
                    activeCategory === cat ? "text-primary scale-110 bg-primary/10 sm:bg-transparent" : "text-muted"
                  )}
                  title={cat}
                >
                  {CATEGORY_ICONS[cat]}
                </button>
              ))}
            </div>
          </form>
           <div className="mt-4 text-muted text-[10px] font-mono tracking-widest uppercase text-center opacity-0 focus-within:opacity-100 transition-opacity hidden md:block">
               [ Press Enter to Add ]
           </div>
        </div>

        <ul className="w-full flex-1 pb-8 px-1 flex flex-col gap-3 max-h-[40vh] overflow-y-auto">
          {log.tasks.length === 0 && (
                 <p className="text-secondary text-xs font-mono text-center py-6 uppercase tracking-widest">{isFa ? 'لیست خالی است' : 'List is empty'}</p>
          )}
          {log.tasks.map((task) => (
             <TaskItem 
                key={task.id}
                task={task}
                isFa={isFa}
                variant="night"
                onDelete={handleRemove}
            />
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
                       "w-10 h-14 md:w-10 md:h-16 border rounded flex flex-col-reverse p-1 bg-black transition-all",
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
              className="group flex flex-col items-center gap-3 w-full md:w-auto active:scale-95 transition-transform"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-primary/30 flex items-center justify-center bg-black hover:bg-primary/5 transition-all duration-300 shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_10%,transparent)]">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-primary/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-medium text-primary">{isFa ? 'ذهنم خلوت شد، استراحت' : 'Mind Empty, Sleep'}</span>
            </button>

            <div className="text-center md:text-left flex-col gap-1 hidden md:flex min-w-[120px]" dir="ltr">
               <p className="text-[10px] text-muted font-mono tracking-tighter uppercase flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Local DB</p>
               <p className="text-[10px] text-muted font-mono tracking-tighter uppercase flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Offline</p>
            </div>
         </footer>
    </div>
  );
}
