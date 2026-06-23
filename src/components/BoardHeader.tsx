import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Sparkles, X, Zap } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { Task } from './data';
interface BoardHeaderProps {
  tasks: Task[];
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  highPriorityOnly: boolean;
  onToggleHighPriority: () => void;
  onNewTask: () => void;
}
export function BoardHeader({
  tasks,
  filteredCount,
  searchQuery,
  onSearchChange,
  highPriorityOnly,
  onToggleHighPriority,
  onNewTask
}: BoardHeaderProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Done').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const todo = tasks.filter((t) => t.status === 'To Do').length;
  const percent = total === 0 ? 0 : done / total * 100;
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const hasActiveFilters = searchQuery.length > 0 || highPriorityOnly;
  return (
    <div className="px-6 pt-4 pb-3 flex flex-col gap-4">
      {/* Stats card */}
      <motion.div
        initial={{
          opacity: 0,
          y: -8
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16161a] to-[#111114] border border-white/5 p-5">
        
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <ProgressRing percent={percent} />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Board Progress
              </div>
              <div className="text-xl font-bold text-white tracking-tight">
                {done} of {total} {total === 1 ? 'task' : 'tasks'} complete
              </div>
              <div className="text-xs text-slate-400">
                Keep up the momentum — you're doing great.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatPill
              label="To Do"
              value={todo}
              dotClass="bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
            
            <StatPill
              label="In Progress"
              value={inProgress}
              dotClass="bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            
            <StatPill
              label="Done"
              value={done}
              dotClass="bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
            
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="relative mt-5 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{
              width: 0
            }}
            animate={{
              width: `${percent}%`
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          
        </div>
      </motion.div>

      {/* Toolbar: search + filters + new task */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 rounded-lg bg-[#16161a] border border-white/5 focus-within:border-cyan-400/40 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.08)] transition-all">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 min-w-0" />
          
          {searchQuery &&
          <button
            onClick={() => onSearchChange('')}
            className="p-0.5 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
            
              <X className="w-3.5 h-3.5" />
            </button>
          }
        </div>

        <button
          onClick={onToggleHighPriority}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${highPriorityOnly ? 'bg-rose-400/10 border-rose-400/30 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.2)]' : 'bg-[#16161a] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'}`}>
          
          <Zap
            className={`w-3.5 h-3.5 ${highPriorityOnly ? 'fill-rose-400' : ''}`} />
          
          High Priority
          <span
            className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${highPriorityOnly ? 'bg-rose-400/20' : 'bg-white/5'}`}>
            
            {highCount}
          </span>
        </button>

        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-[0_0_12px_rgba(34,211,238,0.3)] hover:shadow-[0_0_18px_rgba(34,211,238,0.5)]">
          
          <Plus className="w-3.5 h-3.5" />
          New Task
        </button>
      </div>

      {hasActiveFilters &&
      <motion.div
        initial={{
          opacity: 0,
          y: -4
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="text-xs text-slate-500">
        
          Showing{' '}
          <span className="text-slate-300 font-medium">{filteredCount}</span> of{' '}
          {total} tasks
        </motion.div>
      }
    </div>);

}
function StatPill({
  label,
  value,
  dotClass




}: {label: string;value: number;dotClass: string;}) {
  return (
    <div className="hidden sm:flex flex-col items-center gap-0.5 min-w-[64px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-base font-bold text-white">{value}</span>
    </div>);

}