'use client';

import { useState, useMemo } from 'react';
import { Check, FileText, X, MoveVertical } from 'lucide-react';
import MobileListView from '../../_components/MobileListView';
import { useSplitPdfContext } from '../_context/SplitPdfContext';
import { GROUP_COLORS } from '../_desktop/PageThumbnail';

export default function PageGrid() {
  const {
    pages,
    pageGroups,
    mode,
    extractMode,
    selectedPages,
    togglePageSelection,
    reorderPages,
  } = useSplitPdfContext();

  const [previewPage, setPreviewPage] = useState<{
    preview: string;
    label: string;
  } | null>(null);

  // Map page index → group index for grouped modes
  const pageToGroup = useMemo(() => {
    const map = new Map<number, number>();
    pageGroups.forEach((group, groupIdx) => {
      group.forEach((pageIdx) => map.set(pageIdx, groupIdx));
    });
    return map;
  }, [pageGroups]);

  // Bridge: convert selectedPages (Set<number>) to selectedIds (Set<string>)
  // for MobileListView, and vice versa for toggle.
  const selectedIds = useMemo(
    () => new Set(pages.filter((p) => selectedPages.has(p.pageIndex)).map((p) => p.id)),
    [pages, selectedPages],
  );

  const handleToggleSelect = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (page) togglePageSelection(page.pageIndex);
  };

  const isSelectMode = mode === 'pages' && extractMode === 'select';
  const allSelected = pages.length > 0 && selectedPages.size === pages.length;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      pages.forEach((p) => {
        if (selectedPages.has(p.pageIndex)) togglePageSelection(p.pageIndex);
      });
    } else {
      // Select all
      pages.forEach((p) => {
        if (!selectedPages.has(p.pageIndex)) togglePageSelection(p.pageIndex);
      });
    }
  };

  return (
    <>
      {/* Top header — same style as Organize */}
      <div className="mb-3 px-3 py-2 bg-[#EEF2FF] border border-[#E0E7FF] rounded-md flex items-center gap-2">
        <MoveVertical size={15} className="text-[#4F46E5]" strokeWidth={2.2} />
        <span className="text-[12.5px] font-semibold text-[#3730A3]">
          Drag the handle to reorder
        </span>
      </div>

      {/*
        ═══════════ SELECTION HEADER ═══════════
        Matches image-to-pdf style: rounded-lg bg-[#F8FAFC] border.
        Tap to select all / deselect all.
      */}
      {isSelectMode && (
        <button
          onClick={handleToggleSelectAll}
          disabled={pages.length === 0}
          className="mb-3 w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg flex items-center justify-between active:bg-[#F1F5F9] transition"
        >
          <span className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded flex items-center justify-center transition ${
                allSelected || selectedPages.size > 0
                  ? 'bg-[#2563EB]'
                  : 'border-2 border-[#CBD5E1] bg-white'
              }`}
            >
              {(allSelected || selectedPages.size > 0) && (
                <Check size={13} className="text-white" strokeWidth={3} />
              )}
            </span>
            <span className="text-[13px] font-semibold text-[#0F172A]">
              {selectedPages.size} of {pages.length} selected
            </span>
          </span>
          <span className="text-[11px] text-[#2563EB] font-semibold">
            {allSelected ? 'Deselect all' : 'Select all'}
          </span>
        </button>
      )}

      <MobileListView
        items={pages}
        onReorder={reorderPages}
        selectedIds={selectedIds}
        onToggleSelect={isSelectMode ? handleToggleSelect : undefined}
        accentColor="#2563EB"
        thumbnailSize={{ width: 50, height: 64 }}
        renderThumbnail={(page) => (
          <img
            src={page.preview}
            alt={`Page ${page.pageIndex + 1}`}
            draggable={false}
            className="max-w-full max-h-full object-contain select-none"
          />
        )}
        onThumbnailTap={(page) =>
          setPreviewPage({
            preview: page.preview,
            label: `Page ${page.pageIndex + 1}`,
          })
        }
        renderThumbnailBadge={(page) => {
          // In grouped modes, show group number badge
          if (!isSelectMode) {
            const groupIdx = pageToGroup.get(page.pageIndex);
            if (groupIdx !== undefined) {
              const color = GROUP_COLORS[groupIdx % GROUP_COLORS.length];
              return (
                <div
                  className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow-sm border-2 border-white"
                  style={{ backgroundColor: color }}
                >
                  {groupIdx + 1}
                </div>
              );
            }
          }
          return null;
        }}
        renderPrimaryText={(page) => `Page ${page.pageIndex + 1}`}
        renderSecondaryText={(page) => {
          if (!isSelectMode) {
            const groupIdx = pageToGroup.get(page.pageIndex);
            if (groupIdx !== undefined) return `Group ${groupIdx + 1}`;
            return 'Not included';
          }
          return '';
        }}
      />

      {/* Full-screen preview modal */}
      {previewPage && (
        <PagePreviewModal
          preview={previewPage.preview}
          label={previewPage.label}
          onClose={() => setPreviewPage(null)}
        />
      )}
    </>
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