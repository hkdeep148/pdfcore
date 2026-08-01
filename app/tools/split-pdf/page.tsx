'use client';

import dynamic from 'next/dynamic';
import { SplitPdfProvider } from './_context/SplitPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function SplitPdfPage() {
  return (
    <SplitPdfProvider>
      <DesktopView />
      <MobileView />
    </SplitPdfProvider>
  );
}
