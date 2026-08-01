'use client';

import { useCompressPdfContext } from '../_context/CompressPdfContext';
import type { CompressionLevel } from '../../_types';

interface BottomToolbarProps {
  onAddPdfs: () => void;
}

const levels: { value: CompressionLevel; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Better quality' },
  { value: 'medium', label: 'Medium', description: 'Balanced' },
  { value: 'high', label: 'High', description: 'Smaller size' },
];

export default function BottomToolbar({ onAddPdfs }: BottomToolbarProps) {
  const {
    items, level, setLevel, isProcessing,
    compressAll, downloadAll, downloadOne, recompressAll,
  } = useCompressPdfContext();

  const allDone = items.length > 0 && items.every((it) => it.status === 'done');
  const hasPending = items.some((it) => it.status === 'pending');
  const hasAny = items.length > 0;
  const isSingleFile = items.length === 1;

  // Handle download - single file uses downloadOne
  const handleDownload = () => {
    if (isSingleFile) {
      downloadOne(items[0].id);
    } else {
      downloadAll();
    }
  };

  // ============ DONE VIEW - Clean download-focused UI ============
  if (allDone) {
    return (
      <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        {/* Redo + Download buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={recompressAll}
            className="flex-shrink-0 h-[52px] px-4 rounded-xl border-[1.5px] border-[#D1D5DB] flex items-center gap-1.5 text-[13px] font-bold text-[#26324B] active:scale-95 transition-transform"
            aria-label="Recompress with different level"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Redo
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 h-[52px] rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white text-[15px] font-bold shadow-[0_8px_24px_-4px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-transform"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isSingleFile ? 'Download PDF' : `Download All (${items.length})`}
          </button>
        </div>
      </div>
    );
  }

  // ============ PROCESSING/PENDING VIEW - Full toolbar ============
  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      {/* Compression level selector */}
      <div className="mb-2.5">
        <p className="text-[10.5px] font-semibold text-[#8A93A3] mb-1.5 uppercase tracking-wide">
          Compression Level
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              type="button"
              onClick={() => setLevel(lvl.value)}
              disabled={isProcessing}
              className={`py-2 px-1 rounded-lg text-center transition-all disabled:opacity-50 ${
                level === lvl.value
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-[#F6F7FB] text-[#26324B]'
              }`}
            >
              <div className="text-[12px] font-bold">{lvl.label}</div>
              <div className={`text-[9px] mt-0.5 ${
                level === lvl.value ? 'text-white/80' : 'text-[#8A93A3]'
              }`}>
                {lvl.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add + Compress button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAddPdfs}
          disabled={isProcessing}
          className="flex-shrink-0 w-11 h-11 rounded-xl border-[1.5px] border-[#D1D5DB] flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
          aria-label="Add PDF"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <button
          type="button"
          onClick={compressAll}
          disabled={isProcessing || !hasPending}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#2563EB] text-white text-[14px] font-bold shadow-[0_8px_24px_-4px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Compressing...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Compress {hasAny ? `(${items.length})` : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
}