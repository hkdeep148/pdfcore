import type { PdfFileItem, PdfPageItem, RotationAngle } from '../../_types';

// ============ PDF.JS WORKER SETUP ============

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const lib = await import('pdfjs-dist');
  // Use the CDN-hosted worker
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
  pdfjsLib = lib;
  return lib;
}

// ============ LOAD PDF & GENERATE PREVIEWS ============

export async function loadPdfPages(file: File): Promise<{
  fileItem: PdfFileItem;
  pages: PdfPageItem[];
}> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const pdfId = `${file.name}-${file.size}-${Date.now()}`;
  const fileItem: PdfFileItem = {
    id: pdfId,
    file,
    name: file.name,
    sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    totalPages: pdf.numPages,
  };

  const pages: PdfPageItem[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 }); // small preview

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const preview = canvas.toDataURL('image/jpeg', 0.8);

    pages.push({
      id: `${pdfId}-page-${i}`,
      pdfId,
      pageIndex: i - 1,
      preview,
      rotation: 0,
      originalRotation: page.rotate,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return { fileItem, pages };
}

// ============ APPLY ROTATIONS & GENERATE NEW PDF ============

export async function generateRotatedPdf(
  files: PdfFileItem[],
  pages: PdfPageItem[]
): Promise<string> {
  const { PDFDocument, degrees } = await import('pdf-lib');
  const outputPdf = await PDFDocument.create();

  // Load all source PDFs
  const sourceDocuments = new Map();
  for (const fileItem of files) {
    const buffer = await fileItem.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(buffer);
    sourceDocuments.set(fileItem.id, srcDoc);
  }

  // Copy pages in order with applied rotations
  for (const pageItem of pages) {
    const srcDoc = sourceDocuments.get(pageItem.pdfId);
    if (!srcDoc) continue;

    const [copiedPage] = await outputPdf.copyPages(srcDoc, [pageItem.pageIndex]);

    // Apply user rotation on top of original rotation
    const finalRotation = (pageItem.originalRotation + pageItem.rotation) % 360;
    copiedPage.setRotation(degrees(finalRotation));

    outputPdf.addPage(copiedPage);
  }

  const pdfBytes = await outputPdf.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

// ============ HELPERS ============

export function rotateAngle(current: RotationAngle, direction: 'left' | 'right'): RotationAngle {
  const nextDeg = direction === 'right' ? (current + 90) % 360 : (current + 270) % 360;
  return nextDeg as RotationAngle;
}