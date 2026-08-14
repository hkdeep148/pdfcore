'use client';

import { useRef, useState, useEffect } from 'react';
import { FileText, Scissors, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
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
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/split-pdf')!;

  const [filename, setFilename] = useState('Split_Document');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (file?.name) {
      setFilename(file.name.replace(/\.pdf$/i, '') + '-split');
    }
  }, [file?.name]);

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
  const handleStartOver = () => { clearFile(); setShowSuccess(false); };
  const handleBackToEdit = () => { setShowSuccess(false); resetSplit(); };

  const hasFile = file !== null;

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && splitResult) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Split PDF"
        toolColor="#2563EB"
        onBack={handleBackToEdit}
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
        summaryTitle="Split Summary"
        summaryRows={[
          { icon: <Scissors size={13} />, iconBg: '#DBEAFE', iconColor: '#2563EB',
            label: splitResult.isZip ? 'Files Created' : 'Pages Extracted', value: `${splitResult.outputCount}` },
          { icon: <FileText size={13} />, iconBg: '#DBEAFE', iconColor: '#3B82F6',
            label: 'Total Pages', value: `${splitResult.totalPages}` },
          { icon: <FileText size={13} />, iconBg: '#D1FAE5', iconColor: '#10B981',
            label: 'File Size', value: splitResult.fileSize || '—', valueColor: '#10B981' },
          { icon: <FileText size={13} />, iconBg: '#FEF3C7', iconColor: '#F59E0B',
            label: 'Format', value: splitResult.isZip ? 'ZIP' : 'PDF' },
        ]}
      />
    );
  }

  // ═════════ EMPTY STATE ═════════
  if (!hasFile && !isLoadingPdf) {
    return (
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
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
              <span className="text-[13px] text-[#1E40AF] font-semibold">Loading...</span>
            </div>
            <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECTION 2: SCROLLABLE PAGE GRID ═══ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 mx-4 mt-3">
        <PageGrid />
      </div>

      {/* ═══ SECTION 3: SECURITY FOOTER (pinned) ═══ */}
      <div className="flex-shrink-0 mt-2 mb-2 px-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
        <Lock size={11} />
        Your files are 100% secure. We never store your data.
      </div>

      {/* ═══ SECTION 4: STICKY BOTTOM BAR ═══ */}
      <BottomToolbar barRef={bottomBarRef} />
    </div>
  );
}