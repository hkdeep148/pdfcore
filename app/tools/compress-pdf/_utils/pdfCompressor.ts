import type { CompressionLevel } from '../../_types';

// ============ COMPRESSION PROFILES ============
const COMPRESSION_PROFILES: Record<
  CompressionLevel,
  {
    jpegQuality: number;
    pngJpegQuality: number;
    maxDimensionPx: number;
    pngMaxDimensionPx: number;
    convertPngToJpeg: boolean;
    minSavingsRatio: number; // Only replace image if new is at least this % smaller
  }
> = {
 // 🟢 LOW — Near-original quality
// Target: 25-35% reduction | 4.39 MB → ~3.0 MB
low: {
  jpegQuality: 0.94,
  pngJpegQuality: 0.94,
  maxDimensionPx: 3500,
  pngMaxDimensionPx: 3500,
  convertPngToJpeg: true,
  minSavingsRatio: 0.37,       // ⬇ was 0.40 — small tweak
},
  // ⭐ Reduce File Size" default equivalent
  // Target: 4.39 MB → ~1.5 MB (66% reduction)
 medium: {
  jpegQuality: 0.88,           // ⬆ was 0.82
  pngJpegQuality: 0.90,        // ⬆ was 0.85
  maxDimensionPx: 2600,        // ⬆ was 2100 — BIG JUMP
  pngMaxDimensionPx: 2600,     // ⬆ was 2100
  convertPngToJpeg: true,
  minSavingsRatio: 0.15,       // ⬆ was 0.10
},
  // Maximum compression
  high: {
  jpegQuality: 0.68,           // ⬆ was 0.60 — less blocky artifacts
  pngJpegQuality: 0.72,        // ⬆ was 0.65 — cleaner text/edges
  maxDimensionPx: 1700,        // ⬆ was 1400 — still readable when zoomed
  pngMaxDimensionPx: 1700,     // ⬆ was 1400
  convertPngToJpeg: true,
  minSavingsRatio: 0.08,       // ⬆ was 0.05 — skip pointless conversions
},
};

/**
 * Compresses a PDF by extracting, downsampling, and re-encoding images.
 * "Reduce File Size" behavior.
 */
export async function compressPdf(
  file: File,
  level: CompressionLevel,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const { PDFDocument, PDFName, PDFRawStream, PDFNumber } = await import('pdf-lib');
  const profile = COMPRESSION_PROFILES[level];

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: false,
    updateMetadata: false,
  });

  const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
  const imageEntries: Array<{ ref: any; dict: any; stream: any }> = [];

  for (const [ref, obj] of indirectObjects) {
    if (obj instanceof PDFRawStream) {
      const dict = obj.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype?.toString() === '/Image') {
        imageEntries.push({ ref, dict, stream: obj });
      }
    }
  }

  const total = imageEntries.length;
  let totalOriginalImageBytes = 0;
  let totalCompressedImageBytes = 0;
  let processedCount = 0;
  let convertedPngCount = 0;

  console.log(`[pdfCompressor] Level: ${level}, Found ${total} images`);

  for (let i = 0; i < imageEntries.length; i++) {
    const { dict, stream } = imageEntries[i];
    onProgress?.(i, total);

    try {
      const filter = dict.get(PDFName.of('Filter'));
      const filterStr = filter?.toString() ?? '';
      const width = Number(dict.get(PDFName.of('Width'))?.toString() ?? '0');
      const height = Number(dict.get(PDFName.of('Height'))?.toString() ?? '0');
      const bitsPerComponent = Number(dict.get(PDFName.of('BitsPerComponent'))?.toString() ?? '8');
      const colorSpace = dict.get(PDFName.of('ColorSpace'))?.toString() ?? '';

      if (!width || !height) continue;
      if (width < 100 && height < 100) continue; // Skip tiny icons

      const originalSize = stream.contents.length;
      totalOriginalImageBytes += originalSize;

      // ============ CASE 1: JPEG (DCTDecode) ============
      if (filterStr.includes('DCTDecode')) {
        const jpegBytes = stream.contents;
        const recompressed = await recompressJpeg(
          jpegBytes,
          width,
          height,
          profile.jpegQuality,
          profile.maxDimensionPx
        );

        if (!recompressed) {
          totalCompressedImageBytes += originalSize;
          continue;
        }

        // Only replace if meaningful savings
        if (recompressed.bytes.length >= jpegBytes.length * (1 - profile.minSavingsRatio)) {
          totalCompressedImageBytes += originalSize;
          continue;
        }

        stream.contents = recompressed.bytes;
        dict.set(PDFName.of('Width'), PDFNumber.of(recompressed.width));
        dict.set(PDFName.of('Height'), PDFNumber.of(recompressed.height));
        dict.set(PDFName.of('Length'), PDFNumber.of(recompressed.bytes.length));
        totalCompressedImageBytes += recompressed.bytes.length;
        processedCount++;
        continue;
      }

      // ============ CASE 2: PNG-like (FlateDecode) ============
      if (
        filterStr.includes('FlateDecode') &&
        profile.convertPngToJpeg &&
        bitsPerComponent === 8 &&
        (colorSpace.includes('DeviceRGB') || colorSpace.includes('DeviceGray'))
      ) {
        // Skip transparent images (preserve alpha)
        const hasSMask = !!dict.get(PDFName.of('SMask'));
        if (hasSMask) {
          totalCompressedImageBytes += originalSize;
          continue;
        }

        const isGray = colorSpace.includes('DeviceGray');
        const recompressed = await recompressRawPixels(
          stream.contents,
          width,
          height,
          isGray ? 1 : 3,
          profile.pngJpegQuality,
          profile.pngMaxDimensionPx
        );

        if (!recompressed) {
          totalCompressedImageBytes += originalSize;
          continue;
        }

        if (recompressed.bytes.length >= originalSize * (1 - profile.minSavingsRatio)) {
          totalCompressedImageBytes += originalSize;
          continue;
        }

        // Convert PNG-like → JPEG
        stream.contents = recompressed.bytes;
        dict.set(PDFName.of('Width'), PDFNumber.of(recompressed.width));
        dict.set(PDFName.of('Height'), PDFNumber.of(recompressed.height));
        dict.set(PDFName.of('Length'), PDFNumber.of(recompressed.bytes.length));
        dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
        dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
        dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
        dict.delete(PDFName.of('DecodeParms'));

        totalCompressedImageBytes += recompressed.bytes.length;
        processedCount++;
        convertedPngCount++;
        continue;
      }

      // Other formats — keep as-is
      totalCompressedImageBytes += originalSize;
    } catch (err) {
      console.warn(`[pdfCompressor] Skipped image ${i}:`, err);
      totalCompressedImageBytes += stream.contents.length;
    }
  }

  onProgress?.(total, total);

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: level === 'high' ? 200 : 50,
  });

  const savedMB = ((totalOriginalImageBytes - totalCompressedImageBytes) / 1024 / 1024).toFixed(2);
  console.log(
    `[pdfCompressor] ✓ Processed ${processedCount}/${total} images (${convertedPngCount} PNG→JPEG), saved ${savedMB} MB from images`
  );

  return new Blob([compressedBytes as BlobPart], { type: 'application/pdf' });
}

// ============ JPEG RECOMPRESSION ============

interface RecompressedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

async function recompressJpeg(
  jpegBytes: Uint8Array,
  origW: number,
  origH: number,
  jpegQuality: number,
  maxDim: number
): Promise<RecompressedImage | null> {
  const blob = new Blob([jpegBytes as BlobPart], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    let outW = origW, outH = origH;

    if (outW > maxDim || outH > maxDim) {
      const r = Math.min(maxDim / outW, maxDim / outH);
      outW = Math.round(outW * r);
      outH = Math.round(outH * r);
    }

    // Skip if already efficiently compressed and no resize needed
    const bytesPerPixel = jpegBytes.length / (origW * origH);
    if (outW === origW && outH === origH && bytesPerPixel < 0.4) {
      return null; // Already well-compressed
    }

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return null;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, outW, outH);

    const outBlob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, 'image/jpeg', jpegQuality)
    );
    if (!outBlob) return null;

    const buf = await outBlob.arrayBuffer();
    return { bytes: new Uint8Array(buf), width: outW, height: outH };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ============ PNG/RAW PIXEL RECOMPRESSION ============

async function recompressRawPixels(
  flateBytes: Uint8Array,
  origW: number,
  origH: number,
  channels: 1 | 3,
  jpegQuality: number,
  maxDim: number
): Promise<RecompressedImage | null> {
  try {
    const pixels = await inflateRaw(flateBytes);
    const expectedSize = origW * origH * channels;

    if (pixels.length < expectedSize) {
      return null;
    }

    let outW = origW, outH = origH;
    if (outW > maxDim || outH > maxDim) {
      const r = Math.min(maxDim / outW, maxDim / outH);
      outW = Math.round(outW * r);
      outH = Math.round(outH * r);
    }

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = origW;
    srcCanvas.height = origH;
    const srcCtx = srcCanvas.getContext('2d', { alpha: false });
    if (!srcCtx) return null;

    const imageData = srcCtx.createImageData(origW, origH);
    const data = imageData.data;

    if (channels === 3) {
      for (let i = 0, j = 0; i < expectedSize; i += 3, j += 4) {
        data[j] = pixels[i];
        data[j + 1] = pixels[i + 1];
        data[j + 2] = pixels[i + 2];
        data[j + 3] = 255;
      }
    } else {
      for (let i = 0, j = 0; i < expectedSize; i += 1, j += 4) {
        data[j] = data[j + 1] = data[j + 2] = pixels[i];
        data[j + 3] = 255;
      }
    }
    srcCtx.putImageData(imageData, 0, 0);

    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext('2d', { alpha: false });
    if (!outCtx) return null;

    outCtx.fillStyle = '#FFFFFF';
    outCtx.fillRect(0, 0, outW, outH);
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';
    outCtx.drawImage(srcCanvas, 0, 0, outW, outH);

    const outBlob: Blob | null = await new Promise((res) =>
      outCanvas.toBlob(res, 'image/jpeg', jpegQuality)
    );
    if (!outBlob) return null;

    const buf = await outBlob.arrayBuffer();
    return { bytes: new Uint8Array(buf), width: outW, height: outH };
  } catch (err) {
    console.warn('[pdfCompressor] Raw pixel recompression failed:', err);
    return null;
  }
}

async function inflateRaw(compressed: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([compressed as BlobPart]).stream();
  const decompressed = stream.pipeThrough(new DecompressionStream('deflate'));
  const reader = decompressed.getReader();
  const chunks: Uint8Array[] = [];
  let totalLen = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLen += value.length;
  }

  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

// ============ HELPERS ============

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function calculateSavings(originalBytes: number, compressedBytes: number): number {
  if (originalBytes === 0) return 0;
  return Math.round(((originalBytes - compressedBytes) / originalBytes) * 100);
}

export const COMPRESSION_LEVEL_LABELS: Record<CompressionLevel, string> = {
  low: 'Low compression (best quality)',
  medium: 'Medium compression (recommended)',
  high: 'High compression (smallest size)',
};

export const COMPRESSION_LEVEL_DESCRIPTIONS: Record<CompressionLevel, string> = {
  low: 'Minimal size reduction, preserves quality',
  medium: 'Good balance of size and quality',
  high: 'Maximum size reduction',
};