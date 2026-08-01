'use client';

import { useRef } from 'react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import { getToolByPath } from '../../_config/tools';
import { useCompressPdfContext } from '../_context/CompressPdfContext';
import PdfList from './PdfList';
import BottomToolbar from './BottomToolbar';
import CompressionSummary from './CompressionSummary';

export default function MobileView() {
  const {
    items,
    addPdfs,
    clearAll,
    errorMessage,
    setErrorMessage,
    totalSaved,
  } = useCompressPdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/compress-pdf')!;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const hasItems = items.length > 0;

  return (
    <ToolShellMobile fixedHeight={hasItems}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {errorMessage && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between z-50">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {!hasItems ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        <div className="flex flex-col h-full bg-[#F4F5F7]">
          {/* Shared Header - "Back" button clears all */}
          <MobileToolHeader
            filename={`${items.length} PDF${items.length > 1 ? 's' : ''}`}
            onFilenameChange={() => {}}
            editable={false}
            onBack={clearAll}
          />

          {/* Compression Summary Banner - only shows when compression is done */}
          {totalSaved > 0 && <CompressionSummary />}

          {/* PDF List with compression stats */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <PdfList />
          </div>

          {/* Bottom Toolbar with compression level + action */}
          <BottomToolbar onAddPdfs={openFilePicker} />
        </div>
      )}
    </ToolShellMobile>
  );
}