'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { ReactNode } from 'react';
import type { PageGridItem } from './page-grid.types';

interface PageGridProps<T extends PageGridItem> {
  items: T[];
  onReorder?: (newOrder: T[]) => void;
  children: (item: T, index: number) => ReactNode;
  addMoreCard?: ReactNode;
  minCardSize?: number;
  gap?: number;
  disableDrag?: boolean; // ⭐ NEW
}

export default function PageGrid<T extends PageGridItem>({
  items,
  onReorder,
  children,
  addMoreCard,
  minCardSize = 150,
  gap = 16,
  disableDrag = false, // ⭐ NEW
}: PageGridProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!onReorder) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      onReorder(newItems);
    }
  };

  // ⭐ Render without DndContext when drag is disabled
  const gridContent = (
    <div
      className="grid"
      style={{
        gap: `${gap}px`,
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardSize}px, 1fr))`,
      }}
    >
      {items.map((item, index) => children(item, index))}
      {addMoreCard}
    </div>
  );

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2 -mr-2 pt-4 px-2 pb-6">
      {disableDrag ? (
        gridContent
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            {gridContent}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}