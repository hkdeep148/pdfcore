'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  PdfImageFile,
  PdfImagePage,
  ImageFormat,
  ImageResolution,
} from '../../_types';
import {
  loadPdfPages,
  renderPageAsImage,
  downloadAsZip,
} from '../_utils/pdfToImageConverter';
import { downloadFile, formatBytes } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function usePdfToImage() {
  const toast = useToast();

  // ============ STATE ============
  const [files, setFiles] = useState<PdfImageFile[]>([]);
  const [pages, setPages] = useState<PdfImagePage[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState<ImageFormat>('png');
  const [resolution, setResolution] = useState<ImageResolution>('high');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🆕 Per-page download tracking
  const [downloadingPageId, setDownloadingPageId] = useState<string | null>(null);

  // Conversion result state
  const [conversionResult, setConversionResult] = useState<{
    blobUrl: string;
    filename: string;
    fileSize: string;
    outputCount: number;
    isZip: boolean;
    format: ImageFormat;
  } | null>(null);

  // ⭐ NEW: Individual converted images (for success screen list + gallery)
const [convertedImages, setConvertedImages] = useState<Array<{
  id: string;
  name: string;
  size: string;
  url: string;
  blob: Blob;
}>>([]);

  // Auto-select all pages when they load
  useEffect(() => {
    if (pages.length > 0 && selectedIds.size === 0) {
      setSelectedIds(new Set(pages.map((p) => p.id)));
    }
  }, [pages, selectedIds.size]);

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

  // Helper: clear stale result when pages/settings change
  const clearStaleResult = useCallback(() => {
    if (conversionResult) {
      URL.revokeObjectURL(conversionResult.blobUrl);
      setConversionResult(null);
    }
  }, [conversionResult]);

  const removePage = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    clearStaleResult();
  }, [clearStaleResult]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    clearStaleResult();
  }, [clearStaleResult]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(pages.map((p) => p.id)));
    clearStaleResult();
  }, [pages, clearStaleResult]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    clearStaleResult();
  }, [clearStaleResult]);

const clearAll = useCallback(() => {
  if (conversionResult) URL.revokeObjectURL(conversionResult.blobUrl);
  convertedImages.forEach((img) => URL.revokeObjectURL(img.url));
  setFiles([]);
  setPages([]);
  setSelectedIds(new Set());
  setErrorMessage(null);
  setConversionResult(null);
  setConvertedImages([]); // ⭐ Clean up
}, [conversionResult, convertedImages]);

  // Clear result when format/resolution changes
  const setFormatWithClear = useCallback((fmt: ImageFormat) => {
    setFormat(fmt);
    clearStaleResult();
  }, [clearStaleResult]);

  const setResolutionWithClear = useCallback((res: ImageResolution) => {
    setResolution(res);
    clearStaleResult();
  }, [clearStaleResult]);

  // Get the actual File object for a page
  const getFileForPage = useCallback((page: PdfImagePage): File | null => {
    const fileItem = files.find((f) => f.id === page.pdfId);
    return fileItem?.file ?? null;
  }, [files]);

  // ============ DOWNLOAD ONE (per-page instant download) ============
  const downloadOne = useCallback(async (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;
    const file = getFileForPage(page);
    if (!file) return;

    // ⭐ Use per-page state (NOT isProcessing) so only THIS button shows loading
    setDownloadingPageId(pageId);

    try {
      const blob = await renderPageAsImage(file, page.pageIndex, format, resolution);
      const url = URL.createObjectURL(blob);
      const baseName = page.pdfName.replace(/\.pdf$/i, '');
      const filename = `${baseName}-page-${page.pageIndex + 1}.${format}`;

      // Create download link directly
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Longer cleanup delay for slower connections
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to convert page');
    } finally {
      setDownloadingPageId(null);
    }
  }, [pages, format, resolution, getFileForPage, toast]);

  // ============ CONVERT & PREPARE (no auto-download) ============
  const convertAndPrepare = useCallback(async (): Promise<string | null> => {
    const selectedPages = pages.filter((p) => selectedIds.has(p.id));
    if (selectedPages.length === 0) {
      toast.error('Select pages first');
      return null;
    }

    setIsProcessing(true);
    setProcessProgress(0);
    setErrorMessage(null);

    // Clear previous result
    if (conversionResult) {
      URL.revokeObjectURL(conversionResult.blobUrl);
      setConversionResult(null);
    }

    try {
      let blobUrl: string;
      let filename: string;
      let fileSize: string;
      let isZip = false;

if (selectedPages.length === 1) {
  const page = selectedPages[0];
  const file = getFileForPage(page);
  if (!file) throw new Error('File not found');

  const blob = await renderPageAsImage(file, page.pageIndex, format, resolution);
  blobUrl = URL.createObjectURL(blob);
  const baseName = page.pdfName.replace(/\.pdf$/i, '');
  filename = `${baseName}-page-${page.pageIndex + 1}.${format}`;
  fileSize = formatBytes(blob.size);
  setProcessProgress(100);

  // ⭐ Store single file
  setConvertedImages([{
    id: `img-${page.id}`,
    name: filename,
    size: fileSize,
    url: blobUrl,
    blob,
  }]);
} else {
  // Multiple pages → ZIP + individual files
  const images: { name: string; blob: Blob }[] = [];
  const individualFiles: Array<{
    id: string;
    name: string;
    size: string;
    url: string;
    blob: Blob;
  }> = [];

  for (let i = 0; i < selectedPages.length; i++) {
    const page = selectedPages[i];
    const file = getFileForPage(page);
    if (!file) continue;

    const blob = await renderPageAsImage(file, page.pageIndex, format, resolution);
    const baseName = page.pdfName.replace(/\.pdf$/i, '');
    const imgName = `${baseName}-page-${page.pageIndex + 1}.${format}`;
    const imgUrl = URL.createObjectURL(blob);

    images.push({ name: imgName, blob });
    individualFiles.push({
      id: `img-${page.id}`,
      name: imgName,
      size: formatBytes(blob.size),
      url: imgUrl,
      blob,
    });

    setProcessProgress(((i + 1) / selectedPages.length) * 100);
  }

  // ⭐ Store individual files
  setConvertedImages(individualFiles);

  const zipUrl = await downloadAsZip(images, 'pdf-pages');
  const zipResponse = await fetch(zipUrl);
  const zipBlob = await zipResponse.blob();
  blobUrl = zipUrl;
  filename = `pdf-images-${Date.now()}.zip`;
  fileSize = formatBytes(zipBlob.size);
  isZip = true;
}
      setConversionResult({
        blobUrl,
        filename,
        fileSize,
        outputCount: selectedPages.length,
        isZip,
        format,
      });

      return blobUrl;
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to convert';
      setErrorMessage(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessProgress(0), 500);
    }
  }, [pages, selectedIds, format, resolution, getFileForPage, conversionResult, toast]);

  // Download the converted file
  const downloadConvertedFile = useCallback(() => {
    if (!conversionResult) return;
    downloadFile(conversionResult.blobUrl, conversionResult.filename);
  }, [conversionResult]);

  // Preview in new tab (only for single image, not ZIP)
  const previewConvertedFile = useCallback(() => {
    if (conversionResult && !conversionResult.isZip) {
      window.open(conversionResult.blobUrl, '_blank');
    }
  }, [conversionResult]);

  // Reset for re-converting
  const resetConversion = useCallback(() => {
    if (conversionResult) {
      URL.revokeObjectURL(conversionResult.blobUrl);
      setConversionResult(null);
    }
  }, [conversionResult]);

  return {
    // State
    files, pages, selectedIds, format, resolution,
    isLoadingPdf, loadProgress, isProcessing, processProgress, errorMessage,
    conversionResult,
    downloadingPageId,      
    convertedImages,        // 🆕 EXPORT THIS
    // Setters
    setFormat: setFormatWithClear,
    setResolution: setResolutionWithClear,
    setErrorMessage,
    // Actions
    addPdfs, removePage, toggleSelect, selectAll, clearSelection,
    clearAll, downloadOne,
    convertAndPrepare,
    downloadConvertedFile,
    previewConvertedFile,
    resetConversion,
  };
}

export type PdfToImageState = ReturnType<typeof usePdfToImage>;