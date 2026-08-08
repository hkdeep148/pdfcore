'use client';

import { useState, useEffect } from 'react';
import { Loader2, Eye, Download, X } from 'lucide-react';
import { type FileStatus } from '../_context/CompressImageContext';
import { formatBytes } from '../../_utils/browser';

interface MobileFileCardProps {
  file: FileStatus;
  onRemove: () => void;
  onDownload: () => void;
  onCompare: () => void;
  disabled: boolean;
}

export default function MobileFileCard({
  file,
  onRemove,
  onDownload,
  onCompare,
  disabled,
}: MobileFileCardProps) {
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = file.originalUrl;
  }, [file.originalUrl]);

  const fileFormat = file.original.type.split('/')[1]?.toUpperCase() || 'IMG';
  const compressedFormat = file.compressed?.type.split('/')[1]?.toUpperCase();
  const formatChanged = compressedFormat && compressedFormat !== fileFormat;

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white border border-[#E8EDF5]">

      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden shrink-0 border border-slate-100">
        <img
          src={file.status === 'done' && file.compressedUrl ? file.compressedUrl : file.originalUrl}
          alt={file.original.name}
          className="w-full h-full object-cover"
        />
        {file.status === 'compressing' && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <Loader2 size={16} className="text-white animate-spin" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-[12.5px] font-bold text-[#07122E] truncate mb-1">
            {file.original.name}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] mb-1 flex-wrap">
            {file.status === 'done' && file.compressedSize ? (
              <>
                <span className="text-[#9CA3AF] line-through text-[10.5px]">
                  {formatBytes(file.originalSize)}
                </span>
                <span className="text-[#9CA3AF] text-[10px]">→</span>
                <span className="text-[#4F46E5] font-extrabold text-[11.5px]">
                  {formatBytes(file.compressedSize)}
                </span>
                {file.reduction !== undefined && file.reduction > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-extrabold">
                    -{file.reduction}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-[#6B7280] font-semibold">
                {formatBytes(file.originalSize)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] text-[#9CA3AF] font-semibold">
            {dimensions && (
              <span>
                {dimensions.w} × {dimensions.h}
              </span>
            )}
            {formatChanged && (
              <>
                {dimensions && <span className="text-[#D1D5DB]">•</span>}
                <span>
                  {fileFormat} → {compressedFormat}
                </span>
              </>
            )}
            {file.status === 'pending' && (
              <>
                {dimensions && <span className="text-[#D1D5DB]">•</span>}
                <span className="text-amber-700 font-bold">Waiting</span>
              </>
            )}
          </div>
        </div>

        {file.status === 'done' && (
          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={onCompare}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold active:scale-95 transition-all"
            >
              <Eye size={10} strokeWidth={2.5} />
              Compare
            </button>
            <button
              onClick={onDownload}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold active:scale-95 transition-all"
            >
              <Download size={10} strokeWidth={2.5} />
              Save
            </button>
          </div>
        )}

        {file.status === 'error' && (
          <div className="mt-1.5 text-[10px] text-red-600 font-medium">
            {file.error || 'Failed'}
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        disabled={disabled}
        className="self-start w-7 h-7 rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
        aria-label="Remove"
      >
        <X size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}