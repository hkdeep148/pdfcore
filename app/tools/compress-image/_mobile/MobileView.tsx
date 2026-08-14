'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, ArrowRight, Image as ImageIcon, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import MobileListView from '../../_components/MobileListView';
import MobileLoadingScreen from '../../_components/MobileLoadingScreen';
import MobileCompressingScreen from '../../_components/MobileCompressingScreen';
import ComparisonSlider from '../ComparisonSlider';
import { getToolByPath } from '../../_config/tools';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useCompressImageContext } from '../_context/CompressImageContext';
import { formatBytes } from '../../_utils/browser';
import MobileSettingsSheet from './MobileSettingsSheet';
import MobileActionBar from './MobileActionBar';

export default function MobileView() {
  const {
    files,
    handleFiles,
    handleRemoveFile,
    handleClearAll,
    handleDownloadSingle,
    handleDownloadAll,
    processing,
    isLoading,
    loadingFadeOut,
    error,
    setError,
    comparingFile,
    setComparingFile,
    completedCount,
    hasCompleted,
    totalOriginalSize,
    totalCompressedSize,
    totalReduction,
  } = useCompressImageContext();

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/compress-image')!;

  // Auto-show success screen when compression completes
  useEffect(() => {
    if (hasCompleted && !processing && completedCount === files.length && files.length > 0) {
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasCompleted, processing, completedCount, files.length]);

  // Auto-scroll to bottom when files added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [files.length]);

  // Keep selection in sync with files
  useEffect(() => {
    setSelectedIds(prev => {
      const next = new Set<string>();
      files.forEach(f => { if (prev.has(f.id)) next.add(f.id); });
      return next;
    });
  }, [files]);

  useToolFileReceiver((received: File[]) => handleFiles(received));

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const fileList = e.target.files;
  if (!fileList || fileList.length === 0) {
    e.target.value = '';
    return;
  }

  // Filter out any files that aren't valid images (Samsung Gallery sometimes returns weird files)
  const validFiles = Array.from(fileList).filter(file => {
    // Check MIME type
    if (!file.type.startsWith('image/')) {
      return false;
    }
    // Check file size > 0
    if (file.size === 0) {
      return false;
    }
    return true;
  });

  if (validFiles.length === 0) {
    setError('No valid image files selected. Please try again from Files or Photos.');
    e.target.value = '';
    return;
  }

  if (validFiles.length < fileList.length) {
    setError(`${fileList.length - validFiles.length} file(s) skipped (invalid format).`);
  }

  handleFiles(validFiles);
  e.target.value = '';
};

  const openFilePicker = () => fileInputRef.current?.click();
  const handleStartOver = () => { handleClearAll(); setShowSuccess(false); };

  const selectedCount = selectedIds.size;
  const allSelected = files.length > 0 && selectedCount === files.length;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(files.map(f => f.id)));
  };

  const handleDeleteSelected = () => {
    const targets = files.filter(f => selectedIds.has(f.id));
    if (targets.length === 0) return;
    if (!confirm(`Remove ${targets.length} image${targets.length > 1 ? 's' : ''}?`)) return;
    targets.forEach(f => handleRemoveFile(f.id));
    setSelectedIds(new Set());
  };

  const isTransitioningToSuccess =
    hasCompleted && completedCount === files.length && files.length > 0 && !showSuccess;

  const screen: 'loading' | 'compressing' | 'main' =
    isLoading ? 'loading'
    : processing || isTransitioningToSuccess ? 'compressing'
    : 'main';

  // ═════════ LOADING / COMPRESSING ═════════
  if (screen === 'loading' || screen === 'compressing') {
    return (
      <div className="flex-1 flex flex-col bg-white min-h-0">
        <AnimatePresence mode="wait">
          {screen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <MobileLoadingScreen
                fadeOut={loadingFadeOut}
                title="Preparing your images"
                subtitle="Setting up the compressor"
              />
            </motion.div>
          )}
          {screen === 'compressing' && (
            <motion.div
              key="compressing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <MobileCompressingScreen
                title="Compressing images"
                subtitle="This will only take a moment..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && hasCompleted && files[0]?.compressed && files[0]?.compressedSize) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Compress Image"
        toolColor="#F59E0B"
        onBack={handleStartOver}
        title={completedCount === 1 ? 'Image Compressed!' : `${completedCount} Images Compressed!`}
        subtitle={completedCount === 1 ? 'Your image is ready to download' : 'Your images are ready to download'}
        filename={files[0].original.name}
        files={files.map((f) => ({
          id: f.id,
          name: f.original.name,
          size: formatBytes(f.compressedSize || f.original.size || 0),
          onDownload: () => handleDownloadSingle(f),
        }))}
        compressionStats={{
          originalSize: formatBytes(totalOriginalSize),
          compressedSize: formatBytes(totalCompressedSize),
          savedPercentage: totalReduction,
          savedBytes: formatBytes(totalOriginalSize - totalCompressedSize),
          format: files[0].compressed?.type.split('/')[1]?.toUpperCase(),
        }}
        downloadLabel={completedCount === 1 ? 'Download Image' : `Download All (${completedCount}) as ZIP`}
        onDownload={handleDownloadAll}
        onPreview={
          files[0].compressedUrl
            ? () => window.open(files[0].compressedUrl!, '_blank')
            : undefined
        }
        onStartOver={handleStartOver}
      />
    );
  }

  // ═════════ EMPTY STATE ═════════
  if (files.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
<input
  ref={fileInputRef}
  type="file"
  className="hidden"
  onChange={handleFileChange}
  multiple
  accept="application/octet-stream,image/*"
/>
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      </div>
    );
  }

  // ═════════ MAIN VIEW ═════════
  return (
    <>
      <div className="flex-1 flex flex-col bg-white min-h-0">
<input
  ref={fileInputRef}
  type="file"
  className="hidden"
  onChange={handleFileChange}
  multiple
  accept="application/octet-stream,image/*"
/>

        {/* ═══ SECTION 1: FIXED TOP ═══ */}
        <div className="flex-shrink-0">
          {error && (
            <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
              <span className="text-[13px] text-red-600 font-medium">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 text-xl leading-none">×</button>
            </div>
          )}

          {/* TOP TOOLBAR */}
          <div className="px-3 mt-3">
            <div className="flex items-center rounded-md bg-white border border-[#E2E8F0] min-w-0 overflow-hidden">
              <ActionIcon onClick={openFilePicker} ariaLabel="Add images" variant="primary" icon={<Plus size={20} strokeWidth={2.2} />} />
              <ToolbarDivider />
              <ActionIcon onClick={handleDeleteSelected} disabled={selectedCount === 0} ariaLabel="Remove" variant="danger" icon={<Trash2 size={18} strokeWidth={2} />} />
            </div>
          </div>

          {/* SELECTION HEADER */}
          <div className="mt-4 mx-4 px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] border-b-0 rounded-t-lg flex items-center justify-between">
            <button onClick={toggleSelectAll} className="flex items-center gap-2.5 active:opacity-70">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition ${
                allSelected ? 'bg-[#F59E0B]' : selectedCount > 0 ? 'bg-[#F59E0B]' : 'border-2 border-[#CBD5E1] bg-white'
              }`}>
                {allSelected && <Check size={13} className="text-white" strokeWidth={3} />}
                {!allSelected && selectedCount > 0 && <div className="w-2.5 h-0.5 bg-white rounded" />}
              </div>
              <span className="text-[13px] font-semibold text-[#0F172A]">
                {selectedCount > 0
                  ? `${selectedCount} image${selectedCount > 1 ? 's' : ''} selected`
                  : `${files.length} image${files.length > 1 ? 's' : ''}`}
              </span>
            </button>
            {hasCompleted && (
              <span className="text-[11px] font-semibold text-[#F59E0B] bg-[#FEF3C7] px-2 py-1 rounded-full">
                {completedCount} compressed
              </span>
            )}
          </div>
        </div>

        {/* ═══ SECTION 2: SCROLLABLE FILE LIST ═══ */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 mx-4">
          <MobileListView
            items={files}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            accentColor="#F59E0B"
            renderThumbnail={(file: any) => (
              <img
                src={file.originalUrl}
                alt={file.original.name}
                draggable={false}
                className="max-w-full max-h-full object-cover w-full h-full"
              />
            )}
            onThumbnailTap={(file: any) => {
              if (file.compressedUrl && file.compressedSize) {
                setComparingFile(file);
              }
            }}
            renderPrimaryText={(file: any) => file.original.name}
            renderSecondaryText={(file: any) => {
              if (file.compressedSize) {
                return `${formatBytes(file.original.size)} → ${formatBytes(file.compressedSize)} (-${file.reduction || 0}%)`;
              }
              return formatBytes(file.original.size);
            }}
            actions={(file: any) => [
              {
                icon: <Trash2 size={15} strokeWidth={1.8} />,
                ariaLabel: 'Remove',
                onClick: () => handleRemoveFile(file.id),
                variant: 'danger',
              },
            ]}
          />
        </div>

        {/* ═══ SECTION 3: PINNED ADD MORE + SECURITY ═══ */}
        <div className="flex-shrink-0 mx-4 mt-2 mb-2">
          <button
            onClick={openFilePicker}
            className="w-full py-3 rounded-md border border-dashed border-[#FCD34D] bg-[#FFFBEB] flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-1.5 text-[#F59E0B]">
              <Plus size={16} strokeWidth={2.5} />
              <span className="text-[13px] font-semibold">Add more images</span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">JPG, PNG, WEBP • Multiple files supported</p>
          </button>

          <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
            <Lock size={11} />
            Your files are 100% secure. We never store your data.
          </div>
        </div>

        {/* ═══ SECTION 4: STICKY BOTTOM (Settings sheet + Action bar) ═══ */}
        <div className="flex-shrink-0">
          <MobileSettingsSheet />
          <MobileActionBar barRef={bottomBarRef} />
        </div>
      </div>

      {/* Comparison Modal */}
      {comparingFile && comparingFile.compressedUrl && comparingFile.compressedSize && (
        <ComparisonSlider
          originalUrl={comparingFile.originalUrl}
          compressedUrl={comparingFile.compressedUrl}
          originalSize={comparingFile.originalSize}
          compressedSize={comparingFile.compressedSize}
          reduction={comparingFile.reduction || 0}
          filename={comparingFile.original.name}
          onClose={() => setComparingFile(null)}
        />
      )}
    </>
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
    variant === 'primary' ? 'text-[#F59E0B]'
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