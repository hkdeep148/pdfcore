'use client';

import { useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';

interface DesktopSuccessModalProps {
  /** Show/hide the modal */
  isOpen: boolean;
  /** Called when modal is dismissed */
  onClose: () => void;
  /** Called when "Start Over" button is clicked */
  onStartOver?: () => void;

  /** Main heading — "Download Complete!" */
  title: string;
  /** Subtitle — "3 images compressed and saved" */
  subtitle: string;

  /** Optional stats to show (like size reduction) */
  stats?: {
    label: string;      // "Original"
    value: string;      // "4.8 MB"
    accent?: boolean;   // Highlight in indigo
  }[];

  /** Optional savings badge — "-50%" */
  savingsBadge?: string;

  /** Custom label for start over button */
  startOverLabel?: string;
  /** Custom label for done button */
  doneLabel?: string;
}

export default function DesktopSuccessModal({
  isOpen,
  onClose,
  onStartOver,
  title,
  subtitle,
  stats,
  savingsBadge,
  startOverLabel = 'Start Over',
  doneLabel = 'Done',
}: DesktopSuccessModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_25px_80px_-15px_rgba(15,23,42,0.3)] overflow-hidden animate-modal-pop"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
          aria-label="Close"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Success Icon */}
        <div className="pt-10 pb-6 flex flex-col items-center">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-2xl animate-success-glow" />
            {/* Circle */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] flex items-center justify-center animate-success-pop">
              <Check
                size={40}
                className="text-white animate-check-draw"
                strokeWidth={3}
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="px-8 text-center">
          <h2 className="text-[24px] font-extrabold text-[#07122E] mb-2 tracking-tight">
            {title}
          </h2>
          <p className="text-[14px] text-[#6B7280] font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mx-8 mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="flex items-center justify-around">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`text-[16px] font-extrabold ${
                      stat.accent ? 'text-[#4F46E5]' : 'text-[#07122E]'
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {savingsBadge && (
              <div className="mt-3 pt-3 border-t border-emerald-200/50 flex items-center justify-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  You saved
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-white text-[13px] font-extrabold shadow-sm">
                  {savingsBadge}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-8 pt-6 flex items-center gap-3">
          {onStartOver && (
            <button
              onClick={() => {
                onStartOver();
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border-2 border-[#E8EDF5] text-[#4B5563] text-[13px] font-bold hover:border-[#C7D2FE] hover:text-[#4F46E5] transition-all"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
              {startOverLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[13px] font-bold shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)] hover:shadow-[0_8px_20px_-4px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all"
          >
            {doneLabel}
          </button>
        </div>
      </div>
    </div>
  );
}