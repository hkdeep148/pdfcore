import type { WatermarkPdfFile, WatermarkSettings, WatermarkSize, WatermarkPosition } from '../../_types';

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

export const FONT_SIZES: Record<WatermarkSize, number> = {
  small: 30,
  medium: 60,
  large: 100,
  'extra-large': 160,
};

export const SIZE_LABELS: Record<WatermarkSize, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  'extra-large': 'Extra Large',
};

export const POSITION_LABELS: Record<WatermarkPosition, string> = {
  'top-left': '↖',
  'top-center': '↑',
  'top-right': '↗',
  'middle-left': '←',
  'middle-center': '●',
  'middle-right': '→',
  'bottom-left': '↙',
  'bottom-center': '↓',
  'bottom-right': '↘',
};

// ============ LOAD PDF INFO ============

export async function loadPdfInfo(file: File): Promise<WatermarkPdfFile> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const totalPages = pdf.numPages;
  const allPagePreviews: string[] = [];
  let pageWidth = 0;
  let pageHeight = 0;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    
    // Get REAL PDF dimensions (at scale 1.0)
    const realViewport = page.getViewport({ scale: 1.0 });
    
    if (i === 1) {
      pageWidth = realViewport.width;
      pageHeight = realViewport.height;
    }

    // Render at 0.6 scale for preview thumbnail
    const previewViewport = page.getViewport({ scale: 0.6 });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    canvas.width = previewViewport.width;
    canvas.height = previewViewport.height;

    await page.render({ canvasContext: ctx, viewport: previewViewport, canvas }).promise;
    const preview = canvas.toDataURL('image/jpeg', 0.8);
    allPagePreviews.push(preview);
  }

  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    name: file.name,
    sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    totalPages,
    firstPagePreview: allPagePreviews[0],
    allPagePreviews,
    pageWidth,
    pageHeight,
  };
}

// ============ PARSE PAGE RANGES ============

function parsePageList(input: string, totalPages: number): number[] {
  const result: number[] = [];
  const parts = input.split(',').map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
        for (let i = start; i <= end; i++) result.push(i - 1);
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        result.push(page - 1);
      }
    }
  }

  return [...new Set(result)];
}

// ============ HELPER: HEX TO RGB ============

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

// ============ HELPER: CALCULATE POSITION ============

function getWatermarkPosition(
  position: WatermarkPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number,
  rotation: number = 0,
  margin: number = 40
): { x: number; y: number } {
  let centerX: number, centerY: number;

  if (position.includes('left')) {
    centerX = margin + textWidth / 2;
  } else if (position.includes('right')) {
    centerX = pageWidth - margin - textWidth / 2;
  } else {
    centerX = pageWidth / 2;
  }

  if (position.includes('top')) {
    centerY = pageHeight - margin - textHeight / 2;
  } else if (position.includes('bottom')) {
    centerY = margin + textHeight / 2;
  } else {
    centerY = pageHeight / 2;
  }

  const radians = (rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const halfWidth = textWidth / 2;
  const halfHeight = textHeight / 2;

  const offsetX = -halfWidth * cos + halfHeight * sin;
  const offsetY = -halfWidth * sin - halfHeight * cos;

  return {
    x: centerX + offsetX,
    y: centerY + offsetY,
  };
}

// ============ APPLY WATERMARK ============

export interface ApplyWatermarkOptions {
  onProgress?: (current: number, total: number) => void;
}

export async function applyWatermark(
  file: File,
  settings: WatermarkSettings,
  options: ApplyWatermarkOptions = {}
): Promise<Blob> {
  const { onProgress } = options;

  const { PDFDocument, StandardFonts, rgb, degrees } = await import('pdf-lib');
  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = FONT_SIZES[settings.fontSize];
  const [r, g, b] = hexToRgb01(settings.color);

  const totalPages = pdfDoc.getPageCount();
  const pagesToWatermark = settings.applyToAllPages
    ? Array.from({ length: totalPages }, (_, i) => i)
    : parsePageList(settings.specificPages, totalPages);

  const textWidth = font.widthOfTextAtSize(settings.text, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  for (let i = 0; i < pagesToWatermark.length; i++) {
    onProgress?.(i, pagesToWatermark.length);
    
    const pageIndex = pagesToWatermark[i];
    const page = pdfDoc.getPage(pageIndex);
    const { width, height } = page.getSize();

    const { x, y } = getWatermarkPosition(
      settings.position,
      width,
      height,
      textWidth,
      textHeight,
      settings.rotation,
    );

    page.drawText(settings.text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity: settings.opacity,
      rotate: degrees(settings.rotation),
    });
  }
  onProgress?.(pagesToWatermark.length, pagesToWatermark.length);

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  return new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
}