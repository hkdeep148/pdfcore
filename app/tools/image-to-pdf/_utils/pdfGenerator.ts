import type {
  ImageItem,
  PageSize,
  Orientation,
  PageFit,
  Margins,
  Alignment,
  PageBackground,
  ImageQuality,
} from '../../_types';

// ============ CONSTANTS ============

export const PAGE_SIZE_LABELS: Record<PageSize, string> = {
  A4: 'A4 (210 × 297 mm)',
  A3: 'A3 (297 × 420 mm)',
  A5: 'A5 (148 × 210 mm)',
  Letter: 'Letter (8.5 × 11 in)',
  Legal: 'Legal (8.5 × 14 in)',
};

export const PAGE_DIMENSIONS: Record<PageSize, [number, number]> = {
  A4: [595.28, 841.89],
  A3: [841.89, 1190.55],
  A5: [419.53, 595.28],
  Letter: [612, 792],
  Legal: [612, 1008],
};

export const PAGE_ASPECT_RATIOS: Record<PageSize, number> = {
  A4: 595.28 / 841.89,
  A3: 841.89 / 1190.55,
  A5: 419.53 / 595.28,
  Letter: 612 / 792,
  Legal: 612 / 1008,
};

export const MARGIN_VALUES: Record<Margins, number> = {
  None: 0,
  Small: 20,
  Normal: 40,
  Large: 60,
};

export const MARGIN_PREVIEW_PERCENT: Record<Margins, number> = {
  None: 0,
  Small: 3,
  Normal: 6,
  Large: 9,
};

export const PAGE_BACKGROUND_HEX: Record<PageBackground, string | null> = {
  White: '#FFFFFF',
  Black: '#000000',
  Transparent: null,
};

export const FIT_LABELS: Record<PageFit, string> = {
  'Fit to page': 'Fit',
  'Fill page': 'Fill',
  'Actual size': 'Stretch',
};

// ============ QUALITY PROFILES (Adobe-style) ============
// Target DPI + JPEG quality per level. These are the two knobs that
// most affect final PDF size.
const QUALITY_PROFILES = {
  Low:    { targetDpi: 96,  jpegQuality: 0.60, maxDimensionPx: 1200 },
  Medium: { targetDpi: 150, jpegQuality: 0.75, maxDimensionPx: 1800 },
  High:   { targetDpi: 200, jpegQuality: 0.85, maxDimensionPx: 2400 },
} as const;

// Fallback if ImageQuality has label 'High quality' etc.
function getProfile(quality: ImageQuality) {
  const q = (quality as string).toLowerCase();
  if (q.includes('low')) return QUALITY_PROFILES.Low;
  if (q.includes('med')) return QUALITY_PROFILES.Medium;
  return QUALITY_PROFILES.High;
}

// ============ HELPERS ============

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

/**
 * Calculates the optimal output pixel dimensions for an image so that
 * it looks crisp on the PDF page at the target DPI — without wasting
 * pixels. This is the KEY to Adobe-style small PDFs.
 *
 * @param imgW/imgH        original image pixels
 * @param drawWpt/drawHpt  size on PDF page in points (1pt = 1/72 inch)
 * @param targetDpi        e.g. 150 for eBook, 200 for print
 * @param hardCapPx        never exceed this pixel dimension
 */
function calculateOptimalPixelSize(
  imgW: number,
  imgH: number,
  drawWpt: number,
  drawHpt: number,
  targetDpi: number,
  hardCapPx: number
): { width: number; height: number } {
  // Convert draw size (points) to target pixels at DPI
  const targetWpx = Math.ceil((drawWpt / 72) * targetDpi);
  const targetHpx = Math.ceil((drawHpt / 72) * targetDpi);

  // Don't upscale — cap at original resolution
  let outW = Math.min(imgW, targetWpx);
  let outH = Math.min(imgH, targetHpx);

  // Preserve aspect ratio using the smaller ratio
  const ratio = Math.min(outW / imgW, outH / imgH);
  outW = Math.round(imgW * ratio);
  outH = Math.round(imgH * ratio);

  // Apply hard cap
  if (outW > hardCapPx || outH > hardCapPx) {
  const capRatio = Math.min(hardCapPx / outW, hardCapPx / outH);
  outW = Math.round(outW * capRatio);
  outH = Math.round(outH * capRatio);
}

// iOS Safari canvas area limit ≈ 16 megapixels
const IOS_SAFE_AREA = 16_000_000;
if (outW * outH > IOS_SAFE_AREA) {
  const areaRatio = Math.sqrt(IOS_SAFE_AREA / (outW * outH));
  outW = Math.round(outW * areaRatio);
  outH = Math.round(outH * areaRatio);
}

return { width: outW, height: outH };
}

/**
 * Loads image, applies rotation, downsamples to target size, re-encodes
 * as JPEG with quality setting. Returns compressed bytes ready for PDF.
 */
async function getCompressedImageBytes(
  item: ImageItem,
  drawWpt: number,
  drawHpt: number,
  quality: ImageQuality,
  forceOpaque: boolean
): Promise<{ bytes: Uint8Array; type: 'image/jpeg' | 'image/png'; width: number; height: number }> {
  const profile = getProfile(quality);

  return new Promise((resolve, reject) => {
    const img = new Image();
//  Do NOT set crossOrigin for blob: URLs — it breaks iOS Safari
    img.decoding = 'async';

    img.onload = () => {
      try {
        const isSideways = item.rotation === 90 || item.rotation === 270;
        const srcW = isSideways ? img.naturalHeight : img.naturalWidth;
        const srcH = isSideways ? img.naturalWidth : img.naturalHeight;

        // Calculate optimal output dimensions
        const { width: outW, height: outH } = calculateOptimalPixelSize(
          srcW,
          srcH,
          drawWpt,
          drawHpt,
          profile.targetDpi,
          profile.maxDimensionPx
        );

                const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;

        const ctx = canvas.getContext('2d', { alpha: !forceOpaque });
        if (!ctx) return reject(new Error('Canvas not supported'));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (forceOpaque) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, outW, outH);
        }

        // Move origin to center of canvas
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate((item.rotation * Math.PI) / 180);

        // After rotation of 90/270, natural width becomes vertical
        const naturalDrawW = isSideways ? outH : outW;
        const naturalDrawH = isSideways ? outW : outH;

        ctx.drawImage(
          img,
          -naturalDrawW / 2,
          -naturalDrawH / 2,
          naturalDrawW,
          naturalDrawH
        );

        // Prefer JPEG for best compression (matches Adobe behavior).
        // Only keep PNG when transparency is required.
        const outputType: 'image/jpeg' | 'image/png' = forceOpaque
          ? 'image/jpeg'
          : 'image/png';
        const outputQuality = outputType === 'image/jpeg' ? profile.jpegQuality : undefined;

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Failed to convert image to blob'));
            blob.arrayBuffer()
              .then((buf) => {
                resolve({
                  bytes: new Uint8Array(buf),
                  type: outputType,
                  width: outW,
                  height: outH,
                });
              })
              .catch(reject);
          },
          outputType,
          outputQuality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => {
      console.error('Image failed to load:', e);
      reject(new Error(`Failed to load image: ${item.file.name}`));
    };

    img.src = item.preview;
  });
}

// ============ MAIN PDF GENERATION FUNCTION ============

export interface GeneratePdfOptions {
  images: ImageItem[];
  pageSize: PageSize;
  orientation: Orientation;
  pageFit: PageFit;
  margins: Margins;
  alignment: Alignment;
  background: PageBackground;
  quality: ImageQuality;
}

export async function generatePdf(options: GeneratePdfOptions): Promise<string> {
  const { PDFDocument, rgb } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.create();

  // Determine if we need transparency support
  const bgHex = PAGE_BACKGROUND_HEX[options.background];
  const pageHasBackground = bgHex !== null; // White or Black
  // If page has a solid background, we can flatten transparency → JPEG
  // If transparent, keep PNG for images that have alpha
  const forceOpaqueGlobal = pageHasBackground;

  const margin = MARGIN_VALUES[options.margins];

  for (let i = 0; i < options.images.length; i++) {
    const item = options.images[i];

    try {
      console.log(`Processing image ${i + 1}/${options.images.length}:`, item.file.name);

      // 👇 Use per-image size if set, otherwise fall back to global default
      const itemPageSize = item.pageSize ?? options.pageSize;
      const itemOrientation = item.orientation ?? options.orientation;

      let [pageW, pageH] = PAGE_DIMENSIONS[itemPageSize];
      if (itemOrientation === 'Landscape') [pageW, pageH] = [pageH, pageW];
      const contentW = pageW - margin * 2;
      const contentH = pageH - margin * 2;

      const isSideways = item.rotation === 90 || item.rotation === 270;
      const origW = isSideways ? item.height : item.width;
      const origH = isSideways ? item.width : item.height;

      // ---- 1. Compute draw size on page (points) so we know target DPI resolution
      let drawW = contentW, drawH = contentH;
      if (options.pageFit === 'Fit to page') {
        const ratio = Math.min(contentW / origW, contentH / origH);
        drawW = origW * ratio;
        drawH = origH * ratio;
      } else if (options.pageFit === 'Actual size') {
        drawW = origW;
        drawH = origH;
      } else {
        // Fill page
        const ratio = Math.max(contentW / origW, contentH / origH);
        drawW = origW * ratio;
        drawH = origH * ratio;
      }

      // ---- 2. Compress image sized for its draw box
      const isPng = item.file.type === 'image/png';
      const forceOpaque = forceOpaqueGlobal || !isPng;

      const { bytes, type, width: outPxW, height: outPxH } =
        await getCompressedImageBytes(item, drawW, drawH, options.quality, forceOpaque);

      console.log(
        `  → Compressed: ${outPxW}×${outPxH}px, ${(bytes.length / 1024).toFixed(1)} KB, ${type}`
      );

      // ---- 3. Embed
      const img = type === 'image/png'
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes);

      const page = pdfDoc.addPage([pageW, pageH]);

      if (bgHex) {
        const [r, g, b] = hexToRgb01(bgHex);
        page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: rgb(r, g, b) });
      }

      // ---- 4. Position
      const x = margin + (contentW - drawW) / 2;
      let y: number;
      if (options.alignment === 'Top') {
        y = pageH - margin - drawH;
      } else if (options.alignment === 'Bottom') {
        y = margin;
      } else {
        y = margin + (contentH - drawH) / 2;
      }

      page.drawImage(img, { x, y, width: drawW, height: drawH });

      console.log(`  ✓ Added to PDF`);
    } catch (err) {
      console.error(`❌ Failed on image ${i + 1} (${item.file.name}):`, err);
      throw new Error(
        `Failed to process image "${item.file.name}": ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }

  // ---- Save with object stream compression
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,     // Compress PDF object structure
    addDefaultPage: false,
  });

  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}