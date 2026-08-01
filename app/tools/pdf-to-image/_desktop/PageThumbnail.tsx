'use client';

import type { PdfImagePage } from '../../_types';

interface PageThumbnailProps {
  page: PdfImagePage;
  index: number;
  isSelected: boolean;
  isProcessing: boolean;   // Now means: is THIS page being downloaded
  onToggleSelect: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PageThumbnail({
  page, index, isSelected, isProcessing,
  onToggleSelect, onDownload, onRemove,
}: PageThumbnailProps) {
  return (
    <div
      onClick={() => onToggleSelect(page.id)}
      className={`relative bg-white rounded-2xl border-2 transition-all cursor-pointer p-3 group ${
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
      <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded-lg overflow-hidden flex items-center justify-center mt-6">
        <img
          src={page.preview}
          alt={`Page ${index + 1}`}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-[#5B6472]">
            Page {page.pageIndex + 1}
          </span>
          <span className="text-[10px] text-[#B0B7C3] truncate max-w-[80px]" title={page.pdfName}>
            {page.pdfName}
          </span>
        </div>

        {/* Download button - shows spinner ONLY when this page is downloading */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!isProcessing) onDownload(page.id);
          }}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#10B981] text-white text-[11px] font-semibold hover:bg-[#059669] transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {isProcessing ? (
            <>
              <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}