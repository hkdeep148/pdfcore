'use client';

import { useRef, useState, useEffect } from 'react';
import { Plus, RotateCw, RotateCcw, Trash2, Check, ArrowRight, FileText, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import MobileListView from '../../_components/MobileListView';
import { getToolByPath } from '../../_config/tools';
import { useRotatePdfContext } from '../_context/RotatePdfContext';

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
    isProcessing,
    rotatedPdfUrl,
    rotatedPdfSize,
    downloadRotatedFile,
    previewRotatedPdf,
    resetRotated,
    rotatedCount,
    rotatePage,
    removePage,
    rotateAll,
    rotateSelected,
    selectedIds,
    toggleSelect,
    rotateAndPrepare,
  } = useRotatePdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/rotate-pdf')!;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (rotatedPdfUrl && !isProcessing) {
      setShowSuccess(true);
    }
  }, [rotatedPdfUrl, isProcessing]);

  // Auto-scroll to bottom when new pages added
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
  const handleBackToEdit = () => { setShowSuccess(false); resetRotated(); };

  const hasPages = pages.length > 0;
  const selectedCount = selectedIds.size;
  const allSelected = pages.length > 0 && selectedCount === pages.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      pages.forEach(p => { if (selectedIds.has(p.id)) toggleSelect(p.id); });
    } else {
      pages.forEach(p => { if (!selectedIds.has(p.id)) toggleSelect(p.id); });
    }
  };

  const handleRotateLeftBatch = () => {
    if (selectedCount > 0) rotateSelected('left');
    else rotateAll('left');
  };

  const handleRotateRightBatch = () => {
    if (selectedCount > 0) rotateSelected('right');
    else rotateAll('right');
  };

  const handleDeleteSelected = () => {
    const targets = pages.filter(p => selectedIds.has(p.id));
    if (targets.length === 0) return;
    if (!confirm(`Remove ${targets.length} page${targets.length > 1 ? 's' : ''}?`)) return;
    targets.forEach(p => removePage(p.id));
  };

  // Adapt pages array to MobileListView format
  const listItems = pages.map((p, i) => ({
    id: p.id,
    preview: p.preview,
    rotation: p.rotation,
    pageNumber: i + 1,
    originalPage: p,
  }));

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && rotatedPdfUrl) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Rotate PDF"
        toolColor="#8B3DFF"
        onBack={handleBackToEdit}
        title="PDF Rotated!"
        subtitle={rotatedCount > 0 ? `${rotatedCount} page${rotatedCount !== 1 ? 's' : ''} rotated successfully` : 'Your PDF is ready to download'}
        filename={`${pdfFilename}.pdf`}
        fileSize={rotatedPdfSize || undefined}
        pageCount={pages.length}
        onDownload={downloadRotatedFile}
        onPreview={previewRotatedPdf}
        onStartOver={handleStartOver}
        summaryTitle="Rotation Summary"
        summaryRows={[
          { icon: <RotateCw size={13} />, iconBg: '#F3E8FF', iconColor: '#8B3DFF', label: 'Pages Rotated', value: `${rotatedCount}` },
          { icon: <FileText size={13} />, iconBg: '#DBEAFE', iconColor: '#2563EB', label: 'Total Pages', value: `${pages.length}` },
          { icon: <FileText size={13} />, iconBg: '#D1FAE5', iconColor: '#10B981', label: 'File Size', value: rotatedPdfSize || '—', valueColor: '#10B981' },
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

      {/* ═══ SECTION 1: FIXED TOP ═══ */}
      <div className="flex-shrink-0">
        {errorMessage && (
          <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-100 active:scale-90 transition">
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
        <div className="px-3 mt-3">
          <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden">
            <ActionIcon onClick={openFilePicker} ariaLabel="Add PDFs" variant="primary" icon={<Plus size={20} strokeWidth={2.2} />} />
            <ToolbarDivider />
            <ActionIcon onClick={handleRotateLeftBatch} disabled={pages.length === 0} ariaLabel="Rotate left" icon={<RotateCcw size={18} strokeWidth={2} />} />
            <ToolbarDivider />
            <ActionIcon onClick={handleRotateRightBatch} disabled={pages.length === 0} ariaLabel="Rotate right" icon={<RotateCw size={18} strokeWidth={2} />} />
            <ToolbarDivider />
            <ActionIcon onClick={handleDeleteSelected} disabled={selectedCount === 0} ariaLabel="Remove" variant="danger" icon={<Trash2 size={18} strokeWidth={2} />} />
          </div>
        </div>

        {/* SELECTION HEADER */}
        <div className="mt-4 mx-4 px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] border-b-0 rounded-t-lg flex items-center justify-between">
          <button onClick={toggleSelectAll} className="flex items-center gap-2.5 active:opacity-70">
            <div className={`w-5 h-5 rounded flex items-center justify-center transition ${
              allSelected ? 'bg-[#2563EB]' : selectedCount > 0 ? 'bg-[#2563EB]' : 'border-2 border-[#CBD5E1] bg-white'
            }`}>
              {allSelected && <Check size={13} className="text-white" strokeWidth={3} />}
              {!allSelected && selectedCount > 0 && <div className="w-2.5 h-0.5 bg-white rounded" />}
            </div>
            <span className="text-[13px] font-semibold text-[#0F172A]">
              {selectedCount > 0
                ? `${selectedCount} page${selectedCount > 1 ? 's' : ''} selected`
                : `${pages.length} page${pages.length > 1 ? 's' : ''}`}
            </span>
          </button>
          {rotatedCount > 0 && (
            <span className="text-[11px] font-semibold text-[#8B3DFF] bg-[#F3E8FF] px-2 py-1 rounded-full">
              {rotatedCount} rotated
            </span>
          )}
        </div>
      </div>

      {/* ═══ SECTION 2: SCROLLABLE PAGE LIST ═══ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 mx-4">
        <MobileListView
          items={listItems}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          accentColor="#8B3DFF"
          renderThumbnail={(item) => (
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              <img
                src={item.preview}
                alt={`Page ${item.pageNumber}`}
                draggable={false}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: `rotate(${item.rotation}deg)` }}
              />
            </div>
          )}
          renderThumbnailBadge={(item) => (
            <div className="w-5 h-5 rounded-full bg-[#8B3DFF] text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
              {item.pageNumber}
            </div>
          )}
          renderPrimaryText={(item) => `Page ${item.pageNumber}`}
          renderSecondaryText={(item) => item.rotation !== 0 ? `Rotated ${item.rotation}°` : 'Not rotated'}
          actions={(item) => [
            {
              icon: <RotateCcw size={15} strokeWidth={1.8} />,
              ariaLabel: 'Rotate left',
              onClick: () => rotatePage(item.id, 'left'),
            },
            {
              icon: <RotateCw size={15} strokeWidth={1.8} />,
              ariaLabel: 'Rotate right',
              onClick: () => rotatePage(item.id, 'right'),
            },
            {
              icon: <Trash2 size={15} strokeWidth={1.8} />,
              ariaLabel: 'Remove',
              onClick: () => removePage(item.id),
              variant: 'danger',
            },
          ]}
        />
      </div>

      {/* ═══ SECTION 3: PINNED ADD MORE + SECURITY ═══ */}
      <div className="flex-shrink-0 mx-4 mt-2 mb-2">
        <button
          onClick={openFilePicker}
          className="w-full py-3 rounded-md border border-dashed border-[#DDD6FE] bg-[#FAF5FF] flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-1.5 text-[#8B3DFF]">
            <Plus size={16} strokeWidth={2.5} />
            <span className="text-[13px] font-semibold">Add more PDFs</span>
          </div>
          <p className="text-[10px] text-[#94A3B8]">PDF • Max 50 files</p>
        </button>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
          <Lock size={11} />
          Your files are 100% secure. We never store your data.
        </div>
      </div>

      {/* ═══ SECTION 4: STICKY BOTTOM BAR ═══ */}
      <div
        ref={bottomBarRef}
        className="flex-shrink-0 bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
        style={{ boxShadow: '0 -6px 20px -8px rgba(15,23,42,0.08)' }}
      >
        <button
          onClick={rotateAndPrepare}
          disabled={isProcessing || pages.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#8B3DFF] to-[#A855F7] text-white font-bold text-[16px] shadow-[0_6px_20px_-4px_rgba(139,61,255,0.5)] active:scale-[0.98] transition disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Save Rotated PDF
              <ArrowRight size={18} strokeWidth={2.2} />
            </>
          )}
        </button>
      </div>
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
    variant === 'primary' ? 'text-[#8B3DFF]'
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