'use client';

import { useRef, useState, useEffect } from 'react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import MobileLoadingScreen from '../../_components/MobileLoadingScreen';
import MobileCompressingScreen from '../../_components/MobileCompressingScreen';
import ComparisonSlider from '../ComparisonSlider';
import { getToolByPath } from '../../_config/tools';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import {
  useCompressImageContext,
  formatBytes,
  type FileStatus,
} from '../_context/CompressImageContext';
import { Upload, X, Trash2 } from 'lucide-react';

import MobileSettingsSheet from './MobileSettingsSheet';
import MobileActionBar from './MobileActionBar';
import MobileFileCard from './MobileFileCard';

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
  const [filename, setFilename] = useState('compressed-image');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/compress-image')!;

  // Update filename when files change
  useEffect(() => {
    if (files.length === 1) {
      const name = files[0].original.name.replace(/\.[^/.]+$/, '');
      setFilename(`${name}-compressed`);
    } else if (files.length > 1) {
      setFilename(`${files.length}-images-compressed`);
    }
  }, [files.length, files]);

  // Auto-show success screen when compression completes (with smooth delay)
  useEffect(() => {
    if (hasCompleted && !processing && completedCount === files.length && files.length > 0) {
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasCompleted, processing, completedCount, files.length]);

  useToolFileReceiver((received: File[]) => handleFiles(received));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleStartOver = () => {
    handleClearAll();
    setShowSuccess(false);
  };

  // ═══════════════════════════════════════════
  // LOADING SCREEN — first upload
  // ═══════════════════════════════════════════
  if (isLoading) {
    return (
      <ToolShellMobile fixedHeight={true}>
        <MobileLoadingScreen
          fadeOut={loadingFadeOut}
          title="Preparing your images"
          subtitle="Setting up the compressor"
        />
      </ToolShellMobile>
    );
  }

  // ═══════════════════════════════════════════
  // COMPRESSING SCREEN — during processing
  // ═══════════════════════════════════════════
  const isTransitioningToSuccess =
  hasCompleted &&
  completedCount === files.length &&
  files.length > 0 &&
  !showSuccess;

if (processing || isTransitioningToSuccess) {
  return (
    <ToolShellMobile fixedHeight={true}>
      <MobileCompressingScreen
        title="Compressing images"
        subtitle="This will only take a moment..."
      />

      </ToolShellMobile>
    );
  }

  // ═══════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════
  return (
    <ToolShellMobile fixedHeight={files.length > 0}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between shrink-0 animate-mobile-toolbar">
          <span className="text-[13px] text-red-600 font-medium">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Success Screen */}
      {showSuccess && hasCompleted && files[0]?.compressed && files[0]?.compressedSize ? (
        <MobileSuccessScreen
  title={completedCount === 1 ? 'Image Compressed!' : `${completedCount} Images Compressed!`}
  subtitle={completedCount === 1 ? 'Your image is ready to download' : 'Your images are ready to download'}
  filename={files[0].original.name}
  fileCount={files.length}
  iconVariant="image"
  previewImage={files[0].compressedUrl}
  compressionStats={{
    originalSize: formatBytes(totalOriginalSize),
    compressedSize: formatBytes(totalCompressedSize),
    savedPercentage: totalReduction,
    savedBytes: formatBytes(totalOriginalSize - totalCompressedSize),
    format: files[0].compressed?.type.split('/')[1]?.toUpperCase(),
  }}
  downloadLabel={completedCount === 1 ? 'Download Image' : `Download All (${completedCount}) as ZIP`}
  statusBadge={{ label: 'Compressed', color: 'green' }}
  onDownload={handleDownloadAll}
  onPreview={
    files[0].compressedUrl
      ? () => window.open(files[0].compressedUrl, '_blank')
      : undefined
  }
  onStartOver={handleStartOver}
/>
      ) : files.length === 0 ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        <>
          {/* Header — drops down from top */}
          <div className="animate-mobile-toolbar">
            <MobileToolHeader
              filename={filename}
              onFilenameChange={setFilename}
              onBack={handleClearAll}
            />
          </div>

          {/* Main Content — rises up from middle */}
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[140px] bg-[#F5F5FA] animate-mobile-content">

            {/* Toolbar Row */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                {files.length} {files.length === 1 ? 'Image' : 'Images'}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={openFilePicker}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF] active:scale-95 transition-all"
                >
                  <Upload size={11} strokeWidth={2.5} />
                  Add
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={processing}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-red-600 bg-red-50 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Trash2 size={11} strokeWidth={2.5} />
                  Clear
                </button>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-2 mb-4">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="animate-mobile-item"
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                >
                  <MobileFileCard
                    file={file}
                    onRemove={() => handleRemoveFile(file.id)}
                    onDownload={() => handleDownloadSingle(file)}
                    onCompare={() => setComparingFile(file)}
                    disabled={processing}
                  />
                </div>
              ))}
            </div>

            {/* Collapsible Settings */}
            <MobileSettingsSheet />
          </div>

          {/* Action Bar — slides up from bottom */}
          <div className="animate-mobile-bottom">
            <MobileActionBar />
          </div>
        </>
      )}

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
    </ToolShellMobile>
  );
}