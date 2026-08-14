'use client';

import { useState, useEffect, RefObject } from 'react';

/**
 * Measures the rendered height of a fixed/sticky bottom bar and returns
 * it as a number, so the page can apply dynamic bottom padding that
 * exactly matches the bar. This prevents unnecessary scrollbars when
 * content fits, and prevents content being hidden behind taller bars.
 *
 * Usage:
 *   const bottomBarRef = useRef<HTMLDivElement>(null);
 *   const bottomSpace = useStickyBottomSpace(bottomBarRef);
 *   <div style={{ paddingBottom: bottomSpace }}>...</div>
 *   <div ref={bottomBarRef} className="fixed bottom-0 ...">...</div>
 */
export function useStickyBottomSpace(ref: RefObject<HTMLDivElement | null>): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);

  return height;
}
