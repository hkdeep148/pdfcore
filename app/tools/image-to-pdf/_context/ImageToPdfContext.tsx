'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useImageToPdf, ImageToPdfState } from '../_hooks/useImageToPdf';

const ImageToPdfContext = createContext<ImageToPdfState | null>(null);

export function ImageToPdfProvider({ children }: { children: ReactNode }) {
  const state = useImageToPdf();
  return (
    <ImageToPdfContext.Provider value={state}>
      {children}
    </ImageToPdfContext.Provider>
  );
}

export function useImageToPdfContext(): ImageToPdfState {
  const context = useContext(ImageToPdfContext);
  if (!context) {
    throw new Error('useImageToPdfContext must be used inside <ImageToPdfProvider>');
  }
  return context;
}