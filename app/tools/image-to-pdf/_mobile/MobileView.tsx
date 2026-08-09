'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import {
  Plus, RotateCw, RotateCcw, Trash2, ChevronDown, Check,
  ArrowDownAZ, ArrowRight, GripVertical, FileText, Lock,
} from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import ImagePreviewModal from '../_components/ImagePreviewModal';
import { getToolByPath } from '../../_config/tools';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import OptionSheet, { OptionItem } from './OptionSheet';
import type { ImageItem, PageSize, Orientation, Margins } from '../../_types';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const PAGE_SIZE_OPTIONS: OptionItem<PageSize>[] = [
  { id: 'A4',     label: 'A4',     hint: '210 × 297 mm' },
  { id: 'A3',     label: 'A3',     hint: '297 × 420 mm' },
  { id: 'A5',     label: 'A5',     hint: '148 × 210 mm' },
  { id: 'Letter', label: 'Letter', hint: '8.5 × 11 in'  },
  { id: 'Legal',  label: 'Legal',  hint: '8.5 × 14 in'  },
];
const ORIENTATION_OPTIONS: OptionItem<Orientation | 'Auto'>[] = [
  { id: 'Auto', label: 'Auto' },
  { id: 'Portrait',  label: 'Portrait'  },
  { id: 'Landscape', label: 'Landscape' },
];
const MARGIN_OPTIONS: OptionItem<Margins>[] = [
  { id: 'None',   label: 'None'   },
  { id: 'Small',  label: 'Small'  },
  { id: 'Normal', label: 'Normal' },
  { id: 'Large',  label: 'Large'  },
];

// CHANGED: shortened labels so the mobile toolbar fits on 360px screens
// without horizontal overflow. Full labels appear inside the OptionSheet.
const MARGIN_SHORT: Record<Margins, string> = {
  None: 'None',
  Small: 'Sm',
  Normal: 'Md',
  Large: 'Lg',
};
const ORIENTATION_SHORT: Record<Orientation, string> = {
  Portrait: 'Port',
  Landscape: 'Land',
};
// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function MobileView() {
  const {
    images, addImages, removeImage, rotateImage, reorderImages,
    createPdf, downloadPdf, previewPdf,
    isConverting, isReady, lastPdfSize, pdfFilename,
    errorMessage, setErrorMessage, clearAll,
    pageSize, setPageSize, orientation, setOrientation,
    margins, setMargins,
    updateImageSize,
    createSeparate, setCreateSeparate, isZip,
  } = useImageToPdfContext();

  const [showSuccess, setShowSuccess] = useState(false);
  const [sheet, setSheet] = useState<null | 'size' | 'orientation' | 'margin'>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortAsc, setSortAsc] = useState(false);
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageName: string;
  }>({
    isOpen: false,
    imageUrl: '',
    imageName: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/image-to-pdf')!;

  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set<string>();
      images.forEach(img => { if (prev.has(img.id)) next.add(img.id); });
      return next;
    });
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addImages(Array.from(e.target.files));
    e.target.value = '';
  };
  const openFilePicker = () => fileInputRef.current?.click();
  const hasImages = images.length > 0;

  const handlePreviewImage = (imageUrl: string, imageName: string) => {
    setPreviewState({ isOpen: true, imageUrl, imageName });
  };

  const handleOrientationChange = (value: string | Orientation | 'Auto') => {
    if (value === 'Auto') {
      images.forEach(img => {
        const autoOrientation = img.width > img.height ? 'Landscape' : 'Portrait';
        updateImageSize(img.id, pageSize, autoOrientation);
      });
    } else {
      setOrientation(value as Orientation);
    }
  };

  const displayImages = useMemo(() => {
    if (!sortAsc) return images;
    return [...images].sort((a, b) => a.file.name.localeCompare(b.file.name));
  }, [images, sortAsc]);

  const selectedCount = selectedIds.size;
  const allSelected = images.length > 0 && selectedCount === images.length;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(images.map(i => i.id)));
  };

  const targetsForBatch = (): ImageItem[] =>
    selectedCount > 0 ? images.filter(i => selectedIds.has(i.id)) : images;

  const handleRotateLeft = () => {
    targetsForBatch().forEach(img => rotateImage(img.id, 'left'));
  };
  const handleRotateRight = () => {
    targetsForBatch().forEach(img => rotateImage(img.id, 'right'));
  };
  const handleDeleteSelected = () => {
    const targets = images.filter(i => selectedIds.has(i.id));
    if (targets.length === 0) return;
    if (!confirm(`Remove ${targets.length} image${targets.length > 1 ? 's' : ''}?`)) return;
    targets.forEach(img => removeImage(img.id));
    setSelectedIds(new Set());
  };

  const handleCreatePdf = async () => {
    const url = await createPdf();
    if (url) setShowSuccess(true);
  };
  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
    setSelectedIds(new Set());
  };

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && isReady) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Image to PDF"
        toolColor="#2563EB"
        onBack={handleStartOver}
        title={isZip ? 'ZIP Created!' : 'PDF Created!'}
        subtitle={
          isZip
            ? `${images.length} PDFs bundled into a ZIP file.`
            : images.length === 1
              ? 'Your image has been converted to PDF.'
              : `${images.length} images have been converted to PDF.`
        }
        files={[{
          id: 'created-pdf',
          name: isZip ? `${pdfFilename}.zip` : `${pdfFilename}.pdf`,
          size: lastPdfSize || '—',
          pages: images.length,
        }]}
        onPreview={previewPdf}
        summaryTitle="Conversion Summary"
        summaryRows={[
          {
            icon: <FileText size={13} />, iconBg: '#DBEAFE', iconColor: '#2563EB',
            label: 'Total Images', value: `${images.length}`,
          },
          {
            icon: <FileText size={13} />, iconBg: '#DBEAFE', iconColor: '#3B82F6',
            label: isZip ? 'Output Type' : 'Page Size',
            value: isZip ? `${images.length} PDFs (ZIP)` : `${pageSize} • ${orientation}`,
          },
          {
            icon: <FileText size={13} />, iconBg: '#D1FAE5', iconColor: '#10B981',
            label: isZip ? 'ZIP Size' : 'File Size',
            value: lastPdfSize || '—', valueColor: '#10B981',
          },
        ]}
        downloadLabel={isZip ? 'Download ZIP' : 'Download PDF'}
        onDownload={downloadPdf}
        onStartOver={handleStartOver}
      />
    );
  }

  // ═════════ EMPTY STATE ═════════
  if (!hasImages) {
    return (
      /*
       * CHANGED: pt-[64px] → pt-[72px]
       * The old MobileToolNavbar was fixed at 64px height.
       * The universal LandingNavbar is sticky at 72px height.
       * This div is only rendered on mobile (lg:hidden wraps the entire
       * MobileView call site), so desktop is unaffected.
       */
      <div className="min-h-screen bg-white pt-[72px] overflow-x-hidden">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/webp"
        />
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      </div>
    );
  }

  // ═════════ MAIN VIEW ═════════
  return (
    /*
     * CHANGED: pt-[64px] → pt-[72px]
     * Same reason as above — universal navbar is 72px not 64px.
     */
    <div className="min-h-screen bg-white pb-[160px] pt-[72px] overflow-x-hidden">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />

      {/* Error */}
      {errorMessage && (
        <div className="mx-4 mb-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ⭐ INLINE TOOLBAR */}
      <div className="px-3 mt-3">
        {/*
  CHANGED: min-w-0 and reduced gap prevents children from forcing
  container wider than viewport on small screens.
*/}
<div className="flex items-center justify-between gap-1 p-2 rounded-lg bg-white border border-[#EEF1F5] min-w-0 overflow-hidden">
          {/* + Add */}
          <button
            onClick={openFilePicker}
            aria-label="Add images"
            className="w-9 h-9 flex-shrink-0 rounded-md bg-[#4F46E5] text-white flex items-center justify-center active:scale-95 active:bg-[#4338CA] transition"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          {/* Rotate Left */}
          <button
            onClick={handleRotateLeft}
            disabled={images.length === 0}
            aria-label="Rotate left"
            className="w-9 h-9 flex-shrink-0 rounded-md bg-white border border-[#EEF1F5] text-[#0F172A] flex items-center justify-center active:bg-[#F8FAFC] active:scale-95 transition disabled:opacity-40"
          >
            <RotateCcw size={16} strokeWidth={2} />
          </button>

          {/* Rotate Right */}
          <button
            onClick={handleRotateRight}
            disabled={images.length === 0}
            aria-label="Rotate right"
            className="w-9 h-9 flex-shrink-0 rounded-md bg-white border border-[#EEF1F5] text-[#0F172A] flex items-center justify-center active:bg-[#F8FAFC] active:scale-95 transition disabled:opacity-40"
          >
            <RotateCw size={16} strokeWidth={2} />
          </button>

          {/* Delete */}
          <button
            onClick={handleDeleteSelected}
            disabled={selectedCount === 0}
            aria-label="Delete selected"
            className="w-9 h-9 flex-shrink-0 rounded-md bg-white border border-[#EEF1F5] text-[#EF4444] flex items-center justify-center active:bg-[#FEF2F2] active:scale-95 transition disabled:opacity-40"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-[#E2E8F0] mx-1 flex-shrink-0" />

          {/* Dropdowns */}
          <ToolbarChip label={pageSize} onClick={() => setSheet('size')} />
          <ToolbarChip
            label={ORIENTATION_SHORT[orientation]}
            onClick={() => setSheet('orientation')}
          />
          <ToolbarChip label={MARGIN_SHORT[margins]} onClick={() => setSheet('margin')} />
        </div>
      </div>

      {/* ⭐ SELECTION HEADER */}
      <div className="mt-4 mx-4 px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] border-b-0 rounded-t-lg flex items-center justify-between">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-2.5 active:opacity-70"
        >
          <div
            className={`w-5 h-5 rounded flex items-center justify-center transition ${
              allSelected
                ? 'bg-[#2563EB]'
                : selectedCount > 0
                  ? 'bg-[#2563EB]'
                  : 'border-2 border-[#CBD5E1] bg-white'
            }`}
          >
            {allSelected && (
              <Check size={13} className="text-white" strokeWidth={3} />
            )}
            {!allSelected && selectedCount > 0 && (
              <div className="w-2.5 h-0.5 bg-white rounded" />
            )}
          </div>
          <span className="text-[13px] font-semibold text-[#0F172A]">
            {selectedCount > 0
              ? `${selectedCount} image${selectedCount > 1 ? 's' : ''} selected`
              : `${images.length} image${images.length > 1 ? 's' : ''}`}
          </span>
        </button>

        <button
          onClick={() => setSortAsc(v => !v)}
          className={`w-8 h-8 rounded-lg border flex items-center justify-center active:scale-95 transition ${
            sortAsc
              ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
              : 'border-[#E2E8F0] bg-white text-[#64748B]'
          }`}
          aria-label="Sort"
        >
          <ArrowDownAZ size={16} strokeWidth={2} />
        </button>
      </div>

      {/* ⭐ IMAGE LIST */}
      <div className="mx-4 border border-[#F1F5F9] rounded-b-lg overflow-hidden">
        <Reorder.Group
          axis="y"
          values={displayImages}
          onReorder={sortAsc ? () => {} : reorderImages}
          className="list-none p-0 m-0"
        >
          {displayImages.map((item, index) => (
            <ImageRow
              key={item.id}
              item={item}
              index={index}
              selected={selectedIds.has(item.id)}
              onToggleSelect={() => toggleSelect(item.id)}
              onRotate={() => rotateImage(item.id, 'right')}
              onRemove={() => removeImage(item.id)}
              onPreview={() => handlePreviewImage(item.preview, item.file.name)}
              dragEnabled={!sortAsc}
            />
          ))}
        </Reorder.Group>
      </div>

      {/* ⭐ ADD MORE IMAGES */}
      <div className="mx-4 mt-3">
        <button
          onClick={openFilePicker}
          className="w-full py-3 rounded-md border border-dashed border-[#BFDBFE] bg-[#F5F9FF] flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] transition"
        >
          <div className="flex items-center gap-1.5 text-[#2563EB]">
            <Plus size={16} strokeWidth={2.5} />
            <span className="text-[13px] font-semibold">Add more images</span>
          </div>
          <p className="text-[10px] text-[#94A3B8]">JPG, PNG, WEBP • Max 50 images</p>
        </button>
      </div>

      {/* Security footer */}
      <div className="mt-4 px-4 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
        <Lock size={11} />
        Your files are 100% secure. We never store your data.
      </div>

      {/* ⭐ STICKY BOTTOM — Toggle + Create button */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
        style={{ boxShadow: '0 -6px 20px -8px rgba(15,23,42,0.08)' }}
      >
        {/* Toggle — above button */}
        <div className="flex items-center justify-between px-1 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#0F172A]">
              Create separate PDFs
            </span>
            {images.length > 1 && createSeparate && (
              <span className="text-[11px] text-[#94A3B8]">({images.length} files)</span>
            )}
          </div>
          <button
            onClick={() => setCreateSeparate(!createSeparate)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
              createSeparate ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'
            }`}
            aria-label="Toggle separate PDFs"
            role="switch"
            aria-checked={createSeparate}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                createSeparate ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Create button */}
        <button
          onClick={handleCreatePdf}
          disabled={isConverting || images.length === 0}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-[#2563EB] text-white font-bold text-[16px] shadow-[0_6px_20px_-4px_rgba(37,99,235,0.5)] active:scale-[0.98] transition disabled:opacity-60"
        >
          {isConverting
            ? (createSeparate ? 'Creating ZIP...' : 'Creating...')
            : (createSeparate ? 'Create ZIP' : 'Create PDF')}
          {!isConverting && <ArrowRight size={18} strokeWidth={2.2} />}
        </button>
      </div>

      {/* Sheets */}
      <OptionSheet
        open={sheet === 'size'}
        title="Page Size"
        options={PAGE_SIZE_OPTIONS}
        value={pageSize}
        onChange={(v) => { setPageSize(v); setSheet(null); }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        open={sheet === 'orientation'}
        title="Orientation"
        options={ORIENTATION_OPTIONS}
        value={orientation}
        onChange={(v) => { handleOrientationChange(v); setSheet(null); }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        open={sheet === 'margin'}
        title="Page Margin"
        options={MARGIN_OPTIONS}
        value={margins}
        onChange={(v) => { setMargins(v); setSheet(null); }}
        onClose={() => setSheet(null)}
      />

      <ImagePreviewModal
        isOpen={previewState.isOpen}
        imageUrl={previewState.imageUrl}
        imageName={previewState.imageName}
        onClose={() => setPreviewState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ToolbarChip — dropdown pill
// ═══════════════════════════════════════════════════════════════
function ToolbarChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 h-9 flex items-center gap-1 px-2.5 rounded-md bg-white border border-[#EEF1F5] text-[12px] text-[#0F172A] font-medium active:bg-[#F8FAFC] transition"
    >
      <span className="whitespace-nowrap">{label}</span>
      <ChevronDown size={12} className="text-[#94A3B8] flex-shrink-0" strokeWidth={2} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// ImageRow
// ═══════════════════════════════════════════════════════════════
interface ImageRowProps {
  item: ImageItem;
  index: number;
  selected: boolean;
  onToggleSelect: () => void;
  onRotate: () => void;
  onRemove: () => void;
  onPreview: () => void;
  dragEnabled: boolean;
}

function ImageRow({
  item, selected, onToggleSelect, onRotate, onRemove, onPreview, dragEnabled,
}: ImageRowProps) {
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      style={{
        position: 'relative',
        zIndex: isDragging ? 40 : 0,
        boxShadow: isDragging ? '0 12px 32px rgba(0,0,0,0.12)' : 'none',
        backgroundColor: '#ffffff',
      }}
      whileDrag={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="border-b border-[#F1F5F9] px-3 py-2.5 flex items-center gap-2"
    >
      <div
        onPointerDown={(e) => {
          if (!dragEnabled) return;
          e.preventDefault();
          dragControls.start(e);
        }}
        className={`w-5 flex items-center justify-center py-2 -my-2 text-[#CBD5E1] ${
          dragEnabled ? 'cursor-grab active:cursor-grabbing touch-none' : 'opacity-30'
        }`}
        style={{ touchAction: dragEnabled ? 'none' : 'auto' }}
        aria-label="Reorder"
      >
        <GripVertical size={16} strokeWidth={2} />
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
        onPointerDown={(e) => e.stopPropagation()}
        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition ${
          selected ? 'bg-[#2563EB]' : 'border-2 border-[#CBD5E1] bg-white'
        }`}
        aria-label="Select"
      >
        {selected && <Check size={13} className="text-white" strokeWidth={3} />}
      </button>

      <div
        className="flex-shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition"
        style={{ width: 34, height: 44 }}
        onClick={(e) => { e.stopPropagation(); onPreview(); }}
      >
        <img
          src={item.preview}
          alt=""
          draggable={false}
          className="max-w-full max-h-full object-contain select-none"
          style={{ transform: `rotate(${item.rotation}deg)` }}
        />
      </div>

      <div className="flex-1 min-w-0 ml-1">
        <p className="text-[13px] font-medium text-[#0F172A] truncate leading-tight">
          {item.file.name}
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5">{item.sizeMB}</p>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onRotate(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] active:bg-[#F1F5F9] transition"
          aria-label="Rotate"
        >
          <RotateCw size={15} strokeWidth={1.8} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] active:bg-[#FEF2F2] active:text-[#EF4444] transition"
          aria-label="Delete"
        >
          <Trash2 size={15} strokeWidth={1.8} />
        </button>
      </div>
    </Reorder.Item>
  );
}