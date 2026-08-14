'use client';

import { useRef, useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Image as ImageIcon, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { usePdfToImageContext } from '../_context/PdfToImageContext';
import PageGrid from './PageGrid';
import BottomToolbar from './BottomToolbar';

export default function MobileView() {
  const {
    pages,
    selectedIds,
    selectAll,
    clearSelection,
    removePage,
    addPdfs,
    clearAll,
    isLoadingPdf,
    loadProgress,
    errorMessage,
    setErrorMessage,
    isProcessing,
    conversionResult,
    downloadConvertedFile,
    previewConvertedFile,
    resetConversion,
  } = usePdfToImageContext();

  const tool = getToolByPath('/tools/pdf-to-image')!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (conversionResult && !isProcessing) {
      setShowSuccess(true);
    }
  }, [conversionResult, isProcessing]);

  // Auto-scroll to bottom when pages added
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
  const handleBackToEdit = () => { setShowSuccess(false); resetConversion(); };

  const hasPages = pages.length > 0;
  const allSelected = hasPages && selectedIds.size === pages.length;

  const handleToggleSelectAll = () => {
    if (allSelected) clearSelection();
    else selectAll();
  };

  const handleDeleteSelected = () => {
    const targets = pages.filter((p) => selectedIds.has(p.id));
    if (targets.length === 0) return;
    if (!confirm(`Remove ${targets.length} page${targets.length > 1 ? 's' : ''}?`)) return;
    targets.forEach((p) => removePage(p.id));
  };

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && conversionResult) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="PDF to Image"
        toolColor="#2563EB"
        onBack={handleStartOver}
        title={conversionResult.isZip ? 'Images Ready!' : 'Image Ready!'}
        subtitle={
          conversionResult.isZip
            ? `${conversionResult.outputCount} pages converted to ${conversionResult.format.toUpperCase()}`
            : `Converted to ${conversionResult.format.toUpperCase()}`
        }
        files={[{
          id: 'converted-image',
          name: conversionResult.filename,
          size: conversionResult.fileSize,
          pages: conversionResult.outputCount,
        }]}
        onPreview={conversionResult.isZip ? undefined : previewConvertedFile}
        onDownload={downloadConvertedFile}
        onStartOver={handleStartOver}
        summaryTitle="Conversion Summary"
        summaryRows={[
          { icon: <ImageIcon size={13} />, iconBg: '#DBEAFE', iconColor: '#2563EB', label: 'Images Created', value: `${conversionResult.outputCount}` },
          { icon: <FileText size={13} />, iconBg: '#DBEAFE', iconColor: '#3B82F6', label: 'Format', value: conversionResult.format.toUpperCase() },
          { icon: <FileText size={13} />, iconBg: '#D1FAE5', iconColor: '#10B981', label: 'Total Size', value: conversionResult.fileSize || '—', valueColor: '#10B981' },
          { icon: <FileText size={13} />, iconBg: '#FEF3C7', iconColor: '#F59E0B', label: 'Output', value: conversionResult.isZip ? 'ZIP' : conversionResult.format.toUpperCase() },
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

      {/* ═══ SECTION 1: FIXED TOP ═══ */}
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

        {/* TOP TOOLBAR */}
        <div className="px-4 mt-3">
          <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden">
            <ActionIcon onClick={openFilePicker} ariaLabel="Add PDF" variant="primary" icon={<Plus size={20} strokeWidth={2.2} />} />
            <ToolbarDivider />
            <ActionIcon
              onClick={handleToggleSelectAll}
              disabled={pages.length === 0}
              ariaLabel={allSelected ? 'Deselect all' : 'Select all'}
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              }
            />
            <ToolbarDivider />
            <ActionIcon onClick={handleDeleteSelected} disabled={selectedIds.size === 0} ariaLabel="Remove selected" variant="danger" icon={<Trash2 size={18} strokeWidth={2} />} />
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: SCROLLABLE PAGE GRID ═══ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 mx-4 mt-3">
        <PageGrid />
      </div>

      {/* ═══ SECTION 3: PINNED ADD MORE + SECURITY ═══ */}
      <div className="flex-shrink-0 mx-4 mt-2 mb-2">
        <button
          onClick={openFilePicker}
          className="w-full py-3 rounded-lg border border-dashed border-[#BFDBFE] bg-[#F5F9FF] flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] active:bg-[#EFF6FF] transition"
        >
          <div className="flex items-center gap-1.5 text-[#2563EB]">
            <Plus size={16} strokeWidth={2.5} />
            <span className="text-[13px] font-semibold">Add more PDFs</span>
          </div>
          <p className="text-[10px] text-[#94A3B8]">PDF • Max 100 MB</p>
        </button>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
          <Lock size={11} />
          Your files are 100% secure. We never store your data.
        </div>
      </div>

      {/* ═══ SECTION 4: STICKY BOTTOM BAR ═══ */}
      <BottomToolbar onAddPdfs={openFilePicker} barRef={bottomBarRef} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
function ActionIcon({
  onClick, disabled, ariaLabel, icon, variant = 'default',
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger';
}) {
  const colorClass =
    variant === 'primary' ? 'text-[#6366F1]'
    : variant === 'danger' ? 'text-[#EF4444]'
    : 'text-[#0F172A]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`flex-1 min-w-0 h-12 flex items-center justify-center active:bg-[#F8FAFC] active:scale-95 transition disabled:opacity-40 ${colorClass}`}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#E2E8F0] flex-shrink-0" />;
}