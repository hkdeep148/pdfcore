'use client';

import dynamic from 'next/dynamic';
import { CompressPdfProvider } from './_context/CompressPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function CompressPdfPage() {
  return (
    <CompressPdfProvider>
      <DesktopView />
      <MobileView />
    </CompressPdfProvider>
  );
}
