'use client';

import { useMergePdfContext } from '../_context/MergePdfContext';
import PanelSection from '../../_components/PanelSection';
import FilenameEditor from '../../_components/FilenameEditor';
import type { MergeCompressionLevel } from '../_utils/pdfMerger';

const COMPRESSION_OPTIONS: Array<{
  value: MergeCompressionLevel;
  label: string;
  desc: string;
  badge?: string;
}> = [
  { value: 'none',   label: 'No compression',    desc: 'Fastest • Original quality' },
  { value: 'low',    label: 'Light',             desc: 'Slight size reduction' },
  { value: 'medium', label: 'Recommended',       desc: 'Great balance of size & quality', badge: '⭐' },
  { value: 'high',   label: 'Maximum',           desc: 'Smallest file • Lower quality' },
];

export default function OptionsPanel() {
  const {
    items,
    totalPages,
    totalSizeMB,
    pdfFilename,
    setPdfFilename,
    compressionLevel,
    setCompressionLevel,
    mergeResult,
    downloadMerged,
  } = useMergePdfContext();

  return (
    <>
      {/* ⭐ MERGE RESULT (shown after successful merge) */}
      {mergeResult && (
        <PanelSection label="Merge Complete ✅">
          <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border-2 border-[#10B981] rounded-xl p-4 space-y-3">
            {/* Success icon + title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#166534]">Ready to download!</p>
                <p className="text-[11px] text-[#166534]/70">
                  {mergeResult.filesCount} files • {mergeResult.totalPages} pages
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/60 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#166534]/70">Original size</span>
                <span className="font-bold text-[#07122E]">{mergeResult.originalSizeMB}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#166534]/70">Merged size</span>
                <span className="font-bold text-[#10B981]">{mergeResult.mergedSizeMB}</span>
              </div>
              {mergeResult.savedPercent > 0 && (
                <>
                  <div className="h-px bg-[#10B981]/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#166534]/70">You saved</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[11px] font-bold">
                      -{mergeResult.savedPercent}%
                    </span>
                  </div>
                </>
              )}
              {mergeResult.savedPercent <= 0 && mergeResult.savedPercent >= -5 && (
                <>
                  <div className="h-px bg-[#10B981]/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#166534]/70">Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold">
                      Already optimized
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </PanelSection>
      )}

      <FilenameEditor
        value={pdfFilename}
        onChange={setPdfFilename}
        extension="pdf"
        label="Output filename"
      />

      {/* Compression Level Selector */}
      <PanelSection label="Compression">
        <div className="space-y-2">
          {COMPRESSION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCompressionLevel(opt.value)}
              disabled={!!mergeResult}
              className={`w-full text-left px-3.5 py-3 rounded-lg border-2 transition-all ${
                compressionLevel === opt.value
                  ? 'border-[#2563EB] bg-[#EFF3FF] shadow-[0_2px_8px_-2px_rgba(37,99,235,0.25)]'
                  : 'border-[#E2E2EE] bg-white hover:border-[#C9D8F3] hover:bg-[#F8FAFF]'
              } ${mergeResult ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[13px] font-bold ${
                  compressionLevel === opt.value ? 'text-[#2563EB]' : 'text-[#26324B]'
                }`}>
                  {opt.label}
                  {opt.badge && <span className="ml-1">{opt.badge}</span>}
                </span>
                {compressionLevel === opt.value && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className={`text-[11px] mt-0.5 ${
                compressionLevel === opt.value ? 'text-[#2563EB]/80' : 'text-[#8A93A3]'
              }`}>
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
        {mergeResult && (
          <p className="text-[11px] text-[#8A93A3] mt-2 italic">
            💡 Remove or re-add files to change compression
          </p>
        )}
      </PanelSection>

      {/* Stats (only shown before merge) */}
      {!mergeResult && (
        <PanelSection label="Statistics">
          <div className="bg-[#F6F7FB] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Files to merge</span>
              <span className="font-bold text-[#07122E]">{items.length}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Total pages</span>
              <span className="font-bold text-[#2563EB]">{totalPages}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Combined size</span>
              <span className="font-bold text-[#07122E]">{totalSizeMB} MB</span>
            </div>
          </div>
        </PanelSection>
      )}

      {/* Instructions (only shown before merge) */}
      {!mergeResult && (
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-[12px] text-[#1E40AF] leading-relaxed">
            <strong>Drag the handle</strong> on the left of each PDF to reorder. The final merged PDF will follow this order.
          </p>
        </div>
      )}

      {items.length < 2 && !mergeResult && (
        <div className="mt-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-[12px] text-[#92400E] leading-relaxed font-semibold">
            Add at least 2 PDF files to merge.
          </p>
        </div>
      )}
    </>
  );
}