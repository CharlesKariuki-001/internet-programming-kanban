import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Priority, Status, Task, users } from './data';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus: Status;
  onCreate: (task: Task) => void;
}
const priorityOptions: {
  value: Priority;
  label: string;
  icon: React.ReactNode;
  classes: string;
}[] = [
{
  value: 'Low',
  label: 'Low',
  icon: <ArrowDown className="w-3.5 h-3.5" />,
  classes:
  'border-cyan-400/30 text-cyan-400 bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
},
{
  value: 'Medium',
  label: 'Medium',
  icon: <Minus className="w-3.5 h-3.5" />,
  classes:
  'border-amber-400/30 text-amber-400 bg-amber-400/10 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
},
{
  value: 'High',
  label: 'High',
  icon: <ArrowUp className="w-3.5 h-3.5" />,
  classes:
  'border-rose-400/30 text-rose-400 bg-rose-400/10 shadow-[0_0_10px_rgba(251,113,133,0.2)]'
}];

export function AddTaskModal({
  isOpen,
  onClose,
  defaultStatus,
  onCreate
}: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate(new Date().toISOString().slice(0, 10));
    }
  }, [isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const userList = Object.values(users);
    const newTask: Task = {
      id: `t_${Date.now()}`,
      boardId: '',
      title: title.trim(),
      description: description.trim(),
      priority,
      status: defaultStatus,
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      assignee: userList[Math.floor(Math.random() * userList.length)],
      comments: 0,
      attachments: 0
    };
    onCreate(newTask);
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`New Task · ${defaultStatus}`}>
      
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Title
          </label>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] transition-all" />
          
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a brief description..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] transition-all resize-none" />
          
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorityOptions.map((opt) =>
            <button
              type="button"
              key={opt.value}
              onClick={() => setPriority(opt.value)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${priority === opt.value ? opt.classes : 'border-white/10 text-slate-400 bg-white/5 hover:bg-white/10'}`}>
              
                {opt.icon}
                {opt.label}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white outline-none focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.1)] transition-all [color-scheme:dark]" />
          
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 -mx-6 px-6 -mb-6 pb-6 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            
            Create Task
          </button>
        </div>
      </form>
    </Modal>);

}