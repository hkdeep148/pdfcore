'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface PageSizeOption<T extends string = string> {
  id: T;
  name: string;
  dimensions: string;
  desc?: string;
}

export type SizeScope = 'this' | 'all';

interface PageSizeSheetProps<T extends string = string> {
  open: boolean;
  onClose: () => void;

  // Size selection
  sizes: PageSizeOption<T>[];
  currentSize: T;
  onSizeChange: (size: T, scope: SizeScope) => void;

  // Orientation (optional — only show if provided)
  currentOrientation?: 'Portrait' | 'Landscape';
  onOrientationChange?: (orientation: 'Portrait' | 'Landscape', scope: SizeScope) => void;

  // UI customization
  title?: string;
  showOrientation?: boolean;
  showScope?: boolean;
  scopeLabels?: { this: string; all: string };
}

export default function PageSizeSheet<T extends string = string>({
  open,
  onClose,
  sizes,
  currentSize,
  onSizeChange,
  currentOrientation = 'Portrait',
  onOrientationChange,
  title = 'Page Size',
  showOrientation = true,
  showScope = false,
  scopeLabels = { this: 'This page', all: 'All pages' },
}: PageSizeSheetProps<T>) {
  const [scope, setScope] = useState<SizeScope>('this');

  // Reset scope to "this" whenever sheet re-opens
  useEffect(() => {
    if (open) setScope('this');
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D1D5DB]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h3 className="text-[17px] font-extrabold text-[#07122E]">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B5563] active:bg-slate-100"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-5 pb-8 overflow-y-auto max-h-[70vh]">

              {/* ═════════ Apply Scope Toggle ═════════ */}
              {showScope && (
                <div className="mb-5">
                  <p className="text-[11px] font-bold text-[#8A93A3] uppercase tracking-wider mb-2">
                    Apply To
                  </p>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-2xl">
                    {(['this', 'all'] as SizeScope[]).map((s) => {
                      const isActive = scope === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setScope(s)}
                          className={`
                            py-2.5 rounded-xl text-[13px] font-bold transition-all
                            ${isActive
                              ? 'bg-white text-[#4F46E5] shadow-sm'
                              : 'text-[#6B7280]'
                            }
                          `}
                        >
                          {scopeLabels[s]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═════════ Orientation Toggle (optional) ═════════ */}
              {showOrientation && onOrientationChange && (
                <div className="mb-5">
                  <p className="text-[11px] font-bold text-[#8A93A3] uppercase tracking-wider mb-2">
                    Orientation
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Portrait', 'Landscape'] as const).map((orient) => {
                      const isActive = currentOrientation === orient;
                      return (
                        <button
                          key={orient}
                          onClick={() => onOrientationChange(orient, scope)}
                          className={`
                            flex flex-col items-center gap-2 py-3.5 rounded-2xl border-2 transition-all
                            ${isActive
                              ? 'border-[#4F46E5] bg-[#F5F3FF]'
                              : 'border-[#ECEDF3] bg-white active:bg-slate-50'
                            }
                          `}
                        >
                          <div className={`
                            bg-white border-2 rounded shadow-sm
                            ${orient === 'Portrait' ? 'w-5 h-7' : 'w-7 h-5'}
                            ${isActive ? 'border-[#4F46E5]' : 'border-[#D1D5DB]'}
                          `} />
                          <span className={`text-[12px] font-bold ${isActive ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>
                            {orient}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═════════ Size Options ═════════ */}
              <div>
                <p className="text-[11px] font-bold text-[#8A93A3] uppercase tracking-wider mb-2">
                  Paper Size
                </p>
                <div className="space-y-2">
                  {sizes.map((size) => {
                    const isActive = currentSize === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => {
                          onSizeChange(size.id, scope);
                          onClose();
                        }}
                        className={`
                          w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all
                          ${isActive
                            ? 'border-[#4F46E5] bg-[#F5F3FF]'
                            : 'border-[#ECEDF3] bg-white active:bg-slate-50'
                          }
                        `}
                      >
                        {/* Size Preview */}
                        <div className={`
                          shrink-0 w-8 h-10 bg-white border-2 rounded shadow-sm flex items-center justify-center
                          ${isActive ? 'border-[#4F46E5]' : 'border-[#D1D5DB]'}
                        `}>
                          <span className={`text-[9px] font-bold ${isActive ? 'text-[#4F46E5]' : 'text-[#9CA3AF]'}`}>
                            {size.name}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-left">
                          <p className={`text-[14px] font-bold ${isActive ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>
                            {size.name}
                          </p>
                          <p className="text-[11px] text-[#8A93A3] font-medium">
                            {size.dimensions}
                            {size.desc && ` • ${size.desc}`}
                          </p>
                        </div>

                        {/* Check */}
                        {isActive && (
                          <div className="w-6 h-6 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0">
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}