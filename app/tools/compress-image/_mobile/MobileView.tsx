'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import ComparisonSlider from '../ComparisonSlider';
import { getToolByPath } from '../../_config/tools';
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
export default function MobileView() {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const [comparingFile, setComparingFile] = useState<FileStatus | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filename, setFilename] = useState('compressed-image');

  const [mode, setMode] = useState<CompressionMode>('quality');
  const [quality, setQuality] = useState(75);
  const [targetSize, setTargetSize] = useState(500);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/compress-image')!;

  // ⭐ SINGLE handleFiles function (used by both file input AND tool receiver)
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

  // Sync filename with uploaded file
  useEffect(() => {
    if (files.length === 1) {
      const name = files[0].original.name.replace(/\.[^/.]+$/, '');
      setFilename(`${name}-compressed`);
    } else if (files.length > 1) {
      setFilename(`${files.length}-images-compressed`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  // Receive files from Smart Suggestions
  useToolFileReceiver((files: File[]) => handleFiles(files));

  // ⭐ Simple file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

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
    setShowSuccess(true);
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
    setShowSuccess(false);
  };

  const handleStartOver = () => {
    handleClearAll();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
  };

  const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressedSize = files.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
  const totalReduction = totalOriginalSize > 0
    ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
    : 0;
  const completedCount = files.filter((f) => f.status === 'done').length;
  const hasCompleted = completedCount > 0;

  return (
    <ToolShellMobile fixedHeight={files.length > 0}>
      {/* ⭐ Hidden file input — uses .extensions to avoid Samsung Photo Picker */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.webp"
        multiple
      />

      {error && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between shrink-0">
          <span className="text-[13px] text-red-600 font-medium">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400">
            <X size={16} />
          </button>
        </div>
      )}

      {showSuccess && hasCompleted && files[0]?.compressed && files[0]?.compressedSize ? (
        <MobileSuccessScreen
          title={completedCount === 1 ? 'Image Compressed!' : `${completedCount} Images Compressed!`}
          subtitle={completedCount === 1 
            ? 'Your image is ready to download' 
            : 'Your images are ready to download'
          }
          filename={files[0].original.name}
          iconVariant="image"
          previewImage={files[0].compressedUrl}
          compressionStats={{
            originalSize: formatBytes(totalOriginalSize),
            compressedSize: formatBytes(totalCompressedSize),
            savedPercentage: totalReduction,
            savedBytes: formatBytes(totalOriginalSize - totalCompressedSize),
            format: files[0].compressed?.type.split('/')[1]?.toUpperCase(),
          }}
          downloadLabel={completedCount === 1 
            ? 'Download Image' 
            : `Download All (${completedCount}) as ZIP`
          }
          statusBadge={{ label: 'Compressed', color: 'green' }}
          onDownload={handleDownloadAll}
          onPreview={files[0].compressedUrl 
            ? () => window.open(files[0].compressedUrl, '_blank') 
            : undefined
          }
          onStartOver={handleStartOver}
          onBack={handleBackToEdit}
        />
      ) : files.length === 0 ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        <>
          <MobileToolHeader
            filename={filename}
            onFilenameChange={setFilename}
            onBack={handleClearAll}
          />

          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-[140px] bg-[#F5F5FA]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                {files.length} {files.length === 1 ? 'Image' : 'Images'}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={openFilePicker} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF] active:scale-95 transition-all">
                  <Upload size={11} strokeWidth={2.5} />Add
                </button>
                <button onClick={handleClearAll} disabled={processing} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-red-600 bg-red-50 active:scale-95 transition-all disabled:opacity-50">
                  <Trash2 size={11} strokeWidth={2.5} />Clear
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onRemove={() => handleRemoveFile(file.id)}
                  onDownload={() => handleDownloadSingle(file)}
                  onCompare={() => setComparingFile(file)}
                  disabled={processing}
                />
              ))}
            </div>

            <button onClick={() => setSettingsOpen(!settingsOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#E8EDF5] active:bg-[#F8FAFF] transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center">
                  <Zap size={12} className="text-white" strokeWidth={2.5} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-bold text-[#07122E]">Settings</p>
                  <p className="text-[10px] text-[#6B7280]">
                    {COMPRESSION_LEVELS.find(l => l.value === quality)?.label} · {outputFormat === 'image/jpeg' ? 'JPG' : 'WEBP'}
                  </p>
                </div>
              </div>
              <svg viewBox="0 0 24 24" className={`w-4 h-4 text-[#6B7280] transition-transform ${settingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {settingsOpen && (
              <div className="mt-2 rounded-xl bg-white border border-[#E8EDF5] p-4 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Mode</label>
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#F1F5F9]">
                    <button onClick={() => setMode('quality')} disabled={processing} className={`px-3 py-2 rounded-md text-[11px] font-bold transition-all ${mode === 'quality' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-[#6B7280]'}`}>Quality</button>
                    <button onClick={() => setMode('size')} disabled={processing} className={`px-3 py-2 rounded-md text-[11px] font-bold transition-all ${mode === 'size' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-[#6B7280]'}`}>Target Size</button>
                  </div>
                </div>

                {mode === 'quality' && (
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Compression Level</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {COMPRESSION_LEVELS.map((preset) => {
                        const isSelected = quality === preset.value;
                        return (
                          <button key={preset.value} onClick={() => setQuality(preset.value)} disabled={processing} className={`relative p-2.5 rounded-lg border-2 transition-all active:scale-95 ${isSelected ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white'} disabled:opacity-50`}>
                            {preset.recommended && (<div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">Best</div>)}
                            <div className={`text-[16px] mb-0.5 ${preset.recommended ? 'mt-1' : ''}`}>{preset.icon}</div>
                            <div className={`text-[11px] font-extrabold ${isSelected ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>{preset.label}</div>
                            <div className="text-[8.5px] text-[#6B7280] font-medium mt-0.5 leading-tight">{preset.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {mode === 'size' && (
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Target Size</label>
                    <div className="flex items-center gap-2 mb-2">
                      <input type="number" min="10" max="10240" value={targetSize} onChange={(e) => setTargetSize(Number(e.target.value))} disabled={processing} className="flex-1 px-3 py-2 rounded-lg border border-[#E8EDF5] text-[13px] font-semibold text-[#07122E] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] disabled:opacity-50" />
                      <span className="text-[12px] font-bold text-[#6B7280]">KB</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {SIZE_PRESETS.map((preset) => (
                        <button key={preset.value} onClick={() => setTargetSize(preset.value)} disabled={processing} className={`px-2 py-2 rounded-lg text-[10px] font-bold border transition-all active:scale-95 ${targetSize === preset.value ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]' : 'border-[#E8EDF5] bg-white text-[#4B5563]'}`}>{preset.label}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setOutputFormat('image/jpeg')} disabled={processing} className={`relative p-3 rounded-lg border-2 transition-all active:scale-95 ${outputFormat === 'image/jpeg' ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white'}`}>
                      <div className="text-[18px] mb-0.5">🌍</div>
                      <div className={`text-[12px] font-extrabold mb-0.5 ${outputFormat === 'image/jpeg' ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>JPG</div>
                      <div className="text-[9px] text-emerald-600 font-bold">Best for all</div>
                    </button>
                    <button onClick={() => setOutputFormat('image/webp')} disabled={processing} className={`relative p-3 rounded-lg border-2 transition-all active:scale-95 ${outputFormat === 'image/webp' ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white'}`}>
                      <div className="text-[18px] mb-0.5">⚡</div>
                      <div className={`text-[12px] font-extrabold mb-0.5 ${outputFormat === 'image/webp' ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>WEBP</div>
                      <div className="text-[9px] text-purple-600 font-bold">Max savings</div>
                    </button>
                  </div>
                  {outputFormat === 'image/webp' && (<p className="mt-2 text-[10px] text-amber-700 leading-relaxed">⚠ Not supported on older iOS/Office</p>)}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">Image Size</label>
                  <select value={maxDimension} onChange={(e) => setMaxDimension(Number(e.target.value))} disabled={processing} className="w-full px-3 py-2.5 rounded-lg border-2 border-[#E8EDF5] text-[12px] font-bold text-[#07122E] focus:outline-none focus:border-[#4F46E5] disabled:opacity-50 bg-white">
                    {DIMENSION_PRESETS.map((preset) => (<option key={preset.value} value={preset.value}>{preset.icon} {preset.label}</option>))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white to-transparent pt-6">
            <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {!hasCompleted ? (
                <button onClick={handleCompress} disabled={processing || files.length === 0} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)] active:scale-95 transition-all disabled:opacity-50">
                  {processing ? (<><Loader2 size={16} className="animate-spin" strokeWidth={2.5} />Compressing...</>) : (<><Zap size={16} strokeWidth={2.5} />Compress {files.length} {files.length === 1 ? 'Image' : 'Images'}</>)}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleDownloadAll} disabled={zipping} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[13px] font-bold shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)] active:scale-95 transition-all disabled:opacity-50">
                    {zipping ? (<><Loader2 size={14} className="animate-spin" strokeWidth={2.5} />Zipping...</>) : completedCount > 1 ? (<><Package size={14} strokeWidth={2.5} />Download All</>) : (<><Download size={14} strokeWidth={2.5} />Download</>)}
                  </button>
                  <button onClick={handleRecompress} disabled={processing} className="flex items-center justify-center px-4 py-3.5 rounded-2xl bg-white border-2 border-[#E8EDF5] text-[#4B5563] active:scale-95 transition-all disabled:opacity-50" aria-label="Re-compress">
                    <RotateCcw size={16} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
    <div className="flex gap-3 p-3 rounded-xl bg-white border border-[#E8EDF5]">
      <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] overflow-hidden shrink-0 border border-slate-100">
        <img src={file.status === 'done' && file.compressedUrl ? file.compressedUrl : file.originalUrl} alt={file.original.name} className="w-full h-full object-cover" />
        {file.status === 'compressing' && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <Loader2 size={16} className="text-white animate-spin" strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-[12.5px] font-bold text-[#07122E] truncate mb-1">{file.original.name}</p>
          <div className="flex items-center gap-1.5 text-[11px] mb-1 flex-wrap">
            {file.status === 'done' && file.compressedSize ? (
              <>
                <span className="text-[#9CA3AF] line-through text-[10.5px]">{formatBytes(file.originalSize)}</span>
                <span className="text-[#9CA3AF] text-[10px]">→</span>
                <span className="text-[#4F46E5] font-extrabold text-[11.5px]">{formatBytes(file.compressedSize)}</span>
                {file.reduction !== undefined && file.reduction > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-extrabold">-{file.reduction}%</span>
                )}
              </>
            ) : (
              <span className="text-[#6B7280] font-semibold">{formatBytes(file.originalSize)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] text-[#9CA3AF] font-semibold">
            {dimensions && <span>{dimensions.w} × {dimensions.h}</span>}
            {formatChanged && (<>{dimensions && <span className="text-[#D1D5DB]">•</span>}<span>{fileFormat} → {compressedFormat}</span></>)}
            {file.status === 'pending' && (<>{dimensions && <span className="text-[#D1D5DB]">•</span>}<span className="text-amber-700 font-bold">Waiting</span></>)}
          </div>
        </div>

        {file.status === 'done' && (
          <div className="flex items-center gap-1.5 mt-2">
            <button onClick={onCompare} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-purple-50 text-purple-600 text-[10px] font-bold active:scale-95 transition-all">
              <Eye size={10} strokeWidth={2.5} />Compare
            </button>
            <button onClick={onDownload} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold active:scale-95 transition-all">
              <Download size={10} strokeWidth={2.5} />Save
            </button>
          </div>
        )}

        {file.status === 'error' && (
          <div className="mt-1.5 text-[10px] text-red-600 font-medium">{file.error || 'Failed'}</div>
        )}
      </div>

      <button onClick={onRemove} disabled={disabled} className="self-start w-7 h-7 rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors shrink-0 disabled:opacity-50" aria-label="Remove">
        <X size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}