'use client';

import { useToast } from '../../_components/ToastProvider';
import { useState, useCallback, useEffect } from 'react';
import type { PdfFileItem, PdfPageItem, RotationAngle } from '../../_types';
import { loadPdfPages, generateRotatedPdf, rotateAngle } from '../_utils/pdfRotator';
import { downloadFile } from '../../_utils/browser';

export function useRotatePdf() {
  // ============ STATE ============
  const toast = useToast();
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [pages, setPages] = useState<PdfPageItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState('rotated-' + new Date().toISOString().slice(0, 10));

  // 🆕 Rotated PDF output state (SINGLE file - kept for backwards compatibility)
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string | null>(null);
  const [rotatedPdfSize, setRotatedPdfSize] = useState<string | null>(null);

  // ⭐ NEW: Multiple rotated files (one per input PDF)
  const [rotatedFiles, setRotatedFiles] = useState<Array<{
    id: string;
    name: string;
    url: string;
    size: string;
    blob: Blob;
  }>>([]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  // ============ ACTIONS ============
  const addPdfs = useCallback(async (newFiles: File[]) => {
    const validFiles = newFiles.filter((f) => f.type === 'application/pdf');
    if (validFiles.length === 0) {
      setErrorMessage('Please select PDF files only.');
      toast.error('Please select PDF files only');
      return;
    }
    setErrorMessage(null);
    setIsLoadingPdf(true);
    setLoadProgress(0);

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const { fileItem, pages: newPages } = await loadPdfPages(file);
        setFiles((prev) => [...prev, fileItem]);
        setPages((prev) => [...prev, ...newPages]);
        setLoadProgress(((i + 1) / validFiles.length) * 100);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load PDF...');
      toast.error('Failed to load PDF');
    } finally {
      setIsLoadingPdf(false);
      setTimeout(() => setLoadProgress(0), 500);
    }
  }, [toast]);

  // Helper: clear stale results when pages change
  const clearStaleResult = useCallback(() => {
    if (rotatedPdfUrl) {
      URL.revokeObjectURL(rotatedPdfUrl);
      setRotatedPdfUrl(null);
      setRotatedPdfSize(null);
    }
    // ⭐ Also clear multi-file results
    rotatedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    if (rotatedFiles.length > 0) {
      setRotatedFiles([]);
    }
  }, [rotatedPdfUrl, rotatedFiles]);

  const removePage = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    clearStaleResult();
  }, [clearStaleResult]);

  const rotatePage = useCallback((id: string, direction: 'left' | 'right' = 'right') => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rotation: rotateAngle(p.rotation, direction) } : p
      )
    );
    clearStaleResult();
  }, [clearStaleResult]);

  const rotateSelected = useCallback((direction: 'left' | 'right') => {
    setPages((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) ? { ...p, rotation: rotateAngle(p.rotation, direction) } : p
      )
    );
    clearStaleResult();
  }, [selectedIds, clearStaleResult]);

  const rotateAll = useCallback((direction: 'left' | 'right') => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: rotateAngle(p.rotation, direction) })));
    clearStaleResult();
  }, [clearStaleResult]);

  const resetAllRotations = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, rotation: 0 as RotationAngle })));
    clearStaleResult();
  }, [clearStaleResult]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(pages.map((p) => p.id)));
  }, [pages]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const clearAll = useCallback(() => {
    if (rotatedPdfUrl) URL.revokeObjectURL(rotatedPdfUrl);
    // ⭐ Cleanup all multi-file URLs
    rotatedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
    setPages([]);
    setSelectedIds(new Set());
    setErrorMessage(null);
    setRotatedPdfUrl(null);
    setRotatedPdfSize(null);
    setRotatedFiles([]); // ⭐ Reset multi-file state
  }, [rotatedPdfUrl, rotatedFiles]);

  // ============ 🆕 ROTATE & PREPARE (multiple files supported) ============
  const rotateAndPrepare = useCallback(async (): Promise<string | null> => {
    if (pages.length === 0) return null;
    setIsProcessing(true);
    setErrorMessage(null);

    // Clear previous results
    if (rotatedPdfUrl) URL.revokeObjectURL(rotatedPdfUrl);
    rotatedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setRotatedPdfUrl(null);
    setRotatedFiles([]);

    try {
      const results: Array<{
        id: string;
        name: string;
        url: string;
        size: string;
        blob: Blob;
      }> = [];

      // ⭐ Generate one PDF per input file
      for (const file of files) {
        // ✅ FIXED: Use pdfId (not fileId) to link pages to their source file
        const filePages = pages.filter((p) => p.pdfId === file.id);
        if (filePages.length === 0) continue;

        // Generate rotated PDF for this file
        const url = await generateRotatedPdf([file], filePages);

        // Get blob & size
        const res = await fetch(url);
        const blob = await res.blob();
        const sizeKB = blob.size / 1024;
        const sizeStr =
          sizeKB > 1024
            ? `${(sizeKB / 1024).toFixed(2)} MB`
            : `${Math.round(sizeKB)} KB`;

        // Original filename with -rotated suffix
        const rotatedName = file.name.replace(/\.pdf$/i, '-rotated.pdf');

        results.push({
          id: file.id,
          name: rotatedName,
          url,
          size: sizeStr,
          blob,
        });
      }

      setRotatedFiles(results);

      // For backwards compatibility, set single URL if only one file
      if (results.length === 1) {
        setRotatedPdfUrl(results[0].url);
        setRotatedPdfSize(results[0].size);
      } else if (results.length > 0) {
        // For multiple, use first file's URL as reference
        setRotatedPdfUrl(results[0].url);
      }

      return results[0]?.url || null;
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to generate PDF. Please try again.');
      toast.error('Failed to generate PDF');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [files, pages, rotatedPdfUrl, rotatedFiles, toast]);

  // 🆕 Download the rotated file (single file - backwards compatible)
  const downloadRotatedFile = useCallback(() => {
    if (!rotatedPdfUrl) return;
    downloadFile(rotatedPdfUrl, `${pdfFilename || 'rotated'}.pdf`);
  }, [rotatedPdfUrl, pdfFilename]);

  // 🆕 Preview in new tab (single file - backwards compatible)
  const previewRotatedPdf = useCallback(() => {
    if (rotatedPdfUrl) window.open(rotatedPdfUrl, '_blank');
  }, [rotatedPdfUrl]);

  // ⭐ NEW: Download individual rotated file by ID
  const downloadRotatedFileById = useCallback((fileId: string) => {
    const file = rotatedFiles.find((f) => f.id === fileId);
    if (!file) return;
    downloadFile(file.url, file.name);
  }, [rotatedFiles]);

  // ⭐ NEW: Preview individual file by ID
  const previewRotatedFileById = useCallback((fileId: string) => {
    const file = rotatedFiles.find((f) => f.id === fileId);
    if (file) window.open(file.url, '_blank');
  }, [rotatedFiles]);

  // ⭐ NEW: Download all files as ZIP (or single file directly)
  const downloadAllAsZip = useCallback(async () => {
    if (rotatedFiles.length === 0) return;

    // If only 1 file, download it directly (no ZIP needed)
    if (rotatedFiles.length === 1) {
      downloadRotatedFileById(rotatedFiles[0].id);
      return;
    }

    try {
      // Dynamic import to keep bundle size small
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add each file to the ZIP
      rotatedFiles.forEach((file) => {
        zip.file(file.name, file.blob);
      });

      // Generate ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const zipName = `rotated-pdfs-${new Date().toISOString().slice(0, 10)}.zip`;

      // Download
      downloadFile(zipUrl, zipName);

      // Cleanup after download
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
      toast.error('Failed to create ZIP file');
    }
  }, [rotatedFiles, downloadRotatedFileById, toast]);

  // 🆕 Reset for re-rotating
  const resetRotated = useCallback(() => {
    if (rotatedPdfUrl) URL.revokeObjectURL(rotatedPdfUrl);
    rotatedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setRotatedPdfUrl(null);
    setRotatedPdfSize(null);
    setRotatedFiles([]);
  }, [rotatedPdfUrl, rotatedFiles]);

  // Computed
  const rotatedCount = pages.filter((p) => p.rotation !== 0).length;
  const hasRotations = rotatedCount > 0;

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  return {
    // State
    files, pages, selectedIds, isProcessing, isLoadingPdf, loadProgress,
    errorMessage, pdfFilename,
    rotatedPdfUrl,             // 🆕 Single-file (backwards compat)
    rotatedPdfSize,            // 🆕 Single-file (backwards compat)
    rotatedFiles,              // ⭐ NEW: Multi-file array
    // Computed
    rotatedCount, hasRotations,
    // Setters
    setPdfFilename, setErrorMessage,
    // Actions
    addPdfs, removePage, rotatePage, rotateSelected, rotateAll,
    resetAllRotations, toggleSelect, selectAll, clearSelection, clearAll,
    rotateAndPrepare,          // 🆕 Now supports multiple files
    downloadRotatedFile,       // 🆕 Single file download (backwards compat)
    downloadRotatedFileById,   // ⭐ NEW: Download specific file by ID
    previewRotatedPdf,         // 🆕 Single file preview (backwards compat)
    previewRotatedFileById,    // ⭐ NEW: Preview specific file by ID
    downloadAllAsZip,          // ⭐ NEW: Download all as ZIP
    resetRotated,              // 🆕
  };
}

export type RotatePdfState = ReturnType<typeof useRotatePdf>;