'use client';

import type { PdfPageItem } from '../../_types';

interface PdfPageCardProps {
  page: PdfPageItem;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRotateLeft: (id: string) => void;
  onRotateRight: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PdfPageCard({
  page, index, isSelected,
  onToggleSelect, onRotateLeft, onRotateRight, onRemove,
}: PdfPageCardProps) {
  return (
    <div
      onClick={() => onToggleSelect(page.id)}
      className={`relative bg-white rounded-2xl border-2 transition-all cursor-pointer p-3 group ${
        isSelected
          ? 'border-[#2563EB] shadow-[0_12px_32px_-6px_rgba(37,99,235,0.35)]'
          : 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#D1D5FF]'
      }`}
      style={{ width: 180 }}
    >
      {/* Selection checkbox */}
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
        aria-label="Remove page"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Rotation indicator */}
      {page.rotation !== 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-[#F59E0B] text-white text-[10px] font-bold shadow-sm">
          {page.rotation}°
        </div>
      )}

      {/* PDF preview */}
      <div className="relative w-full aspect-[1/1.414] bg-[#F5F5FA] rounded-lg overflow-hidden flex items-center justify-center mt-6">
        <img
          src={page.preview}
          alt={`Page ${index + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-300"
          style={{ transform: `rotate(${page.rotation}deg)` }}
          draggable={false}
        />
      </div>

      {/* Page number */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-[11px] font-semibold text-[#5B6472]">
          Page {index + 1}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRotateLeft(page.id); }}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#EFF3FF] text-[#5B6472] hover:text-[#2563EB] transition-colors"
            aria-label="Rotate left"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRotateRight(page.id); }}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#EFF3FF] text-[#5B6472] hover:text-[#2563EB] transition-colors"
            aria-label="Rotate right"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}