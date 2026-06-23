import React from 'react';
import { motion } from 'framer-motion';
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}
export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-start justify-between gap-4 py-3">
      
      {(label || description) &&
      <div className="flex flex-col items-start text-left">
          {label &&
        <span className="text-sm font-medium text-slate-200">{label}</span>
        }
          {description &&
        <span className="text-xs text-slate-500 mt-0.5">{description}</span>
        }
        </div>
      }
      <div
        className={`flex-shrink-0 relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.4)]' : 'bg-white/10'}`}>
        
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
          animate={{
            x: checked ? 16 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }} />
        
      </div>
    </button>);

}