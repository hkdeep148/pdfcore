import type { SplitPdfFile, SplitPdfPage } from '../../_types';

// ============ PDF.JS SETUP ============

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const lib = await import('pdfjs-dist');
  lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.mjs`;
  pdfjsLib = lib;
  return lib;
}

// ============ LOAD PDF WITH PAGE PREVIEWS ============

export async function loadPdfPages(file: File): Promise<{
  fileItem: SplitPdfFile;
  pages: SplitPdfPage[];
}> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const fileItem: SplitPdfFile = {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    name: file.name,
    totalPages: pdf.numPages,
  };

  const pages: SplitPdfPage[] = [];

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
      id: `page-${i}`,
      pageIndex: i - 1,
      preview,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return { fileItem, pages };
}

// ============ PARSE PAGE RANGE STRING ============

export function parsePageRanges(rangeStr: string, totalPages: number): number[][] {
  if (!rangeStr.trim()) return [];

  const parts = rangeStr.split(',').map((s) => s.trim()).filter(Boolean);
  const result: number[][] = [];

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
        throw new Error(`Invalid range: "${part}". Use 1-${totalPages}.`);
      }

      const pages: number[] = [];
      for (let i = start; i <= end; i++) {
        pages.push(i - 1);
      }
      result.push(pages);
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page) || page < 1 || page > totalPages) {
        throw new Error(`Invalid page: "${part}". Use 1-${totalPages}.`);
      }
      result.push([page - 1]);
    }
  }

  return result;
}

// ============ ⭐ SPLIT BY SIZE ============

/**
 * Splits a PDF into groups where each group is ≤ maxSizeBytes.
 * Uses a page-by-page estimation approach.
 * Returns page groups (each group = 1 output PDF).
 */
export async function calculateSizeBasedGroups(
  file: File,
  maxSizeBytes: number
): Promise<number[][]> {
  const { PDFDocument } = await import('pdf-lib');
  const buffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  if (totalPages === 0) return [];

  // Estimate: total size / total pages ≈ bytes per page
  const avgBytesPerPage = file.size / totalPages;

  // Rough pages per group based on target size
  const estimatedPagesPerGroup = Math.max(1, Math.floor(maxSizeBytes / avgBytesPerPage));

  const groups: number[][] = [];
  let currentGroup: number[] = [];

  for (let i = 0; i < totalPages; i++) {
    currentGroup.push(i);

    // When group reaches estimated size OR is the last page → finalize
    if (currentGroup.length >= estimatedPagesPerGroup || i === totalPages - 1) {
      // Test actual size by creating a mini PDF
      const testDoc = await PDFDocument.create();
      const copied = await testDoc.copyPages(srcDoc, currentGroup);
      copied.forEach((page) => testDoc.addPage(page));
      const testBytes = await testDoc.save({ useObjectStreams: true });

      // If size exceeds max, roll back one page
      if (testBytes.length > maxSizeBytes && currentGroup.length > 1) {
        const overflowPage = currentGroup.pop()!;
        groups.push([...currentGroup]);
        currentGroup = [overflowPage];
      } else {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
    }
  }

  // Add any remaining pages
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

// ============ SPLIT PDF ============

export interface SplitResult {
  name: string;
  blob: Blob;
  pageCount: number;
}

export async function splitPdf(
  file: File,
  pageGroups: number[][]
): Promise<SplitResult[]> {
  const { PDFDocument } = await import('pdf-lib');
  const buffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const results: SplitResult[] = [];
  const baseName = file.name.replace(/\.pdf$/i, '');

  for (let i = 0; i < pageGroups.length; i++) {
    const pageIndices = pageGroups[i];
    const outputPdf = await PDFDocument.create();
    const copiedPages = await outputPdf.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => outputPdf.addPage(page));

    const pdfBytes = await outputPdf.save({ useObjectStreams: true });
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

    let name: string;
    if (pageIndices.length === 1) {
      name = `${baseName}-page-${pageIndices[0] + 1}.pdf`;
    } else {
      const first = pageIndices[0] + 1;
      const last = pageIndices[pageIndices.length - 1] + 1;
      name = `${baseName}-pages-${first}-${last}.pdf`;
    }

    results.push({ name, blob, pageCount: pageIndices.length });
  }

  return results;
}

// ============ DOWNLOAD AS ZIP ============

export async function downloadAsZip(results: SplitResult[]): Promise<string> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  results.forEach(({ name, blob }) => {
    zip.file(name, blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return URL.createObjectURL(zipBlob);
}

// ============ SIZE HELPERS ============

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}