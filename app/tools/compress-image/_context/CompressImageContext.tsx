'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

// ============ TYPES ============
export type CompressionMode = 'quality' | 'size';
export type OutputFormat = 'image/jpeg' | 'image/webp';

export interface FileStatus {
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

// ============ CONTEXT SHAPE ============
interface CompressImageContextValue {
  // Settings
  mode: CompressionMode;
  setMode: (m: CompressionMode) => void;
  quality: number;
  setQuality: (q: number) => void;
  targetSize: number;
  setTargetSize: (s: number) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  maxDimension: number;
  setMaxDimension: (d: number) => void;

  // Files
  files: FileStatus[];
  handleFiles: (files: File[]) => void;
  handleRemoveFile: (id: string) => void;
  handleClearAll: () => void;

  // Processing
  processing: boolean;
  isLoading: boolean;
  loadingFadeOut: boolean;
  error: string | null;
  setError: (e: string | null) => void;
  handleCompress: () => Promise<void>;
  handleRecompress: () => Promise<void>;

  // Download
  zipping: boolean;
  handleDownloadSingle: (file: FileStatus) => void;
  handleDownloadAll: () => Promise<void>;

  // Success Modal
  successModalOpen: boolean;
  setSuccessModalOpen: (open: boolean) => void;
  lastDownloadCount: number;

  // UI
  comparingFile: FileStatus | null;
  setComparingFile: (f: FileStatus | null) => void;

  // Derived
  completedCount: number;
  hasCompleted: boolean;
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalReduction: number;
}

// ============ CONTEXT ============
const CompressImageContext = createContext<CompressImageContextValue | null>(null);

export function useCompressImageContext() {
  const ctx = useContext(CompressImageContext);
  if (!ctx) throw new Error('useCompressImageContext must be used inside CompressImageProvider');
  return ctx;
}

// ============ UTILITIES ============
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType.toLowerCase()] || 'jpg';
}

// ============ PROVIDER ============
export function CompressImageProvider({ children }: { children: ReactNode }) {
  // Settings State
  const [mode, setMode] = useState<CompressionMode>('quality');
  const [quality, setQuality] = useState(75);
  const [targetSize, setTargetSize] = useState(500);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [maxDimension, setMaxDimension] = useState(0);

  // File State
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const [comparingFile, setComparingFile] = useState<FileStatus | null>(null);

  // Loading Animation State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFadeOut, setLoadingFadeOut] = useState(false);

  // ⭐ Success Modal State
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [lastDownloadCount, setLastDownloadCount] = useState(1);
  // Timer ref for cleanup
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ============ FILE HANDLING ============
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

    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setError(null);

    if (validFiles.length === 0) return;

    setFiles((prev) => {
      const isFirstUpload = prev.length === 0;

      if (isFirstUpload) {
        // Show loading animation only on first upload
        setIsLoading(true);
        setLoadingFadeOut(false);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          setFiles((current) => [...current, ...validFiles]);

          // Fade out smoothly
          setLoadingFadeOut(true);
          timerRef.current = setTimeout(() => {
            setIsLoading(false);
            setLoadingFadeOut(false);
          }, 300);
        }, 800);

        return prev;
      }

      // Add more files instantly — no loading screen
      return [...prev, ...validFiles];
    });
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.originalUrl);
        if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => {
        URL.revokeObjectURL(f.originalUrl);
        if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
      });
      return [];
    });
    setError(null);
  }, []);

  // ============ COMPRESSION ============
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

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);

    // Capture before state update to avoid stale closure
    const filesToCompress = files.filter(
      (f) => f.status === 'pending' || f.status === 'error'
    );

    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' || f.status === 'error'
          ? { ...f, status: 'compressing' as const }
          : f
      )
    );

    for (const file of filesToCompress) {
      const result = await compressFile(file);
      setFiles((prev) => prev.map((f) => (f.id === file.id ? result : f)));
    }

    setProcessing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, mode, quality, targetSize, outputFormat, maxDimension]);

  const handleRecompress = useCallback(async () => {
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

    for (const file of resetFiles) {
      const result = await compressFile(file);
      setFiles((prev) => prev.map((f) => (f.id === file.id ? result : f)));
    }

    setProcessing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, mode, quality, targetSize, outputFormat, maxDimension]);

  // ============ DOWNLOAD ============
  const handleDownloadSingle = useCallback((file: FileStatus) => {
  if (!file.compressed || !file.compressedUrl) return;
  const ext = getFileExtension(file.compressed.type);
  const nameWithoutExt = file.original.name.replace(/\.[^/.]+$/, '');
  const link = document.createElement('a');
  link.href = file.compressedUrl;
  link.download = `${nameWithoutExt}-compressed.${ext}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // ⭐ Track single file download
  setLastDownloadCount(1);
  setTimeout(() => setSuccessModalOpen(true), 300);
}, []);

  const handleDownloadAll = useCallback(async () => {
  const completedFiles = files.filter((f) => f.status === 'done' && f.compressed);
  if (completedFiles.length === 0) return;
  if (completedFiles.length === 1) {
    handleDownloadSingle(completedFiles[0]);
    return;
  }

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

    // ⭐ Track ZIP download count
    setLastDownloadCount(completedFiles.length);
    setTimeout(() => setSuccessModalOpen(true), 300);
  } catch {
    setError('Failed to create ZIP file');
  } finally {
    setZipping(false);
  }
}, [files, handleDownloadSingle]);

  // ============ DERIVED VALUES ============
  const totalOriginalSize = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressedSize = files.reduce((sum, f) => sum + (f.compressedSize || 0), 0);
  const totalReduction =
    totalOriginalSize > 0
      ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
      : 0;
  const completedCount = files.filter((f) => f.status === 'done').length;
  const hasCompleted = completedCount > 0;

  // ============ CONTEXT VALUE ============
  const value: CompressImageContextValue = {
    // Settings
    mode, setMode,
    quality, setQuality,
    targetSize, setTargetSize,
    outputFormat, setOutputFormat,
    maxDimension, setMaxDimension,
    // Files
    files,
    handleFiles,
    handleRemoveFile,
    handleClearAll,
    // Processing
    processing,
    isLoading,
    loadingFadeOut,
    error,
    setError,
    handleCompress,
    handleRecompress,
    // Download
    zipping,
    handleDownloadSingle,
    handleDownloadAll,
    // Success Modal
    successModalOpen,
    setSuccessModalOpen,
    lastDownloadCount,
    // UI
    comparingFile,
    setComparingFile,
    // Derived
    completedCount,
    hasCompleted,
    totalOriginalSize,
    totalCompressedSize,
    totalReduction,
  };

  return (
    <CompressImageContext.Provider value={value}>
      {children}
    </CompressImageContext.Provider>
  );
}