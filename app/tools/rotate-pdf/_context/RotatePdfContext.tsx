'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRotatePdf, RotatePdfState } from '../_hooks/useRotatePdf';

const RotatePdfContext = createContext<RotatePdfState | null>(null);

export function RotatePdfProvider({ children }: { children: ReactNode }) {
  const state = useRotatePdf();
  return (
    <RotatePdfContext.Provider value={state}>
      {children}
    </RotatePdfContext.Provider>
  );
}

export function useRotatePdfContext(): RotatePdfState {
  const context = useContext(RotatePdfContext);
  if (!context) {
    throw new Error('useRotatePdfContext must be used inside <RotatePdfProvider>');
  }
  return context;
}