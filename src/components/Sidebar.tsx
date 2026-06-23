import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Check,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Trash2,
  Trello,
  X,
  Zap } from
'lucide-react';
import { ConnectionBadge } from './ConnectionBadge';
import { useBoards } from '../context/BoardsContext';
import { useProfile } from '../context/ProfileContext';
export type AppView = 'dashboard' | 'boards' | 'analytics' | 'settings';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}
const NAV: {
  view: AppView;
  label: string;
  icon: React.ReactNode;
}[] = [
{
  view: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboard className="w-4 h-4" />
},
{
  view: 'boards',
  label: 'My Boards',
  icon: <Trello className="w-4 h-4" />
},
{
  view: 'analytics',
  label: 'Analytics',
  icon: <BarChart2 className="w-4 h-4" />
},
{
  view: 'settings',
  label: 'Settings',
  icon: <SettingsIcon className="w-4 h-4" />
}];

export function Sidebar({
  isOpen,
  onClose,
  activeView,
  onViewChange
}: SidebarProps) {
  const {
    boards,
    activeBoardId,
    setActiveBoardId,
    createBoard,
    renameBoard,
    deleteBoard
  } = useBoards();
  const { profile } = useProfile();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreating(false);
      return;
    }
    await createBoard(newName.trim());
    setNewName('');
    setCreating(false);
    onViewChange('boards');
  };
  const handleRename = async (id: string) => {
    if (renameValue.trim()) {
      await renameBoard(id, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };
  const handleBoardClick = (id: string) => {
    setActiveBoardId(id);
    onViewChange('boards');
    onClose();
  };
  const sidebarContent =
  <div className="flex flex-col h-full bg-[#111114] border-r border-white/5 text-slate-300 w-64">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-2 text-white font-bold tracking-tight">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          Nexus
        </div>
        <button
        onClick={onClose}
        className="md:hidden ml-auto p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10">
        
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-3 py-3 border-b border-white/5">
        <ConnectionBadge />
      </div>

      <div className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Workspace
        </div>
        {NAV.map((item) =>
      <button
        key={item.view}
        onClick={() => {
          onViewChange(item.view);
          onClose();
        }}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeView === item.view ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
        
            {item.icon}
            {item.label}
          </button>
      )}

        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          Boards
          <button
          onClick={() => {
            setCreating(true);
            setNewName('');
          }}
          className="hover:text-white p-0.5 rounded"
          aria-label="New board">
          
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <AnimatePresence>
          {creating &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="overflow-hidden">
          
              <div className="flex items-center gap-1 px-1 py-1">
                <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
                if (e.key === 'Escape') setCreating(false);
              }}
              onBlur={handleCreate}
              placeholder="Board name"
              className="flex-1 px-2 py-1.5 rounded-md bg-[#0a0a0c] border border-cyan-400/30 text-sm text-white outline-none focus:border-cyan-400/60" />
            
              </div>
            </motion.div>
        }
        </AnimatePresence>

        {boards.map((b) => {
        const isActive = activeView === 'boards' && b.id === activeBoardId;
        const isRenaming = renamingId === b.id;
        return (
          <div key={b.id} className="relative">
              {isRenaming ?
            <div className="flex items-center gap-1 px-1 py-1">
                  <span
                className={`w-2 h-2 rounded-full ${b.color} flex-shrink-0 ml-2`} />
              
                  <input
                autoFocus
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(b.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                onBlur={() => handleRename(b.id)}
                className="flex-1 px-2 py-1 rounded-md bg-[#0a0a0c] border border-cyan-400/30 text-sm text-white outline-none focus:border-cyan-400/60" />
              
                </div> :

            <div
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive ? 'bg-white/5 text-slate-100' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
              onClick={() => handleBoardClick(b.id)}>
              
                  <span
                className={`w-2 h-2 rounded-full ${b.color} flex-shrink-0`} />
              
                  <span className="flex-1 truncate">{b.name}</span>
                  <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === b.id ? null : b.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Board options">
                
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
            }

              <AnimatePresence>
                {menuOpenId === b.id && !isRenaming &&
              <>
                    <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpenId(null)} />
                
                    <motion.div
                  initial={{
                    opacity: 0,
                    y: -4,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95
                  }}
                  transition={{
                    duration: 0.12
                  }}
                  className="absolute right-2 top-9 z-20 w-40 rounded-lg bg-[#1c1c22] border border-white/10 shadow-2xl shadow-black/50 py-1">
                  
                      <button
                    onClick={() => {
                      setRenamingId(b.id);
                      setRenameValue(b.name);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    
                        <Pencil className="w-3 h-3" />
                        Rename
                      </button>
                      <button
                    onClick={() => {
                      if (boards.length <= 1) return;
                      void deleteBoard(b.id);
                      setMenuOpenId(null);
                    }}
                    disabled={boards.length <= 1}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </motion.div>
                  </>
              }
              </AnimatePresence>
            </div>);

      })}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
        onClick={() => onViewChange('settings')}
        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-left">
        
          <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-xs font-medium`}>
          
            {profile.initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-white truncate">
              {profile.name}
            </div>
            <div className="text-xs text-slate-500 truncate">Free Plan</div>
          </div>
        </button>
      </div>
    </div>;

  return (
    <>
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </div>

      <AnimatePresence>
        {isOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
          
            <motion.div
            initial={{
              x: '-100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100%'
            }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.3
            }}
            className="fixed inset-y-0 left-0 z-50 md:hidden shadow-2xl">
            
              {sidebarContent}
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}