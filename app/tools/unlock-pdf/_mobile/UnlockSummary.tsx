'use client';

import { useUnlockPdfContext } from '../_context/UnlockPdfContext';

export default function UnlockSummary() {
  const { items, unlockedCount, allUnlocked } = useUnlockPdfContext();

  if (!allUnlocked || items.length === 0) return null;

  return (
    <div className="mx-3 mb-3 shrink-0">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] p-4 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.4)]">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-extrabold text-white">
                {unlockedCount === 1 ? 'PDF Unlocked!' : 'All PDFs Unlocked!'}
              </p>
              <p className="text-[11px] text-white/85">
                {unlockedCount} of {items.length} file{items.length > 1 ? 's' : ''} ready to download
              </p>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5 flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/90 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-[11.5px] text-white leading-snug">
              Passwords removed. Files are ready to save.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}