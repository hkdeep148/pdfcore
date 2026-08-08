'use client';

import { useState, useCallback } from 'react';
import type { WatermarkPdfFile, WatermarkSettings } from '../../_types';
import { loadPdfInfo, applyWatermark } from '../_utils/watermarker';
import { downloadFile } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

const DEFAULT_SETTINGS: WatermarkSettings = {
  text: 'CONFIDENTIAL',
  fontSize: 'large',
  color: '#EF4444',
  opacity: 0.3,
  rotation: 45,
  position: 'middle-center',
  applyToAllPages: true,
  specificPages: '',
};

export function useAddWatermark() {
  const toast = useToast();

  const [file, setFile] = useState<WatermarkPdfFile | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processProgress, setProcessProgress] = useState(0);

  // 🆕 Watermarked PDF output state
  const [watermarkedPdfUrl, setWatermarkedPdfUrl] = useState<string | null>(null);
  const [watermarkedPdfSize, setWatermarkedPdfSize] = useState<string | null>(null);

  const addPdf = useCallback(async (newFiles: File[]) => {
    const pdfFile = newFiles.find((f) => f.type === 'application/pdf');
    if (!pdfFile) {
      setErrorMessage('Please select a PDF file.');
      toast.error('Please select a PDF file');
      return;
    }
    setErrorMessage(null);
    setIsLoadingPdf(true);

    try {
      const fileItem = await loadPdfInfo(pdfFile);
      setFile(fileItem);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load PDF. It may be corrupted or password-protected.');
      toast.error('Failed to load PDF');
    } finally {
      setIsLoadingPdf(false);
    }
  }, [toast]);

  const clearFile = useCallback(() => {
    if (watermarkedPdfUrl) URL.revokeObjectURL(watermarkedPdfUrl);
    setFile(null);
    setErrorMessage(null);
    setWatermarkedPdfUrl(null);
    setWatermarkedPdfSize(null);
  }, [watermarkedPdfUrl]);

  const updateSettings = useCallback((updates: Partial<WatermarkSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    // Clear stale result when settings change
    if (watermarkedPdfUrl) {
      URL.revokeObjectURL(watermarkedPdfUrl);
      setWatermarkedPdfUrl(null);
      setWatermarkedPdfSize(null);
    }
  }, [watermarkedPdfUrl]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // 🆕 Apply watermark & prepare (no auto-download)
  const applyAndPrepare = useCallback(async (): Promise<string | null> => {
    if (!file) return null;

    if (!settings.text.trim()) {
      toast.error('Please enter watermark text');
      return null;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessProgress(0);

    // Clear previous result
    if (watermarkedPdfUrl) {
      URL.revokeObjectURL(watermarkedPdfUrl);
      setWatermarkedPdfUrl(null);
    }

    try {
      const blob = await applyWatermark(file.file, settings, {
        onProgress: (current: number, total: number) => {
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          setProcessProgress(pct);
        },
      });

      const url = URL.createObjectURL(blob);
      setWatermarkedPdfUrl(url);

      // Calculate size
      const sizeKB = blob.size / 1024;
      setWatermarkedPdfSize(
        sizeKB > 1024
          ? `${(sizeKB / 1024).toFixed(2)} MB`
          : `${Math.round(sizeKB)} KB`
      );

      return url;
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to add watermark';
      setErrorMessage(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
    }
  }, [file, settings, watermarkedPdfUrl, toast]);

  // 🆕 Download the watermarked file
  const downloadWatermarkedFile = useCallback(() => {
    if (!watermarkedPdfUrl || !file) return;
    const watermarkedName = file.name.replace(/\.pdf$/i, '-watermarked.pdf');
    downloadFile(watermarkedPdfUrl, watermarkedName);
  }, [watermarkedPdfUrl, file]);

  // 🆕 Preview in new tab
  const previewWatermarkedPdf = useCallback(() => {
    if (watermarkedPdfUrl) window.open(watermarkedPdfUrl, '_blank');
  }, [watermarkedPdfUrl]);

  // 🆕 Reset for re-applying watermark
  const resetWatermarked = useCallback(() => {
    if (watermarkedPdfUrl) {
      URL.revokeObjectURL(watermarkedPdfUrl);
      setWatermarkedPdfUrl(null);
      setWatermarkedPdfSize(null);
    }
  }, [watermarkedPdfUrl]);

  return {
    // State
    file, settings, isLoadingPdf, isProcessing, errorMessage, processProgress,
    watermarkedPdfUrl,          // 🆕
    watermarkedPdfSize,         // 🆕
    // Setters
    setErrorMessage,
    // Actions
    addPdf, clearFile, updateSettings, resetSettings,
    applyAndPrepare,            // 🆕 replaces downloadWatermarked
    downloadWatermarkedFile,    // 🆕
    previewWatermarkedPdf,      // 🆕
    resetWatermarked,           // 🆕
  };
}

export type AddWatermarkState = ReturnType<typeof useAddWatermark>;