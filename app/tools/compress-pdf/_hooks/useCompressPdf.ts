'use client';

import { useState, useCallback } from 'react';
import type { CompressPdfItem, CompressionLevel } from '../../_types';
import { compressPdf, calculateSavings } from '../_utils/pdfCompressor';
import { downloadFile, formatBytes } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function useCompressPdf() {
  const toast = useToast();

  const [items, setItems] = useState<CompressPdfItem[]>([]);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ============ ACTIONS ============
  const addPdfs = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((f) => f.type === 'application/pdf');
    if (validFiles.length === 0 && newFiles.length > 0) {
      setErrorMessage('Please select PDF files only.');
      toast.error('Only PDF files are supported');
      return;
    }
    setErrorMessage(null);

    const newItems: CompressPdfItem[] = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      originalSizeBytes: file.size,
      originalSizeMB: formatBytes(file.size),
      status: 'pending',
      progress: 0, // ⭐ NEW
    }));

    setItems((prev) => [...prev, ...newItems]);

  }, [toast]);

  const recompressAll = useCallback(() => {
  // Reset all done items to pending so they can be recompressed
  setItems((prev) =>
    prev.map((it) => ({
      ...it,
      status: 'pending' as const,
      progress: 0,
      compressedBlob: undefined,
      compressedSizeBytes: undefined,
      compressedSizeMB: undefined,
      savedPercent: undefined,
    }))
  );
}, []);

  const removePdf = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setErrorMessage(null);
  }, []);

  const compressAll = useCallback(async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      // Update status to compressing (reset progress)
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? { ...it, status: 'compressing' as const, progress: 0 }
            : it
        )
      );

      try {
        // ⭐ Pass progress callback
        const compressedBlob = await compressPdf(item.file, level, (current, total) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, progress: pct } : it
            )
          );
        });

        const savedPercent = calculateSavings(item.originalSizeBytes, compressedBlob.size);

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  compressedBlob,
                  compressedSizeBytes: compressedBlob.size,
                  compressedSizeMB: formatBytes(compressedBlob.size),
                  savedPercent,
                  status: 'done' as const,
                  progress: 100,
                }
              : it
          )
        );
        successCount++;
      } catch (err) {
        console.error('Compression failed:', err);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: 'error' as const,
                  errorMessage: 'Compression failed',
                  progress: 0,
                }
              : it
          )
        );
        failCount++;
      }
    }

    setIsProcessing(false);

    if (failCount > 0) {
      toast.error(`${failCount} PDF${failCount > 1 ? 's' : ''} failed to compress`);
    }
  }, [items, level, toast]);

  const downloadOne = useCallback((id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item?.compressedBlob) return;

    const url = URL.createObjectURL(item.compressedBlob);
    const compressedName = item.name.replace(/\.pdf$/i, '-compressed.pdf');
    downloadFile(url, compressedName);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('PDF downloaded!');
  }, [items, toast]);

  const downloadAll = useCallback(async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.compressedBlob);
    if (doneItems.length === 0) {
      return;
    }

    for (const item of doneItems) {
      if (!item.compressedBlob) continue;
      const url = URL.createObjectURL(item.compressedBlob);
      const compressedName = item.name.replace(/\.pdf$/i, '-compressed.pdf');
      downloadFile(url, compressedName);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      await new Promise((r) => setTimeout(r, 200));
    }

  }, [items, toast]);

  // ============ COMPUTED ============
  const totalOriginalBytes = items.reduce((sum, it) => sum + it.originalSizeBytes, 0);
  const totalCompressedBytes = items.reduce(
    (sum, it) => sum + (it.compressedSizeBytes || 0),
    0
  );
  const totalSaved = items.filter((it) => it.status === 'done').length;
  const totalSavedPercent = totalOriginalBytes > 0
    ? calculateSavings(totalOriginalBytes, totalCompressedBytes || totalOriginalBytes)
    : 0;

  return {
    // State
    items, level, isProcessing, errorMessage,
    // Computed
    totalOriginalBytes, totalCompressedBytes, totalSaved, totalSavedPercent,
    // Setters
    setLevel, setErrorMessage,
    // Actions
    addPdfs, removePdf, clearAll, compressAll, downloadOne, downloadAll,
  recompressAll,
  };
}

export type CompressPdfState = ReturnType<typeof useCompressPdf>;