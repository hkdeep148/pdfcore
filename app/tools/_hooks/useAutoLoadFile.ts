'use client';

import { useEffect } from 'react';
import { usePendingFile } from '../../_context/PendingFileContext';

/**
 * Auto-loads a pending file from the homepage into a tool.
 * 
 * @param onFile - Callback that receives the file if type matches
 * @param acceptType - 'pdf' | 'image' | 'any'
 */
export function useAutoLoadFile(
  onFile: (file: File) => void,
  acceptType: 'pdf' | 'image' | 'any' = 'any'
) {
  const { consumePendingFiles } = usePendingFile();

  useEffect(() => {
    const files = consumePendingFiles();
    if (files.length === 0) return;

    const file = files[0];

    // Check if file type matches what this tool accepts
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (acceptType === 'any') {
      onFile(file);
    } else if (acceptType === 'pdf' && isPdf) {
      onFile(file);
    } else if (acceptType === 'image' && isImage) {
      onFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}