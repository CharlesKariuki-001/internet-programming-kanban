import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlarmClock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Flame,
  ListTodo } from
'lucide-react';
import { useAllTasks } from '../hooks/useTasks';
import { useBoards } from '../context/BoardsContext';
import { Avatar } from '../components/Avatar';
import { PriorityBadge } from '../components/PriorityBadge';
const TODAY = new Date('2023-10-26');
function daysFromToday(dateStr: string) {
  const d = new Date(dateStr);
  return Math.round((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}
interface DashboardProps {
  onOpenBoard: (boardId: string) => void;
}
export function Dashboard({ onOpenBoard }: DashboardProps) {
  const { tasks, isLoading } = useAllTasks();
  const { boards } = useBoards();
  const activeTasks = tasks.filter((t) => t.status !== 'Done');
  const overdue = activeTasks.filter((t) => daysFromToday(t.dueDate) < 0);
  const dueToday = activeTasks.filter((t) => daysFromToday(t.dueDate) === 0);
  const completedThisWeek = tasks.filter((t) => {
    if (t.status !== 'Done' || !t.completedAt) return false;
    return daysFromToday(t.completedAt) >= -7;
  });
  // Urgent feed: High priority + active, sorted by due date soonest first
  const urgent = activeTasks.
  filter((t) => t.priority === 'High').
  sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  ).
  slice(0, 6);
  const stats = [
  {
    label: 'Active Tasks',
    value: activeTasks.length,
    icon: <ListTodo className="w-4 h-4" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20'
  },
  {
    label: 'Overdue',
    value: overdue.length,
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20'
  },
  {
    label: 'Due Today',
    value: dueToday.length,
    icon: <AlarmClock className="w-4 h-4" />,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20'
  },
  {
    label: 'Completed (7d)',
    value: completedThisWeek.length,
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20'
  }];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Good to see you back
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Here's a quick pulse on everything across your boards.
          </p>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) =>
          <motion.div
            key={s.label}
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: i * 0.05
            }}
            className={`relative overflow-hidden rounded-2xl bg-[#16161a] border ${s.border} p-4`}>
            
              <div
              className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${s.bg} blur-2xl pointer-events-none`} />
            
              <div
              className={`relative w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              
                {s.icon}
              </div>
              <div className="relative text-3xl font-bold text-white tabular-nums">
                {isLoading ? '–' : s.value}
              </div>
              <div className="relative text-xs text-slate-400 mt-1">
                {s.label}
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Urgent feed */}
          <div className="lg:col-span-2 rounded-2xl bg-[#16161a] border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-400/10 text-rose-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Urgent Queue
                  </div>
                  <div className="text-xs text-slate-500">
                    High-priority tasks by due date
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {urgent.length} tasks
              </span>
            </div>

            {urgent.length === 0 ?
            <div className="flex flex-col items-center justify-center text-center gap-2 py-10">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div className="text-sm font-medium text-slate-200">
                  No urgent tasks
                </div>
                <div className="text-xs text-slate-500">
                  You're caught up on high-priority work.
                </div>
              </div> :

            <div className="flex flex-col gap-2">
                {urgent.map((t, i) => {
                const board = boards.find((b) => b.id === t.boardId);
                const dayDelta = daysFromToday(t.dueDate);
                const isOverdue = dayDelta < 0;
                return (
                  <motion.button
                    key={t.id}
                    initial={{
                      opacity: 0,
                      x: -8
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: i * 0.04
                    }}
                    onClick={() => onOpenBoard(t.boardId)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-[#1c1c22] border border-white/5 hover:border-rose-400/30 hover:bg-[#1c1c22]/80 transition-all text-left">
                    
                      <Avatar user={t.assignee} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {t.title}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          {board &&
                        <span className="flex items-center gap-1">
                              <span
                            className={`w-1.5 h-1.5 rounded-full ${board.color}`} />
                          
                              {board.name}
                            </span>
                        }
                          <span>·</span>
                          <span className={isOverdue ? 'text-rose-400' : ''}>
                            {isOverdue ?
                          `${Math.abs(dayDelta)}d overdue` :
                          dayDelta === 0 ?
                          'Due today' :
                          `Due in ${dayDelta}d`}
                          </span>
                        </div>
                      </div>
                      <PriorityBadge priority={t.priority} />
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                    </motion.button>);

              })}
              </div>
            }
          </div>

          {/* Activity column */}
          <div className="rounded-2xl bg-[#16161a] border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Your Boards
                </div>
                <div className="text-xs text-slate-500">
                  {boards.length} active
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {boards.map((b) => {
                const boardTasks = tasks.filter((t) => t.boardId === b.id);
                const done = boardTasks.filter(
                  (t) => t.status === 'Done'
                ).length;
                const percent =
                boardTasks.length === 0 ?
                0 :
                Math.round(done / boardTasks.length * 100);
                return (
                  <button
                    key={b.id}
                    onClick={() => onOpenBoard(b.id)}
                    className="group p-3 rounded-xl bg-[#1c1c22] border border-white/5 hover:border-cyan-400/30 transition-all text-left">
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full ${b.color} flex-shrink-0`} />
                        
                        <span className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                          {b.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums">
                        {percent}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{
                          width: 0
                        }}
                        animate={{
                          width: `${percent}%`
                        }}
                        transition={{
                          duration: 0.6,
                          ease: 'easeOut'
                        }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                      
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1.5">
                      {done}/{boardTasks.length} complete
                    </div>
                  </button>);

              })}
            </div>
          </div>
        </div>
      </div>
    </div>);

}