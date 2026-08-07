'use client';

import { useMergePdfContext } from '../_context/MergePdfContext';
import PanelSection from '../../_components/PanelSection';
import FilenameEditor from '../../_components/FilenameEditor';

export default function OptionsPanel() {
  const {
    items,
    totalPages,
    totalSizeMB,
    pdfFilename,
    setPdfFilename,
  } = useMergePdfContext();

  return (
    <>
      {/* Filename editor */}
      <FilenameEditor
        value={pdfFilename}
        onChange={setPdfFilename}
        extension="pdf"
        label="Output filename"
      />

      {/* Statistics */}
      {items.length > 0 && (
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

      {/* Reorder hint */}
      {items.length > 0 && (
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

      {/* Warning: less than 2 files */}
      {items.length < 2 && (
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