'use client';

import dynamic from 'next/dynamic';
import { OrganizePdfProvider } from './_context/OrganizePdfContext';
import MobileToolWrapper from '../_components/MobileToolWrapper';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function OrganizePdfClient() {
  return (
    <OrganizePdfProvider>
      <div className="hidden lg:contents">
        <DesktopView />
      </div>
      <MobileToolWrapper>
        <MobileView />
      </MobileToolWrapper>
    </OrganizePdfProvider>
  );
}