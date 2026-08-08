'use client';

import dynamic from 'next/dynamic';
import { SplitPdfProvider } from './_context/SplitPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function SplitPdfClient() {
  return (
    <SplitPdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </SplitPdfProvider>
  );
}