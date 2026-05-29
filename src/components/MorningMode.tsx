import React, { useMemo, useState } from 'react';
import { DailyLog, Task, UserProfile } from '../types';
import { cn, toPersianNum } from '../lib/utils';
import { BatteryCharging, CheckCircle2, Circle, Sun, Target } from 'lucide-react';
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

export default function MorningMode({ log, onUpdate, user, onUpdateUser }: Props) {
  const lang = user.lang || 'fa';
  const isFa = lang === 'fa';
  const [newTaskText, setNewTaskText] = useState('');
  const top3Ids = log.morningMood?.focusTop3 || [];
  
  const top3Tasks = useMemo(() => {
    return top3Ids.map(id => log.tasks.find(t => t.id === id)).filter(Boolean) as Task[];
  }, [log.tasks, top3Ids]);

  const sandboxTasks = useMemo(() => {
    return log.tasks.filter(t => !top3Ids.includes(t.id));
  }, [log.tasks, top3Ids]);

  const generateSummary = () => {
    const total = log.tasks.length;
    const important = log.tasks.filter(t => t.category === 'important').length;
    const ideas = log.tasks.filter(t => t.category === 'idea').length;
    
    let text = isFa ? `تا این لحظه ` : `You have logged `;
    let parts = [];
    if (important > 0) parts.push(isFa ? `${toPersianNum(important, lang)} کار مهم` : `${important} important tasks`);
    if (ideas > 0) parts.push(isFa ? `${toPersianNum(ideas, lang)} ایده` : `${ideas} ideas`);
    
    if (parts.length > 0) {
       text += parts.join(isFa ? ' و ' : ' and ') + (isFa ? ' برای خود ثبت کرده‌اید. ' : ' so far. ');
    } else {
       text += isFa ? `${toPersianNum(total, lang)} تسک یادداشت کرده‌اید. ` : `${total} tasks so far. `;
    }
    
    const eng = log.nightMood?.energyPrediction || 3;
    if (eng > 3) text += isFa ? "با توجه به پیش‌بینی بالای انرژی شب گذشته، امروز را با کارهای سخت شروع کنید." : "Based on last night's high energy forecast, tackle the hard tasks first.";
    else if (eng < 3) text += isFa ? "امروز را آرام‌تر پیش ببرید، نیازی به فشار زیاد نیست." : "Take it easy today, no need to push too hard.";
    else text += isFa ? "یک روز متعادل و با ثبات در پیش رو دارید." : "A balanced and steady day ahead.";

    return text;
  };

  const handleToggleTop3 = (taskId: string) => {
    let newTop3 = [...top3Ids];
    if (newTop3.includes(taskId)) {
       newTop3 = newTop3.filter(id => id !== taskId);
    } else {
       if (newTop3.length >= 3) return; // limit to 3
       newTop3.push(taskId);
    }
    onUpdate({
        ...log,
        morningMood: {
            wakeTime: log.morningMood?.wakeTime || new Date().toISOString(),
            focusTop3: newTop3,
        }
    });
  };

  const handleDeleteTask = (taskId: string) => {
      onUpdate({
          ...log,
          tasks: log.tasks.filter((t) => t.id !== taskId),
          morningMood: {
              ...log.morningMood,
              focusTop3: (log.morningMood?.focusTop3 || []).filter(id => id !== taskId)
          }
      });
  };

  const handleToggleComplete = (taskId: string) => {
     // Haptic feedback (Tactile feel)
     if (typeof navigator !== 'undefined' && navigator.vibrate) {
         const wasCompleted = log.tasks.find(t => t.id === taskId)?.completed;
         if (!wasCompleted) navigator.vibrate(50); // Vibrate on complete
     }
     onUpdate({
         ...log,
         tasks: log.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t)
     });
  };

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        category: 'none',
        completed: false,
      };
      
      onUpdate({
        ...log,
        tasks: [newTask, ...log.tasks]
      });
      setNewTaskText('');
    }
  };

  const now = new Date();
  const dateFormatter = new Intl.DateTimeFormat(isFa ? 'fa-IR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={cn("min-h-screen bg-background text-foreground p-6 md:p-12 flex flex-col transition-colors duration-1000 w-full mx-auto relative overflow-hidden", isFa ? 'font-sans' : 'font-serif')} dir={isFa ? 'rtl' : 'ltr'}>
      
      {/* Background accents (Optional subtle light mode glows) */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      
      <header className="mb-10 w-full max-w-2xl mx-auto z-10 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start w-full mb-4 border-b border-border-strong pb-6 gap-6 sm:gap-0">
           <div className="flex flex-col w-full sm:w-auto">
              <div className="flex justify-between sm:justify-start items-center w-full gap-4">
                <h1 className="text-3xl font-light tracking-tight flex items-center gap-3">
                  <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_color-mix(in_srgb,var(--primary)_40%,transparent)]"></span>
                  {isFa ? `صبح بخیر، ${user.name}` : `Good morning, ${user.name}`}
                </h1>
                <div className="flex items-center gap-1 sm:hidden bg-surface-hover rounded p-1" dir="ltr">
                  <button onClick={() => onUpdateUser({...user, lang: 'en'})} className={cn("text-[10px] font-mono px-2 rounded transition-colors", !isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>EN</button>
                  <button onClick={() => onUpdateUser({...user, lang: 'fa'})} className={cn("text-[12px] font-sans px-2 rounded transition-colors", isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>فا</button>
                </div>
              </div>
              <p className="text-secondary font-mono text-[10px] mt-2 uppercase tracking-widest bg-transparent" dir="ltr">System Status: Morning Protocol Active</p>
           </div>
           <div className={`flex flex-col items-start ${isFa ? 'sm:items-end text-left sm:text-right' : 'sm:items-end text-right'} font-sans w-full sm:w-auto`} dir="ltr">
              <div className="hidden sm:flex items-center gap-1 mb-2 bg-surface-hover rounded p-1" dir="ltr">
                <button onClick={() => onUpdateUser({...user, lang: 'en'})} className={cn("text-[10px] font-mono px-2 py-[2px] rounded transition-colors", !isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>EN</button>
                <button onClick={() => onUpdateUser({...user, lang: 'fa'})} className={cn("text-[12px] font-sans px-2 py-[2px] rounded transition-colors", isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>فا</button>
              </div>
              <p className="text-xl md:text-2xl font-serif italic text-foreground">{dateFormatter.format(now)}</p>
           </div>
        </div>
        
        <div className="p-4 border border-border bg-surface rounded-xl shadow-sm backdrop-blur-sm relative overflow-hidden mt-4">
           <div className={cn("absolute top-0 h-full w-1 bg-primary/50", isFa ? 'right-0' : 'left-0')}></div>
           <p className={cn("text-muted leading-relaxed font-light text-sm md:text-base", isFa ? 'mr-3' : 'ml-3')}>{generateSummary()}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-10 pb-20 w-full max-w-2xl mx-auto z-10">
        
        <section className="space-y-4 relative">
          <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
             <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>
            <h2 className="text-sm font-mono uppercase tracking-widest text-border-strong">{isFa ? 'تمرکز طلایی امروز' : 'Golden Focus Today'}</h2>
            <span className={cn("text-xs font-mono text-secondary", isFa ? 'mr-auto' : 'ml-auto')} dir="ltr">[{toPersianNum(top3Tasks.length, lang)}/3]</span>
          </div>

          <div className="flex flex-col gap-3 min-h-[120px]">
            {top3Tasks.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-secondary py-8 border border-dashed border-border rounded-xl">
                    <p className="text-xs font-mono uppercase tracking-widest">{isFa ? 'تسک‌های مهم امروز را از لیست پایین انتخاب کنید' : 'Select today\'s top priorities from below'}</p>
                </div>
            )}
            {top3Tasks.map(task => (
                <motion.div layoutId={`main-${task.id}`} key={task.id} className="flex items-stretch gap-4 p-4 border border-border bg-surface rounded-xl hover:bg-surface-hover transition-colors shadow-sm">
                    <button onClick={() => handleToggleComplete(task.id)} className="flex-shrink-0 flex items-center justify-center group">
                        {task.completed ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Circle className="w-6 h-6 text-secondary group-hover:text-primary" />}
                    </button>
                    <span onClick={() => handleToggleTop3(task.id)} className={cn("flex-1 text-lg font-light cursor-pointer self-center transition-all relative", task.completed ? "text-secondary" : "text-foreground")}>
                        {task.text}
                        {task.completed && (
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-1/2 left-0 right-0 h-[2px] bg-primary rounded-full transform -translate-y-1/2"
                                style={{ transformOrigin: isFa ? 'right' : 'left' }}
                            />
                        )}
                    </span>
                    <span className="flex-shrink-0 flex items-center justify-center gap-2">
                        <span className="w-6 text-center text-sm text-primary">{CATEGORY_ICONS[task.category] !== '○' ? CATEGORY_ICONS[task.category] : '—'}</span>
                        <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all font-mono text-[10px] px-1">✕</button>
                    </span>
                </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2 border-b border-border pb-2">
            <h2 className="text-sm font-mono uppercase tracking-widest text-border-strong">{isFa ? 'ساندباکس فعالیت‌ها' : 'Activity Sandbox'}</h2>
          </div>
          
          <form className="relative mb-6" onSubmit={handleAddTask}>
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder={isFa ? "نیاز به انجام کار جدیدی دارید؟ (Enter بزنید)" : "Need to add a new task? (Press Enter)"}
              className="w-full bg-surface border border-border rounded-xl py-3 px-4 text-base font-light focus:outline-none focus:border-primary/50 focus:bg-background transition-colors placeholder:text-secondary shadow-sm"
            />
            <button type="submit" className="hidden">Submit</button>
          </form>
          
          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto px-1 pb-4">
            {sandboxTasks.length === 0 && (
                 <p className="text-secondary text-xs font-mono text-center py-6 uppercase tracking-widest">{isFa ? 'لیست خالی است' : 'List is empty'}</p>
            )}
            {sandboxTasks.map(task => (
                <motion.div layoutId={`sandbox-${task.id}`} key={task.id} className="flex items-stretch gap-4 p-3 border border-transparent hover:border-border bg-transparent hover:bg-surface transition-all rounded-lg group">
                     <button onClick={() => handleToggleComplete(task.id)} className="flex-shrink-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                        {task.completed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-secondary" />}
                    </button>
                    <div className="flex-1 self-center relative w-full overflow-hidden">
                        <span className={cn("text-base font-light transition-all", task.completed ? "text-secondary" : "text-muted")}>
                            {task.text}
                        </span>
                        {task.completed && (
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="absolute top-1/2 left-0 w-full h-[2px] bg-primary rounded-full transform -translate-y-1/2"
                                style={{ transformOrigin: isFa ? 'right' : 'left' }}
                            />
                        )}
                    </div>
                    
                    {!task.completed && top3Tasks.length < 3 && (
                        <button onClick={() => handleToggleTop3(task.id)} className={cn("opacity-0 group-hover:opacity-100 text-primary text-[10px] font-mono border border-primary/30 px-3 py-1.5 rounded transition-all self-center hover:bg-primary/10 uppercase tracking-widest w-content whitespace-nowrap", isFa ? "mr-auto" : "ml-auto")}>
                            {isFa ? '+ تمرکز' : '+ Focus'}
                        </button>
                    )}
                    
                    <span className="flex-shrink-0 flex items-center justify-center gap-2">
                        <span className="w-6 text-center text-sm text-secondary opacity-50">{CATEGORY_ICONS[task.category] !== '○' ? CATEGORY_ICONS[task.category] : '—'}</span>
                        <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all font-mono text-[10px] px-1">✕</button>
                    </span>
                </motion.div>
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
