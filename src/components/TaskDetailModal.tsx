import React from 'react';
import { Modal } from './Modal';
import { Status, Task } from './data';
import { Avatar } from './Avatar';
import { PriorityBadge } from './PriorityBadge';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Trash2,
  User as UserIcon } from
'lucide-react';
interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}
const statusOptions: {
  value: Status;
  dot: string;
  active: string;
}[] = [
{
  value: 'To Do',
  dot: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
  active: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300'
},
{
  value: 'In Progress',
  dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]',
  active: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
},
{
  value: 'Done',
  dot: 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]',
  active: 'bg-green-400/10 border-green-400/30 text-green-300'
}];

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onStatusChange,
  onDelete
}: TaskDetailModalProps) {
  if (!task) return null;
  const isOverdue =
  new Date(task.dueDate) < new Date('2023-10-26') && task.status !== 'Done';
  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-white leading-snug tracking-tight">
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
          </div>
          {task.description &&
          <p className="text-sm text-slate-400 leading-relaxed">
              {task.description}
            </p>
          }
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Assignee
            </span>
            <div className="flex items-center gap-2">
              <Avatar user={task.assignee} size="sm" />
              <span className="text-sm text-slate-200">
                {task.assignee.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Due Date
            </span>
            <div
              className={`flex items-center gap-1.5 text-sm ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
              
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              {isOverdue &&
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-rose-400/10 ml-1">
                  Overdue
                </span>
              }
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Status
          </span>
          <div className="grid grid-cols-3 gap-2">
            {statusOptions.map((opt) => {
              const isActive = task.status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(task.id, opt.value)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${isActive ? opt.active : 'border-white/10 text-slate-400 bg-white/5 hover:bg-white/10'}`}>
                  
                  <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                  {opt.value}
                </button>);

            })}
          </div>
        </div>

        {(task.comments > 0 || task.attachments > 0) &&
        <div className="flex items-center gap-4 text-slate-400 text-xs">
            {task.comments > 0 &&
          <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                {task.comments} comment{task.comments !== 1 ? 's' : ''}
              </div>
          }
            {task.attachments > 0 &&
          <div className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                {task.attachments} attachment{task.attachments !== 1 ? 's' : ''}
              </div>
          }
          </div>
        }

        <div className="flex items-center justify-between pt-4 border-t border-white/5 -mx-6 px-6 -mb-6 pb-6">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 border border-transparent hover:border-rose-400/20 transition-all">
            
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            
            Close
          </button>
        </div>
      </div>
    </Modal>);

}