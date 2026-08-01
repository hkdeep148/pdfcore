'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUnlockPdf, UnlockPdfState } from '../_hooks/useUnlockPdf';

const UnlockPdfContext = createContext<UnlockPdfState | null>(null);

export function UnlockPdfProvider({ children }: { children: ReactNode }) {
  const state = useUnlockPdf();
  return (
    <UnlockPdfContext.Provider value={state}>
      {children}
    </UnlockPdfContext.Provider>
  );
}

export function useUnlockPdfContext(): UnlockPdfState {
  const context = useContext(UnlockPdfContext);
  if (!context) {
    throw new Error('useUnlockPdfContext must be used inside <UnlockPdfProvider>');
  }
  return context;
}