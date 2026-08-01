'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SplitPdfFile, SplitPdfPage, SplitMode, PagesExtractMode } from '../../_types';
import {
  loadPdfPages,
  parsePageRanges,
  splitPdf,
  downloadAsZip,
  calculateSizeBasedGroups,
  formatBytes,
  mbToBytes,
} from '../_utils/pdfSplitter';
import { downloadFile } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function useSplitPdf() {
  const toast = useToast();

  const [file, setFile] = useState<SplitPdfFile | null>(null);
  const [pages, setPages] = useState<SplitPdfPage[]>([]);
  const [mode, setMode] = useState<SplitMode>('pages');
  const [rangeInput, setRangeInput] = useState<string>('');

  // Pages mode
  const [extractMode, setExtractMode] = useState<PagesExtractMode>('all');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [selectPagesInput, setSelectPagesInput] = useState<string>('');
  const [mergeExtracted, setMergeExtracted] = useState<boolean>(false);

  // Size mode
  const [maxSizeMB, setMaxSizeMB] = useState<number>(10);
  const [sizeGroups, setSizeGroups] = useState<number[][]>([]);
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🆕 Split result state
  const [splitResult, setSplitResult] = useState<{
    blobUrl: string;
    filename: string;
    fileSize: string;
    outputCount: number;
    isZip: boolean;
    totalPages: number;
  } | null>(null);

  // Recalculate size groups when file or maxSize changes
  useEffect(() => {
    if (mode !== 'size' || !file) {
      setSizeGroups([]);
      return;
    }

    const calculate = async () => {
      setIsCalculatingSize(true);
      try {
        const groups = await calculateSizeBasedGroups(file.file, mbToBytes(maxSizeMB));
        setSizeGroups(groups);
      } catch (err) {
        console.error(err);
        setSizeGroups([]);
      } finally {
        setIsCalculatingSize(false);
      }
    };

    const timer = setTimeout(calculate, 400);
    return () => clearTimeout(timer);
  }, [file, mode, maxSizeMB]);

  // ============ ADD PDF ============
  const addPdf = useCallback(async (newFiles: File[]) => {
    const pdfFile = newFiles.find((f) => f.type === 'application/pdf');
    if (!pdfFile) {
      setErrorMessage('Please select a PDF file.');
      toast.error('Please select a PDF file');
      return;
    }
    setErrorMessage(null);
    setIsLoadingPdf(true);
    setLoadProgress(0);

    try {
      const { fileItem, pages: newPages } = await loadPdfPages(pdfFile);
      setFile(fileItem);
      setPages(newPages);
      setSelectedPages(new Set());
      setSelectPagesInput('');
      setSizeGroups([]);
      setLoadProgress(100);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load PDF. It may be corrupted or password-protected.');
      toast.error('Failed to load PDF');
    } finally {
      setIsLoadingPdf(false);
      setTimeout(() => setLoadProgress(0), 500);
    }
  }, [toast]);

  const clearFile = useCallback(() => {
    if (splitResult) URL.revokeObjectURL(splitResult.blobUrl);
    setFile(null);
    setPages([]);
    setRangeInput('');
    setSelectedPages(new Set());
    setSelectPagesInput('');
    setSizeGroups([]);
    setErrorMessage(null);
    setSplitResult(null);
  }, [splitResult]);

  // Update input from selection (bidirectional)
  const updateInputFromSelection = useCallback((newSelection: Set<number>) => {
    const sorted = Array.from(newSelection).sort((a, b) => a - b);
    if (sorted.length === 0) {
      setSelectPagesInput('');
      return;
    }
    const ranges: string[] = [];
    let start = sorted[0];
    let prev = sorted[0];
    for (let i = 1; i <= sorted.length; i++) {
      if (i === sorted.length || sorted[i] !== prev + 1) {
        if (start === prev) ranges.push(`${start + 1}`);
        else ranges.push(`${start + 1}-${prev + 1}`);
        if (i < sorted.length) {
          start = sorted[i];
          prev = sorted[i];
        }
      } else {
        prev = sorted[i];
      }
    }
    setSelectPagesInput(ranges.join(','));
  }, []);

  const handleTogglePage = useCallback((pageIndex: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageIndex)) next.delete(pageIndex);
      else next.add(pageIndex);
      updateInputFromSelection(next);
      return next;
    });
  }, [updateInputFromSelection]);

  // Sync input → selected pages
  useEffect(() => {
    if (mode !== 'pages' || extractMode !== 'select' || !file) return;
    if (!selectPagesInput.trim()) {
      setSelectedPages(new Set());
      return;
    }
    try {
      const groups = parsePageRanges(selectPagesInput, file.totalPages);
      const allPages = new Set<number>();
      groups.forEach((group) => group.forEach((p) => allPages.add(p)));
      setSelectedPages(allPages);
    } catch {}
  }, [selectPagesInput, mode, extractMode, file]);

  // ============ COMPUTE PAGE GROUPS ============
  const getPageGroups = useCallback((): number[][] => {
    if (!file) return [];

    if (mode === 'pages') {
      if (extractMode === 'all') {
        return pages.map((p) => [p.pageIndex]);
      }
      if (extractMode === 'select') {
        if (selectedPages.size === 0) return [];
        const selected = Array.from(selectedPages).sort((a, b) => a - b);
        if (mergeExtracted) return [selected];
        return selected.map((p) => [p]);
      }
    }

    if (mode === 'range') {
      try {
        return parsePageRanges(rangeInput, file.totalPages);
      } catch {
        return [];
      }
    }

    if (mode === 'size') {
      return sizeGroups;
    }

    return [];
  }, [file, pages, mode, extractMode, selectedPages, mergeExtracted, rangeInput, sizeGroups]);

  const getRangeError = useCallback((): string | null => {
    if (mode !== 'range' || !file || !rangeInput.trim()) return null;
    try {
      parsePageRanges(rangeInput, file.totalPages);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Invalid range';
    }
  }, [mode, rangeInput, file]);

  const getSelectError = useCallback((): string | null => {
    if (mode !== 'pages' || extractMode !== 'select' || !file || !selectPagesInput.trim()) return null;
    try {
      parsePageRanges(selectPagesInput, file.totalPages);
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : 'Invalid range';
    }
  }, [mode, extractMode, selectPagesInput, file]);

  // ============ 🆕 SPLIT & PREPARE (no auto-download) ============
  const splitAndPrepare = useCallback(async () => {
    if (!file) return null;
    const pageGroups = getPageGroups();

    if (pageGroups.length === 0) {
      toast.error('No valid pages to split. Check your input.');
      return null;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Clear previous result
    if (splitResult) {
      URL.revokeObjectURL(splitResult.blobUrl);
      setSplitResult(null);
    }

    try {
      const results = await splitPdf(file.file, pageGroups);
      let blobUrl: string;
      let filename: string;
      let fileSize: string;
      let isZip = false;

      if (results.length === 1) {
        blobUrl = URL.createObjectURL(results[0].blob);
        filename = results[0].name;
        fileSize = formatBytes(results[0].blob.size);
      } else {
        const zipUrl = await downloadAsZip(results);
        const zipResponse = await fetch(zipUrl);
        const zipBlob = await zipResponse.blob();
        blobUrl = zipUrl;
        filename = file.name.replace(/\.pdf$/i, '-split.zip');
        fileSize = formatBytes(zipBlob.size);
        isZip = true;
      }

      const totalPagesInGroups = pageGroups.reduce((sum, g) => sum + g.length, 0);

      setSplitResult({
        blobUrl,
        filename,
        fileSize,
        outputCount: results.length,
        isZip,
        totalPages: totalPagesInGroups,
      });

      return blobUrl;
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to split PDF';
      setErrorMessage(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [file, getPageGroups, splitResult, toast]);

  // 🆕 Download the prepared file
  const downloadSplitFile = useCallback(() => {
    if (!splitResult) return;
    downloadFile(splitResult.blobUrl, splitResult.filename);
  }, [splitResult]);

  // 🆕 Preview in new tab (only for single PDF, not ZIP)
  const previewSplitFile = useCallback(() => {
    if (splitResult && !splitResult.isZip) {
      window.open(splitResult.blobUrl, '_blank');
    }
  }, [splitResult]);

  // 🆕 Reset for re-splitting
  const resetSplit = useCallback(() => {
    if (splitResult) {
      URL.revokeObjectURL(splitResult.blobUrl);
      setSplitResult(null);
    }
  }, [splitResult]);

  // ============ COMPUTED ============
  const pageGroups = getPageGroups();
  const outputCount = pageGroups.length;
  const rangeError = getRangeError();
  const selectError = getSelectError();
  const canSplit = file !== null && pageGroups.length > 0 && !rangeError && !selectError && !isCalculatingSize;

  return {
  // State
  file, pages, mode, rangeInput,
  extractMode, selectedPages, selectPagesInput, mergeExtracted,
  maxSizeMB, sizeGroups, isCalculatingSize,
  isLoadingPdf, loadProgress, isProcessing, errorMessage,
  splitResult,
  // Computed
  pageGroups, outputCount, rangeError, selectError, canSplit,
  // Setters
  setMode, setRangeInput,
  setExtractMode, setSelectPagesInput, setMergeExtracted,
  setMaxSizeMB,
  setErrorMessage,
  // Actions
  addPdf, clearFile,
  splitAndPrepare,
  downloadSplitFile,
  previewSplitFile,
  resetSplit,
  togglePageSelection: handleTogglePage,
  // Utilities
  formatBytes,
  // 🩹 Backward compat for desktop
  splitAndDownload: async () => {
    const url = await splitAndPrepare();
    if (url) downloadSplitFile();
  },
};
}

export type SplitPdfState = ReturnType<typeof useSplitPdf>;