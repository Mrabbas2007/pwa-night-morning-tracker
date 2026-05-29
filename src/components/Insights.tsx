import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DailyLog, UserProfile } from '../types';
import { getAllLogs } from '../store/db';
import { cn, toPersianNum } from '../lib/utils';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export default function Insights({ onClose, user, onUpdateUser }: Props) {
  const isFa = user.lang === 'fa';
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    getAllLogs().then(setLogs);
  }, []);

  const chartData = logs.slice(-7).map(log => ({
    name: isFa ? new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(new Date(log.date)) : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(log.date)),
    tasks: log.tasks.length,
    energy: log.nightMood?.energyPrediction || 0,
  }));

  // Analyze Energy vs Productivity
  let lowEnergyHighOutput = 0;
  logs.forEach(log => {
      if (log.nightMood && log.nightMood.energyPrediction <= 2 && log.tasks.filter(t => t.completed).length > 2) {
          lowEnergyHighOutput++;
      }
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className={cn("fixed inset-0 z-50 bg-background/90 backdrop-blur-md p-6 md:p-12 overflow-y-auto w-full", isFa ? 'font-sans' : 'font-serif')} 
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8 relative">
        <button onClick={onClose} className={cn("absolute top-0 w-10 h-10 flex items-center justify-center border border-border rounded-full text-lg text-secondary hover:text-foreground hover:bg-surface-hover transition-colors font-mono hover:scale-105 active:scale-95", isFa ? 'left-0' : 'right-0')}>✕</button>
        
        <header className="border-b border-border-strong pb-6 mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light text-foreground">{isFa ? 'بینش‌ها و گزارش‌ها' : 'Insights & Analytics'}</h1>
            <p className="text-secondary text-sm mt-2 font-mono uppercase tracking-widest">{isFa ? 'تحلیل الگوهای رفتاری شما' : 'Analyzing your behavioral patterns'}</p>
          </div>
          <div className="flex items-center gap-1 bg-surface-hover border border-border rounded p-1" dir="ltr">
            <button onClick={() => onUpdateUser({...user, lang: 'en'})} className={cn("text-[10px] font-mono px-3 py-1 rounded transition-colors", !isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>EN</button>
            <button onClick={() => onUpdateUser({...user, lang: 'fa'})} className={cn("text-[12px] font-sans px-3 py-1 rounded transition-colors", isFa ? "bg-primary/20 text-primary" : "text-muted hover:text-secondary")}>فا</button>
          </div>
        </header>

        {logs.length < 2 ? (
            <div className="text-center py-20 text-muted">
                {isFa ? 'دیتای کافی برای تحلیل وجود ندارد. چند روز دیگر ثبت کنید.' : 'Not enough data for insights. Log for a few more days.'}
            </div>
        ) : (
            <>
                <section className="bg-surface border border-border rounded-2xl p-6">
                    <h2 className="text-lg text-foreground mb-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                       {isFa ? 'ماتریس انرژی و بهره‌وری' : 'Energy vs. Productivity'}
                    </h2>
                    <p className="text-secondary text-sm leading-relaxed">
                        {lowEnergyHighOutput > 0 ? (
                           isFa ? `${user.name}، تو معمولاً روزهایی که دیشبش انرژی رو کم پیش‌بینی کردی، اتفاقاً تسک‌های بیشتری رو انجام دادی! این نشون میده قدرت اراده‌ات بیشتر از حس خستگیته.` 
                           : `${user.name}, on days you predicted low energy the night before, you actually completed more tasks! Your willpower overcomes your fatigue.`
                        ) : (
                           isFa ? `${user.name}، سطح انرژی پیش‌بینی شده‌ی شبانه‌ات کاملاً با میزان کارهایی که در روز انجام میدی هم‌خوانی داره. حفظ این تعادل عالیه.` 
                           : `${user.name}, your predicted night energy perfectly aligns with your daily output. Great consistency.`
                        )}
                    </p>
                </section>

                <section className="bg-surface border border-border rounded-2xl p-6">
                    <h2 className="text-lg text-foreground mb-6 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                       {isFa ? 'حجم تخلیه ذهن در ۷ روز اخیر' : 'Mind Dump Volume (Last 7 Days)'}
                    </h2>
                    <div className="h-[200px] w-full" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--surface-hover)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Line type="monotone" dataKey="tasks" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--background)', stroke: 'var(--primary)', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </>
        )}
      </div>
    </motion.div>
  );
}
