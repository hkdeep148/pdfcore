'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCompressPdf, CompressPdfState } from '../_hooks/useCompressPdf';

const CompressPdfContext = createContext<CompressPdfState | null>(null);

export function CompressPdfProvider({ children }: { children: ReactNode }) {
  const state = useCompressPdf();
  return (
    <CompressPdfContext.Provider value={state}>
      {children}
    </CompressPdfContext.Provider>
  );
}

export function useCompressPdfContext(): CompressPdfState {
  const context = useContext(CompressPdfContext);
  if (!context) {
    throw new Error('useCompressPdfContext must be used inside <CompressPdfProvider>');
  }
  return context;
}
