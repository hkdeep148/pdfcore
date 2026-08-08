import type { SignPdfFile, SignPdfPage, PlacedSignature, Signature } from '../../_types';
import { getPdfjs } from '../../_utils/pdf';

// ============ BLUE INK COLORS (Realistic Pen Colors) ============

export const INK_COLORS = {
  darkBlue: '#1E3A8A',      // Fountain pen ink (default) 
  blue: '#1E40AF',           // Ballpoint pen blue
  royalBlue: '#2563EB',      // Royal blue ink
  black: '#000000',          // Classic black ink
  red: '#DC2626',            // Red pen
};

export const DEFAULT_INK_COLOR = INK_COLORS.darkBlue;
export const DEFAULT_PEN_SIZE = 2.5;

// ============ CURSIVE FONTS FOR TYPED SIGNATURES ============

export const SIGNATURE_FONTS = [
  { name: 'Dancing Script', family: '"Dancing Script", cursive' },
  { name: 'Great Vibes', family: '"Great Vibes", cursive' },
  { name: 'Sacramento', family: '"Sacramento", cursive' },
  { name: 'Allura', family: '"Allura", cursive' },
];

// ============ LOAD PDF WITH ALL PAGES ============

export async function loadPdfFile(file: File): Promise<SignPdfFile> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  const totalPages = pdf.numPages;
  const pages: SignPdfPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const preview = canvas.toDataURL('image/jpeg', 0.85);

    pages.push({
      id: `page-${i}-${Date.now()}`,
      pageIndex: i - 1,
      preview,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    name: file.name,
    sizeMB: (file.size / 1024 / 1024).toFixed(2) + ' MB',
    totalPages,
    pages,
  };
}

// ============ CREATE SIGNATURE FROM DRAWING ============

export function createSignatureFromCanvas(canvas: HTMLCanvasElement): Signature {
  // Trim empty space around signature
  const trimmedCanvas = trimCanvas(canvas);
  const imageDataUrl = trimmedCanvas.toDataURL('image/png');

  return {
    id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    imageDataUrl,
    width: trimmedCanvas.width,
    height: trimmedCanvas.height,
    createdAt: Date.now(),
  };
}

// ============ CREATE SIGNATURE FROM TEXT ============

export function createSignatureFromText(
  text: string,
  font: string,
  color: string,
  fontSize: number = 60
): Signature {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Measure text
  ctx.font = `${fontSize}px ${font}`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.4;

  // Set canvas size with padding
  canvas.width = Math.ceil(textWidth + 40);
  canvas.height = Math.ceil(textHeight + 20);

  // Redraw with correct size
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return {
    id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    imageDataUrl: canvas.toDataURL('image/png'),
    width: canvas.width,
    height: canvas.height,
    createdAt: Date.now(),
  };
}

// ============ CREATE SIGNATURE FROM UPLOADED IMAGE ============

export async function createSignatureFromImage(file: File): Promise<Signature> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        
        // Draw image with transparency
        ctx.drawImage(img, 0, 0);
        
        resolve({
          id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          imageDataUrl: canvas.toDataURL('image/png'),
          width: img.width,
          height: img.height,
          createdAt: Date.now(),
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ============ TRIM CANVAS (Remove Empty Space) ============

function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;

  let top = canvas.height;
  let bottom = 0;
  let left = canvas.width;
  let right = 0;

  // Find bounds
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 0) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  // Add small padding
  const padding = 10;
  top = Math.max(0, top - padding);
  left = Math.max(0, left - padding);
  bottom = Math.min(canvas.height, bottom + padding);
  right = Math.min(canvas.width, right + padding);

  const width = right - left;
  const height = bottom - top;

  if (width <= 0 || height <= 0) return canvas;

  // Create trimmed canvas
  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = width;
  trimmedCanvas.height = height;
  const trimmedCtx = trimmedCanvas.getContext('2d');
  if (!trimmedCtx) return canvas;

  trimmedCtx.drawImage(canvas, left, top, width, height, 0, 0, width, height);
  return trimmedCanvas;
}

// In app/tools/sign-pdf/_utils/signer.ts, replace the signPdf function:

export async function signPdf(
  file: File,
  signatures: Signature[],
  placedSignatures: PlacedSignature[]
): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');

  const buffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pdfPages = pdfDoc.getPages();

  const signatureMap = new Map(signatures.map(sig => [sig.id, sig]));

  for (const placed of placedSignatures) {
    const signature = signatureMap.get(placed.signatureId);
    if (!signature) continue;

    const pdfPage = pdfPages[placed.pageIndex];
    if (!pdfPage) continue;

    const { width: pdfWidth, height: pdfHeight } = pdfPage.getSize();

    // ⭐ Use displayWidth/Height stored when signature was placed
    const dispW = placed.displayWidth;
    const dispH = placed.displayHeight;

    if (!dispW || !dispH || dispW <= 0 || dispH <= 0) {
      console.error('❌ Missing displayWidth/Height for signature!', placed);
      continue;
    }

    // ⭐ Calculate independent X and Y scales
    const scaleX = pdfWidth / dispW;
    const scaleY = pdfHeight / dispH;

    // Convert display coordinates to PDF coordinates
    const sigX = placed.x * scaleX;
    const sigW = placed.width * scaleX;
    const sigH = placed.height * scaleY;
    
    // Flip Y-axis (PDF: bottom-up, Display: top-down)
    const sigY = pdfHeight - (placed.y * scaleY) - sigH;

    console.log('=== SIGNATURE PLACEMENT ===');
    console.log('PDF size:', pdfWidth.toFixed(1), 'x', pdfHeight.toFixed(1));
    console.log('Display size:', dispW.toFixed(1), 'x', dispH.toFixed(1));
    console.log('Scale X/Y:', scaleX.toFixed(3), '/', scaleY.toFixed(3));
    console.log('Display coords:', placed.x.toFixed(1), ',', placed.y.toFixed(1));
    console.log('Display size:', placed.width.toFixed(1), 'x', placed.height.toFixed(1));
    console.log('PDF coords:', sigX.toFixed(1), ',', sigY.toFixed(1));
    console.log('PDF sig size:', sigW.toFixed(1), 'x', sigH.toFixed(1));
    console.log('============================');

    if (isNaN(sigX) || isNaN(sigY) || isNaN(sigW) || isNaN(sigH)) {
      console.error('Invalid coords!', { sigX, sigY, sigW, sigH });
      continue;
    }

    const base64 = signature.imageDataUrl.split(',')[1];
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    const image = await pdfDoc.embedPng(bytes);

    pdfPage.drawImage(image, {
      x: Math.max(0, sigX),
      y: Math.max(0, sigY),
      width: Math.max(10, sigW),
      height: Math.max(10, sigH),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes) as BlobPart], { type: 'application/pdf' });
}