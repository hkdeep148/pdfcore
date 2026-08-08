'use client';

import { ReactNode } from 'react';

interface ToolShellMobileProps {
  children: ReactNode;
  fixedHeight?: boolean;
}

export default function ToolShellMobile({
  children,
  fixedHeight = false,
}: ToolShellMobileProps) {
  return (
    <div
      className={`lg:hidden flex flex-col bg-[#F5F5FA] w-full pt-[64px] ${
        fixedHeight
          ? 'h-full min-h-0 overflow-hidden'
          : 'min-h-full'
      }`}
    >
      {children}
    </div>
  );
}