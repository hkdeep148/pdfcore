// app/tools/_utils/fileAnalysis.ts
import { tools } from '../_config/tools';

export type ToolItem = typeof tools[0];

export interface FileAnalysis {
  files: File[];
  count: number;
  totalSize: string;
  type: 'pdf' | 'image' | 'mixed';
  isMultiple: boolean;
  isLarge: boolean;
  topRecommendation: ToolItem;
  topReason: string;
  otherRecommendations: ToolItem[];
}

export function analyzeFiles(files: File[]): FileAnalysis {
  const totalBytes = files.reduce((sum: number, f: File) => sum + f.size, 0);
  const totalMB = totalBytes / 1024 / 1024;
  const isLarge = totalMB > 5;
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

  const getTool = (href: string): ToolItem => {
    const found = tools.find((t: any) => t.href === href);
    if (!found) throw new Error(`Tool not found: ${href}`);
    return found;
  };

  let topRecommendation: ToolItem;
  let topReason: string;
  let otherRecommendations: ToolItem[] = [];

  if (type === 'image') {
    // IMAGES → Image to PDF
    topRecommendation = getTool('/tools/image-to-pdf');
    topReason = isMultiple
      ? `Combine ${images.length} images into one PDF`
      : 'Convert image to PDF';
    otherRecommendations = [];
  } else if (type === 'pdf') {
    if (isMultiple) {
      // Multiple PDFs → Merge
      topRecommendation = getTool('/tools/merge-pdf');
      topReason = `Merge ${pdfs.length} PDFs into one document`;
      otherRecommendations = [getTool('/tools/compress-pdf')];
    } else if (isLarge) {
      // Single large PDF → Compress
      topRecommendation = getTool('/tools/compress-pdf');
      topReason = 'Reduce file size while maintaining quality';
      otherRecommendations = [getTool('/tools/merge-pdf')];
    } else {
      // Single normal PDF → Compress
      topRecommendation = getTool('/tools/compress-pdf');
      topReason = 'Reduce file size for easy sharing';
      otherRecommendations = [getTool('/tools/merge-pdf')];
    }
  } else {
    // MIXED
    topRecommendation = getTool('/tools/merge-pdf');
    topReason = 'Combine your files into one PDF';
    otherRecommendations = [getTool('/tools/compress-pdf')];
  }

  return {
    files,
    count: files.length,
    totalSize,
    type,
    isMultiple,
    isLarge,
    topRecommendation,
    topReason,
    otherRecommendations,
  };
}