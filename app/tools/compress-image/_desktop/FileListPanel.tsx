'use client';

import { AlertCircle, X, FileImage } from 'lucide-react';
import { useCompressImageContext } from '../_context/CompressImageContext';
import { type FileStatus } from '../_context/CompressImageContext';
import { formatBytes } from '../../_utils/browser';
import FileCard from './FileCard';

interface FileListPanelProps {
  onCompare: (file: FileStatus) => void;
  onDownload: (file: FileStatus) => void;
  onRemove: (id: string) => void;
}

export default function FileListPanel({
  onCompare,
  onDownload,
  onRemove,
}: FileListPanelProps) {
  const {
    files,
    processing,
    error,
    setError,
    hasCompleted,
    completedCount,
    totalOriginalSize,
    totalCompressedSize,
    totalReduction,
  } = useCompressImageContext();

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E8EDF5] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] overflow-hidden">

      {/* ── Success Banner ── */}
      {hasCompleted && (
        <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-emerald-900">
              {completedCount} {completedCount === 1 ? 'image' : 'images'} compressed
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <p className="text-[11px] text-emerald-700 font-semibold">
              {formatBytes(totalOriginalSize)} → {formatBytes(totalCompressedSize)}
            </p>
            <div className="px-2.5 py-1 rounded-md bg-emerald-500 text-white text-[12px] font-extrabold shadow-sm">
              -{totalReduction}%
            </div>
          </div>
        </div>
      )}

      {/* ── File Count Header ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <FileImage size={14} className="text-[#4F46E5]" strokeWidth={2.2} />
          <p className="text-[12px] font-bold text-[#111827]">
            {files.length} {files.length === 1 ? 'Image' : 'Images'}
          </p>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mx-5 mt-4 flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
          <AlertCircle
            size={16}
            className="text-red-600 shrink-0 mt-0.5"
            strokeWidth={2.2}
          />
          <div className="flex-1">
            <p className="text-[12px] text-red-700">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── File Cards ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onRemove={() => onRemove(file.id)}
            onDownload={() => onDownload(file)}
            onCompare={() => onCompare(file)}
            disabled={processing}
          />
        ))}
      </div>

    </div>
  );
}