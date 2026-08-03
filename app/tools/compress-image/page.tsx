'use client';

import dynamic from 'next/dynamic';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function CompressImagePage() {
  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
}