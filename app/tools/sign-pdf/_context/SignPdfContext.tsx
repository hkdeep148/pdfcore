'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSignPdf, SignPdfState } from '../_hooks/useSignPdf';

const SignPdfContext = createContext<SignPdfState | null>(null);

export function SignPdfProvider({ children }: { children: ReactNode }) {
  const state = useSignPdf();
  return (
    <SignPdfContext.Provider value={state}>
      {children}
    </SignPdfContext.Provider>
  );
}

export function useSignPdfContext(): SignPdfState {
  const context = useContext(SignPdfContext);
  if (!context) {
    throw new Error('useSignPdfContext must be used inside <SignPdfProvider>');
  }
  return context;
}