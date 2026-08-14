
'use client';

import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Check, GripVertical } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface MobileListAction {
  icon: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface MobileListViewProps<T extends { id: string }> {
  /** Items to render. Each item must have a unique `id`. */
  items: T[];

  /** Enable drag-to-reorder. If provided, drag handles appear on each row. */
  onReorder?: (newOrder: T[]) => void;

  /** Enable selection. Pass both `selectedIds` and `onToggleSelect` to show checkboxes. */
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;

  /** Required: render the thumbnail (usually an `<img>` or icon). */
  renderThumbnail: (item: T, index: number) => React.ReactNode;

  /** Required: render the primary text (usually a title / page label). */
  renderPrimaryText: (item: T, index: number) => React.ReactNode;

  /** Optional: render secondary text (usually a size / description). */
  renderSecondaryText?: (item: T, index: number) => React.ReactNode;

  /** Optional: render a small badge overlaid on the thumbnail (e.g., order number, rotation). */
  renderThumbnailBadge?: (item: T, index: number) => React.ReactNode;

  /** Optional: tap the thumbnail to trigger a preview / action. */
  onThumbnailTap?: (item: T, index: number) => void;

  /** Optional: trailing action buttons on the right of each row. */
  actions?: (item: T, index: number) => MobileListAction[];

  /** Optional: accent color used for selection indicator + primary actions. */
  accentColor?: string;

  /** Optional: shown when items is empty. */
  emptyState?: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function MobileListView<T extends { id: string }>({
  items,
  onReorder,
  selectedIds,
  onToggleSelect,
  renderThumbnail,
  renderPrimaryText,
  renderSecondaryText,
  renderThumbnailBadge,
  onThumbnailTap,
  actions,
  accentColor = '#2563EB',
  emptyState,
}: MobileListViewProps<T>) {
  const isReorderable = !!onReorder;
  const isSelectable = !!selectedIds && !!onToggleSelect;

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  const rows = items.map((item, index) => {
    const isSelected = selectedIds?.has(item.id) ?? false;
    return (
      <MobileListRow<T>
        key={item.id}
        item={item}
        index={index}
        isSelected={isSelected}
        isReorderable={isReorderable}
        isSelectable={isSelectable}
        onToggleSelect={onToggleSelect}
        renderThumbnail={renderThumbnail}
        renderPrimaryText={renderPrimaryText}
        renderSecondaryText={renderSecondaryText}
        renderThumbnailBadge={renderThumbnailBadge}
        onThumbnailTap={onThumbnailTap}
        actions={actions}
        accentColor={accentColor}
      />
    );
  });

  return (
    /*
      Outer wrapper handles the border + rounded corners + clip.
      Reorder.Group inside stays overflow-visible so dragged items
      can scale/shadow freely without being clipped.
    */
    <div className="border border-[#F1F5F9] rounded-lg bg-white overflow-hidden">
      {isReorderable ? (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={onReorder!}
          className="list-none p-0 m-0"
        >
          {rows}
        </Reorder.Group>
      ) : (
        <ul className="list-none p-0 m-0">{rows}</ul>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROW
// ═══════════════════════════════════════════════════════════════

interface MobileListRowProps<T extends { id: string }> {
  item: T;
  index: number;
  isSelected: boolean;
  isReorderable: boolean;
  isSelectable: boolean;
  onToggleSelect?: (id: string) => void;
  renderThumbnail: (item: T, index: number) => React.ReactNode;
  renderPrimaryText: (item: T, index: number) => React.ReactNode;
  renderSecondaryText?: (item: T, index: number) => React.ReactNode;
  renderThumbnailBadge?: (item: T, index: number) => React.ReactNode;
  onThumbnailTap?: (item: T, index: number) => void;
  actions?: (item: T, index: number) => MobileListAction[];
  accentColor: string;
}

function MobileListRow<T extends { id: string }>({
  item,
  index,
  isSelected,
  isReorderable,
  isSelectable,
  onToggleSelect,
  renderThumbnail,
  renderPrimaryText,
  renderSecondaryText,
  renderThumbnailBadge,
  onThumbnailTap,
  actions,
  accentColor,
}: MobileListRowProps<T>) {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  const rowContent = (
    <>
      {/*
        Left accent bar — only when selected. Subtle indicator that
        doesn't wash the row in color.
      */}
      {isSelected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: accentColor }}
          aria-hidden="true"
        />
      )}

      {/* Drag handle — only if reorderable */}
      {isReorderable && (
        <div
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
          className="w-5 flex items-center justify-center py-2 -my-2 text-[#CBD5E1] cursor-grab active:cursor-grabbing touch-none"
          style={{ touchAction: 'none' }}
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} strokeWidth={2} />
        </div>
      )}

      {/* Selection checkbox — only if selectable */}
      {isSelectable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect!(item.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition"
          style={{
            backgroundColor: isSelected ? accentColor : '#FFFFFF',
            border: isSelected ? 'none' : '2px solid #CBD5E1',
          }}
          aria-label={isSelected ? 'Deselect' : 'Select'}
        >
          {isSelected && (
            <Check size={13} className="text-white" strokeWidth={3} />
          )}
        </button>
      )}

      {/* Thumbnail — optionally tappable, with optional badge overlay */}
      <div className="relative flex-shrink-0">
        {onThumbnailTap ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onThumbnailTap(item, index);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="block bg-[#F8FAFC] border border-[#E2E8F0] rounded overflow-hidden flex items-center justify-center active:opacity-70 transition"
            style={{ width: 34, height: 44 }}
            aria-label="Preview"
          >
            {renderThumbnail(item, index)}
          </button>
        ) : (
          <div
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded overflow-hidden flex items-center justify-center"
            style={{ width: 34, height: 44 }}
          >
            {renderThumbnail(item, index)}
          </div>
        )}

        {/*
          Optional badge overlaid on the thumbnail — used for order
          numbers, rotation indicators, etc. Positioned bottom-right
          so it doesn't cover thumbnail content.
        */}
        {renderThumbnailBadge && (
          <div
            className="absolute -bottom-1 -right-1 pointer-events-none"
            aria-hidden="true"
          >
            {renderThumbnailBadge(item, index)}
          </div>
        )}
      </div>

      {/* Primary + optional secondary text */}
      <div className="flex-1 min-w-0 ml-1">
        <p className="text-[13px] font-medium text-[#0F172A] truncate leading-tight">
          {renderPrimaryText(item, index)}
        </p>
        {renderSecondaryText && (
          <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
            {renderSecondaryText(item, index)}
          </p>
        )}
      </div>

      {/* Trailing action buttons */}
      {actions && (
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {actions(item, index).map((action, i) => (
            <ActionButton key={i} action={action} accentColor={accentColor} />
          ))}
        </div>
      )}
    </>
  );

  const commonClassName =
    'relative px-3 py-2.5 flex items-center gap-2 border-b border-[#F1F5F9] last:border-b-0';

  if (isReorderable) {
    return (
      <Reorder.Item
        value={item}
        id={item.id}
        layout
        dragListener={false}
        dragControls={dragControls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          position: 'relative',
          zIndex: isDragging ? 40 : 1,
          backgroundColor: '#FFFFFF',
          boxShadow: isDragging ? '0 12px 32px rgba(0,0,0,0.15)' : 'none',
        }}
        whileDrag={{ scale: 1.03 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 40,
          mass: 0.8,
        }}
        className={commonClassName}
      >
        {rowContent}
      </Reorder.Item>
    );
  }

  return (
    <li className={commonClassName} style={{ backgroundColor: '#FFFFFF' }}>
      {rowContent}
    </li>
  );
}

// ═══════════════════════════════════════════════════════════════
// ACTION BUTTON
// ═══════════════════════════════════════════════════════════════

function ActionButton({
  action,
  accentColor,
}: {
  action: MobileListAction;
  accentColor: string;
}) {
  const colorClass =
    action.variant === 'primary'
      ? 'active:bg-[#F5F3FF]'
      : action.variant === 'danger'
      ? 'text-[#64748B] active:bg-[#FEF2F2] active:text-[#EF4444]'
      : 'text-[#64748B] active:bg-[#F1F5F9]';

  const colorStyle =
    action.variant === 'primary' ? { color: accentColor } : undefined;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        action.onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      disabled={action.disabled || action.loading}
      className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40 transition ${colorClass}`}
      style={colorStyle}
      aria-label={action.ariaLabel}
    >
      {action.loading ? (
        <div
          className="w-4 h-4 rounded-full border-[1.5px] animate-spin"
          style={{
            borderColor: `${accentColor}4D`,
            borderTopColor: accentColor,
          }}
        />
      ) : (
        action.icon
      )}
    </button>
  );
}