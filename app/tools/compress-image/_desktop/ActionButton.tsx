'use client';

import { Loader2, Zap, Package, Download, RotateCcw } from 'lucide-react';
import { useCompressImageContext } from '../_context/CompressImageContext';

export default function ActionButton() {
  const {
    files,
    processing,
    zipping,
    hasCompleted,
    completedCount,
    handleCompress,
    handleRecompress,
    handleDownloadAll,
  } = useCompressImageContext();

  if (files.length === 0) return null;

  // ── Before compression ──
  if (!hasCompleted) {
    return (
      <button
        onClick={handleCompress}
        disabled={processing || files.length === 0}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {processing ? (
          <>
            <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
            Compressing...
          </>
        ) : (
          <>
            <Zap size={16} strokeWidth={2.5} />
            Compress {files.length} {files.length === 1 ? 'Image' : 'Images'}
          </>
        )}
      </button>
    );
  }

  // ── After compression ──
  return (
    <div className="space-y-2">
      <button
        onClick={handleDownloadAll}
        disabled={zipping}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
      >
        {zipping ? (
          <>
            <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
            Creating ZIP...
          </>
        ) : completedCount > 1 ? (
          <>
            <Package size={16} strokeWidth={2.5} />
            Download ZIP ({completedCount})
          </>
        ) : (
          <>
            <Download size={16} strokeWidth={2.5} />
            Download
          </>
        )}
      </button>

      <button
        onClick={handleRecompress}
        disabled={processing}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#E8EDF5] text-[#4B5563] text-[13px] font-bold hover:border-[#C7D2FE] hover:text-[#4F46E5] transition-all disabled:opacity-50"
      >
        {processing ? (
          <>
            <Loader2 size={14} className="animate-spin" strokeWidth={2.5} />
            Re-compressing...
          </>
        ) : (
          <>
            <RotateCcw size={14} strokeWidth={2.5} />
            Re-compress
          </>
        )}
      </button>
    </div>
  );
}