import type { MergePdfItem } from '../../_types';

// ============ COMPRESSION LEVEL TYPE ============
export type MergeCompressionLevel = 'none' | 'low' | 'medium' | 'high';

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

// ============ MERGE ALL PDFs (with optional compression) ============

export interface MergeOptions {
  compressionLevel?: MergeCompressionLevel;
  onProgress?: (stage: 'merging' | 'compressing', current: number, total: number) => void;
}

export async function mergePdfs(
  items: MergePdfItem[],
  options: MergeOptions = {}
): Promise<string> {
  const { compressionLevel = 'none', onProgress } = options;

  const { PDFDocument } = await import('pdf-lib');
  const outputPdf = await PDFDocument.create();

  // ---- STEP 1: Merge all PDFs ----
  for (let i = 0; i < items.length; i++) {
    onProgress?.('merging', i, items.length);
    const item = items[i];
    const buffer = await item.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await outputPdf.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => outputPdf.addPage(page));
  }
  onProgress?.('merging', items.length, items.length);

  // Save merged PDF (uncompressed)
  const mergedBytes = await outputPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  // ---- STEP 2: Optionally compress the merged PDF ----
  if (compressionLevel === 'none') {
    const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  // Dynamically import the compressor (reuse existing logic)
  const { compressPdf } = await import('../../compress-pdf/_utils/pdfCompressor');

  // Wrap merged bytes as a File for the compressor
  const mergedFile = new File(
    [mergedBytes as BlobPart],
    'merged.pdf',
    { type: 'application/pdf' }
  );

  const compressedBlob = await compressPdf(
    mergedFile,
    compressionLevel,
    (current, total) => onProgress?.('compressing', current, total)
  );

  return URL.createObjectURL(compressedBlob);
}