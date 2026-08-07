import type { CompressionLevel } from '../../_types';

export interface CompressionLevelInfo {
  id: CompressionLevel;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  activeBg: string;
  activeBorder: string;
  recommended?: boolean;

  // Quality ratings (0-5 stars)
  textQuality: number;
  imageQuality: number;
  compression: number;

  // Info
  bestFor: string[];
  reduction: string;      // "40-70%"
  reductionMin: number;   // 0.10 = 10%
  reductionMax: number;   // 0.20 = 20%
  useCase: string;

  // Special helper
  suggestionTag?: string;
}

export const COMPRESSION_LEVELS: CompressionLevelInfo[] = [
  {
    id: 'low',
    label: 'Low Compression',
    emoji: '🟢',
    color: '#059669',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    activeBg: '#DCFCE7',
    activeBorder: '#059669',

    textQuality: 5,
    imageQuality: 5,
    compression: 1,

    bestFor: ['Print', 'Contracts', 'Archival'],
    reduction: '10-20%',
    reductionMin: 0.10,
    reductionMax: 0.20,
    useCase: 'Highest quality, smallest reduction',
  },
  {
    id: 'medium',
    label: 'Medium Compression',
    emoji: '🟡',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FCD34D',
    activeBg: '#FEF3C7',
    activeBorder: '#D97706',
    recommended: true,

    textQuality: 5,
    imageQuality: 4,
    compression: 4,

    bestFor: ['Email', 'Sharing', 'Everyday use'],
    reduction: '40-70%',
    reductionMin: 0.40,
    reductionMax: 0.70,
    useCase: 'Best balance of quality and size',
  },
  {
    id: 'high',
    label: 'High Compression',
    emoji: '🔴',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    activeBg: '#FEE2E2',
    activeBorder: '#DC2626',

    textQuality: 4,
    imageQuality: 3,
    compression: 5,

    bestFor: ['Government portals', 'Upload limits', 'Small files'],
    reduction: '70-90%',
    reductionMin: 0.70,
    reductionMax: 0.90,
    useCase: 'Smallest file, some quality loss',
    suggestionTag: 'Need under 500 KB? Try this',
  },
];

// Helper: Get level info by ID
export function getLevelInfo(id: CompressionLevel): CompressionLevelInfo {
  return COMPRESSION_LEVELS.find((l) => l.id === id) ?? COMPRESSION_LEVELS[1];
}

// Helper: Estimate output size range
export function estimateOutputSize(
  originalSizeBytes: number,
  level: CompressionLevel
): { min: string; max: string; avg: string } {
  const info = getLevelInfo(level);

  const minSize = originalSizeBytes * (1 - info.reductionMax);
  const maxSize = originalSizeBytes * (1 - info.reductionMin);
  const avgSize = (minSize + maxSize) / 2;

  return {
    min: formatBytes(minSize),
    max: formatBytes(maxSize),
    avg: formatBytes(avgSize),
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}