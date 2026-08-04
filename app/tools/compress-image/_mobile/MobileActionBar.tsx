'use client';

import { Loader2, Zap, Package, Download, RotateCcw } from 'lucide-react';
import { useCompressImageContext } from '../_context/CompressImageContext';

export default function MobileActionBar() {
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

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white to-transparent pt-6">
      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {!hasCompleted ? (
          <button
            onClick={handleCompress}
            disabled={processing || files.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)] active:scale-95 transition-all disabled:opacity-50"
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
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAll}
              disabled={zipping}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[13px] font-bold shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)] active:scale-95 transition-all disabled:opacity-50"
            >
              {zipping ? (
                <>
                  <Loader2 size={14} className="animate-spin" strokeWidth={2.5} />
                  Zipping...
                </>
              ) : completedCount > 1 ? (
                <>
                  <Package size={14} strokeWidth={2.5} />
                  Download All
                </>
              ) : (
                <>
                  <Download size={14} strokeWidth={2.5} />
                  Download
                </>
              )}
            </button>
            <button
              onClick={handleRecompress}
              disabled={processing}
              className="flex items-center justify-center px-4 py-3.5 rounded-2xl bg-white border-2 border-[#E8EDF5] text-[#4B5563] active:scale-95 transition-all disabled:opacity-50"
              aria-label="Re-compress"
            >
              <RotateCcw size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}