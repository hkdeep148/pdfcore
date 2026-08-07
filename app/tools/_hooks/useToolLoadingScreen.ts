'use client';

import { useState, useEffect } from 'react';

/**
 * Universal loading screen hook for all tools.
 * Shows a loading screen for at least `minDuration` ms while processing.
 *
 * @param isProcessing - Boolean from your tool context (e.g., isCompressing)
 * @param isComplete - Boolean when processing finished (e.g., allCompressed)
 * @param minDuration - Minimum ms to show loading (default: 1000)
 * @returns showLoadingScreen - Whether to render the loading screen
 */
export function useToolLoadingScreen(
  isProcessing: boolean,
  isComplete: boolean,
  minDuration: number = 1000
): boolean {
  const [showLoading, setShowLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Start loading when processing begins
  useEffect(() => {
    if (isProcessing) {
      setShowLoading(true);
      setStartTime(Date.now());
    }
  }, [isProcessing]);

  // Hide loading after min duration when complete
  useEffect(() => {
  if (!isProcessing && showLoading && isComplete) {
    const elapsed = Date.now() - startTime;
    // Add 200ms buffer so progress bar visually completes to 100%
    const remaining = Math.max(0, minDuration - elapsed) + 200;

    const timer = setTimeout(() => {
      setShowLoading(false);
    }, remaining);

    return () => clearTimeout(timer);
  }
}, [isProcessing, isComplete, showLoading, startTime, minDuration]);

  return showLoading;
}