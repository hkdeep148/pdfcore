'use client';

import { useState, useEffect } from 'react';

/**
 * SSR-safe media query hook.
 * Returns `false` on the server, then updates after mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return mounted ? matches : false;
}

/** Returns true if screen is mobile-sized (< 1024px) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)');
}

/** Returns true after the component has mounted (client-only) */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}