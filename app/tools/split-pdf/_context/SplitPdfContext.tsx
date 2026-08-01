'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSplitPdf, SplitPdfState } from '../_hooks/useSplitPdf';

const SplitPdfContext = createContext<SplitPdfState | null>(null);

export function SplitPdfProvider({ children }: { children: ReactNode }) {
  const state = useSplitPdf();
  return (
    <SplitPdfContext.Provider value={state}>
      {children}
    </SplitPdfContext.Provider>
  );
}

export function useSplitPdfContext(): SplitPdfState {
  const context = useContext(SplitPdfContext);
  if (!context) {
    throw new Error('useSplitPdfContext must be used inside <SplitPdfProvider>');
  }
  return context;
}
