'use client';

import { useOrganizePdfContext } from '../_context/OrganizePdfContext';
import PanelSection from '../../_components/PanelSection';
import FilenameEditor from '../../_components/FilenameEditor';

export default function OrganizeOptionsPanel() {
  const {
    files, pages, selectedIds,
    canUndo, deletedCount, rotatedCount,
    pdfFilename, setPdfFilename,
    rotateSelected, deleteSelected, selectAll, clearSelection, undo,
  } = useOrganizePdfContext();

  const hasSelection = selectedIds.size > 0;

  return (
    <>
      <FilenameEditor
        value={pdfFilename}
        onChange={setPdfFilename}
        extension="pdf"
        label="Output filename"
      />

      {/* Stats */}
      <PanelSection label="Document">
        <div className="bg-[#F6F7FB] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[12px]">
            <span className="text-[#8A93A3]">Source files</span>
            <span className="font-bold text-[#07122E]">{files.length}</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#8A93A3]">Current pages</span>
            <span className="font-bold text-[#2563EB]">{pages.length}</span>
          </div>
          {deletedCount > 0 && (
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Deleted</span>
              <span className="font-bold text-[#EF4444]">{deletedCount}</span>
            </div>
          )}
          {rotatedCount > 0 && (
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Rotated</span>
              <span className="font-bold text-[#F59E0B]">{rotatedCount}</span>
            </div>
          )}
        </div>
      </PanelSection>

      {/* Selection controls */}
      <PanelSection label={`Selection (${selectedIds.size})`}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={pages.length === 0}
            className="py-2 rounded-lg border-2 border-[#E2E2EE] text-[12px] font-semibold text-[#26324B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={clearSelection}
            disabled={selectedIds.size === 0}
            className="py-2 rounded-lg border-2 border-[#E2E2EE] text-[12px] font-semibold text-[#26324B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40"
          >
            Clear
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            onClick={() => rotateSelected('left')}
            disabled={!hasSelection}
            className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Left
          </button>
          <button
            type="button"
            onClick={() => rotateSelected('right')}
            disabled={!hasSelection}
            className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Right
          </button>
        </div>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={!hasSelection}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#EF4444] text-white text-[12px] font-semibold hover:bg-[#DC2626] transition-colors disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Delete Selected
        </button>
      </PanelSection>

      {/* Undo */}
      <button
        type="button"
        onClick={undo}
        disabled={!canUndo}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 border-[#E2E2EE] text-[13px] font-semibold text-[#26324B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40 mb-4"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 00-15-6.7L3 13" />
        </svg>
        Undo last action
      </button>

      {/* Info */}
      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <p className="text-[12px] text-[#1E40AF] font-bold mb-1">How to use</p>
          <p className="text-[12px] text-[#1E40AF] leading-relaxed">
            • <strong>Click</strong> pages to select<br />
            • <strong>Hover + drag</strong> the handle to reorder<br />
            • Use rotate/delete buttons or select multiple for bulk actions
          </p>
        </div>
      </div>
    </>
  );
}