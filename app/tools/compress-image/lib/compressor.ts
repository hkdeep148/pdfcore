'use client';

export type CompressionMode = 'quality' | 'size';
export type OutputFormat = 'image/jpeg' | 'image/webp';

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

  console.log('🔵 [Compressor] Starting');
  console.log('🔵 File:', file.name, file.type, `${(file.size / 1024).toFixed(0)}KB`);

  // ⭐ Try jSquash first
  try {
    console.log('🔵 Attempting jSquash...');
    const result = await compressWithJSquash(file, options);
    
    if (result.blob.size >= originalSize) {
      console.log('⚠️ Compressed larger than original');
      return {
        blob: file,
        format: file.type,
        originalSize,
        compressedSize: originalSize,
        reduction: 0,
      };
    }

    const reduction = Math.max(0, Math.round(((originalSize - result.blob.size) / originalSize) * 100));
    console.log('✅ jSquash success:', `${reduction}% reduction`);
    
    return {
      blob: result.blob,
      format: result.format,
      originalSize,
      compressedSize: result.blob.size,
      reduction,
    };
  } catch (err) {
    console.warn('⚠️ jSquash failed:', err instanceof Error ? err.message : err);
  }

  // ⭐ Try browser-image-compression fallback
  try {
    console.log('🟡 Attempting browser-image-compression fallback...');
    const result = await compressWithFallback(file, options);
    console.log('✅ Fallback success');
    return result;
  } catch (err) {
    console.warn('⚠️ Fallback also failed:', err instanceof Error ? err.message : err);
  }

  // ⭐ Last resort: Pure Canvas API (works on ANY image the browser can display)
  try {
    console.log('🟠 Attempting Canvas fallback (last resort)...');
    const result = await compressWithCanvas(file, options);
    console.log('✅ Canvas success');
    return result;
  } catch (err) {
    console.error('❌ All compression methods failed:', err);
    throw new Error(
      `Unable to compress this image. It may be corrupted or in an unsupported format. Try re-saving the image and try again.`
    );
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
    outputFormat = 'image/jpeg',
    maxDimension = 0,
    onProgress,
  } = options;

  onProgress?.('Decoding image...');
  const imageData = await decodeImage(file);
  const targetFormat = outputFormat;

  let finalImageData = imageData;
  if (maxDimension > 0 && (imageData.width > maxDimension || imageData.height > maxDimension)) {
    onProgress?.('Resizing image...');
    finalImageData = await resizeImage(imageData, maxDimension);
  }

  onProgress?.(`Compressing...`);
  
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
async function resizeImage(imageData: ImageData, maxDimension: number): Promise<ImageData> {
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

// ============ BROWSER-IMAGE-COMPRESSION FALLBACK ============
async function compressWithFallback(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const {
    mode,
    quality = 75,
    targetSizeKB = 500,
    outputFormat = 'image/jpeg',
    maxDimension = 0,
  } = options;

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

  compressionOptions.fileType = outputFormat;

  const compressed = await imageCompression(file, compressionOptions);
  const reduction = Math.max(0, Math.round(((file.size - compressed.size) / file.size) * 100));

  return {
    blob: compressed,
    format: compressed.type,
    originalSize: file.size,
    compressedSize: compressed.size,
    reduction,
  };
}

// ============ ⭐ CANVAS FALLBACK (LAST RESORT) ============
// This works on ANY image the browser can display
async function compressWithCanvas(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const {
    quality = 75,
    outputFormat = 'image/jpeg',
    maxDimension = 0,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    // Set timeout for slow loading
    const timeoutId = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load timeout (30s)'));
    }, 30000);

    img.onload = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
      
      try {
        // Calculate dimensions
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (maxDimension > 0) {
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }

            const reduction = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

            resolve({
              blob,
              format: outputFormat,
              originalSize: file.size,
              compressedSize: blob.size,
              reduction,
            });
          },
          outputFormat,
          quality / 100
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
      reject(new Error('Image failed to load - file may be corrupted'));
    };

    img.src = url;
  });
}

// ============ HELPER ============
export function getFileExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType.toLowerCase()] || 'jpg';
}