'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useMergePdf, MergePdfState } from '../_hooks/useMergePdf';

const MergePdfContext = createContext<MergePdfState | null>(null);

export function MergePdfProvider({ children }: { children: ReactNode }) {
  const state = useMergePdf();
  return (
    <MergePdfContext.Provider value={state}>
      {children}
    </MergePdfContext.Provider>
  );
}

export function useMergePdfContext(): MergePdfState {
  const context = useContext(MergePdfContext);
  if (!context) {
    throw new Error('useMergePdfContext must be used inside <MergePdfProvider>');
  }
  return context;
}