'use client';

import { useState } from 'react';
import { Check, Trash2, FileText, X } from 'lucide-react';
import MobileListView from '../../_components/MobileListView';
import { usePdfToImageContext } from '../_context/PdfToImageContext';

export default function PageGrid() {
  const {
    pages,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    removePage,
    reorderPages,
  } = usePdfToImageContext();

  const [previewPage, setPreviewPage] = useState<{
    preview: string;
    label: string;
    pdfName: string;
  } | null>(null);

  const allSelected = pages.length > 0 && selectedIds.size === pages.length;

  return (
    <>
      {/*
        ═══════════ SELECTION HEADER ═══════════
        Clickable toggle — matches image-to-pdf style:
        tap to select all / deselect all.
      */}
      <button
        onClick={allSelected ? clearSelection : selectAll}
        disabled={pages.length === 0}
        className="mb-3 w-full px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg flex items-center justify-between active:bg-[#F1F5F9] transition"
      >
        <span className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded flex items-center justify-center transition ${
              allSelected || selectedIds.size > 0
                ? 'bg-[#2563EB]'
                : 'border-2 border-[#CBD5E1] bg-white'
            }`}
          >
            {(allSelected || selectedIds.size > 0) && (
              <Check size={13} className="text-white" strokeWidth={3} />
            )}
          </span>
          <span className="text-[13px] font-semibold text-[#0F172A]">
            {selectedIds.size} of {pages.length} selected
          </span>
        </span>
        <span className="text-[11px] text-[#2563EB] font-semibold">
          {allSelected ? 'Deselect all' : 'Select all'}
        </span>
      </button>

      {/*
        ═══════════ UNIVERSAL LIST ═══════════
        All row structure, drag handles, selection checkbox,
        thumbnail tap, and trailing actions handled by
        MobileListView. Only tool-specific bits live here.
      */}
      <MobileListView
        items={pages}
        onReorder={reorderPages}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        accentColor="#2563EB"
        renderThumbnail={(page) => (
          <img
            src={page.preview}
            alt=""
            draggable={false}
            className="max-w-full max-h-full object-contain select-none"
          />
        )}
        onThumbnailTap={(page) =>
          setPreviewPage({
            preview: page.preview,
            label: `Page ${page.pageIndex + 1}`,
            pdfName: page.pdfName,
          })
        }
        renderPrimaryText={(page) => `Page ${page.pageIndex + 1}`}
        renderSecondaryText={(page) => page.pdfName}
        actions={(page) => [
          {
            icon: <Trash2 size={15} strokeWidth={1.8} />,
            ariaLabel: 'Remove page',
            onClick: () => removePage(page.id),
            variant: 'danger',
          },
        ]}
      />

      {/* Full-screen preview modal */}
      {previewPage && (
        <PagePreviewModal
          preview={previewPage.preview}
          label={previewPage.label}
          pdfName={previewPage.pdfName}
          onClose={() => setPreviewPage(null)}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PagePreviewModal
// ═══════════════════════════════════════════════════════════════
function PagePreviewModal({
  preview,
  label,
  pdfName,
  onClose,
}: {
  preview: string;
  label: string;
  pdfName: string;
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
          <div>
            <p className="text-[14px] font-bold text-white">{label}</p>
            <p className="text-[11px] text-white/60">{pdfName}</p>
          </div>
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