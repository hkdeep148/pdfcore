/**
 * Safely check if we're running in the browser (not on the server).
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Safely access window (returns undefined on server).
 */
export function safeWindow(): Window | undefined {
  return isBrowser ? window : undefined;
}

/**
 * Download a file safely (browser only).
 */
export function downloadFile(url: string, filename: string): void {
  if (!isBrowser) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy text to clipboard (browser only).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format file size to human-readable string.
 * Example: 1048576 → "1.00 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}