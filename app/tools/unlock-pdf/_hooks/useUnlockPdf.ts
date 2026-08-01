'use client';

import { useState, useCallback } from 'react';
import type { UnlockPdfItem } from '../../_types';
import { isPdfEncrypted, unlockPdf } from '../_utils/pdfUnlocker';
import { downloadFile } from '../../_utils/browser';
import { useToast } from '../../_components/ToastProvider';

export function useUnlockPdf() {
  const toast = useToast();

  const [items, setItems] = useState<UnlockPdfItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ============ ADD PDFs ============
  const addPdfs = useCallback(async (newFiles: File[]) => {
    const validFiles = newFiles.filter((f) => f.type === 'application/pdf');
    if (validFiles.length === 0) {
      setErrorMessage('Please select PDF files only.');
      toast.error('Please select PDF files only');
      return;
    }
    setErrorMessage(null);

    // Add all files as "checking" first
    const newItems: UnlockPdfItem[] = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'checking',
      password: '',
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Check each PDF's encryption status
    for (const item of newItems) {
      try {
        const encrypted = await isPdfEncrypted(item.file);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  isEncrypted: encrypted,
                  status: encrypted ? 'needs-password' : 'unlocked',
                  unlockedBlob: encrypted ? undefined : item.file,
                }
              : it
          )
        );

        if (!encrypted) {
        }
      } catch (err) {
        console.error(err);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: 'error',
                  errorMessage: 'Failed to read PDF',
                }
              : it
          )
        );
      }
    }

  }, [toast]);

  // ============ UPDATE PASSWORD ============
  const updatePassword = useCallback((id: string, password: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, password, errorMessage: undefined } : it))
    );
  }, []);

  // ============ UNLOCK ONE PDF ============
  const unlockOne = useCallback(async (id: string) => {
  const item = items.find((it) => it.id === id);
  if (!item) return;

  if (!item.password) {
    toast.error('Please enter a password');
    return;
  }

  setItems((prev) =>
    prev.map((it) =>
      it.id === id
        ? { ...it, status: 'unlocking' as const, errorMessage: undefined, progress: 0 }
        : it
    )
  );

  try {
    // ⭐ Pass progress callback
    const result = await unlockPdf(item.file, item.password, (current, total) => {
      const pct = total > 0 ? Math.round((current / total) * 100) : 0;
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, progress: pct } : it))
      );
    });
    
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              status: 'unlocked' as const,
              unlockedBlob: result.blob,
              unlockMethod: result.method,
              progress: 100,
            }
          : it
      )
    );
    
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to unlock PDF';
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              status: 'needs-password' as const,
              errorMessage: errorMsg,
              progress: 0,
            }
          : it
      )
    );
    toast.error('Incorrect password');
  }
}, [items, toast]);

  // ============ DOWNLOAD ONE ============
  const downloadOne = useCallback((id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item?.unlockedBlob) return;

    const url = URL.createObjectURL(item.unlockedBlob);
    const unlockedName = item.name.replace(/\.pdf$/i, '-unlocked.pdf');
    downloadFile(url, unlockedName);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [items, toast]);

  // ============ DOWNLOAD ALL UNLOCKED ============
  const downloadAll = useCallback(() => {
    const unlockedItems = items.filter((it) => it.status === 'unlocked' && it.unlockedBlob);
    if (unlockedItems.length === 0) {
      return;
    }

    unlockedItems.forEach((item, index) => {
      setTimeout(() => {
        downloadOne(item.id);
      }, index * 200); // Stagger downloads
    });
  }, [items, downloadOne, toast]);

  // ============ REMOVE / CLEAR ============
  const removePdf = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setErrorMessage(null);
  }, []);

  // ============ COMPUTED ============
const unlockedCount = items.filter((it) => it.status === 'unlocked').length;
const needsPasswordCount = items.filter((it) => it.status === 'needs-password').length;
const totalFiles = items.length;                              // ⭐ ADD THIS
const allUnlocked = totalFiles > 0 && unlockedCount === totalFiles;  // ⭐ ADD THIS

return {
  // State
  items, errorMessage,
  // Computed
  unlockedCount, needsPasswordCount, totalFiles, allUnlocked,
  // Setters
  setErrorMessage,
  // Actions
  addPdfs, updatePassword, unlockOne, downloadOne, downloadAll,
  removePdf, clearAll,
  };
}
export type UnlockPdfState = ReturnType<typeof useUnlockPdf>;