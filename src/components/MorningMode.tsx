import React, { useMemo, useState } from 'react';
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
      
      {/* Background accents */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 md:w-[500px] md:h-[500px] bg-yellow-900/10 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      
      <header className="mb-10 w-full max-w-2xl mx-auto z-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-6 sm:gap-0">
           <div className="flex flex-col w-full sm:w-auto">
              <div className="flex justify-between sm:justify-start items-center w-full gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-light tracking-tight flex items-center gap-2">
                      {getGreeting(user.name, isFa)}
                    </h1>
                    <p className="text-secondary font-mono text-[10px] mt-1 uppercase tracking-widest flex items-center gap-2" dir={isFa ? "rtl" : "ltr"}>
                      <span className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-pulse"></span>
                      {isFa ? 'پروتکل صبحگاهی' : 'Morning Protocol'}
                    </p>
                  </div>
                </div>
              </div>
           </div>
           <div className={`flex flex-col items-start ${isFa ? 'sm:items-end text-left sm:text-right' : 'sm:items-end text-right'} font-sans w-full sm:w-auto`} dir="ltr">
              <p className="text-xl md:text-2xl font-serif italic text-foreground leading-none">{dateFormatter.format(now)}</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-5 border border-border bg-surface rounded-2xl shadow-sm relative overflow-hidden backdrop-blur-sm flex flex-col justify-center">
              <div className={cn("absolute top-0 h-full w-1 bg-primary/50", isFa ? 'right-0' : 'left-0')}></div>
              <span className="text-xs font-mono uppercase tracking-widest text-muted mb-2">{isFa ? 'وضعیت فعلی شما' : 'Current Status'}</span>
              <p className="text-foreground leading-relaxed font-light text-sm">{generateSummary()}</p>
           </div>
           <div className="p-5 border border-border bg-surface rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-muted">{isFa ? 'خلاصه وظایف' : 'Task Overview'}</span>
              <div className="flex gap-4 items-center">
                 <div className="flex flex-col">
                    <span className="text-2xl font-serif text-foreground">{toPersianNum(log.tasks.length, lang)}</span>
                    <span className="text-xs text-secondary">{isFa ? 'کل تسک‌ها' : 'Total'}</span>
                 </div>
                 <div className="w-[1px] h-8 bg-border"></div>
                 <div className="flex flex-col">
                    <span className="text-2xl font-serif text-primary">{toPersianNum(log.tasks.filter(t => t.completed).length, lang)}</span>
                    <span className="text-xs text-secondary">{isFa ? 'انجام شده' : 'Done'}</span>
                 </div>
              </div>
           </div>
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
                    <p className="text-xs font-mono uppercase tracking-widest px-4 text-center">{isFa ? 'تسک‌های مهم امروز را از لیست پایین انتخاب کنید' : 'Select today\'s top priorities from below'}</p>
                </div>
            )}
            {top3Tasks.map(task => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    isFa={isFa}
                    variant="morning-main"
                    layoutId={`main-${task.id}`}
                    onToggleComplete={handleToggleComplete}
                    onToggleTop3={handleToggleTop3}
                    onDelete={handleDeleteTask}
                />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2 border-b border-border pb-2">
            <h2 className="text-sm font-mono uppercase tracking-widest text-border-strong">{isFa ? 'ساندباکس فعالیت‌ها' : 'Activity Sandbox'}</h2>
          </div>
          
          <form className="relative mb-6 group" onSubmit={handleAddTask}>
            <div className="flex flex-row items-center bg-surface border border-border rounded-xl focus-within:border-primary/50 focus-within:bg-background transition-all shadow-sm">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder={isFa ? "نیاز به انجام کار جدیدی دارید؟" : "Need to add a new task?"}
                className="flex-1 bg-transparent py-4 px-5 text-base font-light focus:outline-none placeholder:text-secondary"
                style={{ fontSize: '16px' }} // Prevent iOS Zoom
              />
              <button 
                type="submit" 
                disabled={!newTaskText.trim()}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-background transition-all active:scale-95 disabled:opacity-30 disabled:active:scale-100 disabled:cursor-not-allowed hover:bg-primary/90",
                  isFa ? "ml-2" : "mr-2"
                )}
                aria-label={isFa ? "ثبت تسک" : "Add task"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-muted text-[10px] font-mono tracking-widest uppercase opacity-0 group-focus-within:opacity-100 transition-opacity hidden md:block">
               [ Press Enter ]
             </div>
          </form>
          
          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto px-1 pb-4">
            {sandboxTasks.length === 0 && (
                 <p className="text-secondary text-xs font-mono text-center py-6 uppercase tracking-widest">{isFa ? 'لیست خالی است' : 'List is empty'}</p>
            )}
            {sandboxTasks.map(task => (
                 <TaskItem 
                    key={task.id}
                    task={task}
                    isFa={isFa}
                    variant="morning-sandbox"
                    layoutId={`sandbox-${task.id}`}
                    showFocusButton={true}
                    canAddTop3={top3Tasks.length < 3}
                    onToggleComplete={handleToggleComplete}
                    onToggleTop3={handleToggleTop3}
                    onDelete={handleDeleteTask}
                />
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
