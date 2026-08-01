'use client';

import { Reorder, useDragControls } from 'framer-motion';
import { useMergePdfContext } from '../_context/MergePdfContext';
import type { MergePdfItem } from '../../_types';

interface MobileMergeCardProps {
  item: MergePdfItem;
  index: number;
  onRemove: (id: string) => void;
}

function MobileMergeCard({ item, index, onRemove }: MobileMergeCardProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.03,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        zIndex: 50,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-white rounded-2xl border border-[#E8E8F0] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      {/* Drag handle */}
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          dragControls.start(e);
        }}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing py-3 -my-3 px-1 text-[#B0B7C3] touch-none"
        style={{ touchAction: 'none' }}
        aria-label="Drag"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>

      {/* Order badge */}
      <div className="w-8 h-8 rounded-lg bg-[#EFF3FF] text-[#2563EB] text-[13px] font-bold flex items-center justify-center flex-shrink-0">
        {index + 1}
      </div>

      {/* PDF thumbnail */}
      <div className="w-12 h-14 bg-white border border-[#E8E8F0] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
        <img
          src={item.firstPagePreview}
          alt={item.name}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#07122E] truncate">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#8A93A3]">
          <span className="font-semibold text-[#2563EB]">{item.totalPages} pages</span>
          <span>•</span>
          <span>{item.sizeMB}</span>
        </div>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="w-8 h-8 rounded-full bg-[#FEE9E9] flex items-center justify-center flex-shrink-0 active:scale-90"
        aria-label="Remove"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </Reorder.Item>
  );
}

export default function PdfMobileList() {
  const { items, reorderPdfs, removePdf } = useMergePdfContext();

  return (
    <div className="h-full overflow-y-auto px-3 pb-3">
      {/* Drag hint - only shows when 2+ items */}
      {items.length >= 2 && (
        <div className="mb-3 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-3 py-2 flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-[#2563EB] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-[11px] text-[#1E40AF] font-medium">
            Drag the handle to reorder PDFs
          </p>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={reorderPdfs}
        className="list-none p-0 space-y-2.5"
      >
        {items.map((item, index) => (
          <MobileMergeCard
            key={item.id}
            item={item}
            index={index}
            onRemove={removePdf}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}