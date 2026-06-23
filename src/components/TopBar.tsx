import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useBoards } from '../context/BoardsContext';
import { useProfile } from '../context/ProfileContext';
import type { AppView } from './Sidebar';
interface TopBarProps {
  onMenuClick: () => void;
  activeView: AppView;
}
const VIEW_TITLES: Record<
  AppView,
  {
    title: string;
    subtitle: string;
  }> =
{
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Your daily pulse'
  },
  boards: {
    title: '',
    subtitle: ''
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Productivity insights'
  },
  settings: {
    title: 'Settings',
    subtitle: 'Profile and preferences'
  }
};
export function TopBar({ onMenuClick, activeView }: TopBarProps) {
  const { activeBoard } = useBoards();
  const { profile, notifications } = useProfile();
  let title = VIEW_TITLES[activeView].title;
  let subtitle = VIEW_TITLES[activeView].subtitle;
  if (activeView === 'boards') {
    title = activeBoard?.name || 'My Boards';
    subtitle = 'Updated just now';
  }
  const showNotifDot = notifications.email || notifications.desktop;
  return (
    <header className="h-16 flex-shrink-0 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open menu">
          
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-semibold text-white tracking-tight truncate">
              {title}
            </h1>
            {activeView === 'boards' && activeBoard &&
            <span className="hidden sm:inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-cyan-300 bg-cyan-400/10 border border-cyan-400/20">
                <span
                className={`w-1.5 h-1.5 rounded-full ${activeBoard.color}`} />
              
                Active
              </span>
            }
          </div>
          <div className="hidden sm:block text-[11px] text-slate-500 truncate">
            {subtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Notifications">
          
          <Bell className="w-5 h-5" />
          {showNotifDot &&
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          }
        </button>
        <div className="hidden md:flex items-center gap-2 ml-1 pl-3 border-l border-white/5">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-xs font-medium ring-2 ring-[#0a0a0c]`}>
            
            {profile.initials}
          </div>
        </div>
      </div>
    </header>);

}