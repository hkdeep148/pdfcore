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
 * Examples: 850 → "850 B", 1500 → "1.5 KB", 1500000 → "1.4 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}