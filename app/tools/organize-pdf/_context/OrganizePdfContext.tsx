'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useOrganizePdf, OrganizePdfState } from '../_hooks/useOrganizePdf';

const OrganizePdfContext = createContext<OrganizePdfState | null>(null);

export function OrganizePdfProvider({ children }: { children: ReactNode }) {
  const state = useOrganizePdf();
  return (
    <OrganizePdfContext.Provider value={state}>
      {children}
    </OrganizePdfContext.Provider>
  );
}

export function useOrganizePdfContext(): OrganizePdfState {
  const context = useContext(OrganizePdfContext);
  if (!context) {
    throw new Error('useOrganizePdfContext must be used inside <OrganizePdfProvider>');
  }
  return context;
}
