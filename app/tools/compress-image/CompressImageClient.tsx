'use client';

import { useMediaQuery } from '../_hooks/useMediaQuery';   // ← changed
import DesktopView from './_desktop/DesktopView';
import MobileView from './_mobile/MobileView';
import MobileToolWrapper from '../_components/MobileToolWrapper';

export default function CompressImageClient() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop === undefined) return null;

  if (isDesktop) return <DesktopView />;

  return (
    <MobileToolWrapper>
      <MobileView />
    </MobileToolWrapper>
  );
}