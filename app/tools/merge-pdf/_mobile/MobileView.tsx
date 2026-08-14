'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useStickyBottomSpace } from '../../_hooks/useStickyBottomSpace';
import { Plus, RotateCw, Trash2, ArrowDownAZ, ArrowRight, FileText, Layers, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import MobileListView from '../../_components/MobileListView';
import ProcessingOverlay from '../../_components/ProcessingOverlay';
import { getToolByPath } from '../../_config/tools';
import { useMergePdfContext } from '../_context/MergePdfContext';

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function MobileView() {
  const {
    items,
    addPdfs,
    clearAll,
    removePdf,
    reorderPdfs,
    isLoadingPdf,
    loadProgress,
    isProcessing,
    errorMessage,
    setErrorMessage,
    pdfFilename,
    performMerge,
    downloadMerged,
    previewMerged,
    mergeResult,
    totalPages,
  } = useMergePdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const bottomSpace = useStickyBottomSpace(bottomBarRef);
  const tool = getToolByPath('/tools/merge-pdf')!;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortAsc, setSortAsc] = useState(false);
  // Local visual rotation per PDF (0 / 90 / 180 / 270) — display only.
  const [rotations, setRotations] = useState<Record<string, number>>({});

  // Keep selection in sync with items (drop ids that no longer exist).
  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set<string>();
      items.forEach(it => { if (prev.has(it.id)) next.add(it.id); });
      return next;
    });
  }, [items]);

  // Auto-show success when merge completes
  useEffect(() => {
    if (mergeResult && !isProcessing) {
      setShowSuccess(true);
    }
  }, [mergeResult, isProcessing]);

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

  const displayItems = useMemo(() => {
    if (!sortAsc) return items;
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items, sortAsc]);

  const selectedCount = selectedIds.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map(i => i.id)));
  };

  const handleDeleteSelected = () => {
    const targets = items.filter(i => selectedIds.has(i.id));
    if (targets.length === 0) return;
    if (!confirm(`Remove ${targets.length} PDF${targets.length > 1 ? 's' : ''}?`)) return;
    targets.forEach(it => removePdf(it.id));
    setSelectedIds(new Set());
  };

  const handleRotateItem = (id: string) => {
    setRotations(prev => ({ ...prev, [id]: ((prev[id] || 0) + 90) % 360 }));
  };

  const hasItems = items.length > 0;

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && mergeResult) {
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

  // ═════════ EMPTY STATE ═════════
  if (!hasItems && !isLoadingPdf) {
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
    <>
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

        {/*
          ⭐ TOP TOOLBAR — Add PDF + batch actions
        */}
        <div className="px-4 mt-3">
          <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden">
            <ActionIcon
              onClick={openFilePicker}
              ariaLabel="Add PDFs"
              variant="primary"
              icon={<Plus size={20} strokeWidth={2.2} />}
            />
            <ToolbarDivider />
            <ActionIcon
              onClick={handleDeleteSelected}
              disabled={selectedCount === 0}
              ariaLabel="Remove selected"
              variant="danger"
              icon={<Trash2 size={18} strokeWidth={2} />}
            />
          </div>
        </div>

        {/* ⭐ SELECTION HEADER */}
        <div className="mt-3 mx-4 px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg flex items-center justify-between">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2.5 active:opacity-70"
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition ${
                allSelected || selectedCount > 0
                  ? 'bg-[#2563EB]'
                  : 'border-2 border-[#CBD5E1] bg-white'
              }`}
            >
              {(allSelected || selectedCount > 0) && (
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-[13px] font-semibold text-[#0F172A]">
              {selectedCount > 0
                ? `${selectedCount} PDF${selectedCount > 1 ? 's' : ''} selected`
                : `${items.length} PDF${items.length > 1 ? 's' : ''} • ${totalPages} pages`}
            </span>
          </button>

          <button
            onClick={() => setSortAsc(v => !v)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-90 transition ${
              sortAsc
                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                : 'border-[#E2E8F0] bg-white text-[#64748B]'
            }`}
            aria-label="Sort"
          >
            <ArrowDownAZ size={15} strokeWidth={2} />
          </button>
        </div>

        {/*
          ⭐ PDF LIST (universal MobileListView)
          Reorder is enabled only when sort is NOT active — when the user
          sorts by name, drag-to-reorder is disabled to prevent conflict.
          Order badges show the merge sequence (1, 2, 3…).
        */}
        <div className="mx-4 mt-2">
          <MobileListView
            items={displayItems}
            onReorder={sortAsc ? undefined : reorderPdfs}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            accentColor="#2563EB"
            renderThumbnail={(item) => (
              <img
                src={item.firstPagePreview}
                alt={item.name}
                draggable={false}
                className="max-w-full max-h-full object-contain"
                style={{ transform: `rotate(${rotations[item.id] || 0}deg)` }}
              />
            )}
            renderThumbnailBadge={(_item, index) => (
              <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white">
                {index + 1}
              </div>
            )}
            renderPrimaryText={(item) => item.name}
            renderSecondaryText={(item) => `${item.totalPages} pages · ${item.sizeMB}`}
            actions={(item) => [
              {
                icon: <RotateCw size={15} strokeWidth={1.8} />,
                ariaLabel: 'Rotate',
                onClick: () => handleRotateItem(item.id),
              },
              {
                icon: <Trash2 size={15} strokeWidth={1.8} />,
                ariaLabel: 'Remove',
                onClick: () => removePdf(item.id),
                variant: 'danger',
              },
            ]}
          />
        </div>

        {/* ⭐ ADD MORE PDFs — same size as list rows */}
        <div className="mx-4 mt-2.5">
          <button
            onClick={openFilePicker}
            className="w-full py-3 rounded-lg border border-dashed border-[#BFDBFE] bg-[#F5F9FF] flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] active:bg-[#EFF6FF] transition"
          >
            <div className="flex items-center gap-1.5 text-[#2563EB]">
              <Plus size={16} strokeWidth={2.5} />
              <span className="text-[13px] font-semibold">Add more PDFs</span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">PDF • Max 50 files</p>
          </button>
        </div>

        {/* Security footer */}
        <div className="mt-3 mb-1 px-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
          <Lock size={11} />
          Your files are 100% secure. We never store your data.
        </div>

        {/*
          ⭐ STICKY BOTTOM — Merge button
        */}
        <div
          ref={bottomBarRef}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
          style={{ boxShadow: '0 -6px 20px -8px rgba(15,23,42,0.08)' }}
        >
          {/* Merge button */}
          <button
            onClick={handleMerge}
            disabled={isProcessing || items.length < 2}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white font-bold text-[16px] shadow-[0_6px_20px_-4px_rgba(79,70,229,0.5)] active:scale-[0.98] transition disabled:opacity-60"
          >
            {isProcessing
              ? 'Merging...'
              : `Merge ${items.length} PDF${items.length !== 1 ? 's' : ''}`}
            {!isProcessing && <ArrowRight size={18} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isProcessing}
        stage="merging"
        progress={50}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ActionIcon — Row 1 icon button
// Just an icon centered in a flex-1 slot. No labels, no borders.
// ═══════════════════════════════════════════════════════════════
function ActionIcon({
  onClick,
  disabled,
  ariaLabel,
  icon,
  variant = 'default',
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger';
}) {
  const colorClass =
    variant === 'primary'
      ? 'text-[#6366F1]'
      : variant === 'danger'
      ? 'text-[#EF4444]'
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

// ═══════════════════════════════════════════════════════════════
// ToolbarDivider — thin vertical line between Row 1 icons
// ═══════════════════════════════════════════════════════════════
function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#E2E8F0] flex-shrink-0" />;
}