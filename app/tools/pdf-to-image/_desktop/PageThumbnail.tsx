'use client';

import type { PdfImagePage } from '../../_types';

interface PageThumbnailProps {
  page: PdfImagePage;
  index: number;
  isSelected: boolean;
  isProcessing: boolean;
  onToggleSelect: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PageThumbnail({
  page, index, isSelected,
  onToggleSelect, onRemove,
}: PageThumbnailProps) {
  return (
    <div
      onClick={() => onToggleSelect(page.id)}
      className={`relative bg-white rounded-lg border-2 transition-all cursor-pointer p-3 group ${
        isSelected
          ? 'border-[#2563EB] shadow-[0_12px_32px_-6px_rgba(37,99,235,0.35)]'
          : 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#D1D5FF]'
      }`}
    >
      {/* Checkbox */}
      <div className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
        isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#D1D5DB]'
      }`}>
        {isSelected && (
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(page.id); }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center shadow-sm hover:bg-[#DC2626] transition-colors z-10 opacity-0 group-hover:opacity-100"
        aria-label="Remove"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Preview */}
      <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded-md overflow-hidden flex items-center justify-center mt-6">
        <img
          src={page.preview}
          alt={`Page ${index + 1}`}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#5B6472]">
            Page {page.pageIndex + 1}
          </span>
          <span className="text-[10px] text-[#B0B7C3] truncate max-w-[80px]" title={page.pdfName}>
            {page.pdfName}
          </span>
        </div>
      </div>
    </div>
  );
}