'use client';

import dynamic from 'next/dynamic';
import { CompressPdfProvider } from './_context/CompressPdfContext';
import MobileToolWrapper from '../_components/MobileToolWrapper';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function CompressPdfPage() {
  return (
    <CompressPdfProvider>
      <div className="hidden lg:block">
        <DesktopView />
      </div>
      <MobileToolWrapper>
        <MobileView />
      </MobileToolWrapper>
    </CompressPdfProvider>
  );
}