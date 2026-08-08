'use client';

import { useState, useCallback } from 'react';
import type { MergePdfItem } from '../../_types';
import { loadPdfInfo, mergePdfs } from '../_utils/pdfMerger';
import { downloadFile, formatBytes } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export interface MergeResult {
  blobUrl: string;
  mergedSizeBytes: number;
  mergedSizeMB: string;
  totalPages: number;
  filesCount: number;
}

export function useMergePdf() {
  const toast = useToast();

  const [items, setItems] = useState<MergePdfItem[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState(
    'merged-' + new Date().toISOString().slice(0, 10)
  );

  // Merge result state
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);

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

    // Clear previous merge result when adding new files
    if (mergeResult) {
      URL.revokeObjectURL(mergeResult.blobUrl);
      setMergeResult(null);
    }

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const item = await loadPdfInfo(validFiles[i]);
        setItems((prev) => [...prev, item]);
        setLoadProgress(((i + 1) / validFiles.length) * 100);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load PDF. It may be corrupted or password-protected.');
      toast.error('Failed to load PDF');
    } finally {
      setIsLoadingPdf(false);
      setTimeout(() => setLoadProgress(0), 500);
    }
  }, [toast, mergeResult]);

  const removePdf = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // Clear merge result when list changes
    if (mergeResult) {
      URL.revokeObjectURL(mergeResult.blobUrl);
      setMergeResult(null);
    }
  }, [mergeResult]);

  const reorderPdfs = useCallback((newOrder: MergePdfItem[]) => {
    setItems(newOrder);
    // Clear merge result when order changes
    if (mergeResult) {
      URL.revokeObjectURL(mergeResult.blobUrl);
      setMergeResult(null);
    }
  }, [mergeResult]);

  const clearAll = useCallback(() => {
    setItems([]);
    setErrorMessage(null);
    if (mergeResult) {
      URL.revokeObjectURL(mergeResult.blobUrl);
      setMergeResult(null);
    }
  }, [mergeResult]);

  const movePdf = useCallback((id: string, direction: 'up' | 'down') => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }, []);

  // ⭐ Just merge (no compression, no auto-download)
  const performMerge = useCallback(async () => {
    if (items.length < 2) {
      toast.info('Add at least 2 PDFs to merge');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Clear previous result
    if (mergeResult) {
      URL.revokeObjectURL(mergeResult.blobUrl);
      setMergeResult(null);
    }

    try {
      const url = await mergePdfs(items);

      // Get merged file size
      const response = await fetch(url);
      const blob = await response.blob();
      const mergedSize = blob.size;
      const totalPagesCount = items.reduce((sum, item) => sum + item.totalPages, 0);

      setMergeResult({
        blobUrl: url,
        mergedSizeBytes: mergedSize,
        mergedSizeMB: formatBytes(mergedSize),
        totalPages: totalPagesCount,
        filesCount: items.length,
      });

    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to merge PDFs. Please try again.');
      toast.error('Failed to merge PDFs');
    } finally {
      setIsProcessing(false);
    }
  }, [items, toast, mergeResult]);

  // Download merged file
  const downloadMerged = useCallback(() => {
    if (!mergeResult) return;
    downloadFile(mergeResult.blobUrl, `${pdfFilename || 'merged'}.pdf`);
  }, [mergeResult, pdfFilename]);

  // Preview merged PDF in new tab
  const previewMerged = useCallback(() => {
    if (mergeResult) window.open(mergeResult.blobUrl, '_blank');
  }, [mergeResult]);

  // Reset merge result to allow re-merging
  const resetMerge = useCallback(() => {
    if (mergeResult) {
      URL.revokeObjectURL(mergeResult.blobUrl);
      setMergeResult(null);
    }
  }, [mergeResult]);

  // Computed
  const totalPages = items.reduce((sum, item) => sum + item.totalPages, 0);
  const totalSizeMB = (items.reduce((sum, item) => sum + item.file.size, 0) / 1024 / 1024).toFixed(2);

  return {
    // State
    items, isLoadingPdf, loadProgress, isProcessing, errorMessage, pdfFilename,
    mergeResult,
    // Computed
    totalPages, totalSizeMB,
    // Setters
    setPdfFilename, setErrorMessage,
    // Actions
    addPdfs, removePdf, reorderPdfs, movePdf, clearAll,
    performMerge, downloadMerged, previewMerged, resetMerge,
  };
}

export type MergePdfState = ReturnType<typeof useMergePdf>;