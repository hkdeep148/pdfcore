'use client';

/**
 * Image compressor using jSquash (Squoosh's engines).
 * Uses MozJPEG for JPEG, standard PNG encoder, and libwebp for WebP.
 * For PNG photos, users should convert to WEBP or JPG for best compression.
 */

export type CompressionMode = 'quality' | 'size';
export type OutputFormat = 'same' | 'image/jpeg' | 'image/png' | 'image/webp';

export interface CompressOptions {
  mode: CompressionMode;
  quality?: number;
  targetSizeKB?: number;
  outputFormat?: OutputFormat;
  maxDimension?: number;
  onProgress?: (message: string) => void;
}

export interface CompressResult {
  blob: Blob;
  format: string;
  originalSize: number;
  compressedSize: number;
  reduction: number;
}

// ============ MAIN COMPRESSION FUNCTION ============
export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const originalSize = file.size;

  try {
    const result = await compressWithJSquash(file, options);

    // If compressed is larger, return original
    if (result.blob.size >= originalSize) {
      console.log('Compressed larger than original, keeping original');
      return {
        blob: file,
        format: file.type,
        originalSize,
        compressedSize: originalSize,
        reduction: 0,
      };
    }

    const reduction = Math.max(
      0,
      Math.round(((originalSize - result.blob.size) / originalSize) * 100)
    );

    return {
      blob: result.blob,
      format: result.format,
      originalSize,
      compressedSize: result.blob.size,
      reduction,
    };
  } catch (err) {
    console.warn('jSquash failed, using fallback:', err);
    return await compressWithFallback(file, options);
  }
}

// ============ JSQUASH COMPRESSION ============
async function compressWithJSquash(
  file: File,
  options: CompressOptions
): Promise<{ blob: Blob; format: string }> {
  const {
    mode,
    quality = 75,
    targetSizeKB = 500,
    outputFormat = 'same',
    maxDimension = 0,
    onProgress,
  } = options;

  onProgress?.('Decoding image...');

  const imageData = await decodeImage(file);
  const targetFormat = getTargetFormat(file.type, outputFormat);

  // Optional resize
  let finalImageData = imageData;
  if (
    maxDimension > 0 &&
    (imageData.width > maxDimension || imageData.height > maxDimension)
  ) {
    onProgress?.('Resizing image...');
    finalImageData = await resizeImage(imageData, maxDimension);
  }

  onProgress?.(`Compressing to ${getFormatName(targetFormat)}...`);

  let blob: Blob;
  if (mode === 'quality') {
    blob = await encodeImage(finalImageData, targetFormat, quality);
  } else {
    blob = await compressToTargetSize(finalImageData, targetFormat, targetSizeKB, onProgress);
  }

  return { blob, format: targetFormat };
}

// ============ DECODE IMAGE ============
async function decodeImage(file: File): Promise<ImageData> {
  const arrayBuffer = await file.arrayBuffer();
  const mimeType = file.type.toLowerCase();

  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    const jpegModule = await import('@jsquash/jpeg');
    return await jpegModule.decode(arrayBuffer);
  } else if (mimeType === 'image/png') {
    const pngModule = await import('@jsquash/png');
    return await pngModule.decode(arrayBuffer);
  } else if (mimeType === 'image/webp') {
    const webpModule = await import('@jsquash/webp');
    return await webpModule.decode(arrayBuffer);
  } else {
    throw new Error(`Unsupported input format: ${mimeType}`);
  }
}

// ============ ENCODE IMAGE ============
async function encodeImage(
  imageData: ImageData,
  format: string,
  quality: number
): Promise<Blob> {
  const q = Math.max(1, Math.min(100, quality));

  if (format === 'image/jpeg') {
    const jpegModule = await import('@jsquash/jpeg');
    const buffer = await jpegModule.encode(imageData, {
      quality: q,
      progressive: true,
      optimize_coding: true,
      trellis_multipass: true,
      chroma_subsample: 2,
      auto_subsample: true,
    });
    return new Blob([buffer], { type: 'image/jpeg' });
  } else if (format === 'image/png') {
    // Standard PNG encoding - PNG is lossless, minimal compression
    const pngModule = await import('@jsquash/png');
    const buffer = await pngModule.encode(imageData);
    return new Blob([buffer], { type: 'image/png' });
  } else if (format === 'image/webp') {
    const webpModule = await import('@jsquash/webp');
    const buffer = await webpModule.encode(imageData, {
      quality: q,
      method: 6,
      alpha_quality: 100,
    });
    return new Blob([buffer], { type: 'image/webp' });
  } else {
    throw new Error(`Cannot encode to format: ${format}`);
  }
}

// ============ RESIZE IMAGE ============
async function resizeImage(
  imageData: ImageData,
  maxDimension: number
): Promise<ImageData> {
  const { width, height } = imageData;
  let newWidth = width;
  let newHeight = height;

  if (width > height) {
    if (width > maxDimension) {
      newWidth = maxDimension;
      newHeight = Math.round((height * maxDimension) / width);
    }
  } else {
    if (height > maxDimension) {
      newHeight = maxDimension;
      newWidth = Math.round((width * maxDimension) / height);
    }
  }

  if (newWidth === width && newHeight === height) {
    return imageData;
  }

  const resizeModule = await import('@jsquash/resize');
  return await resizeModule.default(imageData, {
    width: newWidth,
    height: newHeight,
    method: 'lanczos3',
    fitMethod: 'stretch',
    premultiply: true,
    linearRGB: true,
  });
}

// ============ TARGET SIZE MODE ============
async function compressToTargetSize(
  imageData: ImageData,
  format: string,
  targetSizeKB: number,
  onProgress?: (message: string) => void
): Promise<Blob> {
  const targetBytes = targetSizeKB * 1024;
  let low = 1;
  let high = 100;
  let bestBlob: Blob | null = null;
  let iteration = 0;
  const maxIterations = 8;

  while (low <= high && iteration < maxIterations) {
    iteration++;
    const mid = Math.floor((low + high) / 2);
    onProgress?.(`Optimizing (${iteration}/${maxIterations})...`);

    const blob = await encodeImage(imageData, format, mid);

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return bestBlob || (await encodeImage(imageData, format, 1));
}

// ============ HELPERS ============
function getTargetFormat(originalMime: string, outputFormat: OutputFormat): string {
  if (outputFormat === 'same') {
    const mime = originalMime.toLowerCase();
    if (mime === 'image/jpg') return 'image/jpeg';
    return mime;
  }
  return outputFormat;
}

function getFormatName(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WEBP',
  };
  return map[mime] || 'image';
}

export function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType.toLowerCase()] || 'jpg';
}

// ============ FALLBACK ============
async function compressWithFallback(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const {
    mode,
    quality = 75,
    targetSizeKB = 500,
    outputFormat = 'same',
    maxDimension = 0,
    onProgress,
  } = options;

  onProgress?.('Using fallback compression...');

  const imageCompression = (await import('browser-image-compression')).default;

  const compressionOptions: any = {
    useWebWorker: true,
    alwaysKeepResolution: maxDimension === 0,
  };

  if (mode === 'quality') {
    compressionOptions.initialQuality = quality / 100;
  } else {
    compressionOptions.maxSizeMB = targetSizeKB / 1024;
  }

  if (maxDimension > 0) {
    compressionOptions.maxWidthOrHeight = maxDimension;
  }

  if (outputFormat !== 'same') {
    compressionOptions.fileType = outputFormat;
  }

  const compressed = await imageCompression(file, compressionOptions);
  const reduction = Math.max(
    0,
    Math.round(((file.size - compressed.size) / file.size) * 100)
  );

  return {
    blob: compressed,
    format: compressed.type,
    originalSize: file.size,
    compressedSize: compressed.size,
    reduction,
  };
}