'use client';

import { useState } from 'react';
import {
  Download, Eye, RotateCcw, Check, CheckCircle2,
  FileText, ChevronDown,
} from 'lucide-react';

// ============ TYPES ============
export interface CompressionStats {
  originalSize: string;
  compressedSize: string;
  savedPercentage: number;
  savedBytes: string;
  format?: string;
}

export interface MobileSummaryRow {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  valueColor?: string;
}

export interface MobileFileItem {
  id: string;
  name: string;
  size: string;
  pages?: number;
  onDownload?: () => void;
}

interface MobileSuccessScreenProps {
  toolIcon?: React.ReactNode;   // ignored (deprecated)
  toolName?: string;            // ignored (deprecated)
  toolColor?: string;           // ignored (deprecated)
  onBack?: () => void;          // ignored (deprecated)

  title: string;
  subtitle: string;
  files?: MobileFileItem[];
  filename?: string;
  fileSize?: string;
  pageCount?: number;
  onPreview?: () => void;
  summaryTitle?: string;
  summaryRows?: MobileSummaryRow[];
  compressionStats?: CompressionStats;
  downloadLabel?: string;
  onDownload: () => void;
  onStartOver: () => void;
  collapsibleSummary?: boolean;
}

// ============ MAIN COMPONENT ============
export default function MobileSuccessScreen({
  title,
  subtitle,
  files,
  filename,
  fileSize,
  pageCount,
  onPreview,
  summaryTitle,
  summaryRows,
  compressionStats,
  downloadLabel = 'Download',
  onDownload,
  onStartOver,
  collapsibleSummary = false,
}: MobileSuccessScreenProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const hasFiles = files && files.length > 0;
  const isMultipleFiles = files && files.length > 1;
  const fileCount = hasFiles ? files.length : 1;

  // Auto-generate summary rows from compressionStats
  const displaySummaryRows: MobileSummaryRow[] = summaryRows || [];
  const displaySummaryTitle = summaryTitle || (compressionStats ? 'Compression Summary' : 'Summary');

  if (compressionStats && displaySummaryRows.length === 0) {
    displaySummaryRows.push(
      {
        icon: <FileText size={13} />,
        iconBg: '#DBEAFE',
        iconColor: '#3B82F6',
        label: 'Original Size',
        value: compressionStats.originalSize,
      },
      {
        icon: <FileText size={13} />,
        iconBg: '#FEE2E2',
        iconColor: '#EF4444',
        label: 'Compressed Size',
        value: compressionStats.compressedSize,
      },
      {
        icon: <FileText size={13} />,
        iconBg: '#D1FAE5',
        iconColor: '#10B981',
        label: 'Size Reduced',
        value: `${compressionStats.savedBytes} (${compressionStats.savedPercentage}%)`,
        valueColor: '#10B981',
      },
    );
    if (compressionStats.format) {
      displaySummaryRows.push({
        icon: <FileText size={13} />,
        iconBg: '#FEF3C7',
        iconColor: '#F59E0B',
        label: 'Format',
        value: compressionStats.format,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[#FAFBFC] top-[72px]">

      {/* ═══════════ SCROLLABLE CONTENT ═══════════ */}
      <div className="flex-1 overflow-y-auto">

        {/* ⭐ SUCCESS TITLE SECTION */}
        {isMultipleFiles ? (
          /* ─── MULTI-FILE: Compact title ─── */
          <div className="flex items-center gap-3 px-5 pt-5 pb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: '#D1FAE5' }}
            >
              <Check size={20} className="text-emerald-600" strokeWidth={3.5} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold text-slate-900 leading-tight">
                {title}
              </h1>
              <p className="text-[12.5px] text-slate-500 mt-0.5 leading-snug">
                {subtitle}
              </p>
            </div>
          </div>
        ) : (
          /* ─── SINGLE FILE: Big icon + centered title ─── */
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-5">
            <div className="relative mb-5">
              <Sparkle color="#8B5CF6" top="-6px" left="-22px" size={6} />
              <Sparkle color="#10B981" top="-14px" left="-4px" size={5} />
              <Sparkle color="#10B981" top="-18px" left="16px" size={7} />
              <Sparkle color="#EF4444" top="-8px" right="-8px" size={5} />
              <Sparkle color="#F59E0B" top="4px" right="-22px" size={6} />
              <Sparkle color="#3B82F6" top="36px" left="-18px" size={5} />
              <Sparkle color="#A78BFA" top="42px" right="-14px" size={4} />

              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                  boxShadow: '0 8px 24px -6px rgba(16, 185, 129, 0.35)',
                }}
              >
                <Check size={36} className="text-emerald-600" strokeWidth={3.5} />
              </div>
            </div>

            <h1 className="text-[22px] font-extrabold text-slate-900 mb-1.5 tracking-tight">
              {title}
            </h1>
            <p className="text-[13.5px] text-slate-500 leading-relaxed">
              {subtitle}
            </p>
          </div>
        )}

        {/* ═══════════ FILES SECTION ═══════════ */}
        <div className="px-5 pb-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.04)] overflow-hidden">

            {/* Files header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="text-[14px] font-bold text-slate-900">
                Files ({fileCount})
              </h2>
              {onPreview && !isMultipleFiles && (
                <button
                  onClick={onPreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-700"
                >
                  Preview File
                  <Eye size={13} strokeWidth={2} className="text-slate-500" />
                </button>
              )}
              {isMultipleFiles && (
                <span className="text-[11px] text-slate-400 font-medium">
                  Tap ⬇ to download
                </span>
              )}
            </div>

            {/* File rows */}
            {hasFiles ? (
              <div
                className={`divide-y divide-slate-100 ${
                  files.length > 5 ? 'max-h-[280px] overflow-y-auto' : ''
                }`}
              >
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-red-500" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[12.5px] font-semibold text-slate-800 truncate block">
                        {file.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {file.size}{file.pages !== undefined ? ` • ${file.pages} pg` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50">
                        <CheckCircle2 size={10} className="text-emerald-500" strokeWidth={2.5} />
                        <span className="text-[9px] font-bold text-emerald-600">Ready</span>
                      </div>
                      {isMultipleFiles && file.onDownload && (
                        <button
                          onClick={file.onDownload}
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center active:bg-slate-50"
                        >
                          <Download size={12} className="text-slate-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-red-500" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-semibold text-slate-800 truncate block">
                    {filename || 'document.pdf'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {fileSize}{pageCount !== undefined ? ` • ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 size={11} className="text-emerald-500" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-emerald-600">Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════ SUMMARY SECTION (Collapsible for multiple files) ═══════════ */}
        {displaySummaryRows.length > 0 && (
          <div className="px-5 pb-3">
            {collapsibleSummary && isMultipleFiles ? (
              /* Collapsible summary for multiple files */
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.04)] overflow-hidden">
                {/* Header with toggle */}
                <button
                  onClick={() => setSummaryOpen(!summaryOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <h3 className="text-[14px] font-bold text-slate-900">
                    {displaySummaryTitle}
                  </h3>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform ${
                      summaryOpen ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2.5}
                  />
                </button>

                {/* Collapsible content */}
                {summaryOpen && (
                  <div className="border-t border-slate-100 px-4 py-3">
                    <div className="divide-y divide-slate-100">
                      {displaySummaryRows.map((row, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                              style={{ background: row.iconBg, color: row.iconColor }}
                            >
                              {row.icon}
                            </div>
                            <span className="text-[13px] text-slate-600">{row.label}</span>
                          </div>
                          <span
                            className="text-[13px] font-semibold tabular-nums"
                            style={{ color: row.valueColor || '#111827' }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Regular summary (single file or no collapsible) */
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(15,23,42,0.04)] p-4">
                <h3 className="text-[14px] font-bold text-slate-900 mb-3">
                  {displaySummaryTitle}
                </h3>
                <div className="divide-y divide-slate-100">
                  {displaySummaryRows.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                          style={{ background: row.iconBg, color: row.iconColor }}
                        >
                          {row.icon}
                        </div>
                        <span className="text-[13px] text-slate-600">{row.label}</span>
                      </div>
                      <span
                        className="text-[13px] font-semibold tabular-nums"
                        style={{ color: row.valueColor || '#111827' }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════ STICKY BOTTOM ACTIONS ═══════════ */}
      <div
        className="shrink-0 bg-white border-t border-slate-100 px-5 pt-3 space-y-2"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Download button (no dropdown) */}
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 active:scale-[0.98] text-white py-3.5 rounded-xl font-bold text-[14px] shadow-md transition-all"
        >
          <Download size={16} strokeWidth={2.5} />
          {downloadLabel}
        </button>

        {/* Start Over + Preview */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onStartOver}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 active:bg-slate-50 text-slate-700 font-semibold text-[13px] transition-all"
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            Start Over
          </button>

          {onPreview ? (
            <button
              onClick={onPreview}
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-indigo-200 active:bg-indigo-50 text-indigo-600 font-semibold text-[13px] transition-all"
            >
              <Eye size={14} strokeWidth={2.5} />
              Preview
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SPARKLE DOT
// ═══════════════════════════════════════════════════════════════
function Sparkle({ color, top, left, right, size = 5 }: {
  color: string; top: string; left?: string; right?: string; size?: number;
}) {
  return (
    <div
      className="absolute rounded-full"
      style={{ top, left, right, width: `${size}px`, height: `${size}px`, background: color }}
    />
  );
}