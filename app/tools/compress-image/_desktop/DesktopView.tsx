'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ComparisonSlider from '../ComparisonSlider';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import {
  Upload,
  Download,
  X,
  Loader2,
  AlertCircle,
  Zap,
  Package,
  Check,
  Trash2,
  RotateCcw,
  Eye,
  Image as ImageIcon,
  FileImage,
} from 'lucide-react';

// ============ TYPES ============
type CompressionMode = 'quality' | 'size';
type OutputFormat = 'image/jpeg' | 'image/webp';

interface FileStatus {
  id: string;
  original: File;
  originalUrl: string;
  originalSize: number;
  compressed?: Blob;
  compressedUrl?: string;
  compressedSize?: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  error?: string;
  reduction?: number;
}

// ============ CONSTANTS ============
const COMPRESSION_LEVELS = [
  { label: 'Light', value: 90, description: 'Best quality', icon: '🎯' },
  { label: 'Balanced', value: 75, description: 'Recommended', icon: '⚖️', recommended: true },
  { label: 'Strong', value: 50, description: 'Max savings', icon: '⚡' },
];

const SIZE_PRESETS = [
  { label: '100 KB', value: 100 },
  { label: '500 KB', value: 500 },
  { label: '1 MB', value: 1024 },
  { label: '2 MB', value: 2048 },
];

const DIMENSION_PRESETS = [
  { value: 0, label: 'Original', icon: '🖼️' },
  { value: 1920, label: 'Web (1920px)', icon: '💻' },
  { value: 1080, label: 'Social (1080px)', icon: '📱' },
  { value: 800, label: 'Email (800px)', icon: '✉️' },
  { value: 400, label: 'Thumbnail (400px)', icon: '🔍' },
];

// ============ UTILITY ============
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType.toLowerCase()] || 'jpg';
}

// ============ MAIN COMPONENT ============
export default function DesktopView() {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [comparingFile, setComparingFile] = useState<FileStatus | null>(null);

  const [mode, setMode] = useState<CompressionMode>('quality');
  const [quality, setQuality] = useState(75);
  const [targetSize, setTargetSize] = useState(500);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ⭐ Simple handleFiles — no FileReader needed with .extension accept
  const handleFiles = useCallback((newFiles: File[]) => {
    const SUPPORTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_SIZE = 50 * 1024 * 1024;

    const validFiles: FileStatus[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      if (!SUPPORTED.includes(file.type.toLowerCase())) {
        errors.push(`${file.name}: Please select JPG, PNG, or WEBP images only`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: Too large (max 50 MB)`);
        continue;
      }

      validFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        original: file,
        originalUrl: URL.createObjectURL(file),
        originalSize: file.size,
        status: 'pending',
      });
    }

    if (errors.length > 0) setError(errors.join(', '));
    else setError(null);

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  // Receive files from Smart Suggestions
  useToolFileReceiver((files: File[]) => handleFiles(files));

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) handleFiles(Array.from(selected));
    e.target.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files;
      if (dropped) handleFiles(Array.from(dropped));
    },
    [handleFiles]
  );

  const compressFile = async (fileStatus: FileStatus): Promise<FileStatus> => {
    try {
      const { compressImage } = await import('../lib/compressor');
      const result = await compressImage(fileStatus.original, {
        mode,
        quality,
        targetSizeKB: targetSize,
        outputFormat,
        maxDimension,
      });
      const compressedUrl = URL.createObjectURL(result.blob);
      return {
        ...fileStatus,
        compressed: result.blob,
        compressedUrl,
        compressedSize: result.compressedSize,
        status: 'done',
        reduction: result.reduction,
      };
    } catch (err) {
      console.error('Compression failed:', err);
      return {
        ...fileStatus,
        status: 'error',
        error: err instanceof Error ? err.message : 'Compression failed',
      };
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);

    setFiles((prev) =>
      prev.map((f) => (f.status === 'pending' ? { ...f, status: 'compressing' as const } : f))
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status !== 'compressing' && file.status !== 'pending') continue;
      const result = await compressFile(file);
      setFiles((prev) => prev.map((f) => (f.id === file.id ? result : f)));
    }

    setProcessing(false);
  };

  const handleRecompress = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);

    const resetFiles = files.map((f) => {
      if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      return {
        ...f,
        compressed: undefined,
        compressedUrl: undefined,
        compressedSize: undefined,
        status: 'compressing' as const,
        error: undefined,
        reduction: undefined,
      };
    });

    setFiles(resetFiles);

    for (let i = 0; i < resetFiles.length; i++) {
      const file = resetFiles[i];
      const result = await compressFile(file);
      setFiles((prev) => prev.map((f) => (f.id === file.id ? result : f)));
    }

    setProcessing(false);
  };

  const handleDownloadSingle = (file: FileStatus) => {
    if (!file.compressed || !file.compressedUrl) return;
    const ext = getFileExtension(file.compressed.type);
    const nameWithoutExt = file.original.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = file.compressedUrl;
    link.download = `${nameWithoutExt}-compressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const completedFiles = files.filter((f) => f.status === 'done' && f.compressed);
    if (completedFiles.length === 0) return;
    if (completedFiles.length === 1) return handleDownloadSingle(completedFiles[0]);

    setZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const file of completedFiles) {
        if (!file.compressed) continue;
        const ext = getFileExtension(file.compressed.type);
        const nameWithoutExt = file.original.name.replace(/\.[^/.]+$/, '');
        zip.file(`${nameWithoutExt}-compressed.${ext}`, file.compressed);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed-images-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to create ZIP file');
    } finally {
      setZipping(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.originalUrl);
        if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleClearAll = () => {
    files.forEach((f) => {
      URL.revokeObjectURL(f.originalUrl);
      if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
    });
    setFiles([]);
    setError(null);
  };

  const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressedSize = files.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
  const totalReduction = totalOriginalSize > 0
    ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
    : 0;
  const completedCount = files.filter((f) => f.status === 'done').length;
  const hasCompleted = completedCount > 0;

  // ============ RIGHT PANEL ============
  const rightPanel = (
    <div className="space-y-5">
      <div>
        <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Mode</label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#F1F5F9]">
          <button onClick={() => setMode('quality')} disabled={processing} className={`px-3 py-2 rounded-md text-[12px] font-bold transition-all ${mode === 'quality' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}>Quality</button>
          <button onClick={() => setMode('size')} disabled={processing} className={`px-3 py-2 rounded-md text-[12px] font-bold transition-all ${mode === 'size' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}>Target Size</button>
        </div>
      </div>

      {mode === 'quality' && (
        <div>
          <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3 block">Compression Level</label>
          <div className="grid grid-cols-3 gap-1.5">
            {COMPRESSION_LEVELS.map((preset) => {
              const isSelected = quality === preset.value;
              return (
                <button key={preset.value} onClick={() => setQuality(preset.value)} disabled={processing} className={`relative p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'} disabled:opacity-50`}>
                  {preset.recommended && (<div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8.5px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">Recommended</div>)}
                  <div className={`text-[18px] mb-1 ${preset.recommended ? 'mt-1.5' : 'mt-0'}`}>{preset.icon}</div>
                  <div className={`text-[12px] font-extrabold ${isSelected ? 'text-[#4F46E5]' : 'text-[#111827]'}`}>{preset.label}</div>
                  <div className="text-[9.5px] text-[#6B7280] font-medium mt-0.5 leading-tight">{preset.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'size' && (
        <div>
          <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Target Size</label>
          <div className="flex items-center gap-2 mb-3">
            <input type="number" min="10" max="10240" value={targetSize} onChange={(e) => setTargetSize(Number(e.target.value))} disabled={processing} className="flex-1 px-3 py-2 rounded-lg border border-[#E8EDF5] text-[13px] font-semibold text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] disabled:opacity-50" />
            <span className="text-[12px] font-bold text-[#6B7280]">KB</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SIZE_PRESETS.map((preset) => (
              <button key={preset.value} onClick={() => setTargetSize(preset.value)} disabled={processing} className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all ${targetSize === preset.value ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]' : 'border-[#E8EDF5] bg-white text-[#4B5563] hover:border-[#C7D2FE]'}`}>{preset.label}</button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Format</label>
        <div className="space-y-2">
          <button onClick={() => setOutputFormat('image/jpeg')} disabled={processing} className={`relative w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${outputFormat === 'image/jpeg' ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[20px] shrink-0 ${outputFormat === 'image/jpeg' ? 'bg-white shadow-sm' : 'bg-[#F1F5F9]'}`}>🌍</div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[14px] font-extrabold ${outputFormat === 'image/jpeg' ? 'text-[#4F46E5]' : 'text-[#111827]'}`}>JPG</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8.5px] font-extrabold uppercase tracking-wider leading-none">Best for All</span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-tight">Universal. High Quality.</p>
            </div>
            {outputFormat === 'image/jpeg' && (<div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>)}
          </button>

          <button onClick={() => setOutputFormat('image/webp')} disabled={processing} className={`relative w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${outputFormat === 'image/webp' ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[20px] shrink-0 ${outputFormat === 'image/webp' ? 'bg-white shadow-sm' : 'bg-[#F1F5F9]'}`}>⚡</div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[14px] font-extrabold ${outputFormat === 'image/webp' ? 'text-[#4F46E5]' : 'text-[#111827]'}`}>WEBP</span>
                <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-[8.5px] font-extrabold uppercase tracking-wider leading-none">Max Savings</span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-tight">30% smaller. Modern only.</p>
            </div>
            {outputFormat === 'image/webp' && (<div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>)}
          </button>
        </div>
        {outputFormat === 'image/webp' && (<div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200"><p className="text-[10px] text-amber-800 leading-relaxed"><span className="font-bold">⚠ Not supported:</span> Older iOS, Outlook, PowerPoint</p></div>)}
      </div>

      <ImageSizeDropdown value={maxDimension} onChange={setMaxDimension} disabled={processing} />
    </div>
  );

  // ============ ACTION BUTTON ============
  const actionButton = files.length > 0 ? (
    !hasCompleted ? (
      <button onClick={handleCompress} disabled={processing || files.length === 0} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        {processing ? (<><Loader2 size={16} className="animate-spin" strokeWidth={2.5} />Compressing...</>) : (<><Zap size={16} strokeWidth={2.5} />Compress {files.length} {files.length === 1 ? 'Image' : 'Images'}</>)}
      </button>
    ) : (
      <div className="space-y-2">
        <button onClick={handleDownloadAll} disabled={zipping} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all disabled:opacity-50">
          {zipping ? (<><Loader2 size={16} className="animate-spin" strokeWidth={2.5} />Creating ZIP...</>) : completedCount > 1 ? (<><Package size={16} strokeWidth={2.5} />Download ZIP ({completedCount})</>) : (<><Download size={16} strokeWidth={2.5} />Download</>)}
        </button>
        <button onClick={handleRecompress} disabled={processing} className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-[#E8EDF5] text-[#4B5563] text-[13px] font-bold hover:border-[#C7D2FE] hover:text-[#4F46E5] transition-all disabled:opacity-50">
          {processing ? (<><Loader2 size={14} className="animate-spin" strokeWidth={2.5} />Re-compressing...</>) : (<><RotateCcw size={14} strokeWidth={2.5} />Re-compress</>)}
        </button>
      </div>
    )
  ) : null;

  // ============ HEADER ACTION ============
  const headerAction = files.length > 0 ? (
    <div className="flex items-center gap-2">
      <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-semibold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors">
        <Upload size={13} strokeWidth={2.5} />Add more
      </button>
      <button onClick={handleClearAll} disabled={processing} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12.5px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50">
        <Trash2 size={13} strokeWidth={2.5} />Clear all
      </button>
    </div>
  ) : null;

  return (
    <ToolShellDesktop
      title="Compress Images"
      subtitle="Reduce file size while keeping quality — 100% in your browser"
      rightPanel={rightPanel}
      rightPanelTitle="Compression Settings"
      actionButton={actionButton}
      headerAction={headerAction}
      breadcrumbCategory="Optimize"
    >
      {/* ⭐ Single hidden file input with .extension accept */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileInput}
        className="hidden"
        multiple
      />

      {files.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`flex-1 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center ${isDragging ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'}`}
        >
          {/* ⭐ Using onClick instead of label+htmlFor — cleaner, no duplicate input */}
          <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center py-16 px-8 cursor-pointer w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center mb-5 shadow-[0_10px_30px_-6px_rgba(79,70,229,0.5)]">
              <Upload size={32} className="text-white" strokeWidth={2} />
            </div>
            <h3 className="text-[22px] font-extrabold text-[#111827] mb-2">
              {isDragging ? 'Drop your images here' : 'Choose images to compress'}
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-6 leading-relaxed">
              Drag & drop or click to select multiple images.<br />
              <span className="font-semibold text-[#111827]">JPG, PNG, WEBP</span> · Up to 50 MB each
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all">
              <ImageIcon size={16} strokeWidth={2.5} />Choose Images
            </div>
            <div className="flex items-center gap-4 mt-8 text-[12px] text-[#6B7280]">
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="font-medium">100% Private</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="font-medium">No Uploads</span></div>
              <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="font-medium">Batch Support</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#E8EDF5] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] overflow-hidden">
          {hasCompleted && (
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-emerald-900">{completedCount} {completedCount === 1 ? 'image' : 'images'} compressed</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-[11px] text-emerald-700 font-semibold">{formatBytes(totalOriginalSize)} → {formatBytes(totalCompressedSize)}</p>
                <div className="px-2.5 py-1 rounded-md bg-emerald-500 text-white text-[12px] font-extrabold shadow-sm">-{totalReduction}%</div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <FileImage size={14} className="text-[#4F46E5]" strokeWidth={2.2} />
              <p className="text-[12px] font-bold text-[#111827]">{files.length} {files.length === 1 ? 'Image' : 'Images'}</p>
            </div>
          </div>

          {error && (
            <div className="mx-5 mt-4 flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" strokeWidth={2.2} />
              <div className="flex-1"><p className="text-[12px] text-red-700">{error}</p></div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600" aria-label="Dismiss"><X size={14} /></button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {files.map((file) => (
              <FileCard key={file.id} file={file} onRemove={() => handleRemoveFile(file.id)} onDownload={() => handleDownloadSingle(file)} onCompare={() => setComparingFile(file)} disabled={processing} />
            ))}
          </div>
        </div>
      )}

      {comparingFile && comparingFile.compressedUrl && comparingFile.compressedSize && (
        <ComparisonSlider originalUrl={comparingFile.originalUrl} compressedUrl={comparingFile.compressedUrl} originalSize={comparingFile.originalSize} compressedSize={comparingFile.compressedSize} reduction={comparingFile.reduction || 0} filename={comparingFile.original.name} onClose={() => setComparingFile(null)} />
      )}
    </ToolShellDesktop>
  );
}

// ============ FILE CARD ============
interface FileCardProps {
  file: FileStatus;
  onRemove: () => void;
  onDownload: () => void;
  onCompare: () => void;
  disabled: boolean;
}

function FileCard({ file, onRemove, onDownload, onCompare, disabled }: FileCardProps) {
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = file.originalUrl;
  }, [file.originalUrl]);

  const fileFormat = file.original.type.split('/')[1]?.toUpperCase() || 'IMG';
  const compressedFormat = file.compressed?.type.split('/')[1]?.toUpperCase();
  const formatChanged = compressedFormat && compressedFormat !== fileFormat;

  return (
    <div className="group relative flex gap-4 p-3 rounded-xl border border-[#E8EDF5] bg-white hover:border-[#C7D2FE] hover:shadow-[0_4px_16px_-4px_rgba(79,70,229,0.1)] transition-all">
      <div className="relative w-24 h-24 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden shrink-0 border border-slate-100">
        <img src={file.status === 'done' && file.compressedUrl ? file.compressedUrl : file.originalUrl} alt={file.original.name} className="w-full h-full object-cover" />
        {file.status === 'compressing' && (<div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"><Loader2 size={20} className="text-white animate-spin" strokeWidth={2.5} /></div>)}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start gap-2 mb-1.5">
            <p className="text-[14px] font-bold text-[#111827] truncate flex-1" title={file.original.name}>{file.original.name}</p>
            {formatChanged ? (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold uppercase tracking-wider shrink-0">
                <span className="text-slate-400">{fileFormat}</span>
                <svg viewBox="0 0 24 24" className="w-2 h-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                <span className="text-[#4F46E5]">{compressedFormat}</span>
              </div>
            ) : (
              <div className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold uppercase tracking-wider shrink-0">{fileFormat}</div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[12px] mb-1.5">
            {file.status === 'done' && file.compressedSize ? (
              <>
                <span className="text-[#9CA3AF] font-medium line-through">{formatBytes(file.originalSize)}</span>
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                <span className="text-[#4F46E5] font-extrabold text-[13px]">{formatBytes(file.compressedSize)}</span>
                {file.reduction !== undefined && file.reduction > 0 && (<div className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold">-{file.reduction}%</div>)}
              </>
            ) : (
              <span className="text-[#6B7280] font-semibold">{formatBytes(file.originalSize)}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {dimensions && (<span className="text-[10.5px] text-[#9CA3AF] font-semibold">{dimensions.w} × {dimensions.h}</span>)}
            {file.status === 'done' && file.reduction !== undefined && file.compressedSize !== undefined && file.originalSize > file.compressedSize && (<><span className="text-[10px] text-[#D1D5DB]">•</span><span className="text-[10.5px] text-emerald-600 font-bold">Saved {formatBytes(file.originalSize - file.compressedSize)}</span></>)}
            {file.status === 'pending' && (<span className="inline-flex items-center gap-1 text-[10.5px] text-amber-700 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Waiting</span>)}
            {file.status === 'compressing' && (<span className="inline-flex items-center gap-1 text-[10.5px] text-[#4F46E5] font-bold"><Loader2 size={9} className="animate-spin" strokeWidth={2.5} />Compressing...</span>)}
          </div>
        </div>

        {file.status === 'done' && (
          <div className="flex items-center gap-2 mt-2">
            <button onClick={onCompare} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8EDF5] hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 text-[#4B5563] text-[11px] font-bold transition-all"><Eye size={11} strokeWidth={2.5} />Compare</button>
            <button onClick={onDownload} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] hover:from-[#4338CA] hover:to-[#5B4FE0] text-white text-[11px] font-bold shadow-[0_2px_8px_-2px_rgba(79,70,229,0.4)] hover:shadow-[0_4px_12px_-2px_rgba(79,70,229,0.5)] transition-all"><Download size={11} strokeWidth={2.5} />Download</button>
          </div>
        )}

        {file.status === 'error' && (<div className="mt-2 text-[11px] text-red-600 font-medium">{file.error || 'Compression failed'}</div>)}
      </div>

      <button onClick={onRemove} disabled={disabled} className="self-start w-7 h-7 rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50" aria-label="Remove"><X size={14} strokeWidth={2.5} /></button>
    </div>
  );
}

// ============ IMAGE SIZE DROPDOWN ============
interface ImageSizeDropdownProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

function ImageSizeDropdown({ value, onChange, disabled }: ImageSizeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = DIMENSION_PRESETS.find(p => p.value === value) || DIMENSION_PRESETS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div>
      <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Image Size</label>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} disabled={disabled} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${isOpen ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'} disabled:opacity-50 disabled:cursor-not-allowed`}>
          <span className="text-[16px]">{selected.icon}</span>
          <span className="flex-1 text-left text-[12.5px] font-bold text-[#111827]">{selected.label}</span>
          <svg viewBox="0 0 24 24" className={`w-4 h-4 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {isOpen && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-[#E8EDF5] rounded-xl shadow-[0_10px_30px_-6px_rgba(15,23,42,0.15)] overflow-hidden z-20">
            {DIMENSION_PRESETS.map((preset) => {
              const isSelected = value === preset.value;
              return (
                <button key={preset.value} onClick={() => { onChange(preset.value); setIsOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2.5 transition-colors ${isSelected ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#111827] hover:bg-[#F8FAFF]'}`}>
                  <span className="text-[15px]">{preset.icon}</span>
                  <span className={`flex-1 text-left text-[12px] ${isSelected ? 'font-extrabold' : 'font-semibold'}`}>{preset.label}</span>
                  {isSelected && (<svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}