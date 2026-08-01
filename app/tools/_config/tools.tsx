import {
  Combine,
  Image as ImageIcon,
  SplitSquareHorizontal,
  Maximize2,
  RotateCw,
  Unlock,
  ShieldCheck,
  Files,
  PenTool,
} from 'lucide-react';
import { Tool } from '../_types';

// ============ MOBILE UPLOAD INFO TYPE ============
export interface MobileUploadInfo {
  titleLine1: string;
  titleLine2: string;
  titleAccent: string;
  description: string;
  uploadTitle: string;
  uploadSubtitle: string;
  buttonText: string;
  fileSizeNote: string;
  fileType: 'pdf' | 'image';
}

// ============ ALL AVAILABLE PDF TOOLS ============

export const tools: (Tool & {
  color: string;
  bgColor: string;
  mobileUpload: MobileUploadInfo;
  popular?: boolean;              // ⭐ Marks popular tools shown on homepage
})[] = [
  {
    href: '/tools/image-to-pdf',
    label: 'Image to PDF',
    description: 'Convert JPG, PNG, WEBP images into a single PDF',
    category: 'convert',
    color: '#8B3DFF',
    bgColor: '#F3E8FF',
    icon: <ImageIcon size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Convert Images',
      titleLine2: 'to PDF',
      titleAccent: 'PDF',
      description: 'Turn your images\ninto a single PDF file.',
      uploadTitle: 'Upload Images',
      uploadSubtitle: 'Drag & drop images here\nor choose files',
      buttonText: 'Choose Images',
      fileSizeNote: 'Supports JPG, PNG up to 100 MB',
      fileType: 'image',
    },
  },
  {
    href: '/tools/pdf-to-image',
    label: 'PDF to Image',
    description: 'Extract PDF pages as PNG or JPG images',
    category: 'convert',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    icon: <ImageIcon size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Convert PDF',
      titleLine2: 'to Images',
      titleAccent: 'Images',
      description: 'Extract every PDF page\nas high-quality images.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/merge-pdf',
    label: 'Merge PDF',
    description: 'Combine multiple PDFs into one document',
    category: 'organize',
    color: '#2563EB',
    bgColor: '#EAF1FF',
    icon: <Combine size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Merge PDF',
      titleLine2: 'Files',
      titleAccent: 'Files',
      description: 'Combine multiple PDFs\ninto a single document.',
      uploadTitle: 'Upload PDFs',
      uploadSubtitle: 'Drag & drop your PDFs here\nor choose files',
      buttonText: 'Choose PDFs',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/split-pdf',
    label: 'Split PDF',
    description: 'Extract pages or split into multiple files',
    category: 'organize',
    color: '#F97316',
    bgColor: '#FFEDD5',
    icon: <SplitSquareHorizontal size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Split PDF',
      titleLine2: 'Pages',
      titleAccent: 'Pages',
      description: 'Extract pages or split PDF\ninto multiple files.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/organize-pdf',
    label: 'Organize PDF',
    description: 'Reorder, rotate, and delete PDF pages',
    category: 'organize',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    icon: <Files size={28} strokeWidth={2} />,
    // ❌ Not popular - shown only on /tools page
    mobileUpload: {
      titleLine1: 'Organize',
      titleLine2: 'PDF Pages',
      titleAccent: 'Pages',
      description: 'Reorder, delete, or\nrearrange PDF pages.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/compress-pdf',
    label: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    category: 'optimize',
    color: '#F43F5E',
    bgColor: '#FFE4E6',
    icon: <Maximize2 size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Compress',
      titleLine2: 'PDF',
      titleAccent: 'PDF',
      description: 'Reduce PDF file size\nwithout losing quality.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/unlock-pdf',
    label: 'Unlock PDF',
    description: 'Remove password protection from PDFs',
    category: 'security',
    color: '#DB2777',
    bgColor: '#FCE7F3',
    icon: <Unlock size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Unlock PDF',
      titleLine2: 'Files',
      titleAccent: 'Unlock',
      description: 'Remove password protection\nfrom PDFs.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/sign-pdf',
    label: 'Sign PDF',
    description: 'Add your signature to any PDF document',
    category: 'edit',
    color: '#1E40AF',
    bgColor: '#DBEAFE',
    icon: <PenTool size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Sign PDF',
      titleLine2: 'Documents',
      titleAccent: 'Sign',
      description: 'Add your signature\nto PDF files easily.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/rotate-pdf',
    label: 'Rotate PDF',
    description: 'Rotate individual pages or entire PDFs',
    category: 'edit',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    icon: <RotateCw size={28} strokeWidth={2} />,
    popular: true,                // ⭐ POPULAR
    mobileUpload: {
      titleLine1: 'Rotate PDF',
      titleLine2: 'Pages',
      titleAccent: 'Pages',
      description: 'Rotate PDF pages\nto any orientation.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
  {
    href: '/tools/add-watermark',
    label: 'Add Watermark',
    description: 'Add custom text watermarks to your PDFs',
    category: 'security',
    color: '#0EA5A4',
    bgColor: '#CCFBF1',
    icon: <PenTool size={28} strokeWidth={2} />,
    // ❌ Not popular - shown only on /tools page
    mobileUpload: {
      titleLine1: 'Add Watermark',
      titleLine2: 'to PDF',
      titleAccent: 'Watermark',
      description: 'Add text or image watermarks\nto your PDF.',
      uploadTitle: 'Upload PDF',
      uploadSubtitle: 'Drag & drop your PDF here\nor choose a file',
      buttonText: 'Choose PDF',
      fileSizeNote: 'Supports PDF up to 100 MB',
      fileType: 'pdf',
    },
  },
];

// ============ ⭐ DERIVED HELPERS (computed once at module load) ============

/**
 * Popular tools shown on homepage.
 * Computed once when module loads — zero runtime cost per render.
 */
export const popularTools = tools.filter((tool) => tool.popular);

/**
 * Tools grouped by category (useful for categorized menus/pages).
 */
export const toolsByCategory = tools.reduce((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof tools>);

// ============ CATEGORY LABELS ============
export const categoryLabels: Record<string, string> = {
  convert: 'Convert',
  organize: 'Organize',
  optimize: 'Optimize',
  edit: 'Edit',
  security: 'Security',
};

// ============ HELPERS ============

/**
 * Get tool info by current URL path.
 */
export function getToolByPath(pathname: string): (typeof tools)[0] | undefined {
  return tools.find((t) => t.href === pathname);
}