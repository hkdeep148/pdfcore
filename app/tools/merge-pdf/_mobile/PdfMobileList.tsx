'use client';

import { Trash2 } from 'lucide-react';
import MobileListView from '../../_components/MobileListView';
import { useMergePdfContext } from '../_context/MergePdfContext';

export default function PdfMobileList() {
  const { items, reorderPdfs, removePdf } = useMergePdfContext();

  return (
    <div className="h-full overflow-y-auto px-3 pb-3">
      {/*
        Drag hint — only shows when there are 2+ items to reorder.
        Kept from the original design because merge-pdf specifically
        needs users to understand ordering matters (the PDF pages
        will be combined in this exact order).
      */}
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

      {/*
        ═══════════ UNIVERSAL LIST ═══════════
        merge-pdf uses:
          - Reorder: yes (order determines merge sequence)
          - Selection: no (all PDFs are always merged)
          - Thumbnail: first page preview from the PDF
          - Order badge: 1, 2, 3... shown on thumbnail corner
          - Actions: just remove (trash icon)
      */}
      <MobileListView
        items={items}
        onReorder={reorderPdfs}
        accentColor="#2563EB"
        renderThumbnail={(item) => (
          <img
            src={item.firstPagePreview}
            alt={item.name}
            draggable={false}
            className="max-w-full max-h-full object-contain"
          />
        )}
        renderThumbnailBadge={(_item, index) => (
          <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
            {index + 1}
          </div>
        )}
        renderPrimaryText={(item) => item.name}
        renderSecondaryText={(item) => `${item.totalPages} pages · ${item.sizeMB}`}
        actions={(item) => [
          {
            icon: <Trash2 size={15} strokeWidth={1.8} />,
            ariaLabel: 'Remove',
            onClick: () => removePdf(item.id),
            variant: 'danger',
          },
        ]}
      />
    </div>
  );
}