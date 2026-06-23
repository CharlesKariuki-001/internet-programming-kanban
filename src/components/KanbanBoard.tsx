import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, SearchX, RefreshCw } from 'lucide-react';
import { Status, Task } from './data';
import { KanbanColumn } from './KanbanColumn';
import { AddTaskModal } from './AddTaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import { BoardHeader } from './BoardHeader';
import { useTasks } from '../hooks/useTasks';
import { useBoards } from '../context/BoardsContext';
export function KanbanBoard() {
  const {
    tasks,
    isLoading,
    error,
    refetch,
    createTask,
    updateStatus,
    deleteTask
  } = useTasks();
  const { activeBoardId } = useBoards();
  const [addModalStatus, setAddModalStatus] = useState<Status | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const columns: Status[] = ['To Do', 'In Progress', 'Done'];
  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      if (highPriorityOnly && t.priority !== 'High') return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q));

    });
  }, [tasks, searchQuery, highPriorityOnly]);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const hasActiveFilters = searchQuery.length > 0 || highPriorityOnly;
  // Wrap createTask to inject boardId
  const handleCreateTask = (task: Task) =>
  createTask({
    ...task,
    boardId: activeBoardId
  });
  if (isLoading && tasks.length === 0 && !error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex flex-col items-center gap-3 text-slate-400">
          
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
            <Loader2 className="relative w-7 h-7 animate-spin text-cyan-400" />
          </div>
          <span className="text-sm font-medium">Syncing your board…</span>
        </motion.div>
      </div>);

  }
  if (error && tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex flex-col items-center text-center gap-3 max-w-sm">
          
          <div className="w-12 h-12 rounded-full bg-rose-400/10 border border-rose-400/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">
              Couldn't load tasks
            </div>
            <div className="text-xs text-slate-500 mt-1 break-words">
              {error}
            </div>
          </div>
          <button
            onClick={() => void refetch()}
            className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </motion.div>
      </div>);

  }
  return (
    <>
      <BoardHeader
        tasks={tasks}
        filteredCount={filteredTasks.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        highPriorityOnly={highPriorityOnly}
        onToggleHighPriority={() => setHighPriorityOnly((v) => !v)}
        onNewTask={() => setAddModalStatus('To Do')} />
      

      <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6">
        {hasActiveFilters && filteredTasks.length === 0 ?
        <motion.div
          initial={{
            opacity: 0,
            y: 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="h-full flex flex-col items-center justify-center text-center gap-3 text-slate-400">
          
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <SearchX className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">
                No tasks match your filters
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Try clearing the search or filter chips.
              </div>
            </div>
          </motion.div> :

        <div className="flex items-start gap-6 h-full snap-x snap-mandatory">
            {columns.map((status) =>
          <div key={status} className="snap-center h-full">
                <KanbanColumn
              title={status}
              tasks={filteredTasks.filter((t) => t.status === status)}
              onAddTask={() => setAddModalStatus(status)}
              onTaskClick={(id) => setSelectedTaskId(id)} />
            
              </div>
          )}
          </div>
        }
      </div>

      <AddTaskModal
        isOpen={addModalStatus !== null}
        onClose={() => setAddModalStatus(null)}
        defaultStatus={addModalStatus ?? 'To Do'}
        onCreate={handleCreateTask} />
      

      <TaskDetailModal
        task={selectedTask}
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
        onStatusChange={updateStatus}
        onDelete={deleteTask} />
      
    </>);

}