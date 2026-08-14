'use client';

import dynamic from 'next/dynamic';
import { ImageToPdfProvider } from './_context/ImageToPdfContext';
import MobileToolWrapper from '../_components/MobileToolWrapper';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function ImageToPdfPage() {
  return (
    <ImageToPdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <MobileToolWrapper>
        <MobileView />
      </MobileToolWrapper>
    </ImageToPdfProvider>
  );
}