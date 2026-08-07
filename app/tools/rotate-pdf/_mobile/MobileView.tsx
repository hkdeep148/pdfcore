'use client';

import { useRef, useState, useEffect } from 'react';
import { FileText, RotateCw } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useRotatePdfContext } from '../_context/RotatePdfContext';
import PageGrid from './PageGrid';
import BottomToolbar from './BottomToolbar';

export default function MobileView() {
  const {
    pages,
    addPdfs,
    isLoadingPdf,
    loadProgress,
    errorMessage,
    setErrorMessage,
    clearAll,
    pdfFilename,
    setPdfFilename,
    isProcessing,
    rotatedPdfUrl,
    rotatedPdfSize,
    downloadRotatedFile,
    previewRotatedPdf,
    resetRotated,
    rotatedCount,
  } = useRotatePdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/rotate-pdf')!;
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-show success screen when PDF is ready
  useEffect(() => {
    if (rotatedPdfUrl && !isProcessing) {
      setShowSuccess(true);
    }
  }, [rotatedPdfUrl, isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
    resetRotated();
  };

  const hasPages = pages.length > 0;

  return (
    <ToolShellMobile fixedHeight={hasPages}>
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

      {isLoadingPdf && (
        <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
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
      {showSuccess && rotatedPdfUrl ? (
        <MobileSuccessScreen
          toolIcon={tool.icon}
          toolName="Rotate PDF"
          toolColor="#8B3DFF"
          onBack={handleBackToEdit}
          title="PDF Rotated!"
          subtitle={
            rotatedCount > 0
              ? `${rotatedCount} page${rotatedCount !== 1 ? 's' : ''} rotated successfully`
              : 'Your PDF is ready to download'
          }
          filename={`${pdfFilename}.pdf`}
          fileSize={rotatedPdfSize || undefined}
          pageCount={pages.length}
          onDownload={downloadRotatedFile}
          onPreview={previewRotatedPdf}
          onStartOver={handleStartOver}
          summaryTitle="Rotation Summary"
          summaryRows={[
            {
              icon: <RotateCw size={13} />,
              iconBg: '#F3E8FF',
              iconColor: '#8B3DFF',
              label: 'Pages Rotated',
              value: `${rotatedCount}`,
            },
            {
              icon: <FileText size={13} />,
              iconBg: '#DBEAFE',
              iconColor: '#2563EB',
              label: 'Total Pages',
              value: `${pages.length}`,
            },
            {
              icon: <FileText size={13} />,
              iconBg: '#D1FAE5',
              iconColor: '#10B981',
              label: 'File Size',
              value: rotatedPdfSize || '—',
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
        />
      ) : !hasPages && !isLoadingPdf ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        hasPages && (
          <div className="flex flex-col h-full bg-[#F4F5F7]">
            {/* Shared Header */}
            <MobileToolHeader
              filename={pdfFilename}
              onFilenameChange={setPdfFilename}
            />

            {/* Grid */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <PageGrid />
            </div>

            {/* Existing tool-specific bottom toolbar */}
            <BottomToolbar onAddPdfs={openFilePicker} />
          </div>
        )
      )}
    </ToolShellMobile>
  );
}