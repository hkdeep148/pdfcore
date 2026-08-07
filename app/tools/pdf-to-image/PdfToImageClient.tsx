'use client';

import dynamic from 'next/dynamic';
import { PdfToImageProvider } from './_context/PdfToImageContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function PdfToImagePage() {
  return (
    <PdfToImageProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </PdfToImageProvider>
  );
}
