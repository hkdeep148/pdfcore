/**
 * File validation utilities for uploads across all tools.
 * 
 * Philosophy: We don't hard-limit file sizes because our processing
 * is 100% browser-based (no upload happens). Instead, we WARN users
 * when files are unusually large so they know what to expect.
 */

import { formatBytes } from './browser';

// ============================================================
// SIZE THRESHOLDS (in bytes)
// ============================================================

/** Files under this size process without any notification. */
export const SIZE_SILENT_LIMIT = 100 * 1024 * 1024; // 100 MB

/** Files above this size get an "info" toast (may take a moment). */
export const SIZE_INFO_THRESHOLD = 100 * 1024 * 1024; // 100 MB

/** Files above this size get a "warning" toast (may be slow). */
export const SIZE_WARNING_THRESHOLD = 500 * 1024 * 1024; // 500 MB

/** Files above this size need explicit confirmation. */
export const SIZE_CONFIRMATION_THRESHOLD = 1024 * 1024 * 1024; // 1 GB

// ============================================================
// TYPES
// ============================================================

export type FileSizeCategory = 'normal' | 'info' | 'warning' | 'confirm';

export interface FileSizeAssessment {
  /** How to treat this file size. */
  category: FileSizeCategory;
  /** Human-readable message (empty for 'normal'). */
  message: string;
}

export interface FileValidationResult {
  /** Files that passed initial checks (non-empty). Includes large ones. */
  validFiles: File[];
  /** Files rejected outright (e.g., 0 bytes). */
  rejectedFiles: Array<{ file: File; reason: string }>;
  /** Files that are unusually large and need user notification. */
  largeFiles: Array<{ file: File; assessment: FileSizeAssessment }>;
}

// ============================================================
// SIZE ASSESSMENT
// ============================================================

/**
 * Assess a file size and return whether to notify the user.
 */
export function assessFileSize(sizeBytes: number): FileSizeAssessment {
  if (sizeBytes >= SIZE_CONFIRMATION_THRESHOLD) {
    return {
      category: 'confirm',
      message: `This is a huge file (${formatBytes(sizeBytes)}). Processing may take significant time and memory. Continue anyway?`,
    };
  }

  if (sizeBytes >= SIZE_WARNING_THRESHOLD) {
    return {
      category: 'warning',
      message: `Very large file (${formatBytes(sizeBytes)}). Processing may take longer on slower devices.`,
    };
  }

  if (sizeBytes >= SIZE_INFO_THRESHOLD) {
    return {
      category: 'info',
      message: `Large file (${formatBytes(sizeBytes)}) — this may take a moment.`,
    };
  }

  return { category: 'normal', message: '' };
}

// ============================================================
// FILE VALIDATION
// ============================================================

/**
 * Validate a list of files.
 * Rejects only truly broken files (0 bytes). Large files are allowed
 * but flagged for user notification.
 *
 * @example
 * const result = validateFiles(files);
 * 
 * // Reject empty/corrupt files
 * result.rejectedFiles.forEach(({ file, reason }) => {
 *   toast.error(`"${file.name}": ${reason}`);
 * });
 * 
 * // Warn about large files
 * result.largeFiles.forEach(({ file, assessment }) => {
 *   if (assessment.category === 'info') toast.info(assessment.message);
 *   if (assessment.category === 'warning') toast.warning(assessment.message);
 *   // 'confirm' should trigger a modal, not just a toast
 * });
 * 
 * // Process valid files
 * processFiles(result.validFiles);
 */
export function validateFiles(files: File[]): FileValidationResult {
  const validFiles: File[] = [];
  const rejectedFiles: Array<{ file: File; reason: string }> = [];
  const largeFiles: Array<{ file: File; assessment: FileSizeAssessment }> = [];

  for (const file of files) {
    // Reject empty files (usually corrupt or upload error)
    if (file.size === 0) {
      rejectedFiles.push({
        file,
        reason: 'File is empty (0 bytes). It may be corrupt or the upload failed.',
      });
      continue;
    }

    // File is valid — but check if we should notify user
    validFiles.push(file);

    const assessment = assessFileSize(file.size);
    if (assessment.category !== 'normal') {
      largeFiles.push({ file, assessment });
    }
  }

  return { validFiles, rejectedFiles, largeFiles };
}

/**
 * Validate a single file. Returns null if valid, or error message if invalid.
 * Note: Large-but-valid files return null (they're valid, just need notification).
 */
export function validateSingleFile(file: File): string | null {
  const result = validateFiles([file]);
  if (result.rejectedFiles.length > 0) {
    return result.rejectedFiles[0].reason;
  }
  return null;
}