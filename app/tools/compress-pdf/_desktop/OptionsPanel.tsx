'use client';

import { useCompressPdfContext } from '../_context/CompressPdfContext';
import PanelSection from '../../_components/PanelSection';
import { formatBytes } from '../../_utils/browser';
import { COMPRESSION_LEVELS, estimateOutputSize } from '../_constants/compressionLevels';
import { Check } from 'lucide-react';

export default function OptionsPanel() {
  const {
    items, level, setLevel,
    totalOriginalBytes, totalCompressedBytes, totalSaved, totalSavedPercent,
  } = useCompressPdfContext();

  const hasFiles = items.length > 0;
  const totalSize = hasFiles ? items.reduce((sum, it) => sum + it.originalSizeBytes, 0) : 0;

  return (
    <>
      {/* ═══════════ Compression Level (Minimal) ═══════════ */}
      <PanelSection label="Quality">
        <div className="space-y-2">
          {COMPRESSION_LEVELS.map((lvl) => {
            const isSelected = level === lvl.id;
            const estimated = hasFiles ? estimateOutputSize(totalSize, lvl.id) : null;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setLevel(lvl.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all group ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Row 1: Label + Selected indicator */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      lvl.id === 'low' ? 'bg-emerald-500' :
                      lvl.id === 'medium' ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`} />
                    <span className={`text-[13px] font-semibold ${
                      isSelected ? 'text-slate-900' : 'text-slate-700'
                    }`}>
                      {lvl.label.replace(' Compression', '')}
                    </span>
                    {lvl.recommended && (
                      <span className="text-[9.5px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-slate-900" strokeWidth={2.5} />
                  )}
                </div>

                {/* Row 2: Description */}
                <p className="text-[11.5px] text-slate-500 leading-relaxed mb-2">
                  {lvl.useCase}
                </p>

                {/* Row 3: Stats (only if file uploaded) */}
                {estimated && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>
                      <span className="text-slate-500 font-semibold">{lvl.reduction}</span> smaller
                    </span>
                    <span className="text-slate-200">•</span>
                    <span>
                      ~<span className="text-slate-500 font-semibold">{estimated.avg}</span>
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </PanelSection>

      {/* ═══════════ Statistics (Only after compression) ═══════════ */}
      {totalSaved > 0 && (
        <PanelSection label="Result">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Saved
              </span>
              <span className="text-[24px] font-bold text-slate-900 leading-none">
                {totalSavedPercent}%
              </span>
            </div>

            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Original</span>
                <span className="text-slate-400 line-through">{formatBytes(totalOriginalBytes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compressed</span>
                <span className="font-semibold text-slate-900">{formatBytes(totalCompressedBytes)}</span>
              </div>
            </div>
          </div>
        </PanelSection>
      )}

      {/* ═══════════ Tip Box (Minimal) ═══════════ */}
      <div className="mt-4 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100">
        <p className="text-[11.5px] text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">Not compressing much?</span>{' '}
          Text-only PDFs are already efficient. Files with images shrink the most.
        </p>
      </div>
    </>
  );
}