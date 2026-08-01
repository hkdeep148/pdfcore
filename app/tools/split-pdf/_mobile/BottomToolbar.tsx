'use client';

import { useSplitPdfContext } from '../_context/SplitPdfContext';
import type { SplitMode } from '../../_types';

const modes: { value: SplitMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'range',
    label: 'Range',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="7" height="12" rx="1" strokeDasharray="2 2" />
        <rect x="14" y="6" width="7" height="12" rx="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    value: 'pages',
    label: 'Pages',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    value: 'size',
    label: 'Size',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
        <rect x="5" y="9" width="14" height="6" rx="1" />
      </svg>
    ),
  },
];

// Preset size options
const SIZE_PRESETS = [
  { label: '5 MB', value: 5 },
  { label: '10 MB', value: 10 },
  { label: '25 MB', value: 25 },
  { label: '50 MB', value: 50 },
];

export default function BottomToolbar() {
  const {
    file, mode, setMode,
    rangeInput, setRangeInput, rangeError,
    extractMode, setExtractMode,
    selectPagesInput, setSelectPagesInput, selectError,
    mergeExtracted, setMergeExtracted,
    maxSizeMB, setMaxSizeMB, isCalculatingSize,
    outputCount, canSplit, isProcessing,
    splitAndPrepare,  // ⭐ CHANGED: uses new function (triggers success screen)
  } = useSplitPdfContext();

  if (!file) return null;

  return (
    <div className="flex-shrink-0 bg-white border-t border-[#E8E8F0] px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] space-y-2.5">
      {/* Mode tabs */}
      <div>
        <p className="text-[10px] font-semibold text-[#8A93A3] mb-1 uppercase tracking-wide">Mode</p>
        <div className="grid grid-cols-3 gap-1.5">
          {modes.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] font-bold transition-all ${
                mode === m.value
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-[#F6F7FB] text-[#26324B]'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============ RANGE MODE ============ */}
      {mode === 'range' && (
        <div>
          <p className="text-[10px] font-semibold text-[#8A93A3] mb-1 uppercase tracking-wide">
            Page ranges
          </p>
          <input
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="e.g., 1-3, 5, 7-10"
            className={`w-full px-3 py-2 rounded-lg border-2 text-[13px] outline-none ${
              rangeError ? 'border-[#EF4444]' : 'border-[#E2E2EE] focus:border-[#2563EB]'
            }`}
          />
          {rangeError && (
            <p className="text-[10px] text-[#EF4444] font-medium mt-1">{rangeError}</p>
          )}
        </div>
      )}

      {/* ============ PAGES MODE ============ */}
      {mode === 'pages' && (
        <div className="space-y-2">
          {/* Extract mode toggle */}
          <div>
            <p className="text-[10px] font-semibold text-[#8A93A3] mb-1 uppercase tracking-wide">
              Extract
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setExtractMode('all')}
                className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                  extractMode === 'all'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F6F7FB] text-[#26324B]'
                }`}
              >
                All pages
              </button>
              <button
                type="button"
                onClick={() => setExtractMode('select')}
                className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                  extractMode === 'select'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#F6F7FB] text-[#26324B]'
                }`}
              >
                Select pages
              </button>
            </div>
          </div>

          {/* Pages input (only for select mode) */}
          {extractMode === 'select' && (
            <>
              <input
                type="text"
                value={selectPagesInput}
                onChange={(e) => setSelectPagesInput(e.target.value)}
                placeholder="e.g., 4-6, 11"
                className={`w-full px-3 py-2 rounded-lg border-2 text-[13px] outline-none ${
                  selectError ? 'border-[#EF4444]' : 'border-[#E2E2EE] focus:border-[#2563EB]'
                }`}
              />
              {selectError && (
                <p className="text-[10px] text-[#EF4444] font-medium">{selectError}</p>
              )}

              {/* Merge checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={mergeExtracted}
                    onChange={(e) => setMergeExtracted(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    mergeExtracted
                      ? 'bg-[#2563EB] border-[#2563EB]'
                      : 'bg-white border-[#D1D5DB]'
                  }`}>
                    {mergeExtracted && (
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-[#26324B] font-semibold">
                  Merge into one PDF
                </span>
              </label>
            </>
          )}
        </div>
      )}

      {/* ============ SIZE MODE ============ */}
      {mode === 'size' && (
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-[#8A93A3] mb-1 uppercase tracking-wide">
              <span>Max size</span>
              <span className="text-[#2563EB]">{maxSizeMB} MB</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setMaxSizeMB(preset.value)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    maxSizeMB === preset.value
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F6F7FB] text-[#26324B]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom size slider */}
          <div>
            <input
              type="range"
              min="1"
              max="100"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(parseInt(e.target.value, 10))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-[9px] text-[#8A93A3] mt-0.5">
              <span>1 MB</span>
              <span>100 MB</span>
            </div>
          </div>

          {isCalculatingSize && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#2563EB] font-semibold">
              <div className="w-3 h-3 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
              Calculating...
            </div>
          )}
        </div>
      )}

      {/* Split button - now triggers success screen via splitAndPrepare */}
      <button
        type="button"
        onClick={splitAndPrepare}
        disabled={!canSplit || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#2563EB] text-white text-[15px] font-bold shadow-[0_8px_24px_-4px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Splitting...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
            </svg>
            {outputCount > 1 ? `Split into ${outputCount} (ZIP)` : outputCount === 1 ? 'Extract Page' : 'Split PDF'}
          </>
        )}
      </button>
    </div>
  );
}