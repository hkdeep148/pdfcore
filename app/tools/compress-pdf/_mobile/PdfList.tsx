'use client';

import { Trash2, Download, FileText } from 'lucide-react';
import MobileListView from '../../_components/MobileListView';
import { useCompressPdfContext } from '../_context/CompressPdfContext';

export default function PdfList() {
  const { items, removePdf, downloadOne } = useCompressPdfContext();

  return (
    <MobileListView
      items={items}
      accentColor="#2563EB"
      renderThumbnail={(item) => {
        const isDone = item.status === 'done';
        const hasSaved = isDone && (item.savedPercent ?? 0) > 0;
        return (
          <div
            className={`w-full h-full rounded flex items-center justify-center ${
              isDone ? (hasSaved ? 'bg-[#DCFCE7]' : 'bg-[#DBEAFE]') : 'bg-[#EEF2FF]'
            }`}
          >
            <FileText
              size={20}
              strokeWidth={2}
              className={isDone ? 'text-[#10B981]' : 'text-[#4F46E5]'}
            />
          </div>
        );
      }}
      renderPrimaryText={(item) => item.name}
      renderSecondaryText={(item) => {
        if (item.status === 'pending') return `${item.originalSizeMB} • Ready to compress`;
        if (item.status === 'compressing') {
          return (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
              Compressing {item.progress || 0}%
            </span>
          );
        }
        if (item.status === 'error') return item.errorMessage || 'Compression failed';
        if (item.status === 'done') {
          const hasSaved = (item.savedPercent ?? 0) > 0;
          return (
            <span className="flex items-center gap-1.5 flex-wrap">
              {hasSaved ? (
                <>
                  <span className="text-[#94A3B8] line-through">{item.originalSizeMB}</span>
                  <span className="text-[#10B981] font-bold">{item.compressedSizeMB}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[9px] font-extrabold">
                    -{item.savedPercent}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#2563EB] font-bold">{item.compressedSizeMB}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-[9px] font-extrabold">
                    OPTIMIZED
                  </span>
                </>
              )}
            </span>
          );
        }
        return '';
      }}
      actions={(item) => [
        ...(item.status === 'done'
          ? [
              {
                icon: <Download size={15} strokeWidth={1.8} />,
                ariaLabel: 'Download',
                onClick: () => downloadOne(item.id),
                variant: 'primary' as const,
              },
            ]
          : []),
        {
          icon: <Trash2 size={15} strokeWidth={1.8} />,
          ariaLabel: 'Remove',
          onClick: () => removePdf(item.id),
          variant: 'danger',
        },
      ]}
    />
  );
}