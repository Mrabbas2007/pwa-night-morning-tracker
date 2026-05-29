import React, { ReactNode } from 'react';
import { Task } from '../../types';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface Props {
  key?: React.Key;
  task: Task;
  isFa: boolean;
  onToggleComplete?: (id: string) => void;
  onToggleTop3?: (id: string) => void;
  onDelete?: (id: string) => void;
  showFocusButton?: boolean;
  isTop3?: boolean;
  canAddTop3?: boolean;
  layoutId?: string;
  variant?: 'morning-main' | 'morning-sandbox' | 'night';
}

const CATEGORY_ICONS = {
  important: '❗',
  routine: '🔄',
  idea: '💡',
  reminder: '🔔',
  none: '○',
};

export default function TaskItem({
  task,
  isFa,
  onToggleComplete,
  onToggleTop3,
  onDelete,
  showFocusButton,
  canAddTop3,
  layoutId,
  variant = 'morning-sandbox',
}: Props) {
  const icon = CATEGORY_ICONS[task.category] !== '○' ? CATEGORY_ICONS[task.category] : '—';
  
  if (variant === 'night') {
    return (
      <motion.li 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border border-border bg-surface rounded-xl group hover:border-border-strong transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-primary text-xs w-6 text-center">{icon}</span>
          <span className="text-lg font-light text-foreground">{task.text}</span>
        </div>
        {onDelete && (
          <button 
             onClick={() => onDelete(task.id)}
             className="opacity-30 md:opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all p-2 font-mono text-[10px]"
             aria-label="Delete task"
          >
              ✕
          </button>
        )}
      </motion.li>
    );
  }

  // Morning main and sandbox variants share a similar structure
  return (
    <motion.div 
        layoutId={layoutId} 
        className={cn(
            "flex items-stretch gap-4 transition-all group",
            variant === 'morning-main' ? "p-4 border border-border bg-surface rounded-xl hover:bg-surface-hover shadow-sm" : "p-3 border border-transparent hover:border-border bg-transparent hover:bg-surface rounded-lg"
        )}
    >
        {onToggleComplete && (
            <button onClick={() => onToggleComplete(task.id)} className={cn("flex-shrink-0 flex items-center justify-center transition-opacity p-1", variant === 'morning-sandbox' ? "opacity-40 group-hover:opacity-100" : "")}>
                {task.completed ? <CheckCircle2 className={cn("text-primary", variant === 'morning-main' ? "w-6 h-6" : "w-5 h-5")} /> : <Circle className={cn("text-secondary hover:text-primary transition-colors", variant === 'morning-main' ? "w-6 h-6" : "w-5 h-5")} />}
            </button>
        )}
        
        <div className="flex-1 self-center relative w-full overflow-hidden flex flex-col justify-center">
            <span 
                onClick={() => onToggleTop3 && onToggleTop3(task.id)} 
                className={cn(
                    "font-light transition-all", 
                    task.completed ? "text-secondary" : (variant === 'morning-main' ? "text-foreground cursor-pointer" : "text-muted"),
                    variant === 'morning-main' ? "text-lg" : "text-base"
                )}
            >
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
        
        {showFocusButton && !task.completed && canAddTop3 && onToggleTop3 && (
            <button 
                onClick={() => onToggleTop3(task.id)} 
                className={cn(
                    "opacity-0 group-hover:opacity-100 text-primary text-[10px] font-mono border border-primary/30 px-3 py-1.5 rounded transition-all self-center hover:bg-primary/10 uppercase tracking-widest whitespace-nowrap active:opacity-100", 
                    isFa ? "mr-auto" : "ml-auto"
                )}
            >
                {isFa ? '+ تمرکز' : '+ Focus'}
            </button>
        )}
        
        <div className="flex-shrink-0 flex items-center justify-center gap-1">
            <span className={cn("text-center text-sm w-6", variant === 'morning-main' ? "text-primary" : "text-secondary opacity-50")}>{icon}</span>
            {onDelete && (
                <button 
                    onClick={() => onDelete(task.id)} 
                    className="opacity-30 md:opacity-0 group-hover:opacity-100 text-muted hover:text-primary transition-all font-mono text-[10px] p-2"
                    aria-label="Delete task"
                >
                    ✕
                </button>
            )}
        </div>
    </motion.div>
  );
}
