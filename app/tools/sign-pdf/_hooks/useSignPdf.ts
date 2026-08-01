'use client';

import { useState, useCallback } from 'react';
import type {
  SignPdfFile,
  Signature,
  PlacedSignature,
  SignatureMode,
} from '../../_types';
import {
  loadPdfFile,
  signPdf,
  createSignatureFromCanvas,
  createSignatureFromText,
  createSignatureFromImage,
  DEFAULT_INK_COLOR,
  DEFAULT_PEN_SIZE,
} from '../_utils/signer';
import { downloadFile } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function useSignPdf() {
  const toast = useToast();

  // ============ STATE ============
  const [file, setFile] = useState<SignPdfFile | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
  const [activeSignatureId, setActiveSignatureId] = useState<string | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Signature creation state
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('draw');
  const [inkColor, setInkColor] = useState<string>(DEFAULT_INK_COLOR);
  const [penSize, setPenSize] = useState<number>(DEFAULT_PEN_SIZE);
  const [typedText, setTypedText] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('"Dancing Script", cursive');

  // Loading states
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🆕 Signed PDF output state
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [signedPdfSize, setSignedPdfSize] = useState<string | null>(null);

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

    try {
      const fileItem = await loadPdfFile(pdfFile);
      setFile(fileItem);
      setCurrentPageIndex(0);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load PDF. It may be corrupted or password-protected.');
      toast.error('Failed to load PDF');
    } finally {
      setIsLoadingPdf(false);
    }
  }, [toast]);

  const clearFile = useCallback(() => {
    if (signedPdfUrl) URL.revokeObjectURL(signedPdfUrl);
    setFile(null);
    setSignatures([]);
    setPlacedSignatures([]);
    setActiveSignatureId(null);
    setCurrentPageIndex(0);
    setErrorMessage(null);
    setSignedPdfUrl(null);
    setSignedPdfSize(null);
  }, [signedPdfUrl]);

  // ============ CREATE SIGNATURES ============

  const createDrawnSignature = useCallback((canvas: HTMLCanvasElement) => {
    try {
      const signature = createSignatureFromCanvas(canvas);
      setSignatures((prev) => [...prev, signature]);
      setActiveSignatureId(signature.id);
      return signature;
    } catch (err) {
      console.error(err);
      toast.error('Failed to create signature');
      return null;
    }
  }, [toast]);

  const createTypedSignature = useCallback(() => {
    if (!typedText.trim()) {
      toast.error('Please type your name');
      return null;
    }
    try {
      const signature = createSignatureFromText(
        typedText.trim(),
        selectedFont,
        inkColor
      );
      setSignatures((prev) => [...prev, signature]);
      setActiveSignatureId(signature.id);
      return signature;
    } catch (err) {
      console.error(err);
      toast.error('Failed to create signature');
      return null;
    }
  }, [typedText, selectedFont, inkColor, toast]);

  const createUploadedSignature = useCallback(async (imageFile: File) => {
    try {
      const signature = await createSignatureFromImage(imageFile);
      setSignatures((prev) => [...prev, signature]);
      setActiveSignatureId(signature.id);
      return signature;
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload signature');
      return null;
    }
  }, [toast]);

  // ============ REMOVE SIGNATURE ============

  const removeSignature = useCallback((signatureId: string) => {
    setSignatures((prev) => prev.filter((s) => s.id !== signatureId));
    setPlacedSignatures((prev) => prev.filter((p) => p.signatureId !== signatureId));
    if (activeSignatureId === signatureId) {
      setActiveSignatureId(null);
    }
  }, [activeSignatureId]);

  // ============ PLACE SIGNATURE ============

  const placeSignature = useCallback((
    signatureId: string,
    pageIndex: number,
    x: number,
    y: number,
    dw?: number,
    dh?: number
  ) => {
    const signature = signatures.find((s) => s.id === signatureId);
    if (!signature) return;

    const maxWidth = 200;
    const scale = signature.width > maxWidth ? maxWidth / signature.width : 1;
    const width = signature.width * scale;
    const height = signature.height * scale;

    const displayWidth = dw && dw > 0 ? dw : 550;
    const displayHeight = dh && dh > 0 ? dh : 750;

    const placed: PlacedSignature = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      signatureId,
      pageIndex,
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      displayWidth,
      displayHeight,
    };

    setPlacedSignatures((prev) => [...prev, placed]);
  }, [signatures]);

  const placeSignatureExact = useCallback((
    signatureId: string,
    pageIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
    displayWidth: number,
    displayHeight: number
  ) => {
    const signature = signatures.find((s) => s.id === signatureId);
    if (!signature) return;

    if (!displayWidth || !displayHeight || displayWidth <= 0 || displayHeight <= 0) {
      console.error('❌ placeSignatureExact called without valid display dimensions!');
      toast.error('Failed to place signature. Please try again.');
      return;
    }

    const placed: PlacedSignature = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      signatureId,
      pageIndex,
      x,
      y,
      width,
      height,
      displayWidth,
      displayHeight,
    };

    setPlacedSignatures((prev) => [...prev, placed]);
  }, [signatures, toast]);

  const updatePlacedSignature = useCallback((
    placedId: string,
    updates: Partial<PlacedSignature>
  ) => {
    setPlacedSignatures((prev) =>
      prev.map((p) => (p.id === placedId ? { ...p, ...updates } : p))
    );
  }, []);

  const removePlacedSignature = useCallback((placedId: string) => {
    setPlacedSignatures((prev) => prev.filter((p) => p.id !== placedId));
  }, []);

  // ============ 🆕 SIGN PDF (generates + stores blob URL) ============

  const signAndPreparePdf = useCallback(async (): Promise<string | null> => {
    if (!file) return null;

    if (placedSignatures.length === 0) {
      toast.error('Please place at least one signature on the PDF');
      return null;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const blob = await signPdf(file.file, signatures, placedSignatures);
      const url = URL.createObjectURL(blob);

      // Store URL for later download/preview
      if (signedPdfUrl) URL.revokeObjectURL(signedPdfUrl);
      setSignedPdfUrl(url);

      // Store file size
      const sizeKB = blob.size / 1024;
      setSignedPdfSize(
        sizeKB > 1024
          ? `${(sizeKB / 1024).toFixed(2)} MB`
          : `${Math.round(sizeKB)} KB`
      );

      return url;
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to sign PDF';
      setErrorMessage(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [file, signatures, placedSignatures, signedPdfUrl, toast]);

  // 🆕 Download the signed file
  const downloadSignedFile = useCallback(() => {
    if (!signedPdfUrl || !file) return;
    const signedName = file.name.replace(/\.pdf$/i, '-signed.pdf');
    downloadFile(signedPdfUrl, signedName);
  }, [signedPdfUrl, file]);

  // 🆕 Preview in new tab
  const previewSignedPdf = useCallback(() => {
    if (signedPdfUrl) window.open(signedPdfUrl, '_blank');
  }, [signedPdfUrl]);

  // ============ ADD DATE STAMP ============

  const addDateStamp = useCallback(() => {
    const now = new Date();
    const dateText = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 32;
    ctx.font = `${fontSize}px Inter, Arial, sans-serif`;
    const metrics = ctx.measureText(dateText);

    canvas.width = Math.ceil(metrics.width + 30);
    canvas.height = Math.ceil(fontSize * 1.6);

    ctx.font = `${fontSize}px Inter, Arial, sans-serif`;
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(dateText, canvas.width / 2, canvas.height / 2);

    const sig: Signature = {
      id: `date-${Date.now()}`,
      imageDataUrl: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height,
      createdAt: Date.now(),
    };

    setSignatures((prev) => [...prev, sig]);
    setActiveSignatureId(sig.id);
  }, [inkColor]);

  // ============ ADD STICKER ============

  const addSticker = useCallback((stickerType: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const configs: Record<string, { text: string; bg: string; fg: string; border: string }> = {
      approved: { text: '✓ APPROVED', bg: '#DCFCE7', fg: '#16A34A', border: '#16A34A' },
      rejected: { text: '✗ REJECTED', bg: '#FEE2E2', fg: '#DC2626', border: '#DC2626' },
      reviewed: { text: '✓ REVIEWED', bg: '#DBEAFE', fg: '#2563EB', border: '#2563EB' },
      important: { text: '⚠ IMPORTANT', bg: '#FEF3C7', fg: '#D97706', border: '#D97706' },
      confidential: { text: '🔒 CONFIDENTIAL', bg: '#EDE9FE', fg: '#7C3AED', border: '#7C3AED' },
      signed: { text: '✍ SIGNED', bg: '#F0FDF4', fg: '#166534', border: '#16A34A' },
      draft: { text: '📝 DRAFT', bg: '#F1F5F9', fg: '#475569', border: '#64748B' },
      copy: { text: '📋 COPY', bg: '#FFF7ED', fg: '#EA580C', border: '#F97316' },
    };

    const config = configs[stickerType] || configs.approved;
    const fontSize = 28;
    const padding = 20;

    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
    const metrics = ctx.measureText(config.text);
    const width = Math.ceil(metrics.width + padding * 2);
    const height = Math.ceil(fontSize * 2 + padding);

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = config.bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 12);
    ctx.fill();

    ctx.strokeStyle = config.border;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(2, 2, width - 4, height - 4, 10);
    ctx.stroke();

    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
    ctx.fillStyle = config.fg;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(config.text, width / 2, height / 2);

    const sig: Signature = {
      id: `sticker-${Date.now()}`,
      imageDataUrl: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height,
      createdAt: Date.now(),
    };

    setSignatures((prev) => [...prev, sig]);
    setActiveSignatureId(sig.id);
  }, []);

  return {
    // State
    file,
    signatures,
    placedSignatures,
    activeSignatureId,
    currentPageIndex,
    signatureMode,
    inkColor,
    penSize,
    typedText,
    selectedFont,
    isLoadingPdf,
    isProcessing,
    errorMessage,
    signedPdfUrl,        // 🆕
    signedPdfSize,       // 🆕
    // Setters
    setActiveSignatureId,
    setCurrentPageIndex,
    setSignatureMode,
    setInkColor,
    setPenSize,
    setTypedText,
    setSelectedFont,
    setErrorMessage,
    // Actions
    addPdf,
    clearFile,
    createDrawnSignature,
    createTypedSignature,
    createUploadedSignature,
    removeSignature,
    placeSignature,
    placeSignatureExact,
    updatePlacedSignature,
    removePlacedSignature,
    signAndPreparePdf,   // 🆕 replaces downloadSigned
    downloadSignedFile,  // 🆕
    previewSignedPdf,    // 🆕
    addDateStamp,
     addSticker,
    // 🩹 Backward compat for desktop
    downloadSigned: async () => {
      const url = await signAndPreparePdf();
      if (url) downloadSignedFile();
    },
  };
}

export type SignPdfState = ReturnType<typeof useSignPdf>;