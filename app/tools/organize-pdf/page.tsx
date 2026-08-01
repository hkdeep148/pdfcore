'use client';

import dynamic from 'next/dynamic';
import { OrganizePdfProvider } from './_context/OrganizePdfContext';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function OrganizePdfPage() {
  return (
    <OrganizePdfProvider>
      <DesktopView />
      <MobileView />
    </OrganizePdfProvider>
  );
}
