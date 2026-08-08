'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============ TYPES ============

export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast can be called with either:
 *   toast.error('Simple message')
 *   toast.error({ title: 'Bold title', description: 'Muted description' })
 */
export type ToastInput = string | { title: string; description?: string };

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: {
    success: (input: ToastInput) => void;
    error: (input: ToastInput) => void;
    info: (input: ToastInput) => void;
    warning: (input: ToastInput) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ============ CONFIG ============

const AUTO_DISMISS_MS = {
  success: 4000,
  info: 5000,
  warning: 7000,
  error: 0,  // 0 = never (user must close)
};

// ============ ICONS (solid filled circles) ============

const iconElements = {
  success: (
    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  ),
  error: (
    <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  ),
  info: (
    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="16" x2="12" y2="11" />
        <circle cx="12" cy="8" r="0.75" fill="currentColor" />
      </svg>
    </div>
  ),
  warning: (
    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
  ),
};

// Subtle background tint per type
const cardBackgrounds: Record<ToastType, string> = {
  success: 'bg-gradient-to-br from-emerald-50 via-white to-white',
  error: 'bg-gradient-to-br from-red-50 via-white to-white',
  info: 'bg-gradient-to-br from-blue-50 via-purple-50/40 to-white',
  warning: 'bg-gradient-to-br from-amber-50 via-white to-white',
};

// ============ SINGLE TOAST CARD ============

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: () => void;
}) {
  const dismissMs = AUTO_DISMISS_MS[item.type];

  // Auto-dismiss timer (skip if dismissMs is 0, e.g., errors)
  useEffect(() => {
    if (dismissMs === 0) return;

    const timer = setTimeout(onDismiss, dismissMs);
    return () => clearTimeout(timer);
  }, [dismissMs, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`pointer-events-auto w-[380px] ${cardBackgrounds[item.type]} rounded-2xl shadow-[0_10px_40px_-8px_rgba(0,0,0,0.12)] border border-slate-200/60 overflow-hidden`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        {iconElements[item.type]}

        {/* Text content */}
<div className="flex-1 min-w-0 pt-0.5">
  <p className="text-[14px] font-bold text-slate-900 leading-[1.4] break-words">
    {item.title}
  </p>
  {item.description && (
    <p className="text-[13px] text-slate-500 leading-[1.5] mt-1 break-words">
      {item.description}
    </p>
  )}
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="shrink-0 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors -mt-0.5 -mr-1"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ============ PROVIDER ============

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((input: ToastInput, type: ToastType) => {
    const id = `${Date.now()}-${Math.random()}`;

    // Normalize: accept string OR object
    const item: ToastItem =
      typeof input === 'string'
        ? { id, title: input, type }
        : { id, title: input.title, description: input.description, type };

    setToasts((prev) => [...prev, item]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (input: ToastInput) => addToast(input, 'success'),
    error: (input: ToastInput) => addToast(input, 'error'),
    info: (input: ToastInput) => addToast(input, 'info'),
    warning: (input: ToastInput) => addToast(input, 'warning'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container — bottom right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastCard
              key={item.id}
              item={item}
              onDismiss={() => removeToast(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ============ HOOK ============

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context.toast;
}