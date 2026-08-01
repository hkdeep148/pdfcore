'use client';

import { useCompressPdfContext } from '../_context/CompressPdfContext';

export default function PdfList() {
  const { items, removePdf, downloadOne } = useCompressPdfContext();

  return (
    <div className="h-full overflow-y-auto px-3 pb-3 space-y-2.5">
      {items.map((item) => {
        const isDone = item.status === 'done';
        const isCompressing = item.status === 'compressing';
        const isError = item.status === 'error';
        const isPending = item.status === 'pending';
        const hasSaved = isDone && (item.savedPercent ?? 0) > 0;

        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border-2 p-3 transition-all ${
  isDone
    ? hasSaved
      ? 'border-[#10B981] shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
      : 'border-[#3B82F6] shadow-[0_4px_12px_rgba(59,130,246,0.15)]'
    : isError
                ? 'border-[#EF4444]'
                : isCompressing
                ? 'border-[#2563EB]'
                : 'border-[#E8E8F0]'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* PDF Icon */}
              <div className={`w-11 h-13 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isDone ? 'bg-[#DCFCE7]' : 'bg-[#FEE9E9]'
              }`}>
                <svg viewBox="0 0 24 24" className={`w-5 h-5 ${
                  isDone ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#07122E] truncate mb-1">
                  {item.name}
                </p>

                {/* Pending */}
                {isPending && (
                  <p className="text-[11px] text-[#8A93A3] font-medium">
                    {item.originalSizeMB} • Ready to compress
                  </p>
                )}

                {/* Compressing with progress */}
                {isCompressing && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#2563EB] font-bold">Compressing...</span>
                      <span className="text-[#2563EB] font-bold">{item.progress || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EFF6FF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-300"
                        style={{ width: `${item.progress || 0}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Done - Before/After */}
{isDone && (
  <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
    {hasSaved ? (
      <>
        <span className="text-[#8A93A3] line-through">{item.originalSizeMB}</span>
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#B0B7C3]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        <span className="font-bold text-[#10B981]">{item.compressedSizeMB}</span>
        <span className="px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[10px] font-extrabold">
          -{item.savedPercent}%
        </span>
      </>
    ) : (
      <>
        <span className="font-bold text-[#3B82F6]">{item.compressedSizeMB}</span>
        <span className="px-1.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-[10px] font-extrabold flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          OPTIMIZED
        </span>
      </>
    )}
  </div>
)}

                {/* Error */}
                {isError && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="text-[#EF4444] font-bold">
                      {item.errorMessage || 'Compression failed'}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {isDone && (
  <button
    type="button"
    onClick={() => downloadOne(item.id)}
    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-95 ${
      hasSaved
        ? 'bg-[#10B981] shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
        : 'bg-[#3B82F6] shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
    }`}
    aria-label="Download"
  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePdf(item.id)}
                  disabled={isCompressing}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#EF4444] active:bg-[#FEE9E9] disabled:opacity-40"
                  aria-label="Remove"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}