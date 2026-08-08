'use client';

import dynamic from 'next/dynamic';
import { UnlockPdfProvider } from './_context/UnlockPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function UnlockPdfClient() {
  return (
    <UnlockPdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </UnlockPdfProvider>
  );
}