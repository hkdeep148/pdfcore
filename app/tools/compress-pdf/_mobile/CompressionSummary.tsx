'use client';

import { useCompressPdfContext } from '../_context/CompressPdfContext';
import { formatBytes } from '../../_utils/browser';

export default function CompressionSummary() {
  const {
    items,
    totalOriginalBytes,
    totalCompressedBytes,
    totalSavedPercent,
    totalSaved,
  } = useCompressPdfContext();

  const savedBytes = totalOriginalBytes - totalCompressedBytes;
  const allDone = items.length > 0 && items.every((it) => it.status === 'done');

  if (!allDone || totalSaved === 0) return null;

  // ⭐ Detect "already optimized" case (no meaningful savings)
  const isAlreadyOptimized = savedBytes <= 0 || totalSavedPercent === 0;

  // ============ ALREADY OPTIMIZED VARIANT ============
  if (isAlreadyOptimized) {
    return (
      <div className="mx-3 mb-3 shrink-0">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-4 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.4)]">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-extrabold text-white">Already Optimized!</p>
                <p className="text-[10.5px] text-white/85">
                  {items.length > 1
                    ? `Your ${items.length} PDFs are already well-compressed`
                    : 'Your PDF is already well-compressed'}
                </p>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/80 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p className="text-[11.5px] text-white leading-snug">
                  <span className="font-bold">No further compression possible.</span> Try a{' '}
                  <span className="font-bold">High</span> level for slightly smaller size.
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-[11px] text-white/80">Current size:</span>
                <span className="text-[13px] font-extrabold text-white">
                  {formatBytes(totalCompressedBytes)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ NORMAL SAVINGS VARIANT ============
  return (
    <div className="mx-3 mb-3 shrink-0">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] p-4 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.4)]">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-white">Compression Complete!</p>
              <p className="text-[10px] text-white/80">
                {totalSaved} of {items.length} file{items.length > 1 ? 's' : ''} compressed
              </p>
            </div>
          </div>

          {/* Before → After */}
          <div className="flex items-center justify-between gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5 mb-2">
            <div className="text-center flex-1">
              <p className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Before</p>
              <p className="text-[14px] font-bold text-white mt-0.5">
                {formatBytes(totalOriginalBytes)}
              </p>
            </div>
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/60 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <div className="text-center flex-1">
              <p className="text-[9px] font-bold text-white/70 uppercase tracking-wider">After</p>
              <p className="text-[14px] font-bold text-white mt-0.5">
                {formatBytes(totalCompressedBytes)}
              </p>
            </div>
          </div>

          {/* Savings badge */}
          <div className="flex items-center justify-center gap-2 bg-white rounded-xl px-4 py-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="19 12 12 19 5 12" />
              <line x1="12" y1="5" x2="12" y2="19" />
            </svg>
            <span className="text-[15px] font-extrabold text-[#059669]">
              Saved {formatBytes(savedBytes)}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#059669] text-[11px] font-extrabold">
              -{totalSavedPercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}