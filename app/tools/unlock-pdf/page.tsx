'use client';

import dynamic from 'next/dynamic';
import { UnlockPdfProvider } from './_context/UnlockPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function UnlockPdfPage() {
  return (
    <UnlockPdfProvider>
      <DesktopView />
      <MobileView />
    </UnlockPdfProvider>
  );
}
