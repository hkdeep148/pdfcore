'use client';

import { useRef, useState, useEffect } from 'react';
import { useStickyBottomSpace } from '../../_hooks/useStickyBottomSpace';
import { motion, AnimatePresence } from 'framer-motion';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import MobileLoadingScreen from '../../_components/MobileLoadingScreen';
import MobileCompressingScreen from '../../_components/MobileCompressingScreen';
import ComparisonSlider from '../ComparisonSlider';
import { getToolByPath } from '../../_config/tools';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import {
  useCompressImageContext,
  type FileStatus,
} from '../_context/CompressImageContext';
import { formatBytes } from '../../_utils/browser';
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
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const bottomSpace = useStickyBottomSpace(bottomBarRef);
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

/*
  Determine which screen to show. Only one is active at a time,
  and AnimatePresence below crossfades between them so transitions
  aren't abrupt.
*/
const isTransitioningToSuccess =
  hasCompleted &&
  completedCount === files.length &&
  files.length > 0 &&
  !showSuccess;

const screen: 'loading' | 'compressing' | 'main' =
  isLoading
    ? 'loading'
    : processing || isTransitioningToSuccess
    ? 'compressing'
    : 'main';

// Full-screen wrappers for loading and compressing states.
if (screen === 'loading' || screen === 'compressing') {
  return (
    <ToolShellMobile fixedHeight={true}>
      <AnimatePresence mode="wait">
        {screen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            <MobileCompressingScreen
              title="Compressing images"
              subtitle="This will only take a moment..."
            />
          </motion.div>
        )}
      </AnimatePresence>
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

{/*
  AnimatePresence crossfades success screen ↔ file list ↔ empty
  state. Combined with the loading/compressing AnimatePresence
  above, the full flow becomes:
    loading → compressing → success
  with each transition fading smoothly instead of hard-cutting.
*/}
<AnimatePresence mode="wait">
{showSuccess && hasCompleted && files[0]?.compressed && files[0]?.compressedSize ? (
  <motion.div
    key="success"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="h-full"
  >
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
          ? () => window.open(files[0].compressedUrl, '_blank')
          : undefined
      }
      onStartOver={handleStartOver}
    />
  </motion.div>
) : files.length === 0 ? (
  <motion.div
    key="empty"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="h-full"
  >
    <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
  </motion.div>
) : (
  <motion.div
    key="list"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="h-full flex flex-col"
  >
    {/* Header — drops down from top */}
    <div className="animate-mobile-toolbar">
            <MobileToolHeader
              filename={filename}
              onFilenameChange={setFilename}
              onBack={handleClearAll}
            />
          </div>

          {/* Main Content — rises up from middle */}
          <div className="flex-1 overflow-y-auto px-4 pt-2 bg-[#F5F5FA] animate-mobile-content" style={{ paddingBottom: bottomSpace }}>

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
          <MobileActionBar barRef={bottomBarRef} />
        </div>
  </motion.div>
)}
</AnimatePresence>

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