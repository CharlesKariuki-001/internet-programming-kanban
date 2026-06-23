import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, HardDrive } from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
export function ConnectionBadge() {
  const { mode, toggle, hasLiveApi } = useConnection();
  const isCloud = mode === 'cloud';
  return (
    <button
      onClick={toggle}
      title={
      isCloud ?
      hasLiveApi ?
      'Connected to live API. Click to switch to Local Mode.' :
      'Cloud Sync simulated (no API URL configured). Click to switch to Local Mode.' :
      'Working from local mock data. Click to switch to Cloud Sync.'
      }
      className={`group w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${isCloud ? 'bg-emerald-400/5 border-emerald-400/20 hover:border-emerald-400/40 shadow-[0_0_15px_rgba(74,222,128,0.08)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
      
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative flex items-center justify-center w-6 h-6">
          <AnimatePresence mode="wait">
            {isCloud ?
            <motion.div
              key="cloud"
              initial={{
                opacity: 0,
                scale: 0.7
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.7
              }}
              transition={{
                duration: 0.18
              }}
              className="absolute">
              
                <Cloud className="w-4 h-4 text-emerald-400" />
              </motion.div> :

            <motion.div
              key="local"
              initial={{
                opacity: 0,
                scale: 0.7
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.7
              }}
              transition={{
                duration: 0.18
              }}
              className="absolute">
              
                <HardDrive className="w-4 h-4 text-slate-400" />
              </motion.div>
            }
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span
            className={`text-xs font-semibold tracking-tight ${isCloud ? 'text-emerald-300' : 'text-slate-200'}`}>
            
            {isCloud ? 'Cloud Sync' : 'Local Mode'}
          </span>
          <span className="text-[10px] text-slate-500 truncate">
            {isCloud ?
            hasLiveApi ?
            'Live API connected' :
            'Simulated sync' :
            'In-memory store'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 rounded-full ${isCloud ? 'bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse' : 'bg-slate-500'}`} />
        
      </div>
    </button>);

}