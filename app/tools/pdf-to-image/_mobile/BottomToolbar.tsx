'use client';

import { ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { usePdfToImageContext } from '../_context/PdfToImageContext';
import type { ImageFormat, ImageResolution } from '../../_types';

interface BottomToolbarProps {
  onAddPdfs: () => void;
}

const FORMAT_LABELS: Record<ImageFormat, string> = {
  png: 'PNG',
  jpg: 'JPG',
};

const RESOLUTION_LABELS: Record<ImageResolution, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
  ultra: 'Ultra',
};

const FORMAT_OPTIONS: { id: ImageFormat; label: string; hint: string }[] = [
  { id: 'png', label: 'PNG', hint: 'Lossless, larger file' },
  { id: 'jpg', label: 'JPG', hint: 'Smaller, good quality' },
];

const RESOLUTION_OPTIONS: { id: ImageResolution; label: string; hint: string }[] = [
  { id: 'low', label: 'Low', hint: '72 DPI' },
  { id: 'medium', label: 'Medium', hint: '108 DPI' },
  { id: 'high', label: 'High', hint: '144 DPI' },
  { id: 'ultra', label: 'Ultra', hint: '216 DPI' },
];

export default function BottomToolbar({ onAddPdfs }: BottomToolbarProps) {
  const {
    selectedIds,
    format,
    setFormat,
    resolution,
    setResolution,
    isProcessing,
    processProgress,
    convertAndPrepare,
  } = usePdfToImageContext();

  const [sheet, setSheet] = useState<null | 'format' | 'quality'>(null);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
      style={{ boxShadow: '0 -6px 20px -8px rgba(15,23,42,0.08)' }}
    >
      {/* ═══════════ CHIP ROW ═══════════ */}
      <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden mb-3">
        <ChipCell
          label="Format"
          value={FORMAT_LABELS[format]}
          onClick={() => setSheet('format')}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          }
        />
        <div className="w-px h-6 bg-[#E2E8F0] flex-shrink-0" />
        <ChipCell
          label="Quality"
          value={RESOLUTION_LABELS[resolution]}
          onClick={() => setSheet('quality')}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.07 7.07l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.07-7.07l4.24-4.24" />
            </svg>
          }
        />
      </div>

      {/* ═══════════ MAIN CONVERT BUTTON ═══════════ */}
      <button
        type="button"
        onClick={convertAndPrepare}
        disabled={isProcessing || selectedIds.size === 0}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white font-bold text-[16px] shadow-[0_6px_20px_-4px_rgba(79,70,229,0.5)] active:scale-[0.98] transition disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Converting... {Math.round(processProgress)}%
          </>
        ) : selectedIds.size === 0 ? (
          'Select pages to convert'
        ) : (
          <>
            {selectedIds.size > 1
              ? `Convert ${selectedIds.size} Pages`
              : 'Convert to Image'}
            <ArrowRight size={18} strokeWidth={2.2} />
          </>
        )}
      </button>

      {/* ═══════════ BOTTOM SHEETS ═══════════ */}
      {sheet === 'format' && (
        <OptionSheet
          title="Image Format"
          options={FORMAT_OPTIONS}
          value={format}
          onChange={(v) => {
            setFormat(v as ImageFormat);
            setSheet(null);
          }}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'quality' && (
        <OptionSheet
          title="Image Quality"
          options={RESOLUTION_OPTIONS}
          value={resolution}
          onChange={(v) => {
            setResolution(v as ImageResolution);
            setSheet(null);
          }}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ChipCell — dropdown cell inside the bordered chip row
// ═══════════════════════════════════════════════════════════════
function ChipCell({
  label,
  value,
  onClick,
  icon,
}: {
  label: string;
  value: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 min-w-0 flex items-center gap-2 py-2.5 px-2.5 bg-white active:bg-[#F8FAFC] active:scale-[0.98] transition"
    >
      <span className="w-4 h-4 text-[#6366F1] flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0 flex flex-col items-start leading-tight">
        <div className="flex items-center gap-0.5 max-w-full">
          <span className="text-[12px] font-bold text-[#0F172A] truncate">
            {value}
          </span>
          <ChevronDown
            size={11}
            className="text-[#94A3B8] flex-shrink-0"
            strokeWidth={2}
          />
        </div>
        <span className="text-[9px] font-medium text-[#94A3B8] truncate max-w-full mt-0.5">
          {label}
        </span>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// OptionSheet — bottom sheet for choosing format or quality
// (self-contained here so we don't need the pdf-to-image tool
// to depend on image-to-pdf's OptionSheet)
// ═══════════════════════════════════════════════════════════════
interface Option {
  id: string;
  label: string;
  hint: string;
}

function OptionSheet({
  title,
  options,
  value,
  onChange,
  onClose,
}: {
  title: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        style={{ top: '72px' }}
      />
      {/* Sheet */}
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-[0_-8px_32px_-8px_rgba(15,23,42,0.15)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B]"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-3 pb-4">
          {options.map((opt) => {
            const isActive = opt.id === value;
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'bg-white active:bg-[#F8FAFC] text-[#0F172A]'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[14px] font-bold">{opt.label}</span>
                  <span className={`text-[11px] ${isActive ? 'text-[#2563EB]/70' : 'text-[#94A3B8]'} mt-0.5`}>
                    {opt.hint}
                  </span>
                </div>
                {isActive && (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}