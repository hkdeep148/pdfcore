/**
 * Shared pdfjs-dist loader and PDF utilities.
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

// ============================================================
// PDF PAGE RENDERING (shared preview generation)
// ============================================================

/**
 * Represents a single rendered PDF page with its preview and metadata.
 * Used as raw data — tools transform this to their own types.
 */
export interface RenderedPdfPage {
  pageIndex: number;         // 0-based page index
  preview: string;           // data URL of the preview image
  width: number;             // viewport width (at the requested scale)
  height: number;            // viewport height
  originalRotation: number;  // page's original rotation (0, 90, 180, or 270)
}

/**
 * Result of rendering all pages of a PDF into preview images.
 */
export interface RenderedPdf {
  numPages: number;
  pages: RenderedPdfPage[];
}

/**
 * Options for controlling how PDF previews are rendered.
 */
export interface RenderPdfOptions {
  /** Scale factor for the preview canvas (default: 0.5). Higher = larger, sharper image. */
  scale?: number;
  /** JPEG quality for the preview (0–1, default: 0.8). Higher = better quality, larger data URL. */
  previewQuality?: number;
}

/**
 * Loads a PDF file and renders preview images for all pages.
 * Returns generic page data that tools can transform to their own types.
 *
 * @example
 * const rendered = await renderPdfPreviews(file, { previewQuality: 0.75 });
 * const pages = rendered.pages.map((p) => ({
 *   id: `page-${p.pageIndex + 1}`,
 *   preview: p.preview,
 *   // ...other fields
 * }));
 */
export async function renderPdfPreviews(
  file: File,
  options?: RenderPdfOptions
): Promise<RenderedPdf> {
  const scale = options?.scale ?? 0.5;
  const quality = options?.previewQuality ?? 0.8;

  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pages: RenderedPdfPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    pages.push({
      pageIndex: i - 1,
      preview: canvas.toDataURL('image/jpeg', quality),
      width: viewport.width,
      height: viewport.height,
      originalRotation: page.rotate,
    });
  }

  return { numPages: pdf.numPages, pages };
}