'use client';

import { useRef, useState, useEffect } from 'react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useSplitPdfContext } from '../_context/SplitPdfContext';
import PageGrid from './PageGrid';
import BottomToolbar from './BottomToolbar';

export default function MobileView() {
  const {
    file, pages, isLoadingPdf, loadProgress,
    errorMessage, setErrorMessage, addPdf, clearFile,
    isProcessing,
    splitResult, resetSplit,
    downloadSplitFile, previewSplitFile,
  } = useSplitPdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/split-pdf')!;

  const [filename, setFilename] = useState('Split_Document');
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync filename with file
  useEffect(() => {
    if (file?.name) {
      setFilename(file.name.replace(/\.pdf$/i, '') + '-split');
    }
  }, [file?.name]);

  // Auto-show success when split completes
  useEffect(() => {
    if (splitResult && !isProcessing) {
      setShowSuccess(true);
    }
  }, [splitResult, isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdf(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleStartOver = () => {
    clearFile();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
    resetSplit();
  };

  const hasFile = file !== null;

  return (
    <ToolShellMobile fixedHeight={hasFile}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
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

      {isLoadingPdf && (
        <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading...</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 🎊 SUCCESS SCREEN */}
      {showSuccess && splitResult ? (
        <MobileSuccessScreen
          title={splitResult.isZip ? 'PDF Split!' : 'Page Extracted!'}
          subtitle={
            splitResult.isZip
              ? `Split into ${splitResult.outputCount} files (${splitResult.totalPages} pages)`
              : `Extracted ${splitResult.totalPages} page${splitResult.totalPages !== 1 ? 's' : ''}`
          }
          filename={splitResult.filename}
          fileSize={splitResult.fileSize}
          pageCount={splitResult.totalPages}
          onDownload={downloadSplitFile}
          onPreview={splitResult.isZip ? undefined : previewSplitFile}
          onStartOver={handleStartOver}
          onBack={handleBackToEdit}
        />
      ) : !hasFile && !isLoadingPdf ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        hasFile && pages.length > 0 && (
          <div className="flex flex-col h-full bg-[#F4F5F7]">
            {/* Shared Header */}
            <MobileToolHeader
              filename={filename}
              onFilenameChange={setFilename}
            />

            {/* Page grid */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <PageGrid />
            </div>

            {/* Original inline BottomToolbar with settings + split button */}
            <BottomToolbar />
          </div>
        )
      )}
    </ToolShellMobile>
  );
}