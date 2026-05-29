import { useEffect, useState } from 'react';
import NightMode from './components/NightMode';
import MorningMode from './components/MorningMode';
import SleepingScreen from './components/SleepingScreen';
import Onboarding from './components/Onboarding';
import Insights from './components/Insights';
import { getDailyLog, saveDailyLog, getUserProfile, saveUserProfile } from './store/db';
import { DailyLog, UserProfile } from './types';
import { AnimatePresence, motion } from 'motion/react';

const getActionDate = () => {
  return new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().split('T')[0];
};

const checkIsNight = () => {
  const hour = new Date().getHours();
  // Night falls strictly after 8 PM (20) until 5 AM (5)
  return hour >= 20 || hour < 5;
};

export default function App() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isNight, setIsNight] = useState(checkIsNight());
  const [loading, setLoading] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  const actionDate = getActionDate();

  useEffect(() => {
    let mounted = true;
    if ('Notification' in window) {
        Notification.requestPermission();
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    Promise.all([
      getDailyLog(actionDate),
      getUserProfile()
    ]).then(([logData, profileData]) => {
      if (mounted) {
        setLog(logData);
        setUserProfile(profileData);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [actionDate]);

  useEffect(() => {
    let lastNotifiedHour = new Date().getHours();
    const interval = setInterval(() => {
      setIsNight(checkIsNight());
      
      const hour = new Date().getHours();
      if (hour !== lastNotifiedHour) {
         if (hour === 22) { // 10 PM
            if ('Notification' in window && Notification.permission === 'granted') {
               new Notification(userProfile?.lang === 'fa' ? "زمان تخلیه ذهن" : "Mind Dump Time", {
                   body: userProfile?.lang === 'fa' ? "ذهنت شلوغه؟ قبل خواب خالیش کن تا راحت‌تر بخوابی." : "Mind full? Unload it before sleep.",
                   icon: '/icon.png' // Add an icon if present
               });
            }
         } else if (hour === 8) { // 8 AM
            if ('Notification' in window && Notification.permission === 'granted') {
               new Notification(userProfile?.lang === 'fa' ? "تمرکز صبحگاهی" : "Morning Focus", {
                   body: userProfile?.lang === 'fa' ? "نقشه راه امروزت آماده‌ست. بازش کن تا ۳ تمرکز اصلیت رو ببینی." : "Your roadmap is ready. Open to see your top 3 focuses.",
                   icon: '/icon.png'
               });
            }
         }
         lastNotifiedHour = hour;
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [userProfile?.lang]);

  const handleUpdate = async (newLog: DailyLog) => {
    setLog(newLog);
    await saveDailyLog(newLog);
  };

  const handleUpdateUser = async (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    await saveUserProfile(newProfile);
  };
  
  const handleWakeUp = () => {
     handleUpdate({
         ...log!,
         nightMood: {
            ...log!.nightMood!,
            bedTime: ''
         }
     });
  };

  if (loading) return null;
  
  if (!userProfile) {
    return (
      <Onboarding onComplete={(profile) => {
         setUserProfile(profile);
         saveUserProfile(profile);
      }} />
    );
  }

  const isSleeping = isNight && !!log?.nightMood?.bedTime;

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-background text-foreground font-sans">
      <AnimatePresence mode="wait">
        {isSleeping ? (
            <motion.div key="sleep" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <SleepingScreen onWake={handleWakeUp} lang={userProfile.lang} />
            </motion.div>
        ) : isNight ? (
            <motion.div key="night" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <NightMode log={log!} onUpdate={handleUpdate} user={userProfile} onUpdateUser={handleUpdateUser} />
            </motion.div>
        ) : (
          <motion.div key="morning" className="w-full h-full bg-background theme-morning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <MorningMode log={log!} onUpdate={handleUpdate} user={userProfile} onUpdateUser={handleUpdateUser} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showInsights && <Insights user={userProfile} onClose={() => setShowInsights(false)} />}
      </AnimatePresence>
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        <button 
          onClick={() => setIsNight(!isNight)}
          className="bg-surface border border-border p-3 rounded-full text-foreground shadow-lg hover:bg-surface-hover hover:scale-105 active:scale-95 transition-all group focus:outline-none flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {isNight ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-primary transition-colors"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-primary transition-colors"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>
        <button 
          onClick={() => setShowInsights(true)}
          className="bg-surface border border-border p-3 rounded-full text-foreground shadow-lg hover:bg-surface-hover hover:scale-105 active:scale-95 transition-all group focus:outline-none flex items-center justify-center"
          aria-label="Show Insights"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-primary transition-colors"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </button>
      </div>
    </div>
  );
}
