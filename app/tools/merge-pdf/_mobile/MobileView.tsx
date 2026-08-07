'use client';

import { useRef, useState } from 'react';
import { CirclePlus, Trash2, ArrowUpDown, FileText, Layers } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileBottomToolbar from '../../_components/MobileBottomToolbar';
import MobileActionButton from '../../_components/MobileActionButton';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
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

  const handleMerge = async () => {
    await performMerge();
  };

  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
  };

  // Auto-show success when merge completes
  if (mergeResult && !isProcessing && !showSuccess) {
    setShowSuccess(true);
  }

  const shouldShowSuccess = showSuccess || (mergeResult !== null && !isProcessing);
  const hasItems = items.length > 0;

  // ═══════════════════════════════════════════════════════════════
  // ⭐ SUCCESS SCREEN (renders OUTSIDE ToolShellMobile)
  // ═══════════════════════════════════════════════════════════════
  if (shouldShowSuccess && mergeResult) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Merge PDF"
        toolColor="#2563EB"
        onBack={handleStartOver}
        title="Merge Successful!"
        subtitle={`${mergeResult.filesCount} PDFs have been merged into one document.`}
        files={[{
          id: 'merged-pdf',
          name: `${pdfFilename}.pdf`,
          size: mergeResult.mergedSizeMB,
          pages: mergeResult.totalPages,
        }]}
        onPreview={previewMerged}
        summaryTitle="Merge Summary"
        summaryRows={[
          {
            icon: <Layers size={13} />,
            iconBg: '#DBEAFE',
            iconColor: '#2563EB',
            label: 'Files Merged',
            value: `${mergeResult.filesCount} PDFs`,
          },
          {
            icon: <FileText size={13} />,
            iconBg: '#EDE9FE',
            iconColor: '#8B5CF6',
            label: 'Total Pages',
            value: `${mergeResult.totalPages}`,
          },
          {
            icon: <FileText size={13} />,
            iconBg: '#D1FAE5',
            iconColor: '#10B981',
            label: 'File Size',
            value: mergeResult.mergedSizeMB,
            valueColor: '#10B981',
          },
          {
            icon: <FileText size={13} />,
            iconBg: '#FEF3C7',
            iconColor: '#F59E0B',
            label: 'Format',
            value: 'PDF',
          },
        ]}
        downloadLabel="Download Merged PDF"
        onDownload={downloadMerged}
        onStartOver={handleStartOver}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ⭐ NORMAL VIEW (inside ToolShellMobile)
  // ═══════════════════════════════════════════════════════════════
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

        {/* Empty state or file list */}
        {!hasItems && !isLoadingPdf ? (
          <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
        ) : (
          <div className="flex flex-col h-full bg-[#F4F5F7]">
            {/* Header */}
            <MobileToolHeader
              filename={pdfFilename}
              onFilenameChange={setPdfFilename}
            />

            {/* Stats banner */}
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

            {/* Bottom Toolbar */}
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
                  onClick: () => {},
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

            {/* CTA Button */}
            <MobileActionButton
              label={`Merge ${items.length > 0 ? items.length : ''} PDF${items.length !== 1 ? 's' : ''}`}
              loadingLabel="Merging..."
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
        stage="merging"
        progress={50}
      />
    </>
  );
}