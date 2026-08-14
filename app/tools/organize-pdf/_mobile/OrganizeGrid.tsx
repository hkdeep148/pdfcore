'use client';

import { useState } from 'react';
import { RotateCcw, RotateCw, Trash2, FileText, X } from 'lucide-react';
import MobileListView from '../../_components/MobileListView';
import { useOrganizePdfContext } from '../_context/OrganizePdfContext';

export default function OrganizeGrid() {
  const {
    pages,
    selectedIds,
    reorderPages,
    toggleSelect,
    deletePage,
    rotatePage,
    clearSelection,
  } = useOrganizePdfContext();

  const [previewPage, setPreviewPage] = useState<{
    preview: string;
    label: string;
  } | null>(null);

  return (
    <div className="pb-3">
      {/* Selection bar — full width, light purple theme */}
      <div className="mb-3 px-3 py-2 bg-[#EEF2FF] border border-[#E0E7FF] rounded-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-[#4F46E5]" strokeWidth={2.2} />
          <span className="text-[12.5px] font-semibold text-[#3730A3]">
            {selectedIds.size} of {pages.length} selected
          </span>
        </div>
        <button
          onClick={clearSelection}
          disabled={selectedIds.size === 0}
          className="flex items-center gap-1 text-[11px] font-bold text-[#EF4444] active:opacity-60 transition disabled:opacity-40"
        >
          <Trash2 size={14} strokeWidth={2.2} />
          Clear all
        </button>
      </div>

      {/*
        ═══════════ UNIVERSAL LIST ═══════════
        Uses the same list view as image-to-pdf / merge-pdf.
        Thumbnail is slightly bigger (50×64) so page previews
        are easier to see. Tapping the thumbnail opens a
        full-screen preview.
      */}
      <MobileListView
        items={pages}
        onReorder={reorderPages}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        accentColor="#2563EB"
        thumbnailSize={{ width: 50, height: 64 }}
        renderThumbnail={(page, index) => (
          <img
            src={page.preview}
            alt={`Page ${index + 1}`}
            draggable={false}
            className="max-w-full max-h-full object-contain select-none"
            style={{ transform: `rotate(${page.userRotation}deg)` }}
          />
        )}
        onThumbnailTap={(page, index) =>
          setPreviewPage({
            preview: page.preview,
            label: `Page ${index + 1}`,
          })
        }
        renderThumbnailBadge={(_page, index) => (
          <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
            {index + 1}
          </div>
        )}
        renderPrimaryText={(_page, index) => `Page ${index + 1}`}
        renderSecondaryText={(page) =>
          page.userRotation !== 0 ? `Rotated ${page.userRotation}°` : ''
        }
        actions={(page) => [
          {
            icon: <RotateCcw size={15} strokeWidth={1.8} />,
            ariaLabel: 'Rotate left',
            onClick: () => rotatePage(page.id, 'left'),
          },
          {
            icon: <RotateCw size={15} strokeWidth={1.8} />,
            ariaLabel: 'Rotate right',
            onClick: () => rotatePage(page.id, 'right'),
          },
          {
            icon: <Trash2 size={15} strokeWidth={1.8} />,
            ariaLabel: 'Delete',
            onClick: () => deletePage(page.id),
            variant: 'danger',
          },
        ]}
      />

      {/* Full-screen preview modal */}
      {previewPage && (
        <PagePreviewModal
          preview={previewPage.preview}
          label={previewPage.label}
          onClose={() => setPreviewPage(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PagePreviewModal — full-screen preview thumbnail
// ═══════════════════════════════════════════════════════════════
function PagePreviewModal({
  preview,
  label,
  onClose,
}: {
  preview: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <FileText size={15} className="text-white" strokeWidth={2} />
          </div>
          <p className="text-[14px] font-bold text-white">{label}</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition"
          aria-label="Close preview"
        >
          <X size={20} className="text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        <img
          src={preview}
          alt={label}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}