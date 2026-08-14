'use client';

import { ReactNode } from 'react';

export default function MobileToolWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 top-[72px] overflow-hidden flex flex-col bg-white">
      {children}
    </div>
  );
}