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

// Full labels used inside the dropdown cells.
const MARGIN_SHORT: Record<Margins, string> = {
  None: 'None',
  Small: 'Small',
  Normal: 'Normal',
  Large: 'Large',
};
const ORIENTATION_SHORT: Record<Orientation, string> = {
  Portrait: 'Portrait',
  Landscape: 'Landscape',
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
      <div className="min-h-screen bg-white overflow-x-hidden">
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
    <div className="min-h-screen bg-white pb-[240px] overflow-x-hidden">
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



      {/*
        ⭐ TOP TOOLBAR — Row 1 only (Actions)
        The dropdown row was moved to the sticky bottom bar so the
        primary options sit next to the "Create PDF" button.
      */}
      <div className="px-3 mt-3">
        <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden">
          <ActionIcon
            onClick={openFilePicker}
            ariaLabel="Add images"
            variant="primary"
            icon={<Plus size={20} strokeWidth={2.2} />}
          />
          <ToolbarDivider />
          <ActionIcon
            onClick={handleRotateLeft}
            disabled={images.length === 0}
            ariaLabel="Rotate left"
            icon={<RotateCcw size={18} strokeWidth={2} />}
          />
          <ToolbarDivider />
          <ActionIcon
            onClick={handleRotateRight}
            disabled={images.length === 0}
            ariaLabel="Rotate right"
            icon={<RotateCw size={18} strokeWidth={2} />}
          />
          <ToolbarDivider />
          <ActionIcon
            onClick={handleDeleteSelected}
            disabled={selectedCount === 0}
            ariaLabel="Remove"
            variant="danger"
            icon={<Trash2 size={18} strokeWidth={2} />}
          />
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

      {/*
        ⭐ STICKY BOTTOM
        Contents (top → bottom):
          1. Dropdowns row (Size / Orientation / Margin)
          2. Create-separate-PDFs toggle
          3. Create PDF button
      */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]"
        style={{ boxShadow: '0 -6px 20px -8px rgba(15,23,42,0.08)' }}
      >
        {/* Dropdowns — sits right above the toggle and Create button */}
        <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden mb-3">
          <ChipCell
            label="Size"
            value={pageSize}
            onClick={() => setSheet('size')}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            }
          />
          <ToolbarDivider />
          <ChipCell
            label="Orientation"
            value={ORIENTATION_SHORT[orientation]}
            onClick={() => setSheet('orientation')}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="3" width="12" height="18" rx="1.5" />
                <line x1="9" y1="7" x2="15" y2="7" />
              </svg>
            }
          />
          <ToolbarDivider />
          <ChipCell
            label="Margin"
            value={MARGIN_SHORT[margins]}
            onClick={() => setSheet('margin')}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1.5" />
                <rect x="7" y="7" width="10" height="10" rx="0.5" strokeDasharray="2 2" />
              </svg>
            }
          />
        </div>

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
// and between Row 2 dropdown cells.
// ═══════════════════════════════════════════════════════════════
function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#E2E8F0] flex-shrink-0" />;
}

// ═══════════════════════════════════════════════════════════════
// ChipCell — Row 2 dropdown cell (lives inside a bordered row)
// Layout: [icon] [value ▾]
//              [ label   ]
// No individual border or shadow — the parent container provides
// the border, and ToolbarDivider elements separate the cells.
// ═══════════════════════════════════════════════════════════════
function ChipCell({
  label,
  value,
  onClick,
  icon,
}: {
  label: string;
  value: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 min-w-0 flex items-center gap-2 py-2.5 px-2.5 bg-white active:bg-[#F8FAFC] active:scale-[0.98] transition"
    >
      {/* Left icon */}
      <span className="w-4 h-4 text-[#6366F1] flex-shrink-0">{icon}</span>

      {/* Right stacked text */}
      <div className="flex-1 min-w-0 flex flex-col items-start leading-tight">
        <div className="flex items-center gap-0.5 max-w-full">
          <span className="text-[12px] font-bold text-[#0F172A] truncate">
            {value}
          </span>
          <ChevronDown
            size={11}
            className="text-[#94A3B8] flex-shrink-0"
            strokeWidth={2}
          />
        </div>
        <span className="text-[9px] font-medium text-[#94A3B8] truncate max-w-full mt-0.5">
          {label}
        </span>
      </div>
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