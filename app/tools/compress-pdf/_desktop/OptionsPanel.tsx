'use client';

import { useCompressPdfContext } from '../_context/CompressPdfContext';
import PanelSection from '../../_components/PanelSection';
import { COMPRESSION_LEVEL_DESCRIPTIONS, formatBytes } from '../_utils/pdfCompressor';
import type { CompressionLevel } from '../../_types';

const levels: { value: CompressionLevel; label: string; icon: string }[] = [
  { value: 'low', label: 'Low', icon: '🟢' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'high', label: 'High', icon: '🔴' },
];

export default function OptionsPanel() {
  const {
    items, level, setLevel,
    totalOriginalBytes, totalCompressedBytes, totalSaved, totalSavedPercent,
  } = useCompressPdfContext();

  return (
    <>
      {/* Compression Level */}
      <PanelSection label="Compression level">
        <div className="space-y-2">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              type="button"
              onClick={() => setLevel(lvl.value)}
              className={`w-full text-left px-3.5 py-3 rounded-lg border-2 transition-all ${
                level === lvl.value
                  ? 'border-[#2563EB] bg-[#EFF3FF]'
                  : 'border-[#E2E2EE] bg-white hover:border-[#D1D5FF]'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[14px]">{lvl.icon}</span>
                <span className={`text-[13px] font-bold ${level === lvl.value ? 'text-[#2563EB]' : 'text-[#26324B]'}`}>
                  {lvl.label}
                </span>
              </div>
              <p className="text-[11px] text-[#8A93A3] leading-relaxed">
                {COMPRESSION_LEVEL_DESCRIPTIONS[lvl.value]}
              </p>
            </button>
          ))}
        </div>
      </PanelSection>

      {/* Stats */}
      {items.length > 0 && (
        <PanelSection label="Statistics">
          <div className="bg-[#F6F7FB] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Total files</span>
              <span className="font-semibold text-[#07122E]">{items.length}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#8A93A3]">Original size</span>
              <span className="font-semibold text-[#07122E]">{formatBytes(totalOriginalBytes)}</span>
            </div>
            {totalSaved > 0 && (
              <>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#8A93A3]">Compressed size</span>
                  <span className="font-semibold text-[#10B981]">{formatBytes(totalCompressedBytes)}</span>
                </div>
                <div className="pt-2 border-t border-[#E2E2EE] flex justify-between">
                  <span className="text-[12px] font-semibold text-[#26324B]">Total saved</span>
                  <span className="text-[13px] font-bold text-[#10B981]">
                    {totalSavedPercent > 0 ? `${totalSavedPercent}%` : 'No savings'}
                  </span>
                </div>
              </>
            )}
          </div>
        </PanelSection>
      )}

      {/* Info */}
      <div className="mt-5 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-[12px] text-[#1E40AF] leading-relaxed">
          Compression works best on PDFs with images. Text-only PDFs may not compress much.
        </p>
      </div>
    </>
  );
}