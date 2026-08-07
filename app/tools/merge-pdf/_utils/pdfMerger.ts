import type { MergePdfItem } from '../../_types';

// ============ PDF.JS SETUP ============

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
  pdfjsLib = lib;
  return lib;
}

// ============ LOAD PDF INFO (page count + first page preview) ============

export async function loadPdfInfo(file: File): Promise<MergePdfItem> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.4 });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  const firstPagePreview = canvas.toDataURL('image/jpeg', 0.75);

  return {
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    file,
    name: file.name,
    sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    totalPages: pdf.numPages,
    firstPagePreview,
  };
}

// ============ MERGE ALL PDFs ============

export async function mergePdfs(items: MergePdfItem[]): Promise<string> {
  const { PDFDocument } = await import('pdf-lib');
  const outputPdf = await PDFDocument.create();

  // Merge all PDFs
  for (const item of items) {
    const buffer = await item.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await outputPdf.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => outputPdf.addPage(page));
  }

  // Save merged PDF
  const mergedBytes = await outputPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}