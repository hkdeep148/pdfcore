'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { usePendingFile } from '../../_context/PendingFileContext';
import {
  getToolFileConfig,
  filterFilesByType,
  applyLoadMode,
} from '../_utils/toolFileRegistry';

/**
 * ============================================================
 * useToolFileReceiver
 * ============================================================
 *
 * Universal hook for tool pages to auto-receive files from
 * homepage recommendations.
 *
 * @example
 * // PDF tool:
 * useToolFileReceiver((files) => addPdfs(files));
 *
 * // Image tool:
 * useToolFileReceiver((files) => addImages(files));
 * ============================================================
 */
export function useToolFileReceiver(onFiles: (files: File[]) => void) {
  const pathname = usePathname();
  const { consumePendingFiles } = usePendingFile();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent double-loading in Strict Mode
    if (hasLoadedRef.current) return;

    // Get this tool's config from registry
    const config = getToolFileConfig(pathname);
    if (!config) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[FileReceiver] No config for path: ${pathname}`);
      }
      return;
    }

    // Consume pending files (once)
    const rawFiles = consumePendingFiles();
    if (rawFiles.length === 0) return;

    // Filter by accepted type
    const filtered = filterFilesByType(rawFiles, config.accept);
    if (filtered.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[FileReceiver] No matching files for ${config.accept} at ${pathname}`
        );
      }
      return;
    }

    // Apply load mode (single vs multiple)
    const finalFiles = applyLoadMode(filtered, config.mode);

    // Deliver to tool
    hasLoadedRef.current = true;
    onFiles(finalFiles);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[FileReceiver] Loaded ${finalFiles.length} file(s) into ${pathname}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}