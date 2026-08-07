'use client';

import dynamic from 'next/dynamic';
import { SignPdfProvider } from './_context/SignPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function SignPdfPage() {
  return (
    <SignPdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </SignPdfProvider>
  );
}