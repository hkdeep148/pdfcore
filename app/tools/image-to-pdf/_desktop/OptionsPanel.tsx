'use client';

import { useState } from 'react';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import PanelSection from '../../_components/PanelSection';
import DesktopDropdown from '../../_components/DesktopDropdown';
import { PAGE_SIZE_LABELS, FIT_LABELS } from '../_utils/pdfGenerator';

export default function OptionsPanel() {
const {
  images,
  pdfFilename, setPdfFilename,
  pageSize, setPageSize,
  orientation, setOrientation,
  orientationMode, setOrientationChoice,
  margins, setMargins,
  pageFit, setPageFit,
  quality, setQuality,
  setErrorMessage,
} = useImageToPdfContext();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isEditingFilename, setIsEditingFilename] = useState(false);

  const handleChange = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-5">
      {/* File name */}
      <PanelSection label="File name">
        <div className="flex items-center gap-2 px-3.5 py-3 rounded-lg border border-[#E2E2EE] bg-white hover:border-[#C9D8F3] focus-within:border-[#2563EB] transition-colors">
          {isEditingFilename ? (
            <input
              type="text"
              value={pdfFilename}
              onChange={(e) => setPdfFilename(e.target.value)}
              onBlur={() => setIsEditingFilename(false)}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingFilename(false); }}
              autoFocus
              className="flex-1 min-w-0 text-[13.5px] font-medium text-[#26324B] outline-none bg-transparent"
            />
          ) : (
            <span className="flex-1 min-w-0 text-[13.5px] font-medium text-[#26324B] truncate">
              {pdfFilename}.pdf
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsEditingFilename(true)}
            className="text-[#8A93A3] hover:text-[#2563EB] transition-colors flex-shrink-0"
            aria-label="Edit filename"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </PanelSection>

      {/* Paper size */}
      <PanelSection label="Paper size">
        <DesktopDropdown
          id="pageSize"
          value={pageSize}
          options={['A4', 'Letter', 'Legal', 'A5', 'A3'] as const}
          labels={PAGE_SIZE_LABELS}
          openId={openDropdown}
          setOpenId={setOpenDropdown}
          onChange={handleChange(setPageSize)}
        />
      </PanelSection>

{/*
  Orientation — three-option toggle (Auto / Portrait / Landscape).
  All three buttons go through setOrientationChoice so mobile and
  desktop share exactly the same behavior:
    - 'Auto'      → each image derives its own orientation
    - 'Portrait'  → force all images to portrait
    - 'Landscape' → force all images to landscape
  'Auto' is the default on both platforms.
*/}
<PanelSection label="Orientation">
  <div className="grid grid-cols-3 gap-2">
    {/* AUTO */}
    <button
      type="button"
      onClick={() => { setOrientationChoice('Auto'); setErrorMessage(null); }}
      className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg border-2 text-[12px] font-semibold transition-all ${
        orientationMode === 'Auto'
          ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB] shadow-[0_2px_8px_-2px_rgba(37,99,235,0.3)]'
          : 'border-[#E2E2EE] text-[#26324B] hover:border-[#C9D8F3] bg-white'
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
      Auto
    </button>

    {/* PORTRAIT */}
    <button
      type="button"
      onClick={() => { setOrientationChoice('Portrait'); setErrorMessage(null); }}
      className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg border-2 text-[12px] font-semibold transition-all ${
        orientationMode === 'Portrait'
          ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB] shadow-[0_2px_8px_-2px_rgba(37,99,235,0.3)]'
          : 'border-[#E2E2EE] text-[#26324B] hover:border-[#C9D8F3] bg-white'
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="2" width="12" height="20" rx="1.5" />
      </svg>
      Portrait
    </button>

    {/* LANDSCAPE */}
    <button
      type="button"
      onClick={() => { setOrientationChoice('Landscape'); setErrorMessage(null); }}
      className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg border-2 text-[12px] font-semibold transition-all ${
        orientationMode === 'Landscape'
          ? 'border-[#2563EB] bg-[#EFF3FF] text-[#2563EB] shadow-[0_2px_8px_-2px_rgba(37,99,235,0.3)]'
          : 'border-[#E2E2EE] text-[#26324B] hover:border-[#C9D8F3] bg-white'
      }`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="12" rx="1.5" />
      </svg>
      Landscape
    </button>
  </div>
</PanelSection>

      {/* Margins */}
      <PanelSection label="Margins">
        <DesktopDropdown
          id="margins"
          value={margins}
          options={['None', 'Small', 'Normal', 'Large'] as const}
          openId={openDropdown}
          setOpenId={setOpenDropdown}
          onChange={handleChange(setMargins)}
        />
      </PanelSection>

      {/* Image fit */}
      <PanelSection label="Image fit">
        <DesktopDropdown
          id="imageFit"
          value={pageFit}
          options={['Fit to page', 'Fill page', 'Actual size'] as const}
          labels={FIT_LABELS}
          openId={openDropdown}
          setOpenId={setOpenDropdown}
          onChange={handleChange(setPageFit)}
        />
      </PanelSection>

      {/* Export quality */}
      <PanelSection label="Export quality">
        <DesktopDropdown
          id="quality"
          value={quality}
          options={['Low', 'Medium', 'High quality'] as const}
          openId={openDropdown}
          setOpenId={setOpenDropdown}
          onChange={handleChange(setQuality)}
        />
      </PanelSection>
    </div>
  );
}