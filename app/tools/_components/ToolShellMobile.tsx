// components/ToolShellMobile.tsx
// CHANGE: removed pt-[64px]
// REASON: The MobileToolNavbar was `position: fixed` (out of flow).
//         ToolShellMobile needed pt-[64px] to push its content below it.
//         The universal LandingNavbar is `sticky` (in flow), so it naturally
//         pushes all content below it — no padding offset is needed here.
// DESKTOP: unchanged — ToolShellMobile is lg:hidden so desktop unaffected.

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
      className={`lg:hidden flex flex-col bg-[#F5F5FA] w-full ${
        fixedHeight
          ? 'h-full min-h-0 overflow-hidden'
          : 'min-h-full'
      }`}
    >
      {children}
    </div>
  );
}