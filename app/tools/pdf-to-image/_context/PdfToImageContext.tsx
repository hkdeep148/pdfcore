'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePdfToImage, PdfToImageState } from '../_hooks/usePdfToImage';

const PdfToImageContext = createContext<PdfToImageState | null>(null);

export function PdfToImageProvider({ children }: { children: ReactNode }) {
  const state = usePdfToImage();
  return (
    <PdfToImageContext.Provider value={state}>
      {children}
    </PdfToImageContext.Provider>
  );
}

export function usePdfToImageContext(): PdfToImageState {
  const context = useContext(PdfToImageContext);
  if (!context) {
    throw new Error('usePdfToImageContext must be used inside <PdfToImageProvider>');
  }
  return context;
}
