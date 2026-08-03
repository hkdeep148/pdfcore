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

// ============ ⭐ EXIF ORIENTATION READER ============
/**
 * Reads EXIF orientation from a JPEG file
 * Returns: 1 = normal, 3 = 180°, 6 = 90° CW (portrait), 8 = 90° CCW
 */
async function getExifOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) { resolve(1); return; }
      
      const view = new DataView(buffer);
      
      if (view.getUint16(0, false) !== 0xFFD8) { resolve(1); return; }
      
      const length = view.byteLength;
      let offset = 2;
      
      while (offset < length) {
        if (offset + 2 > length) { resolve(1); return; }
        
        const marker = view.getUint16(offset, false);
        offset += 2;
        
        if (marker === 0xFFE1) {
          if (offset + 8 > length) { resolve(1); return; }
          if (view.getUint32(offset + 2, false) !== 0x45786966) { resolve(1); return; }
          
          const little = view.getUint16(offset + 8, false) === 0x4949;
          const tiffOffset = offset + 8;
          
          if (tiffOffset + 6 > length) { resolve(1); return; }
          
          const dirOffset = view.getUint32(tiffOffset + 4, little);
          const dirStart = tiffOffset + dirOffset;
          
          if (dirStart + 2 > length) { resolve(1); return; }
          
          const entries = view.getUint16(dirStart, little);
          
          for (let i = 0; i < entries; i++) {
            const entryOffset = dirStart + 2 + i * 12;
            if (entryOffset + 12 > length) break;
            
            if (view.getUint16(entryOffset, little) === 0x0112) {
              const orientation = view.getUint16(entryOffset + 8, little);
              resolve(orientation);
              return;
            }
          }
          
          resolve(1);
          return;
        } else if ((marker & 0xFF00) !== 0xFF00) {
          resolve(1);
          return;
        } else {
          if (offset + 2 > length) { resolve(1); return; }
          offset += view.getUint16(offset, false);
        }
      }
      
      resolve(1);
    };
    
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536)); // Read first 64KB
  });
}

// ============ ⭐ APPLY ORIENTATION TO IMAGEDATA (for jSquash) ============
async function applyOrientationToImageData(
  imageData: ImageData,
  orientation: number
): Promise<ImageData> {
  if (orientation === 1) return imageData;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageData;
  
  const { width, height } = imageData;
  
  // Set canvas size based on orientation
  if (orientation >= 5 && orientation <= 8) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  
  // Put original imageData on temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return imageData;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Apply transformation
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, height, width); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
  }
  
  ctx.drawImage(tempCanvas, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// ============ ⭐ APPLY ORIENTATION TO CANVAS (for Canvas fallback) ============
function applyOrientationToCanvas(
  img: HTMLImageElement,
  orientation: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  
  // Set canvas size based on orientation
  if (orientation >= 5 && orientation <= 8) {
    canvas.width = height;
    canvas.height = width;
  } else {
    canvas.width = width;
    canvas.height = height;
  }
  
  // Apply transformation based on orientation
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, height, width); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
  }
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas;
}

// ============ MAIN COMPRESSION FUNCTION ============
export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const originalSize = file.size;

  console.log('🔵 [Compressor] Starting');
  console.log('🔵 File:', file.name, file.type, `${(file.size / 1024).toFixed(0)}KB`);

  // Try jSquash first
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
    
    if (err instanceof Error && (err.name === 'NotReadableError' || err.message.includes('could not be read'))) {
      throw new Error(
        'File access was lost. This can happen on Samsung/Android phones. Please re-select the image and try again immediately.'
      );
    }
  }

  // Try browser-image-compression fallback
  try {
    console.log('🟡 Attempting browser-image-compression fallback...');
    const result = await compressWithFallback(file, options);
    console.log('✅ Fallback success');
    return result;
  } catch (err) {
    console.warn('⚠️ Fallback also failed:', err instanceof Error ? err.message : err);
    
    if (err instanceof Error && (err.name === 'NotReadableError' || err.message.includes('could not be read'))) {
      throw new Error(
        'File access was lost. This can happen on Samsung/Android phones. Please re-select the image and try again immediately.'
      );
    }
  }

  // Last resort: Pure Canvas API
  try {
    console.log('🟠 Attempting Canvas fallback (last resort)...');
    const result = await compressWithCanvas(file, options);
    console.log('✅ Canvas success');
    return result;
  } catch (err) {
    console.error('❌ All compression methods failed:', err);
    
    if (err instanceof Error) {
      if (err.name === 'NotReadableError' || err.message.includes('could not be read') || err.message.includes('permission')) {
        throw new Error(
          'File access was lost. This is common on Samsung phones. Please re-select the image and click "Compress" quickly.'
        );
      }
      
      if (err.message.includes('load') || err.message.includes('timeout')) {
        throw new Error(
          'Could not load this image. The file may be corrupted or in an unsupported format. Try re-saving it as a standard JPG.'
        );
      }
      
      if (err.message.includes('memory') || err.message.includes('allocation')) {
        throw new Error(
          'Not enough memory to process this image. Try compressing a smaller image or close other apps.'
        );
      }
    }
    
    throw new Error(
      'Unable to compress this image. Try re-saving the image and try again.'
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
  
  // ⭐ Get EXIF orientation for JPEG files
  let orientation = 1;
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    orientation = await getExifOrientation(file);
    console.log('📐 EXIF orientation:', orientation);
  }
  
  let imageData = await decodeImage(file);
  
  // ⭐ Apply orientation if needed
  if (orientation > 1) {
    console.log('🔄 Applying rotation for orientation:', orientation);
    imageData = await applyOrientationToImageData(imageData, orientation);
  }
  
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
    preserveExif: false, // ⭐ Don't preserve EXIF (rotation is baked into pixels)
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

// ============ ⭐ CANVAS FALLBACK (LAST RESORT) — With EXIF Support ============
async function compressWithCanvas(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const {
    quality = 75,
    outputFormat = 'image/jpeg',
    maxDimension = 0,
  } = options;

  // ⭐ Get EXIF orientation FIRST (before loading image)
  let orientation = 1;
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    orientation = await getExifOrientation(file);
    console.log('📐 Canvas fallback - EXIF orientation:', orientation);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    const timeoutId = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load timeout (30s)'));
    }, 30000);

    img.onload = () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
      
      try {
        // ⭐ First, apply orientation to get a properly rotated canvas
        const orientedCanvas = applyOrientationToCanvas(img, orientation);
        
        // Now handle resizing if needed
        let finalCanvas = orientedCanvas;
        
        if (maxDimension > 0) {
          const currentWidth = orientedCanvas.width;
          const currentHeight = orientedCanvas.height;
          
          if (currentWidth > maxDimension || currentHeight > maxDimension) {
            let newWidth = currentWidth;
            let newHeight = currentHeight;
            
            if (currentWidth > currentHeight) {
              newWidth = maxDimension;
              newHeight = Math.round((currentHeight * maxDimension) / currentWidth);
            } else {
              newHeight = maxDimension;
              newWidth = Math.round((currentWidth * maxDimension) / currentHeight);
            }
            
            // Create resized canvas
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = newWidth;
            resizedCanvas.height = newHeight;
            const resizedCtx = resizedCanvas.getContext('2d');
            
            if (resizedCtx) {
              resizedCtx.imageSmoothingEnabled = true;
              resizedCtx.imageSmoothingQuality = 'high';
              resizedCtx.drawImage(orientedCanvas, 0, 0, newWidth, newHeight);
              finalCanvas = resizedCanvas;
            }
          }
        }

        // Convert to blob
        finalCanvas.toBlob(
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