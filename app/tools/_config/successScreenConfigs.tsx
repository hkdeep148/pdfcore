import React from 'react';
import {
  TrendingUp,
  Image as ImageIcon,
  FileImage,
  Scissors,
  FileText,
  Layers,
  Unlock,
  Lock,
  Droplet,
  RotateCw,
  Edit3,
  FileType,
  Grid3x3,
  Minimize2,
  AlertCircle,
} from 'lucide-react';
import { formatBytes } from '../_utils/browser';

// ═══════════════════════════════════════════════════════════════
// V1 TYPES (OLD DESIGN - used by tools not yet migrated)
// ═══════════════════════════════════════════════════════════════

/** Preview type - determines what preview panel to render */
export type PreviewType = 'pdf' | 'image' | 'images' | 'none';

/** Data passed to preview panel */
export interface PreviewData {
  blob?: Blob | null;
  url?: string | null;
  name?: string;
  pageCount?: number;
  images?: Array<{ url: string; name: string }>;
}

/** Detail row (Original Size: 24.5 MB) */
export interface DetailRow {
  label: string;
  value: string;
  valueColor?: string;
  valueBold?: boolean;
}

/** Details card configuration (right top card) */
export interface DetailsCard {
  icon: React.ReactNode;
  iconColor: string;
  iconTextColor: string;
  title: string;
  rows: DetailRow[];
}

/** Optional info banner */
export interface InfoBanner {
  message: string;
  color: 'green' | 'orange' | 'purple' | 'blue' | 'red';
}

/** V1 success screen configuration */
export interface SuccessScreenConfig {
  title: string;
  subtitle: string;
  previewType: PreviewType;
  previewData: PreviewData;
  fileTitle: string;
  details: DetailsCard;
  whatWeDid: string[];
  infoBanner?: InfoBanner;
  onDownload: () => void;
  onStartOver: () => void;
  downloadLabel?: string;
  hasDownloadDropdown?: boolean;
  showSecurityBar?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// V2 TYPES (NEW PREMIUM DESIGN)
// ═══════════════════════════════════════════════════════════════

/** Tool badge shown top-left */
export interface ToolBadge {
  icon: React.ReactNode;
  name: string;
  bgColor: string;
  iconColor?: string;
}

/** Summary row (icon + label + value) */
export interface SummaryRow {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  valueColor?: string;
}

/** Summary card configuration */
export interface SummaryCard {
  title: string;
  rows: SummaryRow[];
}

/** File in the right panel table */
export interface FileTableRow {
  id: string;
  name: string;
  size: string;
  status: 'ready' | 'processing' | 'error';
  onPreview?: () => void;
  onDownload?: () => void;
  onCompare?: () => void;  // ⭐ NEW: For image before/after comparison
}
/** Related tool for bottom section */
export interface ExploreTool {
  href: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

/** Security banner */
export interface SecurityNote {
  title: string;
  message: string;
}

export interface SuccessScreenV2Config {
  toolBadge: ToolBadge;
  title: string;
  subtitle: string;
  variant?: 'success' | 'warning';
  summary: SummaryCard;
  security?: SecurityNote;
  reductionPercent?: number;
  filesTitle: string;
  files: FileTableRow[];
  primaryButton: {
    label: string;
    onClick: () => void;
    hasDropdown?: boolean;
  };
  onStartOver: () => void;
  onDelete?: () => void;
  extraAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  // ⭐ NEW: For PDF gallery preview
  pdfBlob?: Blob | null;
  pdfPreviewUrl?: string | null;
}
// ═══════════════════════════════════════════════════════════════
// SHARED: DEFAULT EXPLORE TOOLS (for V2)
// ═══════════════════════════════════════════════════════════════
export const DEFAULT_EXPLORE_TOOLS: ExploreTool[] = [
  {
    href: '/tools/compress-pdf',
    name: 'Compress PDF',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    icon: <Minimize2 size={16} strokeWidth={2} />,
  },
  {
    href: '/tools/merge-pdf',
    name: 'Merge PDF',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    icon: <Layers size={16} strokeWidth={2} />,
  },
  {
    href: '/tools/split-pdf',
    name: 'Split PDF',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: <Scissors size={16} strokeWidth={2} />,
  },
  {
    href: '/tools/add-watermark',
    name: 'Edit PDF',
    color: '#6366F1',
    bgColor: '#E0E7FF',
    icon: <Edit3 size={16} strokeWidth={2} />,
  },
  {
    href: '/tools/pdf-to-word',
    name: 'PDF to Word',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    icon: <FileType size={16} strokeWidth={2} />,
  },
  {
    href: '/tools',
    name: 'More Tools',
    color: '#64748B',
    bgColor: '#F1F5F9',
    icon: <Grid3x3 size={16} strokeWidth={2} />,
  },
];

// ═══════════════════════════════════════════════════════════════
// V2 CONFIG BUILDERS (NEW PREMIUM DESIGN)
// ═══════════════════════════════════════════════════════════════

// ─────── COMPRESS PDF (V2) ───────
export function buildCompressPdfV2Config(params: {
  fileName?: string;
  originalSize: string;
  compressedSize: string;
  sizeReducedBytes: string;
  reductionPercent: number;
  files?: Array<{
    id: string;
    name: string;
    size: string;
    onDownload: () => void;
    onPreview?: () => void;
  }>;
  onDownload: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}): SuccessScreenV2Config {
  const filesList = params.files && params.files.length > 0
    ? params.files
    : [{
        id: 'compressed',
        name: params.fileName || 'compressed.pdf',
        size: params.compressedSize,
        onDownload: params.onDownload,
        onPreview: params.onPreview,
      }];

  const isMultiple = filesList.length > 1;
  const displayFileName = filesList[0]?.name || 'compressed.pdf';

  // ⭐ Detect if file couldn't be compressed further
  const isAlreadyOptimized = params.reductionPercent === 0;

  return {
    toolBadge: {
      icon: <Minimize2 size={20} strokeWidth={2} />,
      name: 'Compress PDF',
      bgColor: isAlreadyOptimized ? '#F59E0B' : '#6366F1', // ⭐ Amber if optimized
    },

    // ⭐ Different title based on state
    title: isAlreadyOptimized
      ? (isMultiple ? 'Files Already Optimized' : 'Already Optimized')
      : 'Compression Successful!',

    subtitle: isAlreadyOptimized
      ? (isMultiple
          ? 'Your PDFs are already at their optimal size and cannot be reduced further.'
          : 'Your PDF is already at its optimal size and cannot be reduced further.')
      : (isMultiple
          ? `${filesList.length} PDFs have been compressed successfully.`
          : 'Your PDF has been compressed successfully.'),

    // ⭐ Special variant flag for the UI
    variant: isAlreadyOptimized ? 'warning' : 'success',

summary: {
  title: isAlreadyOptimized ? 'File Analysis' : 'Compression Summary',
  rows: [
    // ⭐ Only show file count for MULTIPLE files
    ...(isMultiple
      ? [{
          icon: <FileText size={13} />,
          iconBg: '#EDE9FE',
          iconColor: '#8B5CF6',
          label: 'Total Files',
          value: `${filesList.length} PDFs`,
        }]
      : []),
    {
      icon: <FileText size={13} />,
      iconBg: '#DBEAFE',
      iconColor: '#3B82F6',
      label: 'Original Size',
      value: params.originalSize,
    },
    {
      icon: <FileText size={13} />,
      iconBg: isAlreadyOptimized ? '#FEF3C7' : '#FEE2E2',
      iconColor: isAlreadyOptimized ? '#F59E0B' : '#EF4444',
      label: isAlreadyOptimized ? 'Final Size' : 'Compressed Size',
      value: params.compressedSize,
    },
{
  icon: isAlreadyOptimized ? <AlertCircle size={13} /> : <TrendingUp size={13} />,
  iconBg: isAlreadyOptimized ? '#FEF3C7' : '#D1FAE5',
  iconColor: isAlreadyOptimized ? '#F59E0B' : '#10B981',
  label: isAlreadyOptimized ? 'Status' : 'Reduction',
  value: isAlreadyOptimized
    ? 'No further compression possible'
    : `${params.reductionPercent}% smaller`,
  valueColor: isAlreadyOptimized ? '#F59E0B' : '#10B981',
},
  ],
},

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    reductionPercent: params.reductionPercent,  // ⭐ NEW

    filesTitle: `Files (${filesList.length})`,
    files: filesList.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      status: 'ready' as const,
      onPreview: f.onPreview,
      onDownload: f.onDownload,
    })),

    primaryButton: {
      // ⭐ Different button text if not compressed
      label: isAlreadyOptimized
        ? (isMultiple ? `Download Original Files (${filesList.length})` : 'Download Original PDF')
        : (isMultiple ? `Download All (${filesList.length})` : 'Download Compressed PDF'),
      onClick: params.onDownload,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

// ─────── IMAGE TO PDF (V2) ───────
export function buildImageToPdfV2Config(params: {
  fileName: string;
  pdfSize: string;
  totalImages: number;
  pageSize: string;         // "A4", "Letter", etc.
  orientation?: string;      // "Portrait" or "Landscape"
  onDownload: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}): SuccessScreenV2Config {
  return {
    toolBadge: {
      icon: <ImageIcon size={20} strokeWidth={2} />,
      name: 'Image to PDF',
      bgColor: '#10B981', // Green for creation tools
    },

    title: 'PDF Created Successfully!',
    subtitle: params.totalImages > 1
      ? `${params.totalImages} images have been converted into a PDF.`
      : 'Your image has been converted into a PDF.',

    variant: 'success',

    summary: {
      title: 'PDF Details',
      rows: [
        {
          icon: <ImageIcon size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'Total Images',
          value: `${params.totalImages} ${params.totalImages === 1 ? 'image' : 'images'}`,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Page Size',
          value: params.orientation
            ? `${params.pageSize} · ${params.orientation}`
            : params.pageSize,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#EDE9FE',
          iconColor: '#8B5CF6',
          label: 'File Size',
          value: params.pdfSize,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEF3C7',
          iconColor: '#F59E0B',
          label: 'Format',
          value: 'PDF',
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: 'Files (1)',
    files: [
      {
        id: 'created',
        name: params.fileName,
        size: params.pdfSize,
        status: 'ready',
        onPreview: params.onPreview,
        onDownload: params.onDownload,
      },
    ],

    primaryButton: {
      label: 'Download PDF',
      onClick: params.onDownload,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

// ─────── ADD WATERMARK (V2) ───────
export function buildWatermarkV2Config(params: {
  fileName: string;
  fileSize: string;
  watermarkType: 'Text' | 'Image';
  watermarkText?: string;      // Optional: The actual text
  appliedTo: string;            // "All Pages" or "Pages 1-5"
  totalPages?: number;          // Optional: Total pages
  position?: string;            // "middle-center", "top-left", etc.
  onDownload: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}): SuccessScreenV2Config {
  // Format position for display (e.g., "middle-center" → "Center")
  const formatPosition = (pos?: string): string => {
    if (!pos) return '—';
    const map: Record<string, string> = {
      'top-left': 'Top Left',
      'top-center': 'Top Center',
      'top-right': 'Top Right',
      'middle-left': 'Middle Left',
      'middle-center': 'Center',
      'middle-right': 'Middle Right',
      'bottom-left': 'Bottom Left',
      'bottom-center': 'Bottom Center',
      'bottom-right': 'Bottom Right',
    };
    return map[pos] || pos;
  };

  return {
    toolBadge: {
      icon: <Droplet size={20} strokeWidth={2} />,
      name: 'Add Watermark',
      bgColor: '#8B5CF6', // Purple for creative/editing tools
    },

    title: 'Watermark Applied Successfully!',
    subtitle: 'Your watermarked PDF is ready to download.',

    variant: 'success',

summary: {
  title: 'Watermark Details',
  rows: [
    {
      icon: <Droplet size={13} />,
      iconBg: '#EDE9FE',
      iconColor: '#8B5CF6',
      label: 'Watermark Type',
      value: params.watermarkType,
    },
    {
      icon: <FileText size={13} />,
      iconBg: '#DBEAFE',
      iconColor: '#3B82F6',
      label: 'Applied To',
      value: params.appliedTo,
    },
    ...(params.position
      ? [{
          icon: <FileText size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'Position',
          value: formatPosition(params.position),
        }]
      : []),
    {
      icon: <FileText size={13} />,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
      label: 'File Size',
      value: params.fileSize,
    },
  ],
},

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: 'Files (1)',
    files: [
      {
        id: 'watermarked',
        name: params.fileName,
        size: params.fileSize,
        status: 'ready',
        onPreview: params.onPreview,
        onDownload: params.onDownload,
      },
    ],

    primaryButton: {
      label: 'Download Watermarked PDF',
      onClick: params.onDownload,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

// ─────── ROTATE PDF (V2) — MULTI-FILE SUPPORT ───────
export function buildRotatePdfV2Config(params: {
  files: Array<{
    id: string;
    name: string;
    size: string;
    onDownload: () => void;
    onPreview?: () => void;
  }>;
  totalPages: number;
  rotatedPagesCount: number;
  rotationDetails: string;
  onDownloadAll: () => void;    // ⭐ Download all as ZIP (or single if only one)
  onStartOver: () => void;
  onDelete?: () => void;
}): SuccessScreenV2Config {
  const isMultiple = params.files.length > 1;
  const isSingle = params.files.length === 1;
  const totalSize = params.files.reduce((sum, f) => {
    // Parse size string like "1.24 MB" or "324 KB"
    const match = f.size.match(/([\d.]+)\s*(KB|MB|GB|B)/i);
    if (!match) return sum;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    let bytes = value;
    if (unit === 'KB') bytes = value * 1024;
    else if (unit === 'MB') bytes = value * 1024 * 1024;
    else if (unit === 'GB') bytes = value * 1024 * 1024 * 1024;
    return sum + bytes;
  }, 0);

  return {
    toolBadge: {
      icon: <RotateCw size={20} strokeWidth={2} />,
      name: 'Rotate PDF',
      bgColor: '#EC4899',
    },

    title: isMultiple
      ? `${params.files.length} PDFs Rotated Successfully!`
      : 'PDF Rotated Successfully!',

    subtitle: isMultiple
      ? `${params.rotatedPagesCount} pages have been rotated across ${params.files.length} PDFs.`
      : params.rotatedPagesCount === 1
        ? '1 page has been rotated in your PDF.'
        : `${params.rotatedPagesCount} pages have been rotated in your PDF.`,

    variant: 'success',

    summary: {
      title: 'Rotation Details',
      rows: [
        // Show total files count only for multiple files
        ...(isMultiple
          ? [{
              icon: <FileText size={13} />,
              iconBg: '#EDE9FE',
              iconColor: '#8B5CF6',
              label: 'Total Files',
              value: `${params.files.length} PDFs`,
            }]
          : []),
        {
          icon: <RotateCw size={13} />,
          iconBg: '#FCE7F3',
          iconColor: '#EC4899',
          label: 'Rotation',
          value: params.rotationDetails,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Pages Rotated',
          value: `${params.rotatedPagesCount} of ${params.totalPages}`,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          label: isMultiple ? 'Total Size' : 'File Size',
          value: isMultiple ? formatBytes(totalSize) : params.files[0]?.size || '—',
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: `Files (${params.files.length})`,
    files: params.files.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      status: 'ready' as const,
      onPreview: f.onPreview,
      onDownload: f.onDownload,
    })),

    primaryButton: {
      label: isMultiple
        ? `Download All (${params.files.length}) as ZIP`
        : 'Download Rotated PDF',
      onClick: params.onDownloadAll,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

// ─────── MERGE PDF (V2) ───────
export function buildMergePdfV2Config(params: {
  fileName: string;
  fileSize: string;
  inputCount: number;
  totalPages: number;
  onDownload: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}): SuccessScreenV2Config {
  return {
    toolBadge: {
      icon: <Layers size={20} strokeWidth={2} />,
      name: 'Merge PDF',
      bgColor: '#3B82F6',
    },

    title: 'PDFs Merged Successfully!',
    subtitle: `${params.inputCount} PDFs merged into one file.`,

    variant: 'success',

    summary: {
      title: 'Merge Details',
      rows: [
        {
          icon: <Layers size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Merged Files',
          value: `${params.inputCount} PDFs`,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#EDE9FE',
          iconColor: '#8B5CF6',
          label: 'Total Pages',
          value: `${params.totalPages}`,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'Output',
          value: '1 PDF',
          valueColor: '#10B981',
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          label: 'File Size',
          value: params.fileSize,
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: 'Files (1)',
    files: [
      {
        id: 'merged',
        name: params.fileName,
        size: params.fileSize,
        status: 'ready',
        onPreview: params.onPreview,
        onDownload: params.onDownload,
      },
    ],

    primaryButton: {
      label: 'Download Merged PDF',
      onClick: params.onDownload,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

// ─────── SPLIT PDF (V2) — MULTI-FILE SUPPORT ───────
export function buildSplitPdfV2Config(params: {
  originalFileName: string;
  originalPageCount: number;
  splitMethod: string;              // "By pages" or "By ranges" or "By size"
  files: Array<{
    id: string;
    name: string;
    size: string;
    pageCount: number;
    onDownload: () => void;
    onPreview?: () => void;
  }>;
  onDownloadAll: () => void;         // Downloads ZIP (or single file)
  onStartOver: () => void;
  onDelete?: () => void;
}): SuccessScreenV2Config {
  const isMultiple = params.files.length > 1;

  // Calculate total size
  const totalSizeBytes = params.files.reduce((sum, f) => {
    const match = f.size.match(/([\d.]+)\s*(KB|MB|GB|B)/i);
    if (!match) return sum;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    let bytes = value;
    if (unit === 'KB') bytes = value * 1024;
    else if (unit === 'MB') bytes = value * 1024 * 1024;
    else if (unit === 'GB') bytes = value * 1024 * 1024 * 1024;
    return sum + bytes;
  }, 0);

  return {
    toolBadge: {
      icon: <Scissors size={20} strokeWidth={2} />,
      name: 'Split PDF',
      bgColor: '#F59E0B', // Amber/orange for splitting tools
    },

    title: isMultiple
      ? 'PDF Split Successfully!'
      : 'Pages Extracted Successfully!',

    subtitle: isMultiple
      ? `Your PDF has been split into ${params.files.length} files.`
      : 'Your extracted pages are ready to download.',

    variant: 'success',

    summary: {
      title: 'Split Details',
      rows: [
        {
          icon: <FileText size={13} />,
          iconBg: '#EDE9FE',
          iconColor: '#8B5CF6',
          label: 'Original PDF',
          value: `${params.originalPageCount} pages`,
        },
        {
          icon: <Scissors size={13} />,
          iconBg: '#FEF3C7',
          iconColor: '#F59E0B',
          label: 'Split Method',
          value: params.splitMethod,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Created Files',
          value: `${params.files.length} ${params.files.length === 1 ? 'PDF' : 'PDFs'}`,
          valueColor: '#3B82F6',
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          label: isMultiple ? 'Total Size' : 'File Size',
          value: formatBytes(totalSizeBytes),
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: `Files (${params.files.length})`,
    files: params.files.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      status: 'ready' as const,
      onPreview: f.onPreview,
      onDownload: f.onDownload,
    })),

    primaryButton: {
      label: isMultiple
        ? `Download All (${params.files.length}) as ZIP`
        : 'Download PDF',
      onClick: params.onDownloadAll,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

export function buildCompressImageV2Config(params: {
  totalOriginalSize: string;
  totalCompressedSize: string;
  totalReductionPercent: number;
  format: string;
  files: Array<{
    id: string;
    name: string;
    originalSize: string;
    compressedSize: string;
    reductionPercent: number;
    onDownload: () => void;
    onCompare?: () => void;
  }>;
  onDownloadAll: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onViewImages?: () => void; // ⭐ NEW: Open gallery viewer
}): SuccessScreenV2Config {
  const isMultiple = params.files.length > 1;

  return {
    toolBadge: {
      icon: <ImageIcon size={20} strokeWidth={2} />,
      name: 'Compress Image',
      bgColor: '#0EA5E9', // Sky blue for image tools
    },

    title: isMultiple
      ? `${params.files.length} Images Compressed!`
      : 'Image Compressed Successfully!',

    subtitle: isMultiple
      ? `Reduced by ${params.totalReductionPercent}% and ready to download.`
      : `Reduced by ${params.totalReductionPercent}% and ready to download.`,

    variant: 'success',

    reductionPercent: params.totalReductionPercent, // ⭐ For animated ring

    summary: {
      title: 'Compression Summary',
      rows: [
        // Show total files count only for multiple files
        {
          icon: <FileText size={13} />,
          iconBg: '#EDE9FE',
          iconColor: '#8B5CF6',
          label: 'Original Size',
          value: params.totalOriginalSize,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          label: 'Compressed Size',
          value: params.totalCompressedSize,
        },
        {
          icon: <TrendingUp size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'Reduction',
          value: `${params.totalReductionPercent}% smaller`,
          valueColor: '#10B981',
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEF3C7',
          iconColor: '#F59E0B',
          label: 'Format',
          value: params.format,
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: `Files (${params.files.length})`,
    files: params.files.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.compressedSize,
      status: 'ready' as const,
      onDownload: f.onDownload,
      onCompare: f.onCompare, // ⭐ NEW
    })),

    primaryButton: {
      label: isMultiple
        ? `Download All (${params.files.length}) as ZIP`
        : 'Download Image',
      onClick: params.onDownloadAll,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
// ⭐ NEW: Add "View Images" as extra action
    extraAction: params.onViewImages
      ? {
          label: 'View Images',
          icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          ),
          onClick: params.onViewImages,
        }
      : undefined,
  };
}

// ─────── PDF TO IMAGES (V2) ───────
export function buildPdfToImagesV2Config(params: {
  totalImages: number;
  totalPages: number;
  format: string;              // "PNG", "JPG"
  resolution: string;          // "High", "Medium", "Low"
  fileSize: string;            // Total/ZIP size
  isSingleImage: boolean;
  files: Array<{
    id: string;
    name: string;
    size: string;
    onDownload: () => void;
    onPreview?: () => void;
  }>;
  onDownloadAll: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onViewImages?: () => void;   // ⭐ For gallery viewer
}): SuccessScreenV2Config {
  const isMultiple = params.files.length > 1;

  return {
    toolBadge: {
      icon: <FileImage size={20} strokeWidth={2} />,
      name: 'PDF to Image',
      bgColor: '#F97316', // Orange for extraction tools
    },

    title: isMultiple
      ? `${params.totalImages} Images Extracted!`
      : 'Image Extracted Successfully!',

    subtitle: isMultiple
      ? `${params.totalImages} pages converted to ${params.format.toUpperCase()} images.`
      : `Page converted to ${params.format.toUpperCase()} image.`,

    variant: 'success',

    summary: {
      title: 'Conversion Details',
      rows: [
        ...(isMultiple
          ? [{
              icon: <FileImage size={13} />,
              iconBg: '#FFEDD5',
              iconColor: '#F97316',
              label: 'Total Images',
              value: `${params.totalImages} images`,
            }]
          : []),
        {
          icon: <FileText size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Format',
          value: params.format.toUpperCase(),
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'Quality',
          value: params.resolution,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEE2E2',
          iconColor: '#EF4444',
          label: isMultiple ? 'Total Size' : 'File Size',
          value: params.fileSize,
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: `Files (${params.files.length})`,
    files: params.files.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      status: 'ready' as const,
      onPreview: f.onPreview,
      onDownload: f.onDownload,
    })),

    primaryButton: {
      label: isMultiple
        ? `Download All (${params.files.length}) as ZIP`
        : 'Download Image',
      onClick: params.onDownloadAll,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,

    // ⭐ View Images button (opens gallery)
    extraAction: params.onViewImages
      ? {
          label: 'View Images',
          icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          ),
          onClick: params.onViewImages,
        }
      : undefined,
  };
}

// ═══════════════════════════════════════════════════════════════
// V1 CONFIG BUILDERS (OLD DESIGN - kept for compatibility)
// Will be migrated to V2 later
// ═══════════════════════════════════════════════════════════════

// ─────── COMPRESS PDF (V1) ───────
export function buildCompressPdfConfig(params: {
  fileName: string;
  originalSize: string;
  compressedSize: string;
  reductionPercent: number;
  totalPages: number;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
  isAlreadyOptimized?: boolean;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalPages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <TrendingUp size={18} />,
      iconColor: '#D1FAE5',
      iconTextColor: '#10B981',
      title: 'Compression Details',
      rows: [
        { label: 'Original Size', value: params.originalSize },
        { label: 'Compressed Size', value: params.compressedSize, valueColor: '#10B981', valueBold: true },
        { label: 'Reduction', value: `${params.reductionPercent}%`, valueColor: '#10B981', valueBold: true },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: params.isAlreadyOptimized
      ? ['File analyzed', 'Best quality maintained', 'Secure & private']
      : ['Compressed PDF', 'Maintained best quality', 'Optimized for web', 'Secure & private'],
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download File',
    hasDownloadDropdown: true,
    showSecurityBar: false,
  };
}

// ─────── IMAGE TO PDF ───────
export function buildImageToPdfConfig(params: {
  fileName: string;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  totalImages: number;
  pageSize: string;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalImages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <ImageIcon size={18} />,
      iconColor: '#D1FAE5',
      iconTextColor: '#10B981',
      title: 'PDF Details',
      rows: [
        { label: 'Created File', value: params.fileName, valueColor: '#6366F1' },
        { label: 'Total Images', value: String(params.totalImages) },
        { label: 'Page Size', value: params.pageSize },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: [
      'Converted images to PDF',
      'Optimized page layout',
      'Applied selected settings',
      'Ready to download',
    ],
    infoBanner: {
      message: `Successfully converted ${params.totalImages} images to PDF document.`,
      color: 'green',
    },
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download File',
    hasDownloadDropdown: true,
    showSecurityBar: true,
  };
}

// ─────── PDF TO IMAGES ───────
export function buildPdfToImagesConfig(params: {
  totalImages: number;
  totalPages: number;
  format: string;
  quality: string;
  images: Array<{ url: string; name: string }>;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'images',
    previewData: {
      images: params.images,
      pageCount: params.totalImages,
    },
    fileTitle: `${params.totalImages} images`,
    details: {
      icon: <FileImage size={18} />,
      iconColor: '#FED7AA',
      iconTextColor: '#EA580C',
      title: 'Image Details',
      rows: [
        { label: 'Created Files', value: `${params.totalImages} images`, valueColor: '#6366F1' },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Format', value: params.format },
        { label: 'Quality', value: params.quality },
      ],
    },
    whatWeDid: [
      'Extracted all pages',
      `Converted to ${params.format}`,
      `Applied ${params.quality} quality`,
      'Ready to download',
    ],
    infoBanner: {
      message: `Successfully extracted ${params.totalImages} images from PDF.`,
      color: 'orange',
    },
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download All',
    hasDownloadDropdown: true,
    showSecurityBar: true,
  };
}

// ─────── SPLIT PDF ───────
export function buildSplitPdfConfig(params: {
  totalParts: number;
  totalPages: number;
  splitMethod: string;
  files: Array<{ url: string; name: string; blob?: Blob }>;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.files[0]?.blob || null,
      url: params.files[0]?.url || null,
      name: params.files[0]?.name || 'split.pdf',
      pageCount: params.totalPages,
    },
    fileTitle: `${params.totalParts} PDF files`,
    details: {
      icon: <Scissors size={18} />,
      iconColor: '#EDE9FE',
      iconTextColor: '#8B5CF6',
      title: 'Split Details',
      rows: [
        { label: 'Created Files', value: `${params.totalParts} PDF files`, valueColor: '#6366F1' },
        { label: 'Total Parts', value: String(params.totalParts) },
        { label: 'Split Method', value: params.splitMethod },
        { label: 'Total Pages', value: String(params.totalPages) },
      ],
    },
    whatWeDid: [
      'Analyzed page ranges',
      'Split into separate files',
      'Preserved quality',
      'Ready to download',
    ],
    infoBanner: {
      message: `Successfully split PDF into ${params.totalParts} separate files.`,
      color: 'purple',
    },
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download All',
    hasDownloadDropdown: true,
    showSecurityBar: true,
  };
}

// ─────── COMPRESS IMAGE ───────
export function buildCompressImageConfig(params: {
  fileName: string;
  originalSize: string;
  compressedSize: string;
  reductionPercent: number;
  format: string;
  imageUrl: string;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'image',
    previewData: {
      images: [{ url: params.imageUrl, name: params.fileName }],
    },
    fileTitle: params.fileName,
    details: {
      icon: <TrendingUp size={18} />,
      iconColor: '#DBEAFE',
      iconTextColor: '#3B82F6',
      title: 'Compression Details',
      rows: [
        { label: 'Original Size', value: params.originalSize },
        { label: 'Compressed Size', value: params.compressedSize, valueColor: '#10B981', valueBold: true },
        { label: 'Reduction', value: `${params.reductionPercent}%`, valueColor: '#10B981', valueBold: true },
        { label: 'Format', value: params.format },
      ],
    },
    whatWeDid: [
      'Compressed image',
      'Maintained best quality',
      'Optimized for web',
      'Secure & private',
    ],
    infoBanner: {
      message: 'Image compressed successfully with best quality.',
      color: 'blue',
    },
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download Image',
    hasDownloadDropdown: true,
    showSecurityBar: true,
  };
}

// ─────── MERGE PDF ───────
export function buildMergePdfConfig(params: {
  fileName: string;
  inputCount: number;
  totalPages: number;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalPages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <Layers size={18} />,
      iconColor: '#DBEAFE',
      iconTextColor: '#3B82F6',
      title: 'Merge Details',
      rows: [
        { label: 'Merged Files', value: `${params.inputCount} PDFs` },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Output', value: '1 PDF', valueColor: '#10B981' },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: [
      `Combined ${params.inputCount} PDFs`,
      'Preserved page order',
      'Maintained quality',
      'Ready to download',
    ],
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download PDF',
    hasDownloadDropdown: true,
    showSecurityBar: false,
  };
}

// ─────── WATERMARK ───────
export function buildWatermarkConfig(params: {
  fileName: string;
  watermarkType: 'Text' | 'Image';
  appliedTo: string;
  totalPages: number;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalPages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <Droplet size={18} />,
      iconColor: '#EDE9FE',
      iconTextColor: '#8B5CF6',
      title: 'Watermark Details',
      rows: [
        { label: 'Watermark Type', value: params.watermarkType },
        { label: 'Applied To', value: params.appliedTo },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: [
      `Applied ${params.watermarkType.toLowerCase()} watermark`,
      `Applied to ${params.appliedTo.toLowerCase()}`,
      'Preserved original quality',
      'Ready to download',
    ],
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download PDF',
    hasDownloadDropdown: true,
    showSecurityBar: false,
  };
}

// ─────── ROTATE PDF ───────
export function buildRotatePdfConfig(params: {
  fileName: string;
  rotation: number;
  appliedTo: string;
  totalPages: number;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalPages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <RotateCw size={18} />,
      iconColor: '#FCE7F3',
      iconTextColor: '#EC4899',
      title: 'Rotation Details',
      rows: [
        { label: 'Rotation', value: `${params.rotation}°` },
        { label: 'Applied To', value: params.appliedTo },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: [
      `Rotated pages by ${params.rotation}°`,
      `Applied to ${params.appliedTo.toLowerCase()}`,
      'Preserved quality',
      'Ready to download',
    ],
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download PDF',
    hasDownloadDropdown: true,
    showSecurityBar: false,
  };
}

// ─────── PROTECT PDF ───────
export function buildProtectPdfConfig(params: {
  fileName: string;
  totalPages: number;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalPages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <Lock size={18} />,
      iconColor: '#FEE2E2',
      iconTextColor: '#EF4444',
      title: 'Protection Details',
      rows: [
        { label: 'Protection', value: 'Enabled', valueColor: '#EF4444' },
        { label: 'Status', value: 'Secured', valueColor: '#10B981' },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: [
      'Applied password protection',
      'Encrypted PDF content',
      'Secured all pages',
      'Ready to download',
    ],
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download Protected PDF',
    showSecurityBar: false,
  };
}

// ─────── UNLOCK PDF ───────
export function buildUnlockPdfConfig(params: {
  fileName: string;
  totalPages: number;
  pdfBlob: Blob | null;
  pdfUrl: string | null;
  onDownload: () => void;
  onStartOver: () => void;
}): SuccessScreenConfig {
  return {
    title: 'Your file is ready!',
    subtitle: 'The task has been completed successfully.',
    previewType: 'pdf',
    previewData: {
      blob: params.pdfBlob,
      url: params.pdfUrl,
      name: params.fileName,
      pageCount: params.totalPages,
    },
    fileTitle: params.fileName,
    details: {
      icon: <Unlock size={18} />,
      iconColor: '#D1FAE5',
      iconTextColor: '#10B981',
      title: 'Unlock Details',
      rows: [
        { label: 'Protection', value: 'Removed', valueColor: '#10B981' },
        { label: 'Status', value: 'Unlocked', valueColor: '#10B981' },
        { label: 'Total Pages', value: String(params.totalPages) },
        { label: 'Format', value: 'PDF' },
      ],
    },
    whatWeDid: [
      'Removed password protection',
      'Decrypted PDF content',
      'Preserved original quality',
      'Ready to download',
    ],
    onDownload: params.onDownload,
    onStartOver: params.onStartOver,
    downloadLabel: 'Download PDF',
    showSecurityBar: false,
  };
}

// ─────── ORGANIZE PDF (V2) ───────
export function buildOrganizePdfV2Config(params: {
  fileName: string;
  fileSize: string;
  totalPages: number;
  originalPageCount: number;
  deletedCount: number;
  rotatedCount: number;
  onDownload: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}): SuccessScreenV2Config {
  // Build dynamic summary rows based on what changed
  const rows: SummaryRow[] = [
    {
      icon: <FileText size={13} />,
      iconBg: '#DBEAFE',
      iconColor: '#3B82F6',
      label: 'Total Pages',
      value: `${params.totalPages}`,
    },
  ];

  // Show deleted pages only if any were deleted
  if (params.deletedCount > 0) {
    rows.push({
      icon: <FileText size={13} />,
      iconBg: '#FEE2E2',
      iconColor: '#EF4444',
      label: 'Pages Removed',
      value: `${params.deletedCount}`,
      valueColor: '#EF4444',
    });
  }

  // Show rotated pages only if any were rotated
  if (params.rotatedCount > 0) {
    rows.push({
      icon: <RotateCw size={13} />,
      iconBg: '#FCE7F3',
      iconColor: '#EC4899',
      label: 'Pages Rotated',
      value: `${params.rotatedCount}`,
    });
  }

  // Always show file size
  rows.push({
    icon: <FileText size={13} />,
    iconBg: '#D1FAE5',
    iconColor: '#10B981',
    label: 'File Size',
    value: params.fileSize,
    valueColor: '#10B981',
  });

  return {
    toolBadge: {
      icon: <Layers size={20} strokeWidth={2} />,
      name: 'Organize PDF',
      bgColor: '#8B5CF6',
    },

    title: 'PDF Organized Successfully!',
    subtitle: 'Your PDF pages have been reorganized.',

    variant: 'success',

    summary: {
      title: 'Organization Summary',
      rows,
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: 'Files (1)',
    files: [
      {
        id: 'organized',
        name: params.fileName,
        size: params.fileSize,
        status: 'ready',
        onPreview: params.onPreview,
        onDownload: params.onDownload,
      },
    ],

    primaryButton: {
      label: 'Download Organized PDF',
      onClick: params.onDownload,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,

    // ⭐ PDF preview URL will be added in DesktopView
  };
}

// ─────── UNLOCK PDF (V2) — MULTI-FILE SUPPORT ───────
export function buildUnlockPdfV2Config(params: {
  files: Array<{
    id: string;
    name: string;
    size: string;
    onDownload: () => void;
    onPreview?: () => void;  // ⭐ ADD
  }>;
  onDownloadAll: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
}): SuccessScreenV2Config {
  const isMultiple = params.files.length > 1;

  return {
    toolBadge: {
      icon: <Unlock size={20} strokeWidth={2} />,
      name: 'Unlock PDF',
      bgColor: '#10B981',
    },

    title: isMultiple
      ? `${params.files.length} PDFs Unlocked!`
      : 'PDF Unlocked Successfully!',

    subtitle: isMultiple
      ? 'All password protections have been removed.'
      : 'Password protection has been removed from your PDF.',

    variant: 'success',

    summary: {
      title: 'Unlock Details',
      rows: [
        ...(isMultiple
          ? [{
              icon: <FileText size={13} />,
              iconBg: '#EDE9FE',
              iconColor: '#8B5CF6',
              label: 'Total Files',
              value: `${params.files.length} PDFs`,
            }]
          : []),
        {
          icon: <Unlock size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'Protection',
          value: 'Removed',
          valueColor: '#10B981',
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Status',
          value: 'Unlocked',
          valueColor: '#10B981',
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEF3C7',
          iconColor: '#F59E0B',
          label: 'Format',
          value: 'PDF',
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: `Files (${params.files.length})`,
files: params.files.map((f) => ({
  id: f.id,
  name: f.name,
  size: f.size,
  status: 'ready' as const,
  onDownload: f.onDownload,
  onPreview: f.onPreview,  // ⭐ ADD
})),

    primaryButton: {
      label: isMultiple
        ? `Download All (${params.files.length})`
        : 'Download Unlocked PDF',
      onClick: params.onDownloadAll,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}

// ─────── SIGN PDF (V2) ───────
export function buildSignPdfV2Config(params: {
  fileName: string;
  fileSize: string;
  totalSignatures: number;
  totalPages: number;
  onDownload: () => void;
  onStartOver: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}): SuccessScreenV2Config {
  return {
    toolBadge: {
      icon: <Edit3 size={20} strokeWidth={2} />,
      name: 'Sign PDF',
      bgColor: '#6366F1',
    },

    title: 'PDF Signed Successfully!',
    subtitle: params.totalSignatures === 1
      ? 'Your signature has been applied to the PDF.'
      : `${params.totalSignatures} signatures have been applied to your PDF.`,

    variant: 'success',

    summary: {
      title: 'Signature Details',
      rows: [
        {
          icon: <Edit3 size={13} />,
          iconBg: '#E0E7FF',
          iconColor: '#6366F1',
          label: 'Signatures Applied',
          value: `${params.totalSignatures}`,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#DBEAFE',
          iconColor: '#3B82F6',
          label: 'Total Pages',
          value: `${params.totalPages}`,
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#D1FAE5',
          iconColor: '#10B981',
          label: 'File Size',
          value: params.fileSize,
          valueColor: '#10B981',
        },
        {
          icon: <FileText size={13} />,
          iconBg: '#FEF3C7',
          iconColor: '#F59E0B',
          label: 'Format',
          value: 'PDF',
        },
      ],
    },

    security: {
      title: 'Your files are secure',
      message: 'Files are processed locally in your browser and never uploaded to any server.',
    },

    filesTitle: 'Files (1)',
    files: [
      {
        id: 'signed',
        name: params.fileName,
        size: params.fileSize,
        status: 'ready',
        onPreview: params.onPreview,
        onDownload: params.onDownload,
      },
    ],

    primaryButton: {
      label: 'Download Signed PDF',
      onClick: params.onDownload,
      hasDropdown: false,
    },

    onStartOver: params.onStartOver,
    onDelete: params.onDelete,
  };
}