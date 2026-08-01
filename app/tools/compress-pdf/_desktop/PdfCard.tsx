'use client';

import type { CompressPdfItem } from '../../_types';

interface PdfCardProps {
  item: CompressPdfItem;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function PdfCard({ item, onRemove, onDownload }: PdfCardProps) {
  const isDone = item.status === 'done';
  const isCompressing = item.status === 'compressing';
  const isError = item.status === 'error';
  const isPending = item.status === 'pending';
  const hasSaved = isDone && (item.savedPercent ?? 0) > 0;

  // Dynamic border color based on status
  const borderClass = isDone
    ? 'border-[#10B981] shadow-[0_8px_24px_-4px_rgba(16,185,129,0.25)]'
    : isCompressing
    ? 'border-[#2563EB] shadow-[0_8px_24px_-4px_rgba(37,99,235,0.25)]'
    : isError
    ? 'border-[#EF4444] shadow-[0_8px_24px_-4px_rgba(239,68,68,0.25)]'
    : 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#C9D8F3]';

  const iconBgClass = isDone
    ? 'bg-[#DCFCE7]'
    : isCompressing
    ? 'bg-[#EFF3FF]'
    : isError
    ? 'bg-[#FEE9E9]'
    : 'bg-[#FEE9E9]';

  const iconColorClass = isDone
    ? 'text-[#10B981]'
    : isCompressing
    ? 'text-[#2563EB]'
    : 'text-[#EF4444]';

  return (
    <div className="select-none w-full">
      <div
        className={`relative bg-white rounded-2xl p-3 pt-9 border-2 transition-all w-full ${borderClass}`}
      >
        {/* Remove button (top right) */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isCompressing}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#EF4444] 
                     flex items-center justify-center shadow-md 
                     hover:bg-[#DC2626] hover:scale-110 transition-all z-10
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label="Remove PDF"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Status badge (top left) */}
        {isDone && (
          <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center shadow-md pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
        {isCompressing && (
          <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center shadow-md pointer-events-none">
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          </div>
        )}
        {isError && (
          <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[#EF4444] flex items-center justify-center shadow-md pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}

        {/* PDF Icon Area (A4 aspect ratio) */}
        <div
          className={`relative w-full mx-auto rounded-lg overflow-hidden flex flex-col items-center justify-center transition-colors ${iconBgClass}`}
          style={{ aspectRatio: '1/1.414' }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-14 h-14 ${iconColorClass} transition-colors`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className={`text-[10px] font-bold mt-2 ${iconColorClass}`}>PDF</span>

          {/* Compression progress overlay */}
          {isCompressing && (
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent">
              <div className="flex justify-between text-[10px] font-bold text-[#2563EB] mb-1">
                <span>Compressing</span>
                <span>{item.progress ?? 0}%</span>
              </div>
              <div className="h-1.5 bg-[#EFF3FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-300 ease-out"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Savings badge overlay (when done) */}
          {isDone && hasSaved && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[10px] font-bold shadow-md">
              -{item.savedPercent}%
            </div>
          )}
          {isDone && !hasSaved && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#F59E0B] text-white text-[9px] font-bold shadow-md">
              Optimized
            </div>
          )}
        </div>

        {/* File info */}
        <div className="mt-3 px-1">
          <p className="text-[12px] font-bold text-[#07122E] truncate" title={item.name}>
            {item.name}
          </p>

          {/* Size info */}
          <div className="flex items-center gap-1.5 mt-1 text-[10.5px]">
            {isDone && item.compressedSizeMB ? (
              <>
                <span className="text-[#8A93A3] line-through">{item.originalSizeMB}</span>
                <span className="text-[#B0B7C3]">→</span>
                <span className="font-bold text-[#10B981]">{item.compressedSizeMB}</span>
              </>
            ) : isError ? (
              <span className="text-[#EF4444] font-semibold truncate">
                {item.errorMessage || 'Failed'}
              </span>
            ) : (
              <span className="text-[#8A93A3] font-semibold">
                {item.originalSizeMB}
              </span>
            )}
          </div>
        </div>

        {/* Action footer */}
        <div className="mt-3 flex items-center justify-center h-8">
          {isDone && (
            <button
              type="button"
              onClick={() => onDownload(item.id)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-[11px] font-bold hover:bg-[#059669] transition-colors shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          )}
          {isCompressing && (
            <div className="text-[11px] font-bold text-[#2563EB]">
              Compressing... {item.progress ?? 0}%
            </div>
          )}
          {isError && (
            <div className="text-[11px] font-bold text-[#EF4444]">
              ⚠️ Failed
            </div>
          )}
          {isPending && (
            <div className="text-[11px] font-semibold text-[#8A93A3]">
              Ready to compress
            </div>
          )}
        </div>
      </div>
    </div>
  );
}