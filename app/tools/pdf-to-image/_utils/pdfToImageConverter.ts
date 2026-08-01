import type {
  PdfImageFile,
  PdfImagePage,
  ImageFormat,
  ImageResolution,
} from '../../_types';

// ============ PDF.JS SETUP ============

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
  pdfjsLib = lib;
  return lib;
}

// ============ CONSTANTS ============

// Scale factor for each resolution (higher = larger image)
export const RESOLUTION_SCALE: Record<ImageResolution, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
  ultra: 3.0,
};

export const RESOLUTION_LABELS: Record<ImageResolution, string> = {
  low: 'Low (72 DPI)',
  medium: 'Medium (108 DPI)',
  high: 'High (144 DPI)',
  ultra: 'Ultra (216 DPI)',
};

export const FORMAT_LABELS: Record<ImageFormat, string> = {
  png: 'PNG (Lossless, larger)',
  jpg: 'JPG (Smaller, good quality)',
};

// ============ LOAD PDF & GENERATE PREVIEWS ============

export async function loadPdfPages(file: File): Promise<{
  fileItem: PdfImageFile;
  pages: PdfImagePage[];
}> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pdfId = `${file.name}-${file.size}-${Date.now()}`;
  const fileItem: PdfImageFile = {
    id: pdfId,
    file,
    name: file.name,
    totalPages: pdf.numPages,
  };

  const pages: PdfImagePage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const preview = canvas.toDataURL('image/jpeg', 0.75);

    pages.push({
      id: `${pdfId}-page-${i}`,
      pdfId,
      pdfName: file.name,
      pageIndex: i - 1,
      preview,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return { fileItem, pages };
}

// ============ RENDER PAGE AS HIGH-QUALITY IMAGE ============

export async function renderPageAsImage(
  file: File,
  pageIndex: number,
  format: ImageFormat,
  resolution: ImageResolution
): Promise<Blob> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(pageIndex + 1);
  const scale = RESOLUTION_SCALE[resolution];
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  // Fill white background for JPG (transparent → white)
  if (format === 'jpg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'jpg' ? 0.92 : undefined;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create image'));
      },
      mimeType,
      quality
    );
  });
}

// ============ DOWNLOAD ALL AS ZIP ============

export async function downloadAsZip(
  images: { name: string; blob: Blob }[],
  zipName: string
): Promise<string> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  images.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return URL.createObjectURL(zipBlob);
}