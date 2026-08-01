'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import type { CardAction } from './page-grid.types';

interface PageGridCardProps {
  id: string;
  preview: string;
  index: number;
  isSelected?: boolean;
  rotation?: number;
  aspectRatio?: string;
  showCheckbox?: boolean;
  showOrderBadge?: boolean;
  onSelect?: () => void;
  actions?: CardAction[];
  footer?: ReactNode;
  overlay?: ReactNode;
  altText?: string;
}

export default function PageGridCard({
  id,
  preview,
  index,
  isSelected = false,
  rotation = 0,
  aspectRatio = '1/1.414',
  showCheckbox = true,
  showOrderBadge = true,
  onSelect,
  actions = [],
  footer,
  overlay,
  altText,
}: PageGridCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-xl border-2 transition-colors p-2 group select-none ${
        isSelected
          ? 'border-[#2563EB] shadow-[0_12px_32px_-6px_rgba(37,99,235,0.35)]'
          : 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#D1D5FF]'
      } ${isDragging ? 'shadow-[0_24px_48px_rgba(20,30,60,0.35)] scale-105' : ''}`}
    >
      {/* Order badge */}
      {showOrderBadge && (
        <div
          className={`absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md pointer-events-none ${
            isSelected ? 'bg-[#2563EB]' : 'bg-[#5B6472]'
          }`}
        >
          {index + 1}
        </div>
      )}

      {/* Selection checkbox */}
      {showCheckbox && onSelect && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            isSelected
              ? 'bg-[#2563EB] border-[#2563EB]'
              : 'bg-white border-[#D1D5DB] hover:border-[#2563EB]'
          }`}
          aria-label={isSelected ? 'Deselect' : 'Select'}
        >
          {isSelected && (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      )}

      {/* Rotation badge */}
      {rotation !== 0 && (
        <div className="absolute top-9 right-1.5 z-10 px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-[9px] font-bold shadow-sm pointer-events-none">
          {rotation}°
        </div>
      )}

      {/* Custom overlay (e.g., progress, status) */}
      {overlay}

      {/* Draggable Preview */}
      <div
        {...attributes}
        {...listeners}
        className="w-full bg-[#F5F5FA] rounded overflow-hidden flex items-center justify-center mt-3 cursor-grab active:cursor-grabbing relative"
        style={{ aspectRatio }}
      >
        <img
          src={preview}
          alt={altText || `Page ${index + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-300 pointer-events-none"
          style={{ transform: `rotate(${rotation}deg)` }}
          draggable={false}
        />

        {/* Drag indicator on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="bg-white/95 rounded-full p-2 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 9 2 12 5 15" />
              <polyline points="9 5 12 2 15 5" />
              <polyline points="15 19 12 22 9 19" />
              <polyline points="19 9 22 12 19 15" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </div>
        </div>
      </div>

      {/* Actions footer */}
      {actions.length > 0 && (
        <div className="mt-2 flex items-center justify-between gap-1 px-1">
          <div className="flex gap-0.5">
            {actions.filter((a) => a.variant !== 'danger').map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(e);
                }}
                disabled={action.disabled}
                className="w-7 h-7 rounded flex items-center justify-center text-[#5B6472] hover:text-[#2563EB] hover:bg-[#EFF3FF] transition-colors disabled:opacity-40"
                aria-label={action.label}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5">
            {actions.filter((a) => a.variant === 'danger').map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(e);
                }}
                disabled={action.disabled}
                className="w-7 h-7 rounded flex items-center justify-center text-[#EF4444] hover:bg-[#FEE9E9] transition-colors disabled:opacity-40"
                aria-label={action.label}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom footer content */}
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}