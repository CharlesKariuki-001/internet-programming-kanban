import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar, type AppView } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './views/Dashboard';
import { Analytics } from './views/Analytics';
import { Settings } from './views/Settings';
import { ConnectionProvider } from './context/ConnectionContext';
import { ToastProvider } from './context/ToastContext';
import { BoardsProvider, useBoards } from './context/BoardsContext';
import { ProfileProvider } from './context/ProfileContext';
import { useScreenInit } from './useScreenInit.js';
function AppShell() {
  const screenInit = useScreenInit() as {
    view?: AppView;
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<AppView>(
    screenInit.view ?? 'dashboard'
  );
  const { setActiveBoardId } = useBoards();
  const handleOpenBoard = (boardId: string) => {
    setActiveBoardId(boardId);
    setActiveView('boards');
  };
  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] overflow-hidden text-slate-200 font-sans selection:bg-cyan-500/30">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView} />
      

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <TopBar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          activeView={activeView} />
        

        <main className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{
                opacity: 0,
                y: 6
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -4
              }}
              transition={{
                duration: 0.22,
                ease: 'easeOut'
              }}
              className="flex-1 flex flex-col overflow-hidden">
              
              {activeView === 'dashboard' &&
              <Dashboard onOpenBoard={handleOpenBoard} />
              }
              {activeView === 'boards' && <KanbanBoard />}
              {activeView === 'analytics' && <Analytics />}
              {activeView === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>);

}
export function App() {
  return (
    <ToastProvider>
      <ConnectionProvider>
        <ProfileProvider>
          <BoardsProvider>
            <AppShell />
          </BoardsProvider>
        </ProfileProvider>
      </ConnectionProvider>
    </ToastProvider>);

}