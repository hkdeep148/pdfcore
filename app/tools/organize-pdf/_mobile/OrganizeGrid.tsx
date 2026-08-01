'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRef } from 'react';
import { useOrganizePdfContext } from '../_context/OrganizePdfContext';
import type { OrganizePdfPage } from '../../_types';

interface MobileCardProps {
  page: OrganizePdfPage;
  index: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRotate: (id: string, direction: 'left' | 'right') => void;
}

function MobileCard({
  page,
  index,
  isSelected,
  onToggleSelect,
  onDelete,
  onRotate,
}: MobileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  // ⭐ Track pointer to distinguish tap from drag
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    const duration = Date.now() - pointerStartRef.current.time;

    if (dx > 10 || dy > 10 || duration > 250) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    onToggleSelect(page.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative bg-white rounded-xl border-2 p-2 transition-colors select-none ${
        isSelected
          ? 'border-[#2563EB] shadow-md'
          : 'border-[#E8E8F0]'
      } ${isDragging ? 'shadow-2xl scale-105 border-[#2563EB] touch-none' : ''}`}
      // ⭐ REMOVED: touch-none class (only when dragging)
    >
      {/* Order badge */}
      <div
        className={`absolute -top-1.5 -left-1.5 z-10 w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm pointer-events-none ${
          isSelected ? 'bg-[#2563EB]' : 'bg-[#5B6472]'
        }`}
      >
        {index + 1}
      </div>

      {/* Drag indicator icon */}
      <div className="absolute top-1 right-1 z-10 text-[#B0B7C3] pointer-events-none opacity-40">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>

      {/* Rotation badge */}
      {page.userRotation !== 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-white text-[9px] font-bold pointer-events-none">
          {page.userRotation}°
        </div>
      )}

      {/* Preview - Smart tap/drag detection */}
      <div
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded overflow-hidden flex items-center justify-center mt-4"
      >
        <img
          src={page.preview}
          alt={`Page ${index + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-300 pointer-events-none"
          style={{ transform: `rotate(${page.userRotation}deg)` }}
          draggable={false}
        />
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-[#2563EB]/10 rounded-xl pointer-events-none flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div
        className="flex items-center justify-around mt-1"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRotate(page.id, 'left');
          }}
          className="w-8 h-8 rounded flex items-center justify-center text-[#5B6472] active:bg-[#EFF3FF] active:scale-90 transition-transform"
          aria-label="Rotate left"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRotate(page.id, 'right');
          }}
          className="w-8 h-8 rounded flex items-center justify-center text-[#5B6472] active:bg-[#EFF3FF] active:scale-90 transition-transform"
          aria-label="Rotate right"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(page.id);
          }}
          className="w-8 h-8 rounded flex items-center justify-center text-[#EF4444] active:bg-[#FEE9E9] active:scale-90 transition-transform"
          aria-label="Delete"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function OrganizeGrid() {
  const {
    pages,
    selectedIds,
    reorderPages,
    toggleSelect,
    deletePage,
    rotatePage,
  } = useOrganizePdfContext();

  // ⭐ CRITICAL FIX: Longer delay + strict tolerance
  // This lets normal scroll gestures pass through
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,     // Longer press required
        tolerance: 5,   // Very strict - even small movement cancels drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,     // ⭐ 300ms long-press for touch
        tolerance: 5,   // ⭐ If finger moves 5px, it's a scroll not drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((page) => page.id === active.id);
      const newIndex = pages.findIndex((page) => page.id === over.id);

      const newPages = [...pages];
      const [movedItem] = newPages.splice(oldIndex, 1);
      newPages.splice(newIndex, 0, movedItem);

      reorderPages(newPages);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-3">
      {/* Drag hint */}
      <div className="mb-2.5 px-3 py-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-lg flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0"
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
        <p className="text-[10.5px] text-[#1E40AF] font-medium leading-tight">
          <strong>Tap</strong> to select · <strong>Long-press & drag</strong> to reorder · <strong>Swipe</strong> to scroll
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pages.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-2.5">
            {pages.map((page, index) => (
              <MobileCard
                key={page.id}
                page={page}
                index={index}
                isSelected={selectedIds.has(page.id)}
                onToggleSelect={toggleSelect}
                onDelete={deletePage}
                onRotate={rotatePage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}