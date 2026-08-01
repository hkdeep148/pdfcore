'use client';

import { useMemo } from 'react';
import { useSplitPdfContext } from '../_context/SplitPdfContext';
import { GROUP_COLORS } from '../_desktop/PageThumbnail';

export default function PageGrid() {
  const {
    pages,
    pageGroups,
    mode,
    extractMode,
    selectedPages,
    togglePageSelection,
  } = useSplitPdfContext();

  const pageToGroup = useMemo(() => {
    const map = new Map<number, number>();
    pageGroups.forEach((group, groupIdx) => {
      group.forEach((pageIdx) => map.set(pageIdx, groupIdx));
    });
    return map;
  }, [pageGroups]);

  // ⭐ Is selection mode active?
  const isSelectMode = mode === 'pages' && extractMode === 'select';

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-3">
      {/* Hint banner when in select mode */}
      {isSelectMode && selectedPages.size === 0 && (
        <div className="mb-3 px-3 py-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#10B981] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <p className="text-[11px] text-[#166534] font-semibold">
            Tap pages to select them
          </p>
        </div>
      )}

      {isSelectMode && selectedPages.size > 0 && (
        <div className="mb-3 px-3 py-2 bg-[#EFF3FF] border border-[#DBEAFE] rounded-xl flex items-center justify-between">
          <p className="text-[11px] text-[#1E40AF] font-bold">
            {selectedPages.size} page{selectedPages.size === 1 ? '' : 's'} selected
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {pages.map((page) => {
          // ⭐ Select mode: use selection state
          if (isSelectMode) {
            const isSelected = selectedPages.has(page.pageIndex);
            return (
              <SelectableMobileCard
                key={page.id}
                pageIndex={page.pageIndex}
                preview={page.preview}
                isSelected={isSelected}
                onToggle={() => togglePageSelection(page.pageIndex)}
              />
            );
          }

          // Default mode: use group coloring
          const groupIdx = pageToGroup.get(page.pageIndex);
          const isIncluded = groupIdx !== undefined;
          const groupColor = isIncluded
            ? GROUP_COLORS[groupIdx! % GROUP_COLORS.length]
            : '#ECEDF3';

          return (
            <GroupedMobileCard
              key={page.id}
              pageIndex={page.pageIndex}
              preview={page.preview}
              isIncluded={isIncluded}
              groupIdx={groupIdx}
              groupColor={groupColor}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============ ⭐ SELECTABLE CARD (for select mode) ============

interface SelectableMobileCardProps {
  pageIndex: number;
  preview: string;
  isSelected: boolean;
  onToggle: () => void;
}

function SelectableMobileCard({
  pageIndex,
  preview,
  isSelected,
  onToggle,
}: SelectableMobileCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative bg-white rounded-lg border-2 p-1.5 transition-all cursor-pointer active:scale-95 ${
        isSelected
          ? 'border-[#10B981] shadow-md shadow-[#10B981]/20'
          : 'border-[#ECEDF3] hover:border-[#10B981]/50'
      }`}
    >
      {/* ⭐ Green checkmark badge when selected */}
      {isSelected && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shadow-md z-10 pointer-events-none">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* Preview */}
      <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded overflow-hidden flex items-center justify-center">
        <img
          src={preview}
          alt={`Page ${pageIndex + 1}`}
          className="max-w-full max-h-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Page number pill */}
      <div className="mt-1 text-center">
        <span
          className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
            isSelected
              ? 'bg-[#10B981] text-white'
              : 'bg-[#F1F5F9] text-[#5B6472]'
          }`}
        >
          {pageIndex + 1}
        </span>
      </div>
    </button>
  );
}

// ============ GROUPED CARD (for range/size modes) ============

interface GroupedMobileCardProps {
  pageIndex: number;
  preview: string;
  isIncluded: boolean;
  groupIdx: number | undefined;
  groupColor: string;
}

function GroupedMobileCard({
  pageIndex,
  preview,
  isIncluded,
  groupIdx,
  groupColor,
}: GroupedMobileCardProps) {
  return (
    <div className="relative">
      <div
        className={`relative bg-white rounded-lg border-2 p-1.5 transition-all ${
          isIncluded ? 'shadow-sm' : 'opacity-40'
        }`}
        style={{ borderColor: groupColor }}
      >
        {/* Group number badge */}
        {isIncluded && (
          <div
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm z-10"
            style={{ backgroundColor: groupColor }}
          >
            {groupIdx! + 1}
          </div>
        )}

        {/* Preview */}
        <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded overflow-hidden flex items-center justify-center">
          <img
            src={preview}
            alt={`Page ${pageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Page number */}
        <div className="mt-1 text-center">
          <span className="text-[9px] font-semibold text-[#5B6472]">
            {pageIndex + 1}
          </span>
        </div>
      </div>
    </div>
  );
}