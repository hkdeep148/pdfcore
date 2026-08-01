'use client';

import { useUnlockPdfContext } from '../_context/UnlockPdfContext';

interface UnlockBottomBarProps {
  onAddPdfs: () => void;
}

export default function UnlockBottomBar({ onAddPdfs }: UnlockBottomBarProps) {
  const {
    items,
    unlockedCount,
    allUnlocked,
    downloadOne,
    downloadAll,
  } = useUnlockPdfContext();

  const isSingleFile = items.length === 1;

  const handleDownload = () => {
    if (isSingleFile && items[0]) {
      downloadOne(items[0].id);
    } else {
      downloadAll();
    }
  };

  // ============ ALL UNLOCKED - Clean download UI ============
  if (allUnlocked) {
    return (
      <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2">
          {/* Add more button */}
          <button
            type="button"
            onClick={onAddPdfs}
            className="flex-shrink-0 w-[52px] h-[52px] rounded-xl border-[1.5px] border-[#D1D5DB] flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Add PDF"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Download button */}
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
            {isSingleFile
              ? 'Download PDF'
              : `Download All (${unlockedCount})`}
          </button>
        </div>
      </div>
    );
  }

  // ============ WORKING VIEW - Add button + status ============
  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        {/* Add more button */}
        <button
          type="button"
          onClick={onAddPdfs}
          className="flex-shrink-0 w-11 h-11 rounded-xl border-[1.5px] border-[#D1D5DB] flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Add PDF"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Status indicator */}
        <div className="flex-1 flex items-center justify-center h-11 rounded-xl bg-[#F6F7FB] gap-2">
          {unlockedCount > 0 ? (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[13px] text-[#26324B] font-semibold">
                {unlockedCount} of {items.length} unlocked
              </span>
            </>
          ) : (
            <span className="text-[13px] text-[#8A93A3] font-medium">
              Enter passwords to unlock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}