'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  ImageItem,
  PageSize,
  Orientation,
  PageFit,
  Margins,
  ImageQuality,
  Alignment,
  PageBackground,
} from '../../_types';
import {
  generatePdf,
  generateSeparatePdfs,
  PAGE_ASPECT_RATIOS,
  MARGIN_PREVIEW_PERCENT,
} from '../_utils/pdfGenerator';
import { downloadFile } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function useImageToPdf() {
  const toast = useToast();

  // ============ STATE ============
  const [images, setImages] = useState<ImageItem[]>([]);
const [pageSize, setPageSize] = useState<PageSize>('A4');
/*
  orientationMode tracks the user's INTENT:
    'Auto'      — each image derives its own orientation from its aspect ratio
    'Portrait'  — force all images to portrait
    'Landscape' — force all images to landscape
  Default is 'Auto' so first-time users get sensible per-image layout.
*/
const [orientationMode, setOrientationMode] =
  useState<'Auto' | Orientation>('Auto');
/*
  orientation stays typed as Orientation (portrait/landscape only) —
  this is the FALLBACK value used when an image has no per-image
  override. In Auto mode we still keep this at 'Portrait' as a
  neutral default; the per-image overrides drive the actual layout.
*/
const [orientation, setOrientation] = useState<Orientation>('Portrait');
  const [pageFit, setPageFit] = useState<PageFit>('Fit to page');
  const [margins, setMargins] = useState<Margins>('Normal');
  const [quality, setQuality] = useState<ImageQuality>('High quality');
  const [alignment, setAlignment] = useState<Alignment>('Center');
  const [pageBackground, setPageBackground] = useState<PageBackground>('White');
  const [isConverting, setIsConverting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [lastPdfUrl, setLastPdfUrl] = useState<string | null>(null);
  const [lastPdfSize, setLastPdfSize] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState(
    'PDF_' + new Date().toISOString().slice(0, 10).replace(/-/g, '')
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ⭐ Separate PDFs mode
  const [createSeparate, setCreateSeparate] = useState(false);
  const [isZip, setIsZip] = useState(false); // whether last output was a zip

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // ============ COMPUTED ============
  const currentPageRatio = useMemo(() => {
    const baseRatio = PAGE_ASPECT_RATIOS[pageSize];
    return orientation === 'Portrait' ? baseRatio : 1 / baseRatio;
  }, [pageSize, orientation]);

  const marginPercent = MARGIN_PREVIEW_PERCENT[margins];

  // ============ EFFECTS ============
  useEffect(() => {
    if (images.length === 0) {
      setSelectedId(null);
    } else if (!selectedId || !images.some((i) => i.id === selectedId)) {
      setSelectedId(images[0].id);
    }
  }, [images, selectedId]);

  // ============ ACTIONS ============
  const addImages = useCallback((files: File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = files.filter((f) => validTypes.includes(f.type));
    if (validFiles.length === 0 && files.length > 0) {
      setErrorMessage('Only JPG, PNG, and WEBP images are supported.');
      toast.error('Only JPG, PNG, and WEBP images are supported');
      return;
    }
    setErrorMessage(null);
    setIsReady(false);

    validFiles.forEach((file) => {
      const preview = URL.createObjectURL(file);
      const img = new Image();
img.onload = () => {
  /*
    If Auto mode is active, stamp the new image with its natural
    orientation right away. This way per-image previews reflect
    Auto behavior immediately — no extra user action needed.
  */
  const autoOrientation: Orientation =
    orientationMode === 'Auto'
      ? img.naturalWidth > img.naturalHeight
        ? 'Landscape'
        : 'Portrait'
      : undefined as unknown as Orientation;

  const newItem: ImageItem = {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    file,
    preview,
    sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    width: img.naturalWidth,
    height: img.naturalHeight,
    rotation: 0,
    scale: 1,
    ...(orientationMode === 'Auto'
      ? { pageSize, orientation: autoOrientation }
      : {}),
  };
  setImages((prev) => [...prev, newItem]);
};
      img.onerror = () => {
        URL.revokeObjectURL(preview);
        console.error(`Failed to load image: ${file.name}`);
        toast.error(`Could not read "${file.name}"`);
      };
      img.src = preview;
    });
  }, [toast]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
    setIsReady(false);
  }, []);

  const rotateImage = useCallback((id: string, direction: 'left' | 'right' = 'right') => {
    setImages((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextDeg =
          direction === 'right'
            ? (((item.rotation + 90) % 360) as 0 | 90 | 180 | 270)
            : (((item.rotation + 270) % 360) as 0 | 90 | 180 | 270);
        return { ...item, rotation: nextDeg };
      })
    );
    setIsReady(false);
  }, []);

const updateImageSize = useCallback(
  (id: string, pageSize?: PageSize, orientation?: Orientation) => {
    setImages((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, pageSize, orientation }
          : item
      )
    );
    setIsReady(false);
  },
  []
);

/*
  Apply Auto orientation to every image based on its own aspect ratio.
  Landscape-shaped images get Landscape; portrait/square get Portrait.
  Called automatically whenever new images arrive AND Auto mode is on.
*/
const applyAutoOrientationToAll = useCallback(() => {
  setImages((prev) =>
    prev.map((item) => ({
      ...item,
      pageSize,
      orientation: item.width > item.height ? 'Landscape' : 'Portrait',
    }))
  );
  setIsReady(false);
}, [pageSize]);

/*
  Wrapper the UI calls when the user picks from the orientation
  dropdown. Handles the 'Auto' branch centrally so mobile and desktop
  behave the same way.
*/
const setOrientationChoice = useCallback(
  (choice: 'Auto' | Orientation) => {
    setOrientationMode(choice);
    setIsReady(false);
    if (choice === 'Auto') {
      // Apply per-image auto to existing images immediately
      setImages((prev) =>
        prev.map((item) => ({
          ...item,
          pageSize,
          orientation: item.width > item.height ? 'Landscape' : 'Portrait',
        }))
      );
    } else {
      // Explicit choice — clear per-image overrides so the global
      // orientation value drives every image.
      setOrientation(choice);
      setImages((prev) =>
        prev.map((item) => ({
          ...item,
          pageSize: undefined,
          orientation: undefined,
        }))
      );
    }
  },
  [pageSize]
);

  const clearAll = useCallback(() => {
    images.forEach((i) => URL.revokeObjectURL(i.preview));
    if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
    setImages([]);
    setIsReady(false);
    setLastPdfUrl(null);
    setLastPdfSize(null);
    setErrorMessage(null);
    setPdfBlob(null);
    setIsZip(false);
  }, [images, lastPdfUrl]);

  const reorderImages = useCallback((newOrder: ImageItem[]) => {
    setImages(newOrder);
    setIsReady(false);
  }, []);

// ⭐ Reset ready state when toggling mode
useEffect(() => {
  setIsReady(false);
}, [createSeparate]);

/*
  When pageSize changes while in Auto mode, re-stamp existing
  images so their per-image pageSize stays in sync.
*/
useEffect(() => {
  if (orientationMode !== 'Auto') return;
  setImages((prev) =>
    prev.map((item) => ({
      ...item,
      pageSize,
      orientation: item.width > item.height ? 'Landscape' : 'Portrait',
    }))
  );
  setIsReady(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [pageSize, orientationMode]);

  // ═════════ SINGLE PDF ═════════
  const createSinglePdf = useCallback(async (): Promise<string | null> => {
    if (images.length === 0) return null;
    setIsConverting(true);
    setErrorMessage(null);
    try {
      const url = await generatePdf({
        images,
        pageSize,
        orientation,
        pageFit,
        margins,
        alignment,
        background: pageBackground,
        quality,
      });
      if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
      setLastPdfUrl(url);
      setIsZip(false);

      try {
        const res = await fetch(url);
        const blob = await res.blob();
        setPdfBlob(blob);
        const sizeKB = blob.size / 1024;
        setLastPdfSize(
          sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${Math.round(sizeKB)} KB`
        );
      } catch {
        setLastPdfSize(null);
      }

      setIsReady(true);
      return url;
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please try again.');
      toast.error('Failed to create PDF');
      return null;
    } finally {
      setIsConverting(false);
    }
  }, [images, pageSize, orientation, pageFit, margins, alignment, pageBackground, quality, lastPdfUrl, toast]);

  // ═════════ SEPARATE PDFs → ZIP ═════════
  const createZip = useCallback(async (): Promise<string | null> => {
    if (images.length === 0) return null;
    setIsConverting(true);
    setErrorMessage(null);
    try {
      const [{ default: JSZip }, results] = await Promise.all([
        import('jszip'),
        generateSeparatePdfs({
          images,
          pageSize,
          orientation,
          pageFit,
          margins,
          alignment,
          background: pageBackground,
          quality,
        }),
      ]);

      const zip = new JSZip();

      // Handle duplicate filenames by appending index
      const usedNames = new Set<string>();
      results.forEach((result, idx) => {
        let finalName = result.name;
        if (usedNames.has(finalName)) {
          const base = finalName.replace(/\.pdf$/i, '');
          finalName = `${base}_${idx + 1}.pdf`;
        }
        usedNames.add(finalName);
        zip.file(finalName, result.blob);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
      const url = URL.createObjectURL(zipBlob);
      setLastPdfUrl(url);
      setPdfBlob(zipBlob);
      setIsZip(true);

      const sizeKB = zipBlob.size / 1024;
      setLastPdfSize(
        sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${Math.round(sizeKB)} KB`
      );

      setIsReady(true);
      return url;
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please try again.');
      toast.error('Failed to create ZIP');
      return null;
    } finally {
      setIsConverting(false);
    }
  }, [images, pageSize, orientation, pageFit, margins, alignment, pageBackground, quality, lastPdfUrl, toast]);

  // ⭐ Unified entry point — routes based on toggle
  const createPdf = useCallback(async (): Promise<string | null> => {
    return createSeparate ? createZip() : createSinglePdf();
  }, [createSeparate, createZip, createSinglePdf]);

  const downloadPdf = useCallback(async () => {
    const url = lastPdfUrl && isReady ? lastPdfUrl : await createPdf();
    if (!url) return;
    const filename = isZip
      ? `${pdfFilename || 'documents'}.zip`
      : `${pdfFilename || 'document'}.pdf`;
    downloadFile(url, filename);
  }, [lastPdfUrl, isReady, isZip, pdfFilename, createPdf]);

  const previewPdf = useCallback(async () => {
    if (isZip) {
      // ZIPs can't be previewed — download instead
      return downloadPdf();
    }
    const url = lastPdfUrl && isReady ? lastPdfUrl : await createPdf();
    if (url) window.open(url, '_blank');
  }, [lastPdfUrl, isReady, isZip, createPdf, downloadPdf]);

return {
  // State
    images,
    pageSize,
    orientation,
    orientationMode,      // ⭐ 'Auto' | 'Portrait' | 'Landscape'
    pageFit,
    margins,
    quality,
    alignment,
    pageBackground,
    isConverting,
    isReady,
    errorMessage,
    pdfFilename,
    selectedId,
    lastPdfUrl,
    lastPdfSize,
    // ⭐ Separate PDFs
    createSeparate,
    setCreateSeparate,
    isZip,
    // Computed
    currentPageRatio,
    marginPercent,
    // Setters
    setPageSize,
    setOrientation,
    setOrientationChoice,   // ⭐ unified setter — use this from UI
    setPageFit,
    setMargins,
    setQuality,
    setAlignment,
    setPageBackground,
    setPdfFilename,
    setSelectedId,
    setErrorMessage,
    // Actions
    addImages,
    removeImage,
    rotateImage,
    updateImageSize,
    clearAll,
    reorderImages,
    createPdf,
    downloadPdf,
    previewPdf,

    // Success screen
    pdfBlob,
    pdfUrl: lastPdfUrl,
    pdfName: isZip
      ? `${pdfFilename || 'documents'}.zip`
      : `${pdfFilename || 'document'}.pdf`,
    pdfSize: pdfBlob?.size || 0,
    pageCount: images.length,
  };
}

export type ImageToPdfState = ReturnType<typeof useImageToPdf>;