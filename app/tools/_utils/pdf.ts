/**
 * Shared pdfjs-dist loader.
 * Loads the library once and caches it for reuse.
 * Handles worker configuration automatically.
 */

// Cache the loaded library so we only initialize once
let pdfjsLib: typeof import('pdfjs-dist') | null = null;

/**
 * Get the pdfjs-dist library, loading it if needed.
 * Worker is configured automatically on first load.
 */
export async function getPdfjs(): Promise<typeof import('pdfjs-dist')> {
  if (pdfjsLib) return pdfjsLib;

  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  pdfjsLib = lib;
  return lib;
}