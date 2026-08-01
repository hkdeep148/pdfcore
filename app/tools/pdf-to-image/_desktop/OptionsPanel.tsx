'use client';

import { usePdfToImageContext } from '../_context/PdfToImageContext';
import PanelSection from '../../_components/PanelSection';
import { FORMAT_LABELS, RESOLUTION_LABELS } from '../_utils/pdfToImageConverter';
import type { ImageFormat, ImageResolution } from '../../_types';

const formats: ImageFormat[] = ['png', 'jpg'];
const resolutions: ImageResolution[] = ['low', 'medium', 'high', 'ultra'];

export default function OptionsPanel() {
  const {
    files, pages, selectedIds,
    format, setFormat, resolution, setResolution,
    selectAll, clearSelection,
  } = usePdfToImageContext();

  return (
    <>
      {/* Format */}
      <PanelSection label="Output format">
        <div className="grid grid-cols-2 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`py-2.5 rounded-lg border-2 text-[13px] font-bold uppercase transition-all ${
                format === fmt
                  ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB]'
                  : 'border-[#E2E2EE] text-[#26324B] hover:border-[#D1D5FF]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#8A93A3] mt-1.5 leading-relaxed">
          {FORMAT_LABELS[format]}
        </p>
      </PanelSection>

      {/* Resolution */}
      <PanelSection label="Image quality">
        <div className="space-y-2">
          {resolutions.map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => setResolution(res)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg border-2 transition-all ${
                resolution === res
                  ? 'border-[#2563EB] bg-[#EFF3FF]'
                  : 'border-[#E2E2EE] bg-white hover:border-[#D1D5FF]'
              }`}
            >
              <span className={`text-[13px] font-semibold ${resolution === res ? 'text-[#2563EB]' : 'text-[#26324B]'}`}>
                {RESOLUTION_LABELS[res]}
              </span>
            </button>
          ))}
        </div>
      </PanelSection>

      {/* Stats */}
      <PanelSection label="Document info">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#F6F7FB] rounded-lg p-2.5 text-center">
            <div className="text-[16px] font-bold text-[#2563EB]">{files.length}</div>
            <div className="text-[10px] text-[#8A93A3]">Files</div>
          </div>
          <div className="bg-[#F6F7FB] rounded-lg p-2.5 text-center">
            <div className="text-[16px] font-bold text-[#2563EB]">{pages.length}</div>
            <div className="text-[10px] text-[#8A93A3]">Pages</div>
          </div>
          <div className="bg-[#F6F7FB] rounded-lg p-2.5 text-center">
            <div className="text-[16px] font-bold text-[#10B981]">{selectedIds.size}</div>
            <div className="text-[10px] text-[#8A93A3]">Selected</div>
          </div>
        </div>
      </PanelSection>

      {/* Selection controls */}
      <PanelSection label="Selection">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={pages.length === 0}
            className="py-2 rounded-lg border-2 border-[#E2E2EE] text-[12px] font-semibold text-[#26324B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={clearSelection}
            disabled={selectedIds.size === 0}
            className="py-2 rounded-lg border-2 border-[#E2E2EE] text-[12px] font-semibold text-[#26324B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </PanelSection>

      {/* Info */}
      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-[12px] text-[#1E40AF] leading-relaxed">
          Multiple selections download as a ZIP file. Single selection downloads directly.
        </p>
      </div>
    </>
  );
}