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

  // 🆕 Rotated PDF output state
  const [rotatedPdfUrl, setRotatedPdfUrl] = useState<string | null>(null);
  const [rotatedPdfSize, setRotatedPdfSize] = useState<string | null>(null);

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

  // Helper: clear stale result when pages change
  const clearStaleResult = useCallback(() => {
    if (rotatedPdfUrl) {
      URL.revokeObjectURL(rotatedPdfUrl);
      setRotatedPdfUrl(null);
      setRotatedPdfSize(null);
    }
  }, [rotatedPdfUrl]);

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
    setFiles([]);
    setPages([]);
    setSelectedIds(new Set());
    setErrorMessage(null);
    setRotatedPdfUrl(null);
    setRotatedPdfSize(null);
  }, [rotatedPdfUrl]);

  // ============ 🆕 ROTATE & PREPARE (no auto-download) ============
  const rotateAndPrepare = useCallback(async (): Promise<string | null> => {
    if (pages.length === 0) return null;
    setIsProcessing(true);
    setErrorMessage(null);

    // Clear previous result
    if (rotatedPdfUrl) {
      URL.revokeObjectURL(rotatedPdfUrl);
      setRotatedPdfUrl(null);
    }

    try {
      const url = await generateRotatedPdf(files, pages);
      setRotatedPdfUrl(url);

      // Calculate size
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const sizeKB = blob.size / 1024;
        setRotatedPdfSize(
          sizeKB > 1024
            ? `${(sizeKB / 1024).toFixed(2)} MB`
            : `${Math.round(sizeKB)} KB`
        );
      } catch {
        setRotatedPdfSize(null);
      }

      return url;
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to generate PDF. Please try again.');
      toast.error('Failed to generate PDF');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [files, pages, rotatedPdfUrl, toast]);

  // 🆕 Download the rotated file
  const downloadRotatedFile = useCallback(() => {
    if (!rotatedPdfUrl) return;
    downloadFile(rotatedPdfUrl, `${pdfFilename || 'rotated'}.pdf`);
  }, [rotatedPdfUrl, pdfFilename]);

  // 🆕 Preview in new tab
  const previewRotatedPdf = useCallback(() => {
    if (rotatedPdfUrl) window.open(rotatedPdfUrl, '_blank');
  }, [rotatedPdfUrl]);

  // 🆕 Reset for re-rotating
  const resetRotated = useCallback(() => {
    if (rotatedPdfUrl) {
      URL.revokeObjectURL(rotatedPdfUrl);
      setRotatedPdfUrl(null);
      setRotatedPdfSize(null);
    }
  }, [rotatedPdfUrl]);

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
    rotatedPdfUrl,           // 🆕
    rotatedPdfSize,          // 🆕
    // Computed
    rotatedCount, hasRotations,
    // Setters
    setPdfFilename, setErrorMessage,
    // Actions
    addPdfs, removePage, rotatePage, rotateSelected, rotateAll,
    resetAllRotations, toggleSelect, selectAll, clearSelection, clearAll,
    rotateAndPrepare,        // 🆕 replaces downloadPdf
    downloadRotatedFile,     // 🆕
    previewRotatedPdf,       // 🆕
    resetRotated,            // 🆕
  };
}

export type RotatePdfState = ReturnType<typeof useRotatePdf>;