'use client';

import { useState } from 'react';
import { useRotatePdfContext } from '../_context/RotatePdfContext';

export default function OptionsPanel() {
  const {
    pages, files, selectedIds, pdfFilename, setPdfFilename,
    rotateAll, rotateSelected, resetAllRotations,
    selectAll, clearSelection,
  } = useRotatePdfContext();

  const [isEditingFilename, setIsEditingFilename] = useState(false);

  const rotatedCount = pages.filter((p) => p.rotation !== 0).length;
  const hasSelection = selectedIds.size > 0;
  const hasPages = pages.length > 0;

  // ⭐ Smart rotate — uses selection if any, otherwise all
  const handleRotate = (direction: 'left' | 'right') => {
    if (hasSelection) {
      rotateSelected(direction);
    } else {
      rotateAll(direction);
    }
  };

  // Dynamic labels based on selection
  const rotateScope = hasSelection
    ? `${selectedIds.size} selected`
    : `all ${pages.length}`;

  return (
    <div className="space-y-4">
      {/* ⭐ File Name */}
      <div>
        <label className="text-[11.5px] font-bold text-[#26324B] mb-1.5 block uppercase tracking-wide">
          File name
        </label>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E2EE] bg-white focus-within:border-[#2563EB] transition-colors">
          {isEditingFilename ? (
            <input
              type="text"
              value={pdfFilename}
              onChange={(e) => setPdfFilename(e.target.value)}
              onBlur={() => setIsEditingFilename(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingFilename(false); }}
              autoFocus
              className="flex-1 min-w-0 text-[13px] font-medium text-[#26324B] outline-none bg-transparent"
            />
          ) : (
            <span className="flex-1 min-w-0 text-[13px] font-medium text-[#26324B] truncate">
              {pdfFilename}.pdf
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsEditingFilename(true)}
            className="text-[#8A93A3] hover:text-[#2563EB] transition-colors flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ⭐ Compact Document Info */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F6F7FB]">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <div className="flex-1 text-[12px] text-[#5B6472]">
          <span className="font-bold text-[#07122E]">{files.length}</span> file{files.length !== 1 ? 's' : ''} · <span className="font-bold text-[#07122E]">{pages.length}</span> page{pages.length !== 1 ? 's' : ''}
        </div>
        {rotatedCount > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold" title={`${rotatedCount} pages rotated`}>
            <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {rotatedCount}
          </div>
        )}
      </div>

      {/* ⭐ Selection Info + Controls */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11.5px] font-bold text-[#26324B] uppercase tracking-wide">
            Selection
          </label>
          {hasSelection && (
            <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF3FF] px-2 py-0.5 rounded-full">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={selectAll}
            disabled={!hasPages}
            className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              selectedIds.size === pages.length && hasPages
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E2EE] text-[#5B6472] hover:border-[#C9D8F3]'
            } disabled:opacity-40`}
          >
            Select all
          </button>
          <button
            type="button"
            onClick={clearSelection}
            disabled={!hasSelection}
            className="py-1.5 rounded-lg bg-white border border-[#E2E2EE] text-[11px] font-bold text-[#5B6472] hover:border-[#EF4444] hover:text-[#EF4444] transition-all disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ⭐ Smart Rotate Section - dynamically labeled */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11.5px] font-bold text-[#26324B] uppercase tracking-wide">
            Rotate
          </label>
          <span className="text-[10px] font-semibold text-[#8A93A3]">
            {rotateScope}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleRotate('left')}
            disabled={!hasPages}
            className={`group flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              hasSelection
                ? 'border-[#2563EB] bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                : 'border-[#E2E2EE] bg-white text-[#26324B] hover:border-[#2563EB] hover:bg-[#EFF3FF] hover:text-[#2563EB]'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span className="text-[11px] font-bold">Left</span>
          </button>
          <button
            type="button"
            onClick={() => handleRotate('right')}
            disabled={!hasPages}
            className={`group flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              hasSelection
                ? 'border-[#2563EB] bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                : 'border-[#E2E2EE] bg-white text-[#26324B] hover:border-[#2563EB] hover:bg-[#EFF3FF] hover:text-[#2563EB]'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span className="text-[11px] font-bold">Right</span>
          </button>
        </div>
      </div>

      {/* ⭐ Reset - only when needed */}
      {rotatedCount > 0 && (
        <button
          type="button"
          onClick={resetAllRotations}
          className="w-full py-2 rounded-lg border border-[#E2E2EE] text-[12px] font-bold text-[#EF4444] hover:border-[#EF4444] hover:bg-[#FEE9E9] transition-colors flex items-center justify-center gap-1.5"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Reset {rotatedCount} rotation{rotatedCount === 1 ? '' : 's'}
        </button>
      )}

      {/* ⭐ Compact Tip */}
      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg px-3 py-2.5 flex items-start gap-2">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-[11px] text-[#1E40AF] leading-relaxed">
          {hasSelection
            ? `Rotate buttons will affect ${selectedIds.size} selected page${selectedIds.size === 1 ? '' : 's'}. Clear selection to rotate all.`
            : 'Click pages to select them, or rotate all pages at once.'}
        </p>
      </div>
    </div>
  );
}