export type QualityLevel = 'Low' | 'Medium' | 'High quality';

interface CompressOptions {
  quality: QualityLevel;
  maxDimension?: number; // Max width/height in pixels
}

// Quality settings matching Adobe Acrobat's typical outputs
const QUALITY_SETTINGS: Record<QualityLevel, { jpegQuality: number; maxDim: number; dpi: number }> = {
  'Low':          { jpegQuality: 0.60, maxDim: 1200, dpi: 96 },   // ~Screen quality
  'Medium':       { jpegQuality: 0.75, maxDim: 1800, dpi: 150 },  // ~eBook quality
  'High quality': { jpegQuality: 0.85, maxDim: 2400, dpi: 200 },  // ~Print quality
};

export interface CompressedImage {
  dataUrl: string;      // JPEG base64
  width: number;        // New width after resize
  height: number;       // New height after resize
  originalWidth: number;
  originalHeight: number;
  format: 'JPEG';
}

/**
 * Compresses an image using canvas:
 * 1. Resizes if larger than maxDimension
 * 2. Re-encodes as JPEG with quality setting
 * 3. Returns base64 data URL (much smaller than PNG)
 */
export async function compressImage(
  file: File | Blob,
  options: CompressOptions
): Promise<CompressedImage> {
  const settings = QUALITY_SETTINGS[options.quality];
  const maxDim = options.maxDimension ?? settings.maxDim;

  // Load image
  const img = await loadImage(file);
  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;

  // Calculate new dimensions (preserve aspect ratio)
  let { width, height } = calculateFitDimensions(
    originalWidth,
    originalHeight,
    maxDim
  );

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas context not available');

  // White background (for transparent PNGs → JPEG)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // High-quality resampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Encode as JPEG (much smaller than PNG for photos)
  const dataUrl = canvas.toDataURL('image/jpeg', settings.jpegQuality);

  return {
    dataUrl,
    width,
    height,
    originalWidth,
    originalHeight,
    format: 'JPEG',
  };
}

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function calculateFitDimensions(
  origW: number,
  origH: number,
  maxDim: number
): { width: number; height: number } {
  if (origW <= maxDim && origH <= maxDim) {
    return { width: origW, height: origH };
  }
  const ratio = Math.min(maxDim / origW, maxDim / origH);
  return {
    width: Math.round(origW * ratio),
    height: Math.round(origH * ratio),
  };
}