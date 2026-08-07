'use client';

import { useRef, useState, useEffect } from 'react';
import { FileText, LayoutGrid } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useOrganizePdfContext } from '../_context/OrganizePdfContext';
import OrganizeGrid from './OrganizeGrid';
import OrganizeBottomBar from './OrganizeBottomBar';

export default function MobileView() {
  const {
    pages, files, addPdfs, isLoadingPdf, loadProgress,
    errorMessage, setErrorMessage, clearAll,
    pdfFilename, setPdfFilename,
    isProcessing,
    organizedPdfUrl, organizedPdfSize,
    downloadOrganizedFile, previewOrganizedPdf, resetOrganized,
  } = useOrganizePdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/organize-pdf')!;
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-show success screen when URL becomes available
  useEffect(() => {
    if (organizedPdfUrl && !isProcessing) {
      setShowSuccess(true);
    }
  }, [organizedPdfUrl, isProcessing]);

  // Sync filename with first file
  useEffect(() => {
    if (files.length > 0 && !pdfFilename.startsWith(files[0].name.replace(/\.pdf$/i, ''))) {
      setPdfFilename(files[0].name.replace(/\.pdf$/i, '') + '-organized');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

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
    resetOrganized();
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
      {showSuccess && organizedPdfUrl ? (
        <MobileSuccessScreen
          toolIcon={tool.icon}
          toolName="Organize PDF"
          toolColor="#06B6D4"
          onBack={handleBackToEdit}
          title="PDF Organized!"
          subtitle={`${pages.length} pages ready to download`}
          filename={`${pdfFilename}.pdf`}
          fileSize={organizedPdfSize || undefined}
          pageCount={pages.length}
          onDownload={downloadOrganizedFile}
          onPreview={previewOrganizedPdf}
          onStartOver={handleStartOver}
          summaryTitle="Organize Summary"
          summaryRows={[
            {
              icon: <LayoutGrid size={13} />,
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
              value: organizedPdfSize || '—',
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
            <div className="flex-1 min-h-0 overflow-y-auto">
              <OrganizeGrid />
            </div>

            {/* Inline settings toolbar (selection + main actions + save button) */}
            <OrganizeBottomBar onAddPdfs={openFilePicker} />
          </div>
        )
      )}
    </ToolShellMobile>
  );
}