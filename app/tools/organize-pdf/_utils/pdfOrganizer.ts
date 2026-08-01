import type { OrganizePdfFile, OrganizePdfPage } from '../../_types';

// ============ PDF.JS SETUP ============

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
  pdfjsLib = lib;
  return lib;
}

// ============ LOAD PDF & GENERATE PREVIEWS ============

export async function loadPdfPages(file: File): Promise<{
  fileItem: OrganizePdfFile;
  pages: OrganizePdfPage[];
}> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pdfId = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;
  const fileItem: OrganizePdfFile = {
    id: pdfId,
    file,
    name: file.name,
    totalPages: pdf.numPages,
  };

  const pages: OrganizePdfPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const preview = canvas.toDataURL('image/jpeg', 0.8);

    pages.push({
      id: `${pdfId}-page-${i}-${Math.random()}`,
      pdfId,
      pdfName: file.name,
      originalPageIndex: i - 1,
      originalRotation: page.rotate,
      userRotation: 0,
      preview,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return { fileItem, pages };
}

// ============ ROTATION HELPER ============

export function rotatePageAngle(current: 0 | 90 | 180 | 270, direction: 'left' | 'right'): 0 | 90 | 180 | 270 {
  const nextDeg = direction === 'right' ? (current + 90) % 360 : (current + 270) % 360;
  return nextDeg as 0 | 90 | 180 | 270;
}

// ============ BUILD FINAL PDF FROM ORGANIZED PAGES ============

export async function buildOrganizedPdf(
  files: OrganizePdfFile[],
  pages: OrganizePdfPage[]
): Promise<Blob> {
  const { PDFDocument, degrees } = await import('pdf-lib');
  const outputPdf = await PDFDocument.create();

  // Load all source PDFs (cache them)
  const sourceCache = new Map();
  for (const fileItem of files) {
    const buffer = await fileItem.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    sourceCache.set(fileItem.id, srcDoc);
  }

  // Copy pages in order with applied rotations
  for (const page of pages) {
    const srcDoc = sourceCache.get(page.pdfId);
    if (!srcDoc) continue;

    const [copiedPage] = await outputPdf.copyPages(srcDoc, [page.originalPageIndex]);

    // Apply combined rotation (original + user)
    const finalRotation = (page.originalRotation + page.userRotation) % 360;
    copiedPage.setRotation(degrees(finalRotation));

    outputPdf.addPage(copiedPage);
  }

  const pdfBytes = await outputPdf.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}