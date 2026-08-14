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
    /*
      fixedHeight=true: fill the viewport minus the 72px sticky
      navbar so the shell has a concrete height. This allows any
      internal flex-1 + sticky bottom bar to actually stick to
      the viewport bottom instead of floating with content.

      fixedHeight=false: shell grows to fit its content — used
      when the tool has no fixed viewport UI (e.g., long-scroll
      pages like empty states).
    */
    <div
      className={`lg:hidden flex flex-col bg-[#F5F5FA] w-full ${
        fixedHeight
          ? 'h-[calc(100vh-72px)] min-h-0 overflow-hidden'
          : 'min-h-full'
      }`}
    >
      {children}
    </div>
  );
}