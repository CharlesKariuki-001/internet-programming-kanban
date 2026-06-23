import React, { useCallback, useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
export type ToastVariant = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
}
interface ToastContextValue {
  toast: (
  message: string,
  variant?: ToastVariant,
  action?: Toast['action'])
  => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION = 4000;
export function ToastProvider({ children }: {children: React.ReactNode;}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const toast = useCallback(
    (
    message: string,
    variant: ToastVariant = 'info',
    action?: Toast['action']) =>
    {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        variant,
        action
      }]
      );
      // Errors stick around longer if they have a retry action
      const duration =
      variant === 'error' && action ? TOAST_DURATION * 1.5 : TOAST_DURATION;
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );
  return (
    <ToastContext.Provider
      value={{
        toast
      }}>
      
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) =>
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>);

}
function ToastItem({
  toast,
  onDismiss



}: {toast: Toast;onDismiss: () => void;}) {
  const variants = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      border: 'border-emerald-400/30',
      glow: 'shadow-[0_0_20px_rgba(74,222,128,0.15)]'
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
      border: 'border-rose-400/30',
      glow: 'shadow-[0_0_20px_rgba(251,113,133,0.15)]'
    },
    info: {
      icon: <Info className="w-4 h-4 text-cyan-400" />,
      border: 'border-cyan-400/30',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.15)]'
    }
  };
  const { icon, border, glow } = variants[toast.variant];
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 40,
        scale: 0.95
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        x: 40,
        scale: 0.95,
        transition: {
          duration: 0.2
        }
      }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30
      }}
      className={`pointer-events-auto flex items-center gap-3 min-w-[280px] max-w-[360px] px-4 py-3 rounded-xl bg-[#16161a] border ${border} ${glow} backdrop-blur`}>
      
      {icon}
      <span className="flex-1 text-sm text-slate-200">{toast.message}</span>
      {toast.action &&
      <button
        onClick={() => {
          toast.action!.onClick();
          onDismiss();
        }}
        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-white/5 transition-colors">
        
          {toast.action.label}
        </button>
      }
      <button
        onClick={onDismiss}
        className="p-0.5 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
        
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>);

}
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}