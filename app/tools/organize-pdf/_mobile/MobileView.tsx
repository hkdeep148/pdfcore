'use client';

import { useRef, useState, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/organize-pdf')!;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (organizedPdfUrl && !isProcessing) {
      setShowSuccess(true);
    }
  }, [organizedPdfUrl, isProcessing]);

  useEffect(() => {
    if (files.length > 0 && !pdfFilename.startsWith(files[0].name.replace(/\.pdf$/i, ''))) {
      setPdfFilename(files[0].name.replace(/\.pdf$/i, '') + '-organized');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  // Auto-scroll to bottom when pages count changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [pages.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const handleStartOver = () => { clearAll(); setShowSuccess(false); };
  const handleBackToEdit = () => { setShowSuccess(false); resetOrganized(); };

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
          { icon: <LayoutGrid size={13} />, iconBg: '#DBEAFE', iconColor: '#2563EB', label: 'Total Pages', value: `${pages.length}` },
          { icon: <FileText size={13} />, iconBg: '#D1FAE5', iconColor: '#10B981', label: 'File Size', value: organizedPdfSize || '—', valueColor: '#10B981' },
          { icon: <FileText size={13} />, iconBg: '#FEF3C7', iconColor: '#F59E0B', label: 'Format', value: 'PDF' },
        ]}
      />
    );
  }

  // ═════════ EMPTY STATE ═════════
  if (!hasPages && !isLoadingPdf) {
    return (
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
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
    <div className="flex-1 flex flex-col bg-white min-h-0">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {/* ═══ SECTION 1: FIXED TOP (error + loading) ═══ */}
      <div className="flex-shrink-0">
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

        {isLoadingPdf && (
          <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
              <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
            </div>
            <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECTION 2: SCROLLABLE PAGE GRID ═══ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 mx-4 mt-3">
        <OrganizeGrid />
      </div>

      {/* ═══ SECTION 3: SECURITY FOOTER (pinned) ═══ */}
      <div className="flex-shrink-0 mt-2 mb-2 px-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
        <Lock size={11} />
        Your files are 100% secure. We never store your data.
      </div>

      {/* ═══ SECTION 4: STICKY BOTTOM BAR ═══ */}
      <OrganizeBottomBar onAddPdfs={openFilePicker} barRef={bottomBarRef} />
    </div>
  );
}