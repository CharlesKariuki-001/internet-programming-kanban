import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg'
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);
  return (
    <AnimatePresence>
      {isOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          transition={{
            duration: 0.2
          }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 10
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 10
          }}
          transition={{
            duration: 0.2,
            ease: 'easeOut'
          }}
          className={`relative w-full ${maxWidth} rounded-2xl bg-[#16161a] border border-white/10 shadow-2xl shadow-black/50`}>
          
            {title &&
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="text-base font-semibold text-white tracking-tight">
                  {title}
                </h2>
                <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
              
                  <X className="w-4 h-4" />
                </button>
              </div>
          }
            {children}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}