'use client';

import { useRotatePdfContext } from '../_context/RotatePdfContext';

interface BottomToolbarProps {
  onAddPdfs: () => void;
}

export default function BottomToolbar({ onAddPdfs }: BottomToolbarProps) {
  const {
  selectedIds, isProcessing,
  rotateAll, rotateSelected,
  rotateAndPrepare,
} = useRotatePdfContext();

  const hasSelection = selectedIds.size > 0;

  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-2 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={onAddPdfs}
          className="flex flex-col items-center gap-1.5 px-2 py-1 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full border-[1.5px] border-[#D1D5DB] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="text-[10.5px] font-medium text-[#07122E]">Add PDF</span>
        </button>

        <button
          type="button"
          onClick={() => hasSelection ? rotateSelected('left') : rotateAll('left')}
          className="flex flex-col items-center gap-1.5 px-2 py-1 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full border-[1.5px] border-[#D1D5DB] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </div>
          <span className="text-[10.5px] font-medium text-[#07122E]">
            {hasSelection ? 'Rot Left' : 'All Left'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => hasSelection ? rotateSelected('right') : rotateAll('right')}
          className="flex flex-col items-center gap-1.5 px-2 py-1 active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-full border-[1.5px] border-[#D1D5DB] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </div>
          <span className="text-[10.5px] font-medium text-[#07122E]">
            {hasSelection ? 'Rot Right' : 'All Right'}
          </span>
        </button>
      </div>

      <button
  type="button"
  onClick={rotateAndPrepare}
  disabled={isProcessing}
        className="w-full mt-2.5 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#2563EB] text-white text-[15.5px] font-bold shadow-[0_8px_24px_-4px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Save Rotated PDF
          </>
        )}
      </button>
    </div>
  );
}