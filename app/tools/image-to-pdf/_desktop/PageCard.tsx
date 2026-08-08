'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ImageItem, PageFit, PageBackground, PageSize, Orientation } from '../../_types';
import { PAGE_BACKGROUND_HEX } from '../_utils/pdfGenerator';

const PAGE_ASPECT_RATIOS: Record<PageSize, number> = {
  A4: 595.28 / 841.89,
  A3: 841.89 / 1190.55,
  A5: 419.53 / 595.28,
  Letter: 612 / 792,
  Legal: 612 / 1008,
};

interface PageCardProps {
  item: ImageItem;
  index: number;
  ratio: number;
  marginPercent: number;
  pageFit: PageFit;
  background: PageBackground;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onPreview?: (imageUrl: string, imageName: string) => void;
}

export default function PageCard({
  item, index, ratio, marginPercent, pageFit, background,
  isSelected, onSelect, onRemove, onPreview,
}: PageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  // Calculate preview ratio based on per-image orientation if set
  const previewRatio = item.orientation && item.pageSize
    ? (() => {
      const baseRatio = PAGE_ASPECT_RATIOS[item.pageSize];
      return item.orientation === 'Portrait' ? baseRatio : 1 / baseRatio;
    })()
    : ratio;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const bgHex = PAGE_BACKGROUND_HEX[background];
  const pageBgClass = bgHex === null
    ? 'bg-[repeating-conic-gradient(#f0f0f5_0%_25%,white_0%_50%)] [background-size:14px_14px]'
    : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className="select-none w-full"
    >
      <div
        className={`relative bg-white rounded-2xl p-3 pt-9 border-2 transition-all cursor-pointer w-full ${
          isSelected
            ? 'border-[#2563EB] shadow-[0_16px_40px_-8px_rgba(37,99,235,0.4)]'
            : 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#C9D8F3] hover:shadow-[0_8px_20px_-4px_rgba(20,30,60,0.1)]'
        } ${isDragging ? 'shadow-[0_24px_48px_rgba(20,30,60,0.35)] scale-105' : ''}`}
      >
        {/* Drag handle (6 dots) - uses dnd-kit listeners */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col gap-[3px] cursor-grab active:cursor-grabbing p-2 touch-none z-10"
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

        {/* Remove button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center shadow-md hover:bg-[#DC2626] hover:scale-110 transition-all z-20"
          aria-label="Remove page"
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

        {/* Paper preview - preserves your dynamic ratio, background, margins, fit */}
        <div
          className={`relative w-full mx-auto border border-[#E2E2EE] shadow-sm overflow-hidden ${
            bgHex === '#000000' ? 'bg-black' : bgHex === '#FFFFFF' ? 'bg-white' : pageBgClass
          }`}
          style={{ aspectRatio: previewRatio }}
        >
          {/* Content area with margins */}
          <div
            className="absolute flex items-center justify-center overflow-hidden"
            style={{
              left: `${marginPercent}%`,
              top: `${marginPercent}%`,
              right: `${marginPercent}%`,
              bottom: `${marginPercent}%`,
            }}
          >
            <img
              src={item.preview}
              alt={item.file.name}
              draggable={false}
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.(item.preview, item.file.name);
              }}
              className="transition-transform duration-200 cursor-pointer hover:opacity-90"
              style={{
                width: pageFit === 'Fill page' ? '100%' : 'auto',
                height: pageFit === 'Fill page' ? '100%' : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: pageFit === 'Fill page' ? 'cover' : 'contain',
                transform: `rotate(${item.rotation}deg)`,
              }}
            />
          </div>
        </div>

        {/* Page number badge */}
        <div className="flex justify-center mt-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
              isSelected
                ? 'bg-[#2563EB] text-white shadow-[0_4px_10px_-2px_rgba(37,99,235,0.5)]'
                : 'bg-[#2D3748] text-white'
            }`}
          >
            {index + 1}
          </div>
        </div>
      </div>
    </div>
  );
}