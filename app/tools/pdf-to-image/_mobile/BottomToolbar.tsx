'use client';

import { usePdfToImageContext } from '../_context/PdfToImageContext';
import type { ImageFormat, ImageResolution } from '../../_types';

interface BottomToolbarProps {
  onAddPdfs: () => void;
}

const formats: ImageFormat[] = ['png', 'jpg'];
const resolutions: { value: ImageResolution; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
];

export default function BottomToolbar({ onAddPdfs }: BottomToolbarProps) {
  const {
  selectedIds, format, setFormat, resolution, setResolution,
  isProcessing, processProgress,
  convertAndPrepare,
  selectAll, clearSelection, pages,
} = usePdfToImageContext();

  const allSelected = pages.length > 0 && selectedIds.size === pages.length;

  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      {/* Options */}
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div>
          <p className="text-[10px] font-semibold text-[#8A93A3] mb-1">Format</p>
          <div className="grid grid-cols-2 gap-1">
            {formats.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all ${
                  format === fmt ? 'bg-[#2563EB] text-white' : 'bg-[#F6F7FB] text-[#26324B]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#8A93A3] mb-1">Quality</p>
          <div className="grid grid-cols-4 gap-1">
            {resolutions.map((res) => (
              <button
                key={res.value}
                type="button"
                onClick={() => setResolution(res.value)}
                className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  resolution === res.value ? 'bg-[#2563EB] text-white' : 'bg-[#F6F7FB] text-[#26324B]'
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Select all / Add */}
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={onAddPdfs}
          className="flex-1 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-semibold text-[#26324B] active:bg-[#F6F7FB]"
        >
          + Add PDF
        </button>
        <button
          type="button"
          onClick={allSelected ? clearSelection : selectAll}
          disabled={pages.length === 0}
          className="flex-1 py-2 rounded-lg border border-[#D1D5DB] text-[12px] font-semibold text-[#26324B] active:bg-[#F6F7FB] disabled:opacity-40"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      {/* Main action */}
      <button
  type="button"
  onClick={convertAndPrepare}
        disabled={isProcessing || selectedIds.size === 0}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#2563EB] text-white text-[15px] font-bold shadow-[0_8px_24px_-4px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Converting... {Math.round(processProgress)}%
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {selectedIds.size > 1
  ? `Convert ${selectedIds.size} Pages`
  : selectedIds.size === 1
  ? 'Convert to Image'
  : 'Select pages'}
          </>
        )}
      </button>
    </div>
  );
}