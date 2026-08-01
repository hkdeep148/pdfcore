'use client';

import { useSplitPdfContext } from '../_context/SplitPdfContext';
import PanelSection from '../../_components/PanelSection';
import type { SplitMode } from '../../_types';

const modes: { value: SplitMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'range',
    label: 'Range',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="7" height="12" rx="1" strokeDasharray="2 2" />
        <rect x="14" y="6" width="7" height="12" rx="1" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    value: 'pages',
    label: 'Pages',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function SplitOptionsPanel() {
  const {
    file, mode, setMode,
    rangeInput, setRangeInput, rangeError,
    extractMode, setExtractMode,
    selectPagesInput, setSelectPagesInput, selectError,
    selectedPages, mergeExtracted, setMergeExtracted,
    maxSizeMB, setMaxSizeMB, isCalculatingSize, sizeGroups,
    outputCount, formatBytes,
  } = useSplitPdfContext();

  if (!file) return null;

  return (
    <>
      {/* Mode Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`relative flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
              mode === m.value
                ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB]'
                : 'border-[#E2E2EE] bg-white text-[#5B6472] hover:border-[#C9D8F3] hover:bg-[#F8FAFF]'
            }`}
          >
            {mode === m.value && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
            {m.icon}
            <span className="text-[13px] font-bold">{m.label}</span>
          </button>
        ))}
      </div>

      {/* ============ RANGE MODE ============ */}
      {mode === 'range' && (
        <PanelSection label="Page ranges">
          <input
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            placeholder="e.g., 1-3, 5, 7-10"
            className={`w-full px-3.5 py-2.5 rounded-lg border-2 text-[13px] outline-none transition-colors ${
              rangeError
                ? 'border-[#EF4444] focus:border-[#EF4444]'
                : 'border-[#E2E2EE] focus:border-[#2563EB]'
            }`}
          />
          {rangeError ? (
            <p className="text-[11px] text-[#EF4444] font-medium mt-1.5">{rangeError}</p>
          ) : (
            <p className="text-[11px] text-[#8A93A3] mt-1.5">
              Use commas to separate ranges. Each range becomes one PDF.
            </p>
          )}
        </PanelSection>
      )}

      {/* ============ PAGES MODE ============ */}
      {mode === 'pages' && (
        <>
          <PanelSection label="Extract mode:">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExtractMode('all')}
                className={`px-3 py-2.5 rounded-lg border-2 text-[13px] font-bold transition-all ${
                  extractMode === 'all'
                    ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB]'
                    : 'border-[#E2E2EE] bg-white text-[#5B6472] hover:border-[#C9D8F3]'
                }`}
              >
                Extract all pages
              </button>
              <button
                type="button"
                onClick={() => setExtractMode('select')}
                className={`px-3 py-2.5 rounded-lg border-2 text-[13px] font-bold transition-all ${
                  extractMode === 'select'
                    ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB]'
                    : 'border-[#E2E2EE] bg-white text-[#5B6472] hover:border-[#C9D8F3]'
                }`}
              >
                Select pages
              </button>
            </div>
          </PanelSection>

          {extractMode === 'select' && (
            <>
              <PanelSection label="Pages to extract:">
                <input
                  type="text"
                  value={selectPagesInput}
                  onChange={(e) => setSelectPagesInput(e.target.value)}
                  placeholder="e.g., 4-6, 11"
                  className={`w-full px-3.5 py-2.5 rounded-lg border-2 text-[13px] outline-none transition-colors ${
                    selectError
                      ? 'border-[#EF4444] focus:border-[#EF4444]'
                      : 'border-[#E2E2EE] focus:border-[#2563EB]'
                  }`}
                />
                {selectError && (
                  <p className="text-[11px] text-[#EF4444] font-medium mt-1.5">{selectError}</p>
                )}
                <p className="text-[11px] text-[#8A93A3] mt-1.5">
                  💡 Click pages in the grid to select them
                </p>
              </PanelSection>

              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={mergeExtracted}
                    onChange={(e) => setMergeExtracted(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    mergeExtracted
                      ? 'bg-[#2563EB] border-[#2563EB]'
                      : 'bg-white border-[#D1D5DB] group-hover:border-[#2563EB]'
                  }`}>
                    {mergeExtracted && (
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[13px] text-[#26324B] font-medium">
                  Merge extracted pages into one PDF file.
                </span>
              </label>

              {selectedPages.size > 0 && (
                <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <p className="text-[12px] text-[#1E40AF] leading-relaxed">
                    {mergeExtracted ? (
                      <>Selected pages will be merged into <strong>1 PDF file</strong> with {selectedPages.size} pages.</>
                    ) : (
                      <>Selected pages will be converted into separate PDF files.{' '}
                      <strong>{outputCount} PDF{outputCount !== 1 ? 's' : ''}</strong> will be created.</>
                    )}
                  </p>
                </div>
              )}
            </>
          )}

          {extractMode === 'all' && (
            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-[12px] text-[#1E40AF] leading-relaxed">
                Each page will be extracted into a separate PDF file.{' '}
                <strong>{file.totalPages} PDFs</strong> will be created.
              </p>
            </div>
          )}
        </>
      )}

      {/* ============ ⭐ SIZE MODE ============ */}
      {mode === 'size' && (
        <>
          <PanelSection label="Maximum size per PDF:">
            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setMaxSizeMB(preset.value)}
                  className={`px-2 py-2 rounded-lg border-2 text-[12px] font-bold transition-all ${
                    maxSizeMB === preset.value
                      ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB]'
                      : 'border-[#E2E2EE] bg-white text-[#5B6472] hover:border-[#C9D8F3]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom slider */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={maxSizeMB}
                onChange={(e) => setMaxSizeMB(Math.max(1, Math.min(100, parseFloat(e.target.value) || 1)))}
                className="flex-1 px-3 py-2 rounded-lg border-2 border-[#E2E2EE] text-[13px] font-bold text-[#26324B] outline-none focus:border-[#2563EB]"
              />
              <span className="text-[13px] font-bold text-[#5B6472]">MB</span>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(parseInt(e.target.value, 10))}
              className="w-full accent-[#2563EB] mt-3"
            />
            <div className="flex justify-between text-[10px] text-[#8A93A3] mt-1">
              <span>1 MB</span>
              <span>100 MB</span>
            </div>
          </PanelSection>

          {/* Info */}
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div className="text-[12px] text-[#1E40AF] leading-relaxed">
              <p className="mb-1">
                PDF will be split into files of approximately <strong>{maxSizeMB} MB each</strong>.
              </p>
              {isCalculatingSize ? (
  <span className="flex items-center gap-1.5 text-[#2563EB]">
    <span className="w-3 h-3 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin inline-block" />
    Calculating optimal splits...
  </span>
) : sizeGroups.length > 0 ? (
                <p><strong>{sizeGroups.length} PDF{sizeGroups.length !== 1 ? 's' : ''}</strong> will be created.</p>
              ) : (
                <p>Adjust the size to see split preview.</p>
              )}
            </div>
          </div>

          {/* File info */}
          <div className="bg-[#F6F7FB] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Original size</span>
              <span className="font-bold text-[#07122E]">{formatBytes(file.file.size)}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Target size</span>
              <span className="font-bold text-[#2563EB]">≤ {maxSizeMB} MB each</span>
            </div>
          </div>
        </>
      )}

      {/* Output count summary */}
      <PanelSection label="Output">
        <div className="bg-[#F6F7FB] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[12px]">
            <span className="text-[#8A93A3]">Source PDF</span>
            <span className="font-bold text-[#07122E]">{file.totalPages} pages</span>
          </div>
          <div className="pt-2 border-t border-[#E2E2EE] flex justify-between">
            <span className="text-[12px] font-semibold text-[#26324B]">Output files</span>
            <span className="text-[13px] font-bold text-[#10B981]">{outputCount}</span>
          </div>
        </div>
      </PanelSection>
    </>
  );
}