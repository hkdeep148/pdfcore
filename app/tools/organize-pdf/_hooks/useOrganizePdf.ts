'use client';

import { useState, useCallback } from 'react';
import type { OrganizePdfFile, OrganizePdfPage } from '../../_types';
import { loadPdfPages, buildOrganizedPdf, rotatePageAngle } from '../_utils/pdfOrganizer';
import { downloadFile } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function useOrganizePdf() {
  const toast = useToast();

  const [files, setFiles] = useState<OrganizePdfFile[]>([]);
  const [pages, setPages] = useState<OrganizePdfPage[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<OrganizePdfPage[][]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState('organized-' + new Date().toISOString().slice(0, 10));

  // 🆕 Organized PDF output state
  const [organizedPdfUrl, setOrganizedPdfUrl] = useState<string | null>(null);
  const [organizedPdfSize, setOrganizedPdfSize] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  // ============ HISTORY HELPER ============
  const pushHistory = useCallback((newPages: OrganizePdfPage[]) => {
    setHistory((prev) => [...prev.slice(-9), pages]);
    setPages(newPages);

    // Clear stale result when pages change
    if (organizedPdfUrl) {
      URL.revokeObjectURL(organizedPdfUrl);
      setOrganizedPdfUrl(null);
      setOrganizedPdfSize(null);
    }
  }, [pages, organizedPdfUrl]);

  // ============ ADD PDFs ============
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
        const { fileItem, pages: newPages } = await loadPdfPages(validFiles[i]);
        setFiles((prev) => [...prev, fileItem]);
        setPages((prev) => [...prev, ...newPages]);
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
  }, [toast]);

  // ============ PAGE ACTIONS ============
  const reorderPages = useCallback((newOrder: OrganizePdfPage[]) => {
    pushHistory(newOrder);
  }, [pushHistory]);

  const rotatePage = useCallback((id: string, direction: 'left' | 'right') => {
    pushHistory(
      pages.map((p) =>
        p.id === id ? { ...p, userRotation: rotatePageAngle(p.userRotation, direction) } : p
      )
    );
  }, [pages, pushHistory]);

  const rotateSelected = useCallback((direction: 'left' | 'right') => {
    pushHistory(
      pages.map((p) =>
        selectedIds.has(p.id)
          ? { ...p, userRotation: rotatePageAngle(p.userRotation, direction) }
          : p
      )
    );
  }, [pages, selectedIds, pushHistory]);

  const deletePage = useCallback((id: string) => {
    pushHistory(pages.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [pages, pushHistory]);

  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    pushHistory(pages.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  }, [pages, selectedIds, pushHistory]);

  // ============ SELECTION ============
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

  // ============ UNDO ============
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setPages(previous);
    setHistory((prev) => prev.slice(0, -1));

    // Clear stale result
    if (organizedPdfUrl) {
      URL.revokeObjectURL(organizedPdfUrl);
      setOrganizedPdfUrl(null);
      setOrganizedPdfSize(null);
    }
  }, [history, organizedPdfUrl]);

  // ============ CLEAR ALL ============
  const clearAll = useCallback(() => {
    if (organizedPdfUrl) URL.revokeObjectURL(organizedPdfUrl);
    setFiles([]);
    setPages([]);
    setSelectedIds(new Set());
    setHistory([]);
    setErrorMessage(null);
    setOrganizedPdfUrl(null);
    setOrganizedPdfSize(null);
  }, [organizedPdfUrl]);

  // ============ 🆕 ORGANIZE & PREPARE (no auto-download) ============
  const organizeAndPrepare = useCallback(async (): Promise<string | null> => {
    if (pages.length === 0) {
      toast.error('No pages to save');
      return null;
    }
    setIsProcessing(true);
    setErrorMessage(null);

    // Clear previous result
    if (organizedPdfUrl) {
      URL.revokeObjectURL(organizedPdfUrl);
      setOrganizedPdfUrl(null);
    }

    try {
      const blob = await buildOrganizedPdf(files, pages);
      const url = URL.createObjectURL(blob);
      setOrganizedPdfUrl(url);

      // Calculate size
      const sizeKB = blob.size / 1024;
      setOrganizedPdfSize(
        sizeKB > 1024
          ? `${(sizeKB / 1024).toFixed(2)} MB`
          : `${Math.round(sizeKB)} KB`
      );

      return url;
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to generate PDF.');
      toast.error('Failed to generate PDF');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [files, pages, organizedPdfUrl, toast]);

  // 🆕 Download the organized file
  const downloadOrganizedFile = useCallback(() => {
    if (!organizedPdfUrl) return;
    downloadFile(organizedPdfUrl, `${pdfFilename || 'organized'}.pdf`);
  }, [organizedPdfUrl, pdfFilename]);

  // 🆕 Preview in new tab
  const previewOrganizedPdf = useCallback(() => {
    if (organizedPdfUrl) window.open(organizedPdfUrl, '_blank');
  }, [organizedPdfUrl]);

  // 🆕 Reset for re-organizing
  const resetOrganized = useCallback(() => {
    if (organizedPdfUrl) {
      URL.revokeObjectURL(organizedPdfUrl);
      setOrganizedPdfUrl(null);
      setOrganizedPdfSize(null);
    }
  }, [organizedPdfUrl]);

  // ============ COMPUTED ============
  const canUndo = history.length > 0;
  const totalOriginalPages = files.reduce((sum, f) => sum + f.totalPages, 0);
  const deletedCount = totalOriginalPages - pages.length;
  const rotatedCount = pages.filter((p) => p.userRotation !== 0).length;
  const hasChanges = deletedCount > 0 || rotatedCount > 0 || history.length > 0;

  return {
    // State
    files, pages, selectedIds, isLoadingPdf, loadProgress, isProcessing,
    errorMessage, pdfFilename,
    organizedPdfUrl,          // 🆕
    organizedPdfSize,         // 🆕
    // Computed
    canUndo, totalOriginalPages, deletedCount, rotatedCount, hasChanges,
    // Setters
    setPdfFilename, setErrorMessage,
    // Actions
    addPdfs, reorderPages, rotatePage, rotateSelected, deletePage, deleteSelected,
    toggleSelect, selectAll, clearSelection, undo, clearAll,
    organizeAndPrepare,       // 🆕 replaces downloadPdf
    downloadOrganizedFile,    // 🆕
    previewOrganizedPdf,      // 🆕
    resetOrganized,           // 🆕
  };
}

export type OrganizePdfState = ReturnType<typeof useOrganizePdf>;