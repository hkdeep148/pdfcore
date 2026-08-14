'use client';

import { useOrganizePdfContext } from '../_context/OrganizePdfContext';

interface OrganizeBottomBarProps {
  onAddPdfs: () => void;
  barRef?: React.RefObject<HTMLDivElement | null>;
}

export default function OrganizeBottomBar({ onAddPdfs, barRef }: OrganizeBottomBarProps) {
  const {
    pages, selectedIds, canUndo, isProcessing,
    rotateSelected, deleteSelected, undo,
    organizeAndPrepare,  // ⭐ CHANGED: uses new function (triggers success screen)
    selectAll, clearSelection,
  } = useOrganizePdfContext();

  const hasSelection = selectedIds.size > 0;
  const allSelected = pages.length > 0 && selectedIds.size === pages.length;

  return (
<div
  ref={barRef}
  className="flex-shrink-0 bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
  style={{ boxShadow: '0 -6px 20px -8px rgba(15,23,42,0.08)' }}
>
      {/* Selection actions (shown when items selected) */}
      {hasSelection && (
        <div className="mb-2.5 flex items-center gap-1.5 bg-[#EFF3FF] rounded-xl p-2">
          <span className="text-[11px] font-bold text-[#2563EB] px-2">
            {selectedIds.size} selected
          </span>
          <button
            type="button"
            onClick={() => rotateSelected('left')}
            className="flex-1 py-1.5 rounded-lg bg-white text-[11px] font-semibold text-[#26324B] active:scale-95"
          >
            Rot L
          </button>
          <button
            type="button"
            onClick={() => rotateSelected('right')}
            className="flex-1 py-1.5 rounded-lg bg-white text-[11px] font-semibold text-[#26324B] active:scale-95"
          >
            Rot R
          </button>
          <button
            type="button"
            onClick={deleteSelected}
            className="flex-1 py-1.5 rounded-lg bg-[#EF4444] text-white text-[11px] font-semibold active:scale-95"
          >
            Delete
          </button>
        </div>
      )}

      {/* Main toolbar */}
      <div className="flex items-center gap-1 mb-2">
        <button
          type="button"
          onClick={onAddPdfs}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg active:bg-[#F6F7FB]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-[10px] font-semibold text-[#07122E]">Add</span>
        </button>

        <button
          type="button"
          onClick={allSelected ? clearSelection : selectAll}
          disabled={pages.length === 0}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg active:bg-[#F6F7FB] disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span className="text-[10px] font-semibold text-[#07122E]">
            {allSelected ? 'None' : 'All'}
          </span>
        </button>

        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg active:bg-[#F6F7FB] disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 00-15-6.7L3 13" />
          </svg>
          <span className="text-[10px] font-semibold text-[#07122E]">Undo</span>
        </button>
      </div>

      {/* Save button - triggers success screen */}
      <button
        type="button"
        onClick={organizeAndPrepare}
        disabled={isProcessing || pages.length === 0}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[16px] font-bold shadow-[0_6px_20px_-4px_rgba(79,70,229,0.5)] active:scale-[0.98] transition disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Building...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Save PDF ({pages.length})
          </>
        )}
      </button>
    </div>
  );
}