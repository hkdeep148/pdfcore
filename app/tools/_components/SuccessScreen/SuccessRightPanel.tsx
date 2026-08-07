'use client';

import { motion } from 'framer-motion';
import { Eye, CheckCircle2, Download, RotateCcw, FileText } from 'lucide-react';
import type { FileTableRow } from '../../_config/successScreenConfigs';

interface Props {
  filesTitle: string;
  files: FileTableRow[];
  primaryButton: {
    label: string;
    onClick: () => void;
    hasDropdown?: boolean;
  };
  onStartOver: () => void;
  onDelete?: () => void;
  extraAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

// ⭐ Show max 7 files before scrolling
const MAX_VISIBLE_FILES = 7;
const ROW_HEIGHT = 60;

export default function SuccessRightPanel({
  filesTitle,
  files,
  primaryButton,
  onStartOver,
  extraAction,
}: Props) {
  const firstPreviewableFile = files.find((f) => f.onPreview);
  const isMultipleFiles = files.length > 1;
  const shouldScroll = files.length > MAX_VISIBLE_FILES;
  const maxListHeight = MAX_VISIBLE_FILES * ROW_HEIGHT;

  // ⭐ Determine the second button:
  // extraAction (View Images) takes priority over Preview
  const hasSecondButton = !!extraAction || !!firstPreviewableFile;

  return (
    <div className="flex flex-col h-full">
      {/* ═══════════ FILES CARD ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col mb-6 min-h-0"
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-slate-900">{filesTitle}</h2>
            {shouldScroll && (
              <span className="text-[11px] text-slate-400 font-medium">
                (scroll for more)
              </span>
            )}
          </div>
        </div>

        {/* Table header */}
        <div
          className={`grid gap-4 pb-3 border-b border-slate-100 ${
            isMultipleFiles
              ? 'grid-cols-[1fr_80px_80px_140px]'
              : 'grid-cols-[1fr_100px_100px]'
          }`}
        >
          <span className="text-[12px] font-semibold text-slate-500">Name</span>
          <span className="text-[12px] font-semibold text-slate-500 text-right">Size</span>
          <span className="text-[12px] font-semibold text-slate-500 text-right">Status</span>
          {isMultipleFiles && (
            <span className="text-[12px] font-semibold text-slate-500 text-right">&nbsp;</span>
          )}
        </div>

        {/* File list — scrolls after MAX_VISIBLE_FILES */}
        <div
          className={`flex-1 ${shouldScroll ? 'overflow-y-auto premium-scrollbar pr-1' : ''}`}
          style={shouldScroll ? { maxHeight: `${maxListHeight}px` } : undefined}
        >
          <div className="divide-y divide-slate-100">
            {files.map((file, idx) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + Math.min(idx, 5) * 0.03 }}
                className={`grid gap-4 py-3.5 items-center ${
                  isMultipleFiles
                    ? 'grid-cols-[1fr_80px_80px_140px]'
                    : 'grid-cols-[1fr_100px_100px]'
                }`}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: '#FEE2E2' }}
                  >
                    <FileText size={14} style={{ color: '#EF4444' }} strokeWidth={2} />
                  </div>
                  <span className="text-[12.5px] font-medium text-slate-800 truncate">
                    {file.name}
                  </span>
                </div>

                {/* Size */}
                <span className="text-[12.5px] text-slate-700 font-semibold text-right tabular-nums">
                  {file.size}
                </span>

                {/* Status */}
                <div className="flex justify-end">
                  {file.status === 'ready' && (
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded"
                      style={{ background: '#D1FAE5' }}
                    >
                      <CheckCircle2 size={11} style={{ color: '#10B981' }} strokeWidth={2.5} />
                      <span className="text-[10.5px] font-bold" style={{ color: '#059669' }}>
                        Ready
                      </span>
                    </div>
                  )}
                </div>

                {/* Per-file actions (only for multi-file) */}
                {isMultipleFiles && (
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Compare button (if onCompare exists) */}
                    {file.onCompare && (
                      <button
                        onClick={file.onCompare}
                        className="h-8 px-2.5 rounded-md border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center gap-1 transition-all group"
                        title={`Compare ${file.name}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-indigo-600">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="12" y1="3" x2="12" y2="21" />
                        </svg>
                        <span className="text-[10.5px] font-semibold text-slate-600 group-hover:text-indigo-600">
                          Compare
                        </span>
                      </button>
                    )}

                    {/* Download button */}
                    {file.onDownload && (
                      <button
                        onClick={file.onDownload}
                        className="w-8 h-8 rounded-md border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center transition-all group"
                        title={`Download ${file.name}`}
                      >
                        <Download
                          size={13}
                          className="text-slate-600 group-hover:text-indigo-600"
                          strokeWidth={2}
                        />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══════════ ACTION BUTTONS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {/* Download button */}
        <button
          onClick={primaryButton.onClick}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-lg font-bold text-[14px] shadow-md hover:shadow-lg transition-all"
        >
          <Download size={16} strokeWidth={2.5} />
          {primaryButton.label}
        </button>

        {/* ⭐ SMART SECONDARY BUTTONS */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Always show Start Over */}
          <button
            onClick={onStartOver}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-[12.5px] transition-all"
          >
            <RotateCcw size={13} strokeWidth={2.5} />
            Start Over
          </button>

          {/* ⭐ Show extraAction (View Images) OR Preview — never both */}
          {extraAction ? (
            // IMAGE OUTPUT → Show "View Images" button
            <button
              onClick={extraAction.onClick}
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 font-semibold text-[12.5px] transition-all"
            >
              {extraAction.icon}
              {extraAction.label}
            </button>
          ) : firstPreviewableFile ? (
            // PDF OUTPUT → Show "Preview" button
            <button
              onClick={firstPreviewableFile.onPreview}
              className="flex items-center justify-center gap-1.5 py-3.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 font-semibold text-[12.5px] transition-all"
            >
              <Eye size={13} strokeWidth={2.5} />
              Preview
            </button>
          ) : (
            <div />
          )}
        </div>
      </motion.div>

      {/* Premium scrollbar */}
      <style jsx>{`
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 999px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.35);
        }
      `}</style>
    </div>
  );
}