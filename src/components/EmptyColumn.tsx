import React from 'react';
import { motion } from 'framer-motion';
import { Status } from './data';
import { CheckCircle2, Inbox, Loader2 } from 'lucide-react';
interface EmptyColumnProps {
  status: Status;
  onAddTask: () => void;
}
export function EmptyColumn({ status, onAddTask }: EmptyColumnProps) {
  const config = {
    'To Do': {
      icon: <Inbox className="w-5 h-5 text-yellow-400" />,
      ring: 'bg-yellow-400/10 border-yellow-400/20',
      title: 'All clear',
      copy: 'No pending tasks. Add one to get started.',
      cta: 'Add a task'
    },
    'In Progress': {
      icon: <Loader2 className="w-5 h-5 text-cyan-400" />,
      ring: 'bg-cyan-400/10 border-cyan-400/20',
      title: 'Nothing in flight',
      copy: 'Move a task here to start working on it.',
      cta: 'Add a task'
    },
    Done: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      ring: 'bg-green-400/10 border-green-400/20',
      title: 'Nothing done yet',
      copy: 'Finished tasks will live here.',
      cta: 'Add a task'
    }
  }[status];
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3
      }}
      className="flex flex-col items-center justify-center text-center gap-3 py-10 px-4 rounded-xl border border-dashed border-white/10">
      
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border ${config.ring}`}>
        
        {config.icon}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-200">{config.title}</div>
        <div className="text-xs text-slate-500 mt-0.5 max-w-[200px]">
          {config.copy}
        </div>
      </div>
      <button
        onClick={onAddTask}
        className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
        
        {config.cta} →
      </button>
    </motion.div>);

}