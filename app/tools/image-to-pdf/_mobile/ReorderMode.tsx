'use client';

import { Reorder, useDragControls } from 'framer-motion';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import type { ImageItem } from '../../_types';

interface ReorderItemProps {
  item: ImageItem;
  index: number;
  onRemove: (id: string) => void;
}

function ReorderItem({ item, index, onRemove }: ReorderItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        zIndex: 50,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-white rounded-2xl p-3 shadow-sm border-2 border-[#E8E8F0] flex items-center gap-3"
    >
      <div
        onPointerDown={(e) => { e.preventDefault(); dragControls.start(e); }}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing py-4 -my-4 pl-1 pr-2 touch-none select-none"
        style={{ touchAction: 'none' }}
      >
        <div className="text-[#B0B7C3]">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </div>
        <div className="w-9 h-9 rounded-lg bg-[#E8EEFF] text-[#2563EB] text-[14px] font-bold flex items-center justify-center flex-shrink-0">
          {index + 1}
        </div>
      </div>

      <div className="w-16 h-20 rounded-lg bg-white border border-[#E8E8F0] shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
        <img
          src={item.preview}
          alt={`Page ${index + 1}`}
          className="max-w-full max-h-full object-contain"
          style={{ transform: `rotate(${item.rotation}deg)` }}
          draggable={false}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#07122E] truncate">Page {index + 1}</p>
        <p className="text-[11px] text-[#8A93A3] mt-0.5 truncate">{item.file.name}</p>
        <p className="text-[10px] text-[#B0B7C3] mt-0.5">{item.sizeMB}</p>
      </div>

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
        className="w-8 h-8 rounded-full bg-[#FEE9E9] flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
        aria-label="Delete page"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </Reorder.Item>
  );
}

interface ReorderModeProps {
  onDone: () => void;
}

export default function ReorderMode({ onDone }: ReorderModeProps) {
  const { images, reorderImages, removeImage } = useImageToPdfContext();

  return (
    <>
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        <div className="mb-4 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3 flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-[12px] text-[#1E40AF] font-medium">Drag the handle on the left to reorder pages</p>
        </div>

        <Reorder.Group
          axis="y"
          values={images}
          onReorder={reorderImages}
          className="list-none p-0 space-y-3"
        >
          {images.map((item, index) => (
            <ReorderItem
              key={item.id}
              item={item}
              index={index}
              onRemove={removeImage}
            />
          ))}
        </Reorder.Group>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F5F5FA] via-[#F5F5FA] to-transparent">
        <button
          type="button"
          onClick={onDone}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#2563EB] text-white text-[16px] font-bold shadow-[0_8px_24px_-4px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-transform"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Done Reordering
        </button>
      </div>
    </>
  );
}