import React from 'react';
import { Priority } from './data';
import { AlertCircle, ArrowDown, ArrowUp, Minus } from 'lucide-react';
interface PriorityBadgeProps {
  priority: Priority;
}
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    High: {
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      border: 'border-rose-400/20',
      glow: 'shadow-[0_0_8px_rgba(251,113,133,0.2)]',
      icon: <ArrowUp className="w-3 h-3 mr-1" />
    },
    Medium: {
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      glow: 'shadow-[0_0_8px_rgba(251,191,36,0.2)]',
      icon: <Minus className="w-3 h-3 mr-1" />
    },
    Low: {
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/20',
      glow: 'shadow-[0_0_8px_rgba(34,211,238,0.2)]',
      icon: <ArrowDown className="w-3 h-3 mr-1" />
    }
  };
  const { color, bg, border, glow, icon } = config[priority];
  return (
    <div
      className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${color} ${bg} ${border} ${glow}`}>
      
      {icon}
      {priority}
    </div>);

}