import type { PdfFileItem, PdfPageItem, RotationAngle } from '../../_types';
import { renderPdfPreviews } from '../../_utils/pdf';


// ============ LOAD PDF & GENERATE PREVIEWS ============

export async function loadPdfPages(file: File): Promise<{
  fileItem: PdfFileItem;
  pages: PdfPageItem[];
}> {
  const rendered = await renderPdfPreviews(file, { previewQuality: 0.8 });

  const pdfId = `${file.name}-${file.size}-${Date.now()}`;

  const fileItem: PdfFileItem = {
    id: pdfId,
    file,
    name: file.name,
    sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    totalPages: rendered.numPages,
  };

  const pages: PdfPageItem[] = rendered.pages.map((p) => ({
    id: `${pdfId}-page-${p.pageIndex + 1}`,
    fileId: pdfId,
    pdfId,
    pageIndex: p.pageIndex,
    preview: p.preview,
    rotation: 0,
    originalRotation: p.originalRotation,
    width: p.width,
    height: p.height,
  }));

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