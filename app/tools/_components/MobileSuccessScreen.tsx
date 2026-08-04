'use client';

import { Download, Eye, RotateCcw, Check, Activity, ArrowLeft } from 'lucide-react';

// ============ TYPES ============
export interface CompressionStats {
  originalSize: string;
  compressedSize: string;
  savedPercentage: number;
  savedBytes: string;
  format?: string;
}

export interface FileListItem {
  id: string;
  name: string;
  thumbnailUrl?: string;
  reduction?: number;
  onDownload: () => void;
  onPreview?: () => void;
}

export interface StatusBadge {
  label: string;
  color: 'green' | 'blue' | 'purple';
}

interface MobileSuccessScreenProps {
  // Content
  title: string;
  subtitle: string;
  filename: string;
  iconVariant?: 'image' | 'pdf' | 'file' | 'unlocked' | 'locked' | 'signed' | 'merged' | 'split';
  previewImage?: string;
  compressionStats?: CompressionStats;
  statusBadge?: StatusBadge;

  // File metadata (used by PDF tools)
  fileSize?: string;
  pageCount?: number;

  // Actions
  downloadLabel?: string;
  onDownload: () => void;
  onPreview?: () => void;
  onStartOver: () => void;
  onBack?: () => void;

  // Multi-file support
  files?: FileListItem[];
}

// ============ COMPONENT ============
export default function MobileSuccessScreen({
  title,
  subtitle,
  filename,
  iconVariant = 'file',
  previewImage,
  compressionStats,
  statusBadge,
  fileSize,
  pageCount,
  downloadLabel = 'Download',
  onDownload,
  onPreview,
  onStartOver,
  onBack,
  files,
}: MobileSuccessScreenProps) {
  const hasMultipleFiles = files && files.length > 1;

  return (
    <div className="flex flex-col h-full bg-[#F5F5FA] overflow-y-auto">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-4 pt-4 pb-2 text-[13px] font-semibold text-[#4F46E5] active:scale-95 transition-all self-start"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>
      )}

      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-6">

        {/* ═══════════ Success Icon ═══════════ */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-2xl animate-success-glow" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] flex items-center justify-center animate-success-pop">
            <Check size={44} className="text-white animate-check-draw" strokeWidth={3} />
          </div>
        </div>

        {/* ═══════════ Title ═══════════ */}
        <h1 className="text-[26px] font-extrabold text-[#07122E] text-center mb-2 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-[14px] text-[#6B7280] text-center font-medium mb-6">
          {subtitle}
        </p>

        {/* ═══════════ FILE LIST or SINGLE FILE ═══════════ */}
        {hasMultipleFiles ? (
          /* MULTI-FILE COMPACT LIST */
          <div className="w-full mb-6 rounded-2xl bg-white border border-[#E8EDF5] overflow-hidden shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05)]">
            <div className="px-4 py-2.5 bg-[#F8FAFF] border-b border-[#E8EDF5]">
              <p className="text-[10.5px] font-bold text-[#6B7280] uppercase tracking-wider">
                Files ({files!.length})
              </p>
            </div>
            <div className="divide-y divide-[#F1F5F9] max-h-[240px] overflow-y-auto">
              {files!.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          </div>
        ) : (
          /* SINGLE FILE */
          <div className="w-full mb-6 rounded-2xl bg-white border border-[#E8EDF5] p-3.5 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt={filename} className="w-full h-full object-cover" />
                ) : (
                  <FileIcon variant={iconVariant} />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-bold text-[#07122E] truncate mb-1">
                  {filename}
                </p>

                {/* File metadata (size + pages) — for PDF tools */}
                {(fileSize || pageCount !== undefined) && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] font-semibold mb-1">
                    {fileSize && <span>{fileSize}</span>}
                    {fileSize && pageCount !== undefined && (
                      <span className="text-[#D1D5DB]">•</span>
                    )}
                    {pageCount !== undefined && (
                      <span>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
                    )}
                  </div>
                )}

                {statusBadge && (
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-extrabold uppercase tracking-wider ${
                    statusBadge.color === 'green'
                      ? 'bg-emerald-50 text-emerald-700'
                      : statusBadge.color === 'blue'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    <Check size={10} strokeWidth={3} />
                    {statusBadge.label}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ Compression Stats ═══════════ */}
        {compressionStats && (
          <div className="w-full mb-6 rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-[#E0E7FF] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center">
                <Activity size={13} className="text-white" strokeWidth={2.5} />
              </div>
              <p className="text-[11px] font-extrabold text-[#4F46E5] uppercase tracking-wider">
                Compression Details
              </p>
            </div>

            <div className="space-y-2.5">
              <StatRow label="Original" value={compressionStats.originalSize} strikethrough />
              <StatRow label="Compressed" value={compressionStats.compressedSize} accent />
              <div className="h-px bg-[#E0E7FF]" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#6B7280]">You Saved</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-extrabold text-emerald-600">
                    {compressionStats.savedBytes}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-extrabold shadow-sm">
                    -{compressionStats.savedPercentage}%
                  </span>
                </div>
              </div>
              {compressionStats.format && (
                <>
                  <div className="h-px bg-[#E0E7FF]" />
                  <StatRow label="Format" value={compressionStats.format} bold />
                </>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ Action Buttons ═══════════ */}
        <div className="w-full space-y-2 mt-auto">
          {/* Download */}
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] active:scale-95 transition-all"
          >
            <Download size={16} strokeWidth={2.5} />
            {downloadLabel}
          </button>

          {/* Preview (only single-file mode) */}
          {!hasMultipleFiles && onPreview && (
            <button
              onClick={onPreview}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border-2 border-[#E8EDF5] text-[#4F46E5] text-[13px] font-bold active:scale-95 transition-all"
            >
              <Eye size={15} strokeWidth={2.5} />
              Preview
            </button>
          )}

          {/* Start Over */}
          <button
            onClick={onStartOver}
            className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-bold text-[#6B7280] active:scale-95 transition-all"
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function FileRow({ file }: { file: FileListItem }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 active:bg-slate-50 transition-colors">
      {/* Thumbnail */}
      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden shrink-0 border border-slate-100">
        {file.thumbnailUrl ? (
          <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileIcon variant="image" small />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-bold text-[#07122E] truncate">
          {file.name}
        </p>
        {file.reduction !== undefined && file.reduction > 0 && (
          <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9.5px] font-extrabold mt-0.5">
            -{file.reduction}%
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {file.onPreview && (
          <button
            onClick={file.onPreview}
            className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center active:scale-90 transition-all"
            aria-label="Preview"
          >
            <Eye size={15} strokeWidth={2.5} />
          </button>
        )}
        <button
          onClick={file.onDownload}
          className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center active:scale-90 transition-all"
          aria-label="Download"
        >
          <Download size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  strikethrough = false,
  accent = false,
  bold = false,
}: {
  label: string;
  value: string;
  strikethrough?: boolean;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold text-[#6B7280]">{label}</span>
      <span
        className={`text-[14px] ${
          strikethrough
            ? 'text-[#9CA3AF] line-through font-medium'
            : accent
            ? 'text-[#4F46E5] font-extrabold'
            : bold
            ? 'text-[#07122E] font-extrabold'
            : 'text-[#07122E] font-bold'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function FileIcon({
  variant,
  small = false,
}: {
  variant: 'image' | 'pdf' | 'file' | 'unlocked' | 'locked' | 'signed' | 'merged' | 'split';
  small?: boolean;
}) {
  const size = small ? 20 : 26;
  const color = 'text-[#6B7280]';

  if (variant === 'image') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }

  if (variant === 'pdf') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }

  if (variant === 'unlocked') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    );
  }

  if (variant === 'locked') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }

  if (variant === 'signed') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    );
  }

  if (variant === 'merged') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
        <path d="M18 2l4 4-10 10H8v-4L18 2z" />
      </svg>
    );
  }

  if (variant === 'split') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  // Default: generic file icon
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={color} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}