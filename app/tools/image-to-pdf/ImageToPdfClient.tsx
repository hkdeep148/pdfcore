'use client';

import dynamic from 'next/dynamic';
import { ImageToPdfProvider } from './_context/ImageToPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function ImageToPdfPage() {
  return (
    <ImageToPdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <div className="lg:hidden contents">
        <MobileView />
      </div>
    </ImageToPdfProvider>
  );
}