'use client';

import dynamic from 'next/dynamic';
import { AddWatermarkProvider } from './_context/AddWatermarkContext';
import MobileToolWrapper from '../_components/MobileToolWrapper';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function AddWatermarkClient() {
  return (
    <AddWatermarkProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <MobileToolWrapper>
        <MobileView />
      </MobileToolWrapper>
    </AddWatermarkProvider>
  );
}