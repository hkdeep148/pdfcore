'use client';

import dynamic from 'next/dynamic';
import { MergePdfProvider } from './_context/MergePdfContext';
import MobileToolWrapper from '../_components/MobileToolWrapper';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function MergePdfPage() {
  return (
    <MergePdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <MobileToolWrapper>
        <MobileView />
      </MobileToolWrapper>
    </MergePdfProvider>
    );
}