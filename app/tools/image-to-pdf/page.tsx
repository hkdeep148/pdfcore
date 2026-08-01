'use client';

import dynamic from 'next/dynamic';
import { ImageToPdfProvider } from './_context/ImageToPdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function ImageToPdfPage() {
  return (
    <ImageToPdfProvider>
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <DesktopView />
        <MobileView />
      </div>
    </ImageToPdfProvider>
  );
}