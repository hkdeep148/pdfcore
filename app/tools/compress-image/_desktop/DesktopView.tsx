'use client';

import { useRef, useState } from 'react';
import ImageGalleryViewer, { GalleryImage } from '../ImageGalleryViewer';
import { Upload, Trash2 } from 'lucide-react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import DesktopUploadPage from '../../_components/DesktopUploadPage';
import ComparisonSlider from '../ComparisonSlider';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import DesktopLoadingScreen from '../../_components/DesktopLoadingScreen';
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { formatBytes } from '../../_utils/browser';
import {
  useCompressImageContext,
  type FileStatus,
} from '../_context/CompressImageContext';
import { buildCompressImageV2Config } from '../../_config/successScreenConfigs';

import SettingsPanel from './SettingsPanel';
import ActionButton from './ActionButton';
import FileListPanel from './FileListPanel';

export default function DesktopView() {
  const {
    // Files
    files,
    handleFiles,
    handleClearAll,
    handleRemoveFile,
    handleDownloadSingle,
    handleDownloadAll,
    // Processing
    isLoading,
    loadingFadeOut,
    processing,
    // UI
    comparingFile,
    setComparingFile,
    // Derived — for success screen
    completedCount,
    totalOriginalSize,
    totalCompressedSize,
    totalReduction,
  } = useCompressImageContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useToolFileReceiver((received: File[]) => handleFiles(received));

  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) handleFiles(Array.from(selected));
    e.target.value = '';
  };

  // ⭐ Check if all files are done processing
  const allDone = files.length > 0 && files.every((f) => f.status === 'done');
  const anyProcessing = files.some((f) => f.status === 'compressing');

  // ⭐ Loading screen hook
  const showProcessing = useToolLoadingScreen(anyProcessing, allDone, 1800);

  // ⭐ Detect format from first completed file (using 'compressed' — not compressedBlob)
  const detectFormat = (): string => {
    const firstDone = files.find(
      (f): f is FileStatus & { compressed: Blob } =>
        f.status === 'done' && !!f.compressed
    );
    if (!firstDone) return 'IMG';
    const type = firstDone.compressed.type;
    if (type.includes('jpeg') || type.includes('jpg')) return 'JPG';
    if (type.includes('png')) return 'PNG';
    if (type.includes('webp')) return 'WEBP';
    return 'IMG';
  };

  // ============ UPLOAD SCREEN ============
  if (files.length === 0) {
    return (
      <DesktopUploadPage
        toolName="Compress Images"
        toolAccent="Images"
        toolDescription="Reduce image file size while keeping quality. Everything runs in your browser — your files never leave your device."
        supportedFormats="JPG, PNG, WEBP"
        maxSizeMB={50}
        multiple={true}
        buttonText="Choose Images"
        fileType="image"
        onFilesSelected={handleFiles}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎨 PROCESSING SCREEN (while compressing)
  // ═══════════════════════════════════════════════════════════════
  if (showProcessing) {
    return (
      <DesktopProcessingScreen
        title={files.length === 1 ? 'Compressing image' : 'Compressing images'}
        subtitle={`Optimizing ${files.length} ${files.length === 1 ? 'image' : 'images'}...`}
        fileCount={files.length}
        gradientFrom="#0EA5E9"
        gradientTo="#3B82F6"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
        icon={
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        }
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎊 SUCCESS SCREEN (V2 — all files compressed)
  // ═══════════════════════════════════════════════════════════════
  if (allDone) {
    const doneFiles = files.filter((f) => f.status === 'done');

// ⭐ Prepare gallery images
const galleryImages: GalleryImage[] = doneFiles.map((f) => ({
  id: f.original.name + f.original.size,
  name: f.original.name,
  url: f.compressedUrl || f.originalUrl,
  originalUrl: f.originalUrl,
  originalSize: formatBytes(f.originalSize),
  compressedSize: formatBytes(f.compressedSize || 0),
  reductionPercent: f.reduction || 0,
  onDownload: () => handleDownloadSingle(f),
}));

const config = buildCompressImageV2Config({
  totalOriginalSize: formatBytes(totalOriginalSize),
  totalCompressedSize: formatBytes(totalCompressedSize),
  totalReductionPercent: totalReduction,
  format: detectFormat(),
  files: doneFiles.map((f) => ({
    id: f.original.name + f.original.size,
    name: f.original.name,
    originalSize: formatBytes(f.originalSize),
    compressedSize: formatBytes(f.compressedSize || 0),
    reductionPercent: f.reduction || 0,
    onDownload: () => handleDownloadSingle(f),
    onCompare: () => setComparingFile(f),
  })),
  onDownloadAll: handleDownloadAll,
  onStartOver: handleClearAll,
  onDelete: handleClearAll,
  onViewImages: () => setGalleryOpen(true), // ⭐ NEW
});

return (
  <>
    <SuccessScreenV2 config={config} />

    {/* ⭐ NEW: Image Gallery Viewer */}
    <ImageGalleryViewer
      isOpen={galleryOpen}
      images={galleryImages}
      onClose={() => setGalleryOpen(false)}
    />

    {/* Comparison Slider Modal — for compare button */}
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

  // ============ HEADER ACTION ============
  const headerAction = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors"
      >
        <Upload size={13} strokeWidth={2.5} />
        Add more
      </button>
      <button
        onClick={handleClearAll}
        disabled={processing}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        <Trash2 size={13} strokeWidth={2.5} />
        Clear all
      </button>
    </div>
  );

  // ============ TOOL SCREEN (file list during processing) ============
  return (
    <div className="animate-tool-enter">
      <ToolShellDesktop
        title="Compress Images"
        subtitle="Reduce file size while keeping quality — 100% in your browser"
        rightPanel={
          <div className="animate-panel-right">
            <SettingsPanel />
          </div>
        }
        rightPanelTitle="Compression Settings"
        actionButton={<ActionButton />}
        headerAction={headerAction}
        breadcrumbCategory="Optimize"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          multiple
        />

        <div className="animate-panel-left">
          <FileListPanel
            onCompare={(file: FileStatus) => setComparingFile(file)}
            onDownload={handleDownloadSingle}
            onRemove={handleRemoveFile}
          />
        </div>

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
      </ToolShellDesktop>
    </div>
  );
}