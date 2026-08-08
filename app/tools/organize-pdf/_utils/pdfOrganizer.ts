import type { OrganizePdfFile, OrganizePdfPage } from '../../_types';
import { renderPdfPreviews } from '../../_utils/pdf';

// ============ LOAD PDF & GENERATE PREVIEWS ============

export async function loadPdfPages(file: File): Promise<{
  fileItem: OrganizePdfFile;
  pages: OrganizePdfPage[];
}> {
  const rendered = await renderPdfPreviews(file, { previewQuality: 0.8 });

  const pdfId = `${file.name}-${file.size}-${Date.now()}-${Math.random()}`;

  const fileItem: OrganizePdfFile = {
    id: pdfId,
    file,
    name: file.name,
    totalPages: rendered.numPages,
  };

  const pages: OrganizePdfPage[] = rendered.pages.map((p) => ({
    id: `${pdfId}-page-${p.pageIndex + 1}-${Math.random()}`,
    pdfId,
    pdfName: file.name,
    originalPageIndex: p.pageIndex,
    originalRotation: p.originalRotation,
    userRotation: 0,
    preview: p.preview,
    width: p.width,
    height: p.height,
  }));

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