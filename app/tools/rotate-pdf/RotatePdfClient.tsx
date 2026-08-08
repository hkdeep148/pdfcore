'use client';

import dynamic from 'next/dynamic';
import { RotatePdfProvider } from './_context/RotatePdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function RotatePdfClient() {
  return (
    <RotatePdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </RotatePdfProvider>
  );
}