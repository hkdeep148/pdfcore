'use client';

import { createContext, useContext, useRef, useState, ReactNode, useCallback } from 'react';

interface PendingFilePayload {
  files: File[];
  sourcePath: string;
  timestamp: number;
}

interface PendingFileContextValue {
  payload: PendingFilePayload | null;
  setPendingFiles: (files: File[], sourcePath?: string) => void;
  consumePendingFiles: () => File[];
  hasPendingFiles: () => boolean;
}

const PendingFileContext = createContext<PendingFileContextValue | null>(null);

const MAX_AGE_MS = 60_000; // Files expire after 1 minute

export function PendingFileProvider({ children }: { children: ReactNode }) {
  const [payload, setPayloadState] = useState<PendingFilePayload | null>(null);
  const consumedRef = useRef(false);

  const setPendingFiles = useCallback((files: File[], sourcePath: string = '/') => {
    if (files.length === 0) {
      setPayloadState(null);
      return;
    }

    setPayloadState({
      files,
      sourcePath,
      timestamp: Date.now(),
    });
    consumedRef.current = false;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[PendingFile] Set ${files.length} file(s) from ${sourcePath}`);
    }
  }, []);

  const consumePendingFiles = useCallback((): File[] => {
    // Prevent double consumption in Strict Mode
    if (consumedRef.current) return [];
    if (!payload) return [];

    // Expire old files
    const age = Date.now() - payload.timestamp;
    if (age > MAX_AGE_MS) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[PendingFile] Files expired (${age}ms old), discarding`);
      }
      setPayloadState(null);
      return [];
    }

    consumedRef.current = true;
    const files = payload.files;
    setPayloadState(null);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[PendingFile] Consumed ${files.length} file(s)`);
    }

    return files;
  }, [payload]);

  const hasPendingFiles = useCallback((): boolean => {
    return payload !== null && payload.files.length > 0;
  }, [payload]);

  return (
    <PendingFileContext.Provider
      value={{ payload, setPendingFiles, consumePendingFiles, hasPendingFiles }}
    >
      {children}
    </PendingFileContext.Provider>
  );
}

export function usePendingFile() {
  const context = useContext(PendingFileContext);
  if (!context) {
    throw new Error('usePendingFile must be used within PendingFileProvider');
  }
  return context;
}