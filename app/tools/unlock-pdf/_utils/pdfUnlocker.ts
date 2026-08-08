import { getPdfjs } from '../../_utils/pdf';

// ============ CUSTOM ERROR TYPES ============

export class WrongPasswordError extends Error {
  constructor(message = 'Incorrect password. Please try again.') {
    super(message);
    this.name = 'WrongPasswordError';
  }
}

export class PasswordRequiredError extends Error {
  constructor(message = 'This PDF requires a password.') {
    super(message);
    this.name = 'PasswordRequiredError';
  }
}

// ============ CHECK IF PDF IS ENCRYPTED ============

export async function isPdfEncrypted(file: File): Promise<boolean> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();

  try {
    await pdfjs.getDocument({ data: buffer }).promise;
    return false;
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error.name === 'PasswordException') {
      return true;
    }
    return false;
  }
}

// ============ RESULT TYPE ============

export interface UnlockResult {
  blob: Blob;
  method: 'fast' | 'canvas';
}

// ============ UNLOCK PDF ============

/**
 * Unlock a password-protected PDF.
 *
 * Strategy:
 * 1. Verify password with pdf.js
 * 2. Render each page to canvas
 * 3. Rebuild PDF from images
 */
export async function unlockPdf(
  file: File,
  password: string,
  onProgress?: (current: number, total: number) => void
): Promise<UnlockResult> {
  const pdfjs = await getPdfjs();
  const buffer = await file.arrayBuffer();

  // ⭐ Verify password with pdf.js - silently handle password errors
  let pdfDoc;
  try {
    pdfDoc = await pdfjs.getDocument({
      data: buffer.slice(0),
      password: password,
    }).promise;
  } catch (err: unknown) {
    const error = err as { name?: string; code?: number; message?: string };

    // ⭐ Password errors are EXPECTED — don't log them
    if (error.name === 'PasswordException') {
      if (error.code === 1) {
        throw new PasswordRequiredError();
      }
      // code === 2 = incorrect password
      throw new WrongPasswordError();
    }

    // ⭐ Only log truly unexpected errors
    console.error('PDF unlock error (unexpected):', err);
    throw new Error('Failed to unlock PDF. File may be corrupted.');
  }

  // ⭐ Render each page to canvas → rebuild PDF
  const blob = await unlockViaCanvas(pdfDoc, onProgress);
  return {
    blob,
    method: 'canvas',
  };
}

/**
 * Render each page to canvas and embed as JPEG in new PDF.
 * Preserves visual appearance but converts text to images.
 */
async function unlockViaCanvas(
  pdfDoc: any,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const outputPdf = await PDFDocument.create();

  const totalPages = pdfDoc.numPages;

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.(i - 1, totalPages);

    const page = await pdfDoc.getPage(i);

    // Use higher scale for better quality (2.5x = ~150 DPI equivalent)
    const scale = 2.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas not supported');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render page
    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
      intent: 'print', // ⭐ Higher quality rendering
    }).promise;

    // Convert to JPEG (better compression than PNG for scanned/rendered content)
    const jpegBlob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => b ? resolve(b) : reject(new Error('Canvas conversion failed')),
        'image/jpeg',
        0.92 // High quality
      );
    });

    const jpegArrayBuffer = await jpegBlob.arrayBuffer();
    const jpegBytes = new Uint8Array(jpegArrayBuffer);

    const embeddedImage = await outputPdf.embedJpg(jpegBytes);

    // Original page size in points (72 DPI)
    const pageWidthPt = viewport.width / scale;
    const pageHeightPt = viewport.height / scale;

    const pdfPage = outputPdf.addPage([pageWidthPt, pageHeightPt]);
    pdfPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: pageWidthPt,
      height: pageHeightPt,
    });

    // Clean up canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.(totalPages, totalPages);

  const pdfBytes = await outputPdf.save({
    useObjectStreams: true,
  });

  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}