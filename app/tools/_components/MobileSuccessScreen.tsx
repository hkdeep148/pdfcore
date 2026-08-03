'use client';

import { useEffect } from 'react';
import { Download, Eye, RotateCcw, CheckCircle2 } from 'lucide-react';

interface MobileSuccessScreenProps {
  title?: string;
  subtitle?: string;
  filename: string;
  fileSize?: string;
  pageCount?: number;
  onDownload: () => void;
  onPreview?: () => void;
  onStartOver: () => void;
  onBack: () => void;
  statusBadge?: {
    label: string;
    color?: 'green' | 'blue' | 'purple' | 'orange';
  };
  iconVariant?: 'pdf' | 'unlocked' | 'locked' | 'image';
  compressionStats?: {
    originalSize: string;
    compressedSize: string;
    savedPercentage: number;
    savedBytes: string;
    format?: string;
    dimensions?: string;
  };
  downloadLabel?: string;
  previewImage?: string;
}

export default function MobileSuccessScreen({
  title = 'PDF Ready!',
  subtitle = 'Your file has been created successfully',
  filename,
  fileSize,
  pageCount,
  onDownload,
  onPreview,
  onStartOver,
  statusBadge,
  iconVariant = 'pdf',
  compressionStats,
  downloadLabel,
  previewImage,
}: MobileSuccessScreenProps) {
  // Haptic feedback on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F4F5F7]">
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-6 min-h-0 overflow-y-auto">
        
        {/* ⭐ Compact Success Icon */}
        <div className="relative mb-4 mt-2">
          <div className="absolute inset-0 rounded-full bg-[#10B981]/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_6px_20px_rgba(16,185,129,0.4)] animate-success-bounce">
            <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Compact Title */}
        <h2 className="text-[20px] font-extrabold text-[#07122E] text-center mb-1">
          {title}
        </h2>

        {/* Compact Subtitle */}
        <p className="text-[13px] text-[#6B7280] text-center mb-5 max-w-[280px]">
          {subtitle}
        </p>

        {/* File Info Card */}
        <div className="w-full max-w-[360px] bg-white rounded-2xl border border-[#E5E7EB] p-3.5 mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            {/* Icon - variant-based */}
            {iconVariant === 'unlocked' ? (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(16,185,129,0.25)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
              </div>
            ) : iconVariant === 'locked' ? (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            ) : iconVariant === 'image' ? (
              previewImage ? (
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.25)] border border-slate-100">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.25)]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(239,68,68,0.25)]">
                <span className="text-white font-black text-[10px]">PDF</span>
              </div>
            )}

            {/* File Details */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#07122E] truncate">
                {filename}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {pageCount !== undefined && (
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </span>
                )}
                {pageCount !== undefined && fileSize && (
                  <span className="text-[11px] text-[#D1D5DB]">•</span>
                )}
                {fileSize && (
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    {fileSize}
                  </span>
                )}
                {statusBadge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-0.5 ${
                    statusBadge.color === 'green'
                      ? 'bg-[#DCFCE7] text-[#166534]'
                      : statusBadge.color === 'blue'
                      ? 'bg-[#DBEAFE] text-[#1E40AF]'
                      : statusBadge.color === 'purple'
                      ? 'bg-[#EDE9FE] text-[#6D28D9]'
                      : statusBadge.color === 'orange'
                      ? 'bg-[#FED7AA] text-[#9A3412]'
                      : 'bg-[#DCFCE7] text-[#166534]'
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {statusBadge.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Compression Stats Card */}
        {compressionStats && (
          <div className="w-full max-w-[360px] bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFF] rounded-2xl border border-[#C7D2FE] p-3.5 mb-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#4F46E5]">
                Compression Details
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-[#6B7280] font-semibold">Original</span>
                <span className="text-[12px] font-bold text-[#07122E] line-through">
                  {compressionStats.originalSize}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-[#6B7280] font-semibold">Compressed</span>
                <span className="text-[13px] font-extrabold text-[#4F46E5]">
                  {compressionStats.compressedSize}
                </span>
              </div>

              <div className="border-t border-[#C7D2FE]/50 my-1.5" />

              <div className="flex items-center justify-between">
                <span className="text-[11.5px] text-[#6B7280] font-semibold">You Saved</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11.5px] text-emerald-700 font-bold">
                    {compressionStats.savedBytes}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10.5px] font-extrabold">
                    -{compressionStats.savedPercentage}%
                  </span>
                </div>
              </div>

              {compressionStats.format && (
                <>
                  <div className="border-t border-[#C7D2FE]/50 my-1.5" />
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] text-[#6B7280] font-semibold">Format</span>
                    <span className="text-[11.5px] font-bold text-[#07122E]">
                      {compressionStats.format}
                    </span>
                  </div>
                </>
              )}

              {compressionStats.dimensions && (
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] text-[#6B7280] font-semibold">Dimensions</span>
                  <span className="text-[11.5px] font-bold text-[#07122E]">
                    {compressionStats.dimensions}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-[360px] space-y-2">
          {/* Primary: Download */}
          <button
            onClick={onDownload}
            className="w-full h-[48px] bg-[#3F6DE0] text-white text-[14px] font-bold rounded-[14px] active:scale-[0.98] transition-transform shadow-[0_4px_14px_rgba(63,109,224,0.3)] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" strokeWidth={2.2} />
            {downloadLabel || 'Download PDF'}
          </button>

          {/* Secondary: Preview */}
          {onPreview && (
            <button
              onClick={onPreview}
              className="w-full h-[48px] bg-white text-[#3F6DE0] text-[14px] font-bold rounded-[14px] border-2 border-[#3F6DE0] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" strokeWidth={2.2} />
              Preview
            </button>
          )}

          {/* Tertiary: Start Over */}
          <button
            onClick={onStartOver}
            className="w-full h-[42px] bg-transparent text-[#6B7280] text-[13px] font-semibold rounded-[14px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:text-[#07122E]"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            Start Over
          </button>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes success-bounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-success-bounce {
          animation: success-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}