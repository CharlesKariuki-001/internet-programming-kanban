import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { Task } from './data';
import { Avatar } from './Avatar';
import { PriorityBadge } from './PriorityBadge';
interface TaskCardProps {
  task: Task;
  onClick: () => void;
}
export function TaskCard({ task, onClick }: TaskCardProps) {
  const isOverdue =
  new Date(task.dueDate) < new Date('2023-10-26') && task.status !== 'Done';
  // Per-status hover glow color
  const accent =
  task.status === 'To Do' ?
  'group-hover:shadow-[0_8px_30px_-8px_rgba(250,204,21,0.25)] group-hover:border-yellow-400/30' :
  task.status === 'In Progress' ?
  'group-hover:shadow-[0_8px_30px_-8px_rgba(34,211,238,0.3)] group-hover:border-cyan-400/30' :
  'group-hover:shadow-[0_8px_30px_-8px_rgba(74,222,128,0.3)] group-hover:border-green-400/30';
  // Side accent stripe color
  const stripe =
  task.status === 'To Do' ?
  'bg-gradient-to-b from-yellow-400 to-amber-500' :
  task.status === 'In Progress' ?
  'bg-gradient-to-b from-cyan-400 to-blue-500' :
  'bg-gradient-to-b from-green-400 to-emerald-500';
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 12,
        scale: 0.96
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: {
          duration: 0.18
        }
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 28
      }}
      whileHover={{
        y: -3
      }}
      whileTap={{
        scale: 0.98
      }}
      onClick={onClick}
      className={`group relative flex flex-col gap-3 p-4 pl-5 rounded-xl bg-[#1c1c22] border border-white/5 cursor-pointer overflow-hidden transition-all duration-300 ${accent}`}>
      
      {/* Side accent stripe — appears on hover */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${stripe} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-200 leading-snug group-hover:text-white transition-colors">
          {task.title}
        </h4>
      </div>

      {task.description &&
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      }

      <div className="mt-1 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />

          <div
            className={`flex items-center text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${isOverdue ? 'text-rose-400 bg-rose-400/10 group-hover:bg-rose-400/15' : 'text-slate-400 bg-white/5 group-hover:bg-white/10'}`}>
            
            <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="pt-3 mt-1 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500">
          {task.comments > 0 &&
          <div className="flex items-center text-xs hover:text-slate-300 transition-colors">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              {task.comments}
            </div>
          }
          {task.attachments > 0 &&
          <div className="flex items-center text-xs hover:text-slate-300 transition-colors">
              <Paperclip className="w-3.5 h-3.5 mr-1" />
              {task.attachments}
            </div>
          }
        </div>
        <motion.div
          whileHover={{
            scale: 1.1
          }}
          transition={{
            type: 'spring',
            stiffness: 400
          }}>
          
          <Avatar user={task.assignee} size="sm" />
        </motion.div>
      </div>
    </motion.div>);

}