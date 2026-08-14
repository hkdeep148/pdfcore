'use client';

import { useRef, useState, useEffect } from 'react';
import { useStickyBottomSpace } from '../../_hooks/useStickyBottomSpace';
import { FileText, LayoutGrid, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
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
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const bottomSpace = useStickyBottomSpace(bottomBarRef);
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

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && organizedPdfUrl) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Organize PDF"
        toolColor="#2563EB"
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
    );
  }

  // ═════════ EMPTY STATE ═════════
  if (!hasPages && !isLoadingPdf) {
    return (
      <div className="min-h-screen bg-white overflow-x-hidden">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept="application/pdf"
        />
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      </div>
    );
  }

  // ═════════ MAIN VIEW ═════════
  return (
    <div className="min-h-[100dvh] bg-white overflow-x-hidden" style={{ paddingBottom: bottomSpace }}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {/* Error */}
      {errorMessage && (
        <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-100 active:scale-90 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoadingPdf && (
        <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
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

      {/*
        ⭐ PAGE GRID
        Organize PDF uses a unique 2-column grid with long-press
        drag-and-drop reordering (dnd-kit). The grid cards and
        bottom bar handle all organize-specific functionality.
      */}
      <div className="mx-4 mt-3">
        <OrganizeGrid />
      </div>

      {/* Security footer */}
      <div className="mt-3 mb-1 px-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
        <Lock size={11} />
        Your files are 100% secure. We never store your data.
      </div>

      {/*
        ⭐ STICKY BOTTOM — Selection actions + Save button
      */}
      <OrganizeBottomBar onAddPdfs={openFilePicker} barRef={bottomBarRef} />
    </div>
  );
}