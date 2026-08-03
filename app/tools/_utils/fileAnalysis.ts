// app/tools/_utils/fileAnalysis.ts
import { tools } from '../_config/tools';
import { PDFDocument } from 'pdf-lib';

export type ToolItem = typeof tools[0];

export interface FileAnalysis {
  files: File[];
  count: number;
  totalSize: string;
  totalBytes: number;
  type: 'pdf' | 'image' | 'mixed';
  isMultiple: boolean;
  isLarge: boolean;
  isSmall: boolean;
  pageCount: number;
  isSinglePage: boolean;
  hasImages: boolean;
  isImageHeavy: boolean;
  isTextBased: boolean;
  isScanned: boolean;
  hasForms: boolean;
  isAlreadyOptimized: boolean;
  isSigned: boolean;
  isInvoice: boolean;
  contentType: 'text' | 'image' | 'mixed' | 'form' | 'scanned' | 'signed';
  kbPerPage: number;
  topRecommendation: ToolItem;
  topReason: string;
  otherRecommendations: ToolItem[];
}

// Deep PDF analysis
async function analyzePDF(file: File): Promise<{
  pageCount: number;
  hasImages: boolean;
  isImageHeavy: boolean;
  isTextBased: boolean;
  isScanned: boolean;
  hasForms: boolean;
}> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageCount = pdf.getPageCount();
    
    const uint8 = new Uint8Array(arrayBuffer);
    const pdfString = new TextDecoder('latin1').decode(uint8.slice(0, Math.min(uint8.length, 500000)));
    
    const imageMatches = (pdfString.match(/\/Image|\/DCTDecode|\/JPXDecode/gi) || []).length;
    const textMatches = (pdfString.match(/BT\s|\/Text|\/Font/gi) || []).length;
    const formMatches = (pdfString.match(/\/AcroForm|\/Widget|\/Field/gi) || []).length;
    
    const kbPerPage = (file.size / 1024) / pageCount;
    
    return {
      pageCount,
      hasImages: imageMatches > 0,
      isImageHeavy: imageMatches > textMatches * 2 || kbPerPage > 200,
      isTextBased: textMatches > imageMatches * 3 && kbPerPage < 50,
      isScanned: imageMatches > 0 && textMatches === 0 && kbPerPage > 100,
      hasForms: formMatches > 5,
    };
  } catch (error) {
    console.error('PDF analysis failed:', error);
    return {
      pageCount: 1,
      hasImages: false,
      isImageHeavy: false,
      isTextBased: false,
      isScanned: false,
      hasForms: false,
    };
  }
}

// ⭐ SMART SCORING ALGORITHM
function calculateToolScore(
  toolHref: string,
  analysis: {
    pageCount: number;
    kbPerPage: number;
    sizeInKB: number;
    isMultiple: boolean;
    hasImages: boolean;
    isImageHeavy: boolean;
    isTextBased: boolean;
    isScanned: boolean;
    hasForms: boolean;
    isAlreadyOptimized: boolean;
    isSigned: boolean;
    isInvoice: boolean;
    type: 'pdf' | 'image' | 'mixed';
    isSinglePage: boolean;
  }
): number {
  let score = 0;

  switch (toolHref) {
    case '/tools/merge-pdf':
      // Best for multiple files
      if (analysis.isMultiple) score += 100;
      else score += 5; // Low for single file
      break;

    case '/tools/split-pdf':
      // Best for multi-page PDFs
      if (analysis.pageCount > 10) score += 90;
      else if (analysis.pageCount >= 5) score += 75;
      else if (analysis.pageCount >= 2) score += 40;
      else score += 5; // 1 page = useless
      break;

    case '/tools/organize-pdf':
      // Best for 2-10 page PDFs (small enough to rearrange)
      if (analysis.pageCount >= 2 && analysis.pageCount <= 10) score += 85;
      else if (analysis.pageCount > 10 && analysis.pageCount <= 20) score += 60;
      else if (analysis.pageCount > 20) score += 30;
      else score += 5; // 1 page = useless
      break;

    case '/tools/compress-pdf':
      // Best for large or image-heavy PDFs
      if (analysis.isAlreadyOptimized) score += 10; // Already compressed
      else if (analysis.isImageHeavy && analysis.sizeInKB > 1000) score += 90;
      else if (analysis.sizeInKB > 5000) score += 85;
      else if (analysis.sizeInKB > 2000) score += 70;
      else if (analysis.sizeInKB > 500) score += 50;
      else if (analysis.isTextBased) score += 15; // Text doesn't compress much
      else score += 30;
      break;

    case '/tools/pdf-to-image':
      // Best for image-heavy or scanned PDFs
      if (analysis.isScanned) score += 95;
      else if (analysis.isImageHeavy) score += 85;
      else if (analysis.hasImages) score += 60;
      else if (analysis.pageCount === 1) score += 45; // 1 page as image
      else score += 30;
      break;

    case '/tools/image-to-pdf':
      // Only relevant for images - lower score for large images (compress is better)
      if (analysis.type === 'image') {
        if (analysis.sizeInKB > 5000) score += 60;      // Large image → compress first
        else if (analysis.sizeInKB > 2000) score += 75;  // Medium → still good for PDF
        else score += 100;                                 // Small → PDF is best
      } else {
        score += 5;
      }
      break;

    case '/tools/compress-image':
      // Best for large images
      if (analysis.type === 'image') {
        if (analysis.sizeInKB > 5000) score += 100;     // 5+ MB → BEST MATCH ⭐
        else if (analysis.sizeInKB > 2000) score += 85;  // 2-5 MB → great
        else if (analysis.sizeInKB > 500) score += 70;   // 500KB-2MB → good
        else if (analysis.sizeInKB > 100) score += 50;   // 100-500KB → ok
        else score += 20;                                  // Small → low priority
      } else {
        score += 5;
      }
      break;

    case '/tools/rotate-pdf':
      // Useful for scanned docs or any PDF
      if (analysis.isScanned) score += 70; // Scans often need rotation
      else if (analysis.pageCount > 1) score += 45;
      else score += 35;
      break;

    case '/tools/sign-pdf':
      // Best for single-page contracts or forms
      if (analysis.isSigned) score += 20; // Already signed
      else if (analysis.hasForms) score += 90;
      else if (analysis.isSinglePage) score += 85;
      else if (analysis.pageCount <= 3) score += 60;
      else score += 30;
      break;

    case '/tools/add-watermark':
      // Best for signed documents, invoices, or shareable PDFs
      if (analysis.isInvoice) score += 90;
      else if (analysis.isSigned) score += 85;
      else if (analysis.pageCount <= 5) score += 50;
      else score += 35;
      break;

    case '/tools/unlock-pdf':
      // Low priority unless we detect encryption
      score += 15; // Show last unless PDF is encrypted
      break;

    default:
      score += 20;
  }

  return score;
}

// Helper: add isSinglePage() method
function addHelperMethods(obj: any) {
  obj.isSinglePage = () => obj.pageCount === 1;
  return obj;
}

export async function analyzeFiles(files: File[]): Promise<FileAnalysis> {
  const totalBytes = files.reduce((sum: number, f: File) => sum + f.size, 0);
  const totalMB = totalBytes / 1024 / 1024;
  const sizeInKB = totalBytes / 1024;
  const isLarge = totalMB > 5;
  const isSmall = sizeInKB < 100;
  const isMultiple = files.length > 1;

  const pdfs = files.filter((f: File) => f.type === 'application/pdf');
  const images = files.filter((f: File) => f.type.startsWith('image/'));

  let type: 'pdf' | 'image' | 'mixed';
  if (pdfs.length > 0 && images.length === 0) type = 'pdf';
  else if (images.length > 0 && pdfs.length === 0) type = 'image';
  else type = 'mixed';

  const totalSize =
    totalMB < 1
      ? `${(totalMB * 1024).toFixed(0)} KB`
      : `${totalMB.toFixed(2)} MB`;

  // Deep PDF analysis
  let pageCount = 0;
  let hasImages = false;
  let isImageHeavy = false;
  let isTextBased = false;
  let isScanned = false;
  let hasForms = false;

  if (pdfs.length > 0) {
    for (const pdf of pdfs) {
      const analysis = await analyzePDF(pdf);
      pageCount += analysis.pageCount;
      if (analysis.hasImages) hasImages = true;
      if (analysis.isImageHeavy) isImageHeavy = true;
      if (analysis.isTextBased) isTextBased = true;
      if (analysis.isScanned) isScanned = true;
      if (analysis.hasForms) hasForms = true;
    }
  }

  const isSinglePage = pageCount === 1;
  const kbPerPage = pageCount > 0 ? sizeInKB / pageCount : sizeInKB;

  // Filename analysis
  const filename = files[0]?.name?.toLowerCase() || '';
  const isAlreadyOptimized = 
    filename.includes('compressed') || 
    filename.includes('optimized') || 
    filename.includes('reduced') ||
    filename.includes('-min') ||
    filename.includes('-co') ||
    kbPerPage < 30;
    
  const isSigned = 
    filename.includes('signed') || 
    filename.includes('signature');
    
  const isInvoice = 
    filename.includes('invoice') || 
    filename.includes('receipt') || 
    filename.includes('bill');

  // Content type
  let contentType: 'text' | 'image' | 'mixed' | 'form' | 'scanned' | 'signed';
  if (hasForms) contentType = 'form';
  else if (isSigned) contentType = 'signed';
  else if (isScanned) contentType = 'scanned';
  else if (isImageHeavy) contentType = 'image';
  else if (isTextBased) contentType = 'text';
  else contentType = 'mixed';

  // ⭐ SMART RANKING: Score every tool and sort by relevance
  const scoringContext = addHelperMethods({
    pageCount,
    kbPerPage,
    sizeInKB,
    isMultiple,
    hasImages,
    isImageHeavy,
    isTextBased,
    isScanned,
    hasForms,
    isAlreadyOptimized,
    isSigned,
    isInvoice,
    type,
  });

  // ⭐ Filter out irrelevant tools based on file type
  const relevantTools = tools.filter((tool) => {
    // If user uploaded PDFs → hide image-only tools
    if (type === 'pdf') {
      const imageOnlyTools = [
        '/tools/image-to-pdf',
        '/tools/compress-image',
      ];
      return !imageOnlyTools.includes(tool.href);
    }
    
    // If user uploaded Images → hide all PDF-specific tools
    if (type === 'image') {
      const pdfOnlyTools = [
        '/tools/pdf-to-image',
        '/tools/merge-pdf',
        '/tools/split-pdf',
        '/tools/organize-pdf',
        '/tools/compress-pdf',
        '/tools/rotate-pdf',
        '/tools/sign-pdf',
        '/tools/add-watermark',
        '/tools/unlock-pdf',
      ];
      return !pdfOnlyTools.includes(tool.href);
    }
    
    return true;
  });

  // Score only relevant tools
  const scoredTools = relevantTools.map((tool) => ({
    tool,
    score: calculateToolScore(tool.href, scoringContext),
  }));

  // Sort by score (highest first)
  scoredTools.sort((a, b) => b.score - a.score);

  // Top recommendation is the highest scored tool
  const topRecommendation = scoredTools[0].tool;
  const otherRecommendations = scoredTools.slice(1).map((s) => s.tool);

  // Generate contextual reason for top recommendation
  let topReason = '';
  switch (topRecommendation.href) {
    case '/tools/merge-pdf':
      topReason = `Merge ${pdfs.length} PDFs into one document`;
      break;
    case '/tools/split-pdf':
      topReason = `Extract pages from your ${pageCount}-page PDF`;
      break;
    case '/tools/organize-pdf':
      topReason = `Rearrange your ${pageCount}-page PDF`;
      break;
    case '/tools/compress-pdf':
      topReason = isAlreadyOptimized 
        ? 'Try to reduce file size further'
        : 'Reduce file size for easy sharing';
      break;
    case '/tools/pdf-to-image':
      topReason = isScanned
        ? 'Extract scanned pages as images'
        : `Convert ${pageCount} page${pageCount > 1 ? 's' : ''} to images`;
      break;
    case '/tools/image-to-pdf':
      topReason = isMultiple 
        ? `Combine ${images.length} images into one PDF`
        : 'Convert image to PDF';
      break;
    case '/tools/compress-image':
      topReason = isMultiple
        ? `Reduce size of ${images.length} images`
        : totalMB > 5
          ? `Reduce ${totalSize} to save space`
          : 'Reduce image file size';
      break;
    case '/tools/sign-pdf':
      topReason = hasForms 
        ? 'Fill and sign your form'
        : 'Add your digital signature';
      break;
    case '/tools/add-watermark':
      topReason = isInvoice
        ? 'Add "PAID" or custom watermark'
        : 'Add text or image watermark';
      break;
    case '/tools/rotate-pdf':
      topReason = 'Fix page orientation';
      break;
    case '/tools/unlock-pdf':
      topReason = 'Remove password protection';
      break;
    default:
      topReason = 'Recommended for your file';
  }

  return {
    files,
    count: files.length,
    totalSize,
    totalBytes,
    type,
    isMultiple,
    isLarge,
    isSmall,
    pageCount,
    isSinglePage,
    hasImages,
    isImageHeavy,
    isTextBased,
    isScanned,
    hasForms,
    isAlreadyOptimized,
    isSigned,
    isInvoice,
    contentType,
    kbPerPage,
    topRecommendation,
    topReason,
    otherRecommendations,
  };
}