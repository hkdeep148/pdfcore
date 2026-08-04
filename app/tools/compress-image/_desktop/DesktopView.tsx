'use client';

import { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import DesktopUploadPage from '../../_components/DesktopUploadPage';
import ComparisonSlider from '../ComparisonSlider';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import {
  useCompressImageContext,
  type FileStatus,
} from '../_context/CompressImageContext';
// Step 4 will create these — import them now so structure is clear
import LoadingScreen from './LoadingScreen';
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
    // Processing
    isLoading,
    loadingFadeOut,
    processing,
    // UI
    comparingFile,
    setComparingFile,
  } = useCompressImageContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Receive files from Smart Suggestions
  useToolFileReceiver((received: File[]) => handleFiles(received));

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) handleFiles(Array.from(selected));
    e.target.value = '';
  };

  // ============ LOADING SCREEN ============
  if (isLoading) {
    return <LoadingScreen fadeOut={loadingFadeOut} />;
  }

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

  // ============ TOOL SCREEN ============
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
      {/* Hidden file input — used by Add more button */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        multiple
      />

      {/* File List — slides in from LEFT */}
      <div className="animate-panel-left">
        <FileListPanel
          onCompare={(file: FileStatus) => setComparingFile(file)}
          onDownload={handleDownloadSingle}
          onRemove={handleRemoveFile}
        />
      </div>

      {/* Comparison Slider Modal */}
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