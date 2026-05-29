import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, BarChart2, Sun, Moon, Globe, User, X } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface Props {
  isNight: boolean;
  onToggleNight: () => void;
  onShowInsights: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onRenameRequest: () => void;
}

export default function SettingsMenu({ isNight, onToggleNight, onShowInsights, user, onUpdateUser, onRenameRequest }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isFa = user.lang === 'fa';

  const menuItems = [
    {
      id: 'insights',
      icon: <BarChart2 size={20} />,
      label: isFa ? 'آنالیز دیتا' : 'Insights',
      onClick: () => {
        onShowInsights();
        setIsOpen(false);
      }
    },
    {
      id: 'theme',
      icon: isNight ? <Sun size={20} /> : <Moon size={20} />,
      label: isFa ? 'تغییر مود' : 'Toggle Theme',
      onClick: () => {
        onToggleNight();
      }
    },
    {
      id: 'lang',
      icon: <Globe size={20} />,
      label: isFa ? 'English' : 'فارسی',
      onClick: () => {
        onUpdateUser({ ...user, lang: isFa ? 'en' : 'fa' });
        // Auto-close on lang change is generally good
        setIsOpen(false);
      }
    },
    {
      id: 'rename',
      icon: <User size={20} />,
      label: isFa ? 'تغییر نام' : 'Rename',
      onClick: () => {
        onRenameRequest();
        setIsOpen(false);
      }
    }
  ];

  const RADIUS = 110;

  const getPosition = (index: number) => {
    const count = menuItems.length;
    const angleDeg = (index / (count - 1)) * 90; 
    const angleRad = (angleDeg * Math.PI) / 180;
    const dirX = isFa ? -1 : 1;
    const x = Math.cos(angleRad) * RADIUS * dirX;
    const y = -Math.sin(angleRad) * RADIUS;
    return { x, y };
  };

  return (
    <div className={cn("fixed bottom-8 z-50", isFa ? "right-8" : "left-8")}>
      <div className="relative flex items-center justify-center">
         
         {/* Background invisible overlay when open to handle clicking outside */}
         {isOpen && (
           <div 
             className="fixed inset-0 z-0 bg-transparent" 
             onClick={() => setIsOpen(false)}
             aria-hidden="true"
           />
         )}

         {/* Menu Items */}
         <AnimatePresence>
           {isOpen && menuItems.map((item, index) => {
             const { x, y } = getPosition(index);
             return (
               <motion.button
                 key={item.id}
                 initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                 animate={{ x, y, scale: 1, opacity: 1 }}
                 exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                 transition={{
                   type: "spring",
                   stiffness: 400,
                   damping: 25,
                   delay: index * 0.05
                 }}
                 onClick={item.onClick}
                 className={cn(
                   "absolute z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border transition-colors group cursor-pointer active:scale-95",
                   isNight ? "bg-surface border-white/10 text-foreground hover:bg-surface-hover hover:border-primary/50" : "bg-white/50 border-white/40 text-black hover:bg-white/70 hover:border-primary/50"
                 )}
               >
                 {item.icon}
                 <div className={cn(
                   "absolute -bottom-8 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap text-[10px] md:text-xs font-medium px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg border backdrop-blur-xl",
                   isNight ? "bg-surface/90 border-white/10 text-white" : "bg-white border-black/10 text-black"
                 )}>
                   {item.label}
                 </div>
               </motion.button>
             );
           })}
         </AnimatePresence>

         {/* Main FAB Button */}
         <motion.button
           onClick={() => setIsOpen(!isOpen)}
           animate={{
             scale: isOpen ? 0.85 : 1,
           }}
           whileTap={{ scale: 0.95 }}
           className={cn(
             "relative z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md border transition-colors cursor-pointer",
             isNight ? (isOpen ? "bg-surface border-white/20 text-primary hover:bg-surface/90" : "bg-surface/50 border-white/10 text-foreground hover:bg-surface") : (isOpen ? "bg-white/90 border-white/40 text-primary hover:bg-white" : "bg-white/40 border-white/30 text-black hover:bg-white/60")
           )}
           aria-label="Settings"
           title={isFa ? 'تنظیمات' : 'Settings'}
         >
            <motion.div
              initial={false}
              animate={{ 
                rotate: isOpen ? 180 : 0,
                scale: isOpen ? 0 : 1,
                opacity: isOpen ? 0 : 1
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Settings size={28} />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ 
                rotate: isOpen ? 0 : -180,
                scale: isOpen ? 1 : 0,
                opacity: isOpen ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <X size={28} />
            </motion.div>
         </motion.button>

      </div>
    </div>
  );
}
