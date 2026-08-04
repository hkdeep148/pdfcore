'use client';

import { useState, useEffect } from 'react';
import { Loader2, Eye, Download, X } from 'lucide-react';
import { formatBytes, type FileStatus } from '../_context/CompressImageContext';

interface FileCardProps {
  file: FileStatus;
  onRemove: () => void;
  onDownload: () => void;
  onCompare: () => void;
  disabled: boolean;
}

export default function FileCard({
  file,
  onRemove,
  onDownload,
  onCompare,
  disabled,
}: FileCardProps) {
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(
    null
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () =>
      setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = file.originalUrl;
  }, [file.originalUrl]);

  const fileFormat =
    file.original.type.split('/')[1]?.toUpperCase() || 'IMG';
  const compressedFormat =
    file.compressed?.type.split('/')[1]?.toUpperCase();
  const formatChanged =
    compressedFormat && compressedFormat !== fileFormat;

  return (
    <div className="group relative flex gap-4 p-3 rounded-xl border border-[#E8EDF5] bg-white hover:border-[#C7D2FE] hover:shadow-[0_4px_16px_-4px_rgba(79,70,229,0.1)] transition-all">

      {/* ── Thumbnail ── */}
      <div className="relative w-24 h-24 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden shrink-0 border border-slate-100">
        <img
          src={
            file.status === 'done' && file.compressedUrl
              ? file.compressedUrl
              : file.originalUrl
          }
          alt={file.original.name}
          className="w-full h-full object-cover"
        />
        {file.status === 'compressing' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center">
            <Loader2 size={20} className="text-white animate-spin" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>

          {/* Filename + Format Badge */}
          <div className="flex items-start gap-2 mb-1.5">
            <p
              className="text-[14px] font-bold text-[#111827] truncate flex-1"
              title={file.original.name}
            >
              {file.original.name}
            </p>
            {formatChanged ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold uppercase tracking-wider shrink-0">
                <span className="text-slate-400">{fileFormat}</span>
                <svg
                  viewBox="0 0 24 24"
                  className="w-2 h-2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="text-[#4F46E5]">{compressedFormat}</span>
              </div>
            ) : (
              <div className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider shrink-0">
                {fileFormat}
              </div>
            )}
          </div>

          {/* Size Info */}
          <div className="flex items-center gap-2 text-[12px] mb-1.5">
            {file.status === 'done' && file.compressedSize ? (
              <>
                <span className="text-[#9CA3AF] font-medium line-through">
                  {formatBytes(file.originalSize)}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-[#9CA3AF]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="text-[#4F46E5] font-extrabold text-[13px]">
                  {formatBytes(file.compressedSize)}
                </span>
                {file.reduction !== undefined && file.reduction > 0 && (
                  <div className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold">
                    -{file.reduction}%
                  </div>
                )}
              </>
            ) : (
              <span className="text-[#6B7280] font-semibold">
                {formatBytes(file.originalSize)}
              </span>
            )}
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {dimensions && (
              <span className="text-[10.5px] text-[#9CA3AF] font-semibold">
                {dimensions.w} × {dimensions.h}
              </span>
            )}
            {file.status === 'done' &&
              file.reduction !== undefined &&
              file.compressedSize !== undefined &&
              file.originalSize > file.compressedSize && (
                <>
                  <span className="text-[10px] text-[#D1D5DB]">•</span>
                  <span className="text-[10.5px] text-emerald-600 font-bold">
                    Saved {formatBytes(file.originalSize - file.compressedSize)}
                  </span>
                </>
              )}
            {file.status === 'pending' && (
              <span className="inline-flex items-center gap-1 text-[10.5px] text-amber-700 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Waiting
              </span>
            )}
            {file.status === 'compressing' && (
              <span className="inline-flex items-center gap-1 text-[10.5px] text-[#4F46E5] font-bold">
                <Loader2 size={9} className="animate-spin" strokeWidth={2.5} />
                Compressing...
              </span>
            )}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        {file.status === 'done' && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={onCompare}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8EDF5] hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 text-[#4B5563] text-[11px] font-bold transition-all"
            >
              <Eye size={11} strokeWidth={2.5} />
              Compare
            </button>
            <button
              onClick={onDownload}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] hover:from-[#4338CA] hover:to-[#5B4FE0] text-white text-[11px] font-bold shadow-[0_2px_8px_-2px_rgba(79,70,229,0.4)] hover:shadow-[0_4px_12px_-2px_rgba(79,70,229,0.5)] transition-all"
            >
              <Download size={11} strokeWidth={2.5} />
              Download
            </button>
          </div>
        )}

        {/* ── Error Message ── */}
        {file.status === 'error' && (
          <div className="mt-2 text-[11px] text-red-600 font-medium">
            {file.error || 'Compression failed'}
          </div>
        )}
      </div>

      {/* ── Remove Button ── */}
      <button
        onClick={onRemove}
        disabled={disabled}
        className="self-start w-7 h-7 rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50"
        aria-label="Remove"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

    </div>
  );
}