'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MergePdfItem } from '../../_types';

interface PdfMergeCardProps {
  item: MergePdfItem;
  index: number;
  totalItems: number;
  onRemove: (id: string) => void;
}

export default function PdfMergeCard({ item, index, onRemove }: PdfMergeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="select-none w-full">
      <div
        className={`relative bg-white rounded-2xl p-3 pt-9 border-2 border-[#ECEDF3] 
                   shadow-[0_4px_14px_rgba(20,30,60,0.06)] 
                   hover:border-[#C9D8F3] hover:shadow-[0_8px_20px_-4px_rgba(20,30,60,0.1)] 
                   transition-all w-full ${
                     isDragging ? 'shadow-[0_24px_48px_rgba(20,30,60,0.35)] scale-105' : ''
                   }`}
      >
        {/* Drag handle (6 dots) at top center */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col gap-[3px] 
                     cursor-grab active:cursor-grabbing p-2 touch-none z-10"
          style={{ touchAction: 'none' }}
          aria-label="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-[3px]">
            <span className="w-[3px] h-[3px] rounded-full bg-[#C7CBDA]" />
            <span className="w-[3px] h-[3px] rounded-full bg-[#C7CBDA]" />
            <span className="w-[3px] h-[3px] rounded-full bg-[#C7CBDA]" />
          </div>
          <div className="flex gap-[3px]">
            <span className="w-[3px] h-[3px] rounded-full bg-[#C7CBDA]" />
            <span className="w-[3px] h-[3px] rounded-full bg-[#C7CBDA]" />
            <span className="w-[3px] h-[3px] rounded-full bg-[#C7CBDA]" />
          </div>
        </div>

        {/* Remove button at top right */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#EF4444] 
                     flex items-center justify-center shadow-md 
                     hover:bg-[#DC2626] hover:scale-110 transition-all z-20"
          aria-label="Remove PDF"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* PDF Preview (first page) */}
        <div
          className="relative w-full mx-auto bg-white border border-[#E2E2EE] 
                     shadow-sm overflow-hidden rounded-md flex items-center justify-center"
          style={{ aspectRatio: '0.707' /* A4 ratio */ }}
        >
          <img
            src={item.firstPagePreview}
            alt={item.name}
            draggable={false}
            className="w-full h-full object-contain"
          />
        </div>

        {/* File info */}
        <div className="mt-3 px-1">
          <p className="text-[12px] font-bold text-[#07122E] truncate" title={item.name}>
            {item.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[10.5px] text-[#8A93A3]">
            <span className="font-semibold text-[#2563EB]">
              {item.totalPages} {item.totalPages === 1 ? 'page' : 'pages'}
            </span>
            <span>•</span>
            <span>{item.sizeMB}</span>
          </div>
        </div>

        {/* Position number badge at bottom */}
        <div className="flex justify-center mt-3">
          <div
            className="w-6 h-6 rounded-full bg-[#2D3748] text-white 
                       flex items-center justify-center text-[11px] font-bold"
          >
            {index + 1}
          </div>
        </div>
      </div>
    </div>
  );
}