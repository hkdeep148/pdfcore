'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAddWatermark, AddWatermarkState } from '../_hooks/useAddWatermark';

const AddWatermarkContext = createContext<AddWatermarkState | null>(null);

export function AddWatermarkProvider({ children }: { children: ReactNode }) {
  const state = useAddWatermark();
  return (
    <AddWatermarkContext.Provider value={state}>
      {children}
    </AddWatermarkContext.Provider>
  );
}

export function useAddWatermarkContext(): AddWatermarkState {
  const context = useContext(AddWatermarkContext);
  if (!context) {
    throw new Error('useAddWatermarkContext must be used inside <AddWatermarkProvider>');
  }
  return context;
}
