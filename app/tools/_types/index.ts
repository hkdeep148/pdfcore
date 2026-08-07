// ============ SHARED TYPES ACROSS ALL TOOLS ============

import { ReactNode } from 'react';

// PDF/Image tool types
export type PageSize = 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal';
export type Orientation = 'Portrait' | 'Landscape';
export type PageFit = 'Fit to page' | 'Fill page' | 'Actual size';
export type Margins = 'None' | 'Small' | 'Normal' | 'Large';
export type ImageSpacing = 'None' | 'Small' | 'Medium' | 'Large';
export type ImageQuality = 'Low' | 'Medium' | 'High quality';
export type Alignment = 'Center' | 'Top' | 'Bottom';
export type PageBackground = 'White' | 'Black' | 'Transparent';

// Image item type
export type ImageItem = {
  id: string;
  file: File;
  preview: string;
  sizeMB: string;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  scale: number;
   // 👇 NEW — per-image page size overrides (optional)
  pageSize?: PageSize;
  orientation?: Orientation;
};

// Tool categories
export type ToolCategory = 'convert' | 'edit' | 'optimize' | 'security' | 'organize';

// Tool metadata (used in the sidebar config)
export type Tool = {
  href: string;
  label: string;
  description: string;
  category: ToolCategory;
  icon: ReactNode;
  comingSoon?: boolean;   // ← NEW: optional flag
};

// ============ PDF TOOL TYPES ============

export type RotationAngle = 0 | 90 | 180 | 270;

export type PdfPageItem = {
  id: string;
  fileId: string;
  pdfId: string;              // which PDF file this page belongs to
  pageIndex: number;          // original page number (0-based)
  preview: string;            // data URL of the page image
  rotation: RotationAngle;    // user-applied rotation
  originalRotation: number;   // original PDF rotation
  width: number;
  height: number;
};

export type PdfFileItem = {
  id: string;
  file: File;
  name: string;
  sizeMB: string;
  totalPages: number;
};

// ============ COMPRESSION TYPES ============

export type CompressionLevel = 'low' | 'medium' | 'high';

export type CompressPdfItem = {
  id: string;
  file: File;
  name: string;
  originalSizeBytes: number;
  originalSizeMB: string;
  compressedSizeBytes?: number;
  compressedSizeMB?: string;
  compressedBlob?: Blob;
  savedPercent?: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  errorMessage?: string;
  progress?: number;  // ⭐ 0-100 during compression
};

// ============ PDF TO IMAGE TYPES ============

export type ImageFormat = 'png' | 'jpg';
export type ImageResolution = 'low' | 'medium' | 'high' | 'ultra';

export type PdfImagePage = {
  id: string;
  pdfId: string;
  pdfName: string;
  pageIndex: number;
  preview: string;         // small preview data URL
  width: number;
  height: number;
};

export type PdfImageFile = {
  id: string;
  file: File;
  name: string;
  totalPages: number;
};

// ============ MERGE PDF TYPES ============

export type MergePdfItem = {
  id: string;
  file: File;
  name: string;
  sizeMB: string;
  totalPages: number;
  firstPagePreview: string;   // data URL of first page thumbnail
};

// ============ UNLOCK PDF TYPES ============

export type UnlockPdfStatus = 'idle' | 'checking' | 'needs-password' | 'unlocking' | 'unlocked' | 'error';

export type UnlockPdfItem = {
  id: string;
  file: File;
  name: string;
  sizeMB: string;
  status: UnlockPdfStatus;
  password: string;
  unlockedBlob?: Blob;
  errorMessage?: string;
  isEncrypted?: boolean;
  unlockMethod?: 'fast' | 'canvas';
  progress?: number;  // ⭐ 0-100 during unlocking
};

// ============ SPLIT PDF TYPES ============

export type SplitMode = 'range' | 'pages' | 'size';  // ⭐ Simplified
export type PagesExtractMode = 'all' | 'select';     // ⭐ NEW sub-mode

export type SplitPdfPage = {
  id: string;
  pageIndex: number;      // 0-based
  preview: string;
  width: number;
  height: number;
};

export type SplitPdfFile = {
  id: string;
  file: File;
  name: string;
  totalPages: number;
};

// ============ WATERMARK TYPES ============

export type WatermarkPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type WatermarkSize = 'small' | 'medium' | 'large' | 'extra-large';

export type WatermarkSettings = {
  text: string;
  fontSize: WatermarkSize;
  color: string;           // hex color
  opacity: number;         // 0-1
  rotation: number;        // 0-360 degrees
  position: WatermarkPosition;
  applyToAllPages: boolean;
  specificPages: string;   // e.g., "1, 3-5"
};

export type WatermarkPdfFile = {
  id: string;
  file: File;
  name: string;
  sizeMB: string;
  totalPages: number;
  firstPagePreview: string;
  allPagePreviews: string[];
  pageWidth: number;
  pageHeight: number;
};

// ============ ORGANIZE PDF TYPES ============

export type OrganizePdfPage = {
  id: string;                    // unique id (used for reordering)
  pdfId: string;                 // which source PDF
  pdfName: string;               // source PDF name
  originalPageIndex: number;     // page number in original PDF (0-based)
  originalRotation: number;      // rotation stored in original PDF
  userRotation: 0 | 90 | 180 | 270;  // user-applied rotation
  preview: string;               // data URL
  width: number;
  height: number;
};

export type OrganizePdfFile = {
  id: string;
  file: File;
  name: string;
  totalPages: number;
};

// ============ SIGN PDF TYPES ============

export type SignatureMode = 'draw' | 'type' | 'upload';

export type SignatureStyle = {
  color: string;      // Blue ink by default
  penSize: number;    // Line thickness
  font?: string;      // For typed signatures
};

export type Signature = {
  id: string;
  imageDataUrl: string;   // The signature image
  width: number;
  height: number;
  createdAt: number;
};

export type PlacedSignature = {
  id: string;
  signatureId: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
};

export type SignPdfPage = {
  id: string;
  pageIndex: number;
  preview: string;
  width: number;
  height: number;
};

export type SignPdfFile = {
  id: string;
  file: File;
  name: string;
  sizeMB: string;
  totalPages: number;
  pages: SignPdfPage[];
};