'use client';

import { useRef, useState } from 'react';
import { CirclePlus, LayoutList, Trash2, ArrowUpDown } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileBottomToolbar from '../../_components/MobileBottomToolbar';
import MobileActionButton from '../../_components/MobileActionButton';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import ProcessingOverlay from '../../_components/ProcessingOverlay';
import { getToolByPath } from '../../_config/tools';
import { useMergePdfContext } from '../_context/MergePdfContext';
import PdfMobileList from './PdfMobileList';

export default function MobileView() {
  const {
    items,
    addPdfs,
    clearAll,
    isLoadingPdf,
    loadProgress,
    isProcessing,
    processStage,
    processProgress,
    errorMessage,
    setErrorMessage,
    pdfFilename,
    setPdfFilename,
    performMerge,
    downloadMerged,
    previewMerged,
    resetMerge,
    mergeResult,
    totalPages,
  } = useMergePdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/merge-pdf')!;

  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  // 🎊 Handle merge & show success screen
  const handleMerge = async () => {
    await performMerge();
    // performMerge sets mergeResult when done; we wait for it via effect
  };

  // Show success screen when mergeResult appears
  const shouldShowSuccess = showSuccess || (mergeResult !== null && !isProcessing);

  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
    resetMerge();
  };

  // Auto-show success when merge completes
  if (mergeResult && !isProcessing && !showSuccess) {
    setShowSuccess(true);
  }

  const hasItems = items.length > 0;

  return (
    <>
      <ToolShellMobile fixedHeight={hasItems}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept="application/pdf"
        />

        {/* Error message */}
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

        {/* Loading indicator */}
        {isLoadingPdf && (
          <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
              <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDFs...</span>
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
        {shouldShowSuccess && mergeResult ? (
          <MobileSuccessScreen
            title="PDFs Merged!"
            subtitle={`${mergeResult.filesCount} PDFs combined into one`}
            filename={`${pdfFilename}.pdf`}
            fileSize={mergeResult.mergedSizeMB}
            pageCount={mergeResult.totalPages}
            onDownload={downloadMerged}
            onPreview={previewMerged}
            onStartOver={handleStartOver}
            onBack={handleBackToEdit}
          />
        ) : !hasItems && !isLoadingPdf ? (
          <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
        ) : (
          <div className="flex flex-col h-full bg-[#F4F5F7]">
            {/* Shared Header */}
            <MobileToolHeader
              filename={pdfFilename}
              onFilenameChange={setPdfFilename}
            />

            {/* File count / stats banner */}
            <div className="mx-3 mb-2 px-3 py-2 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl flex items-center justify-around shrink-0">
              <div className="text-center">
                <div className="text-[14px] font-bold text-[#2563EB]">{items.length}</div>
                <div className="text-[9px] text-[#8A93A3] uppercase tracking-wide">PDFs</div>
              </div>
              <div className="w-px h-7 bg-[#DBEAFE]" />
              <div className="text-center">
                <div className="text-[14px] font-bold text-[#2563EB]">{totalPages}</div>
                <div className="text-[9px] text-[#8A93A3] uppercase tracking-wide">Pages</div>
              </div>
            </div>

            {/* PDF list */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <PdfMobileList />
            </div>

            {/* Shared Bottom Toolbar */}
            <MobileBottomToolbar
              actions={[
                {
                  icon: CirclePlus,
                  label: 'Add PDF',
                  onClick: openFilePicker,
                },
                {
                  icon: ArrowUpDown,
                  label: 'Reorder',
                  onClick: () => {
                    // Reorder is done via drag handles in the list itself
                    // This button can show a hint or be a no-op
                  },
                  disabled: items.length < 2,
                },
                {
                  icon: Trash2,
                  label: 'Clear All',
                  onClick: clearAll,
                  disabled: !hasItems,
                  danger: true,
                },
              ]}
            />

            {/* Shared CTA Button */}
            <MobileActionButton
              label={`Merge ${items.length > 0 ? items.length : ''} PDF${items.length !== 1 ? 's' : ''}`}
              loadingLabel={processStage === 'compressing' ? 'Compressing...' : 'Merging...'}
              loading={isProcessing}
              disabled={items.length < 2}
              onClick={handleMerge}
              variant="primary"
            />
          </div>
        )}
      </ToolShellMobile>

      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isProcessing}
        stage={processStage}
        progress={processProgress}
      />
    </>
  );
}