'use client';

import { useMediaQuery } from '../_hooks/useMediaQuery';
import DesktopView from './_desktop/DesktopView';
import MobileView from './_mobile/MobileView';

export default function CompressImageClient() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Avoid flash on first render before media query resolves
  if (isDesktop === undefined) return null;

  return isDesktop ? <DesktopView /> : <MobileView />;
}