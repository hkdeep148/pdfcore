'use client';

import type { SplitPdfPage } from '../../_types';

interface PageThumbnailProps {
  page: SplitPdfPage;
  groupIndex: number | null;
  groupColor: string;
  isSelectable?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (pageIndex: number) => void;
}

export const GROUP_COLORS = [
  '#2563EB', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#EF4444',
];

export default function PageThumbnail({
  page,
  groupIndex,
  groupColor,
  isSelectable = false,
  isSelected = false,
  onToggleSelect,
}: PageThumbnailProps) {
  const isIncluded = groupIndex !== null;

  // ⭐ Selection mode (from "Select pages")
  if (isSelectable) {
    return (
      <div
        className="select-none w-full cursor-pointer"
        onClick={() => onToggleSelect?.(page.pageIndex)}
      >
        <div
          className={`relative bg-white rounded-xl border-2 p-2 group transition-all ${
            isSelected
              ? 'border-[#10B981] shadow-[0_8px_24px_-4px_rgba(16,185,129,0.35)]'
              : 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#10B981]/50 hover:shadow-[0_8px_20px_-4px_rgba(20,30,60,0.1)]'
          }`}
        >
          {/* ⭐ Green checkmark badge (top-right) when selected */}
          {isSelected && (
            <div className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg pointer-events-none">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}

          {/* Preview */}
          <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded overflow-hidden flex items-center justify-center mt-3">
            <img
              src={page.preview}
              alt={`Page ${page.pageIndex + 1}`}
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Page number */}
          <div className="mt-2 flex items-center justify-center h-7">
            <div
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                isSelected
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#F1F5F9] text-[#5B6472]'
              }`}
            >
              Page {page.pageIndex + 1}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ⭐ Default mode (extract-all, range) — non-clickable with group coloring
  return (
    <div className="select-none w-full">
      <div
        className={`relative bg-white rounded-xl border-2 p-2 group transition-all ${
          isIncluded
            ? 'shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:shadow-[0_8px_20px_-4px_rgba(20,30,60,0.15)]'
            : 'opacity-40 hover:opacity-60'
        }`}
        style={{
          borderColor: isIncluded ? groupColor : '#ECEDF3',
        }}
      >
        {isIncluded && (
          <div
            className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md pointer-events-none"
            style={{ backgroundColor: groupColor }}
          >
            {groupIndex! + 1}
          </div>
        )}

        {!isIncluded && (
          <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-full bg-[#94A3B8] text-white text-[9px] font-bold shadow-sm pointer-events-none">
            Excluded
          </div>
        )}

        <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded overflow-hidden flex items-center justify-center mt-3">
          <img
            src={page.preview}
            alt={`Page ${page.pageIndex + 1}`}
            className="max-w-full max-h-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        <div className="mt-2 flex items-center justify-center h-7">
          <div
            className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors"
            style={{
              backgroundColor: isIncluded ? `${groupColor}15` : '#F1F5F9',
              color: isIncluded ? groupColor : '#5B6472',
            }}
          >
            Page {page.pageIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
}