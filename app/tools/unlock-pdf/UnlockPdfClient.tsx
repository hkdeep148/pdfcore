'use client';

import dynamic from 'next/dynamic';
import { UnlockPdfProvider } from './_context/UnlockPdfContext';
import MobileToolWrapper from '../_components/MobileToolWrapper';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function UnlockPdfClient() {
  return (
    <UnlockPdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <MobileToolWrapper>
        <MobileView />
      </MobileToolWrapper>
    </UnlockPdfProvider>
  );
}