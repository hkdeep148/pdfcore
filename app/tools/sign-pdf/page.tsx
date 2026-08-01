'use client';

import dynamic from 'next/dynamic';
import { SignPdfProvider } from './_context/SignPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function SignPdfPage() {
  return (
    <SignPdfProvider>
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <DesktopView />
        <MobileView />
      </div>
    </SignPdfProvider>
  );
}