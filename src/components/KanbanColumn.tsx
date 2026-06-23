import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Status, Task } from './data';
import { TaskCard } from './TaskCard';
import { EmptyColumn } from './EmptyColumn';
interface KanbanColumnProps {
  title: Status;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (id: string) => void;
}
export function KanbanColumn({
  title,
  tasks,
  onAddTask,
  onTaskClick
}: KanbanColumnProps) {
  const config = {
    'To Do': {
      dot: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
      border: 'border-t-yellow-400/30'
    },
    'In Progress': {
      dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]',
      border: 'border-t-cyan-400/30'
    },
    Done: {
      dot: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]',
      border: 'border-t-green-400/30'
    }
  };
  const { dot, border } = config[title];
  return (
    <div className="flex flex-col flex-shrink-0 w-80 md:w-80 lg:w-[340px] max-h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dot}`} />
          <h3 className="text-sm font-semibold text-slate-200 tracking-tight">
            {title}
          </h3>
          <motion.span
            key={tasks.length}
            initial={{
              scale: 0.6,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            className="ml-2 px-2 py-0.5 rounded-full bg-white/5 text-xs font-medium text-slate-400">
            
            {tasks.length}
          </motion.span>
        </div>
        <button
          onClick={onAddTask}
          aria-label={`Add task to ${title}`}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
          
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`flex flex-col gap-3 p-3 rounded-2xl bg-[#16161a] border border-white/5 border-t-2 ${border} overflow-y-auto min-h-[150px] custom-scrollbar`}>
        
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.length === 0 ?
          <motion.div
            key="empty"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}>
            
              <EmptyColumn status={title} onAddTask={onAddTask} />
            </motion.div> :

          tasks.map((task) =>
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task.id)} />

          )
          }
        </AnimatePresence>

        {tasks.length > 0 &&
        <button
          onClick={onAddTask}
          className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/20 transition-all">
          
            <Plus className="w-4 h-4" />
            Add task
          </button>
        }
      </div>
    </div>);

}