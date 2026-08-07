'use client';

import dynamic from 'next/dynamic';
import { AddWatermarkProvider } from './_context/AddWatermarkContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function ToolPage() {
  return (
    <AddWatermarkProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </AddWatermarkProvider>
  );
}