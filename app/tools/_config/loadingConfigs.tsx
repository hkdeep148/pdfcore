import { ProcessingScreenProps } from '../_components/DesktopProcessingScreen';

// SVG icons for each tool
const CompressIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const MergeIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
    <path d="M18 2l4 4-10 10H8v-4L18 2z" />
  </svg>
);

const SplitIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const SignIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const RotateIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const ImageIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const WatermarkIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// TOOL LOADING CONFIGS
// ═══════════════════════════════════════════════════════════════
export const TOOL_LOADING_CONFIGS: Record<
  string,
  Omit<ProcessingScreenProps, 'fileCount'>
> = {
  'compress-pdf': {
    title: 'Compressing your PDF',
    subtitle: 'Optimizing file size...',
    subtitleMultiple: 'Optimizing {count} PDF files...',
    icon: <CompressIcon />,
    gradientFrom: '#6366F1',
    gradientTo: '#A855F7',
    infoText: '🔒 Your files are processed securely',
  },
  'merge-pdf': {
    title: 'Merging your PDFs',
    subtitle: 'Combining files into one...',
    subtitleMultiple: 'Combining {count} PDF files...',
    icon: <MergeIcon />,
    gradientFrom: '#3B82F6',
    gradientTo: '#06B6D4',
    infoText: '🔒 Your files are processed securely',
  },
  'split-pdf': {
    title: 'Splitting your PDF',
    subtitle: 'Extracting pages...',
    subtitleMultiple: 'Splitting {count} PDF files...',
    icon: <SplitIcon />,
    gradientFrom: '#F59E0B',
    gradientTo: '#EF4444',
    infoText: '🔒 Your files are processed securely',
  },
  'sign-pdf': {
    title: 'Signing your PDF',
    subtitle: 'Adding your signature...',
    subtitleMultiple: 'Signing {count} PDF files...',
    icon: <SignIcon />,
    gradientFrom: '#8B5CF6',
    gradientTo: '#EC4899',
    infoText: '🔒 Your signature is applied securely',
  },
  'rotate-pdf': {
    title: 'Rotating your PDF',
    subtitle: 'Adjusting page orientation...',
    subtitleMultiple: 'Rotating {count} PDF files...',
    icon: <RotateIcon />,
    gradientFrom: '#EC4899',
    gradientTo: '#F43F5E',
    infoText: '🔒 Your files are processed securely',
  },
  'pdf-to-image': {
    title: 'Converting to images',
    subtitle: 'Rendering pages as images...',
    subtitleMultiple: 'Converting {count} PDF files...',
    icon: <ImageIcon />,
    gradientFrom: '#10B981',
    gradientTo: '#059669',
    infoText: '🔒 Your files are processed securely',
  },
  'jpg-to-pdf': {
    title: 'Creating your PDF',
    subtitle: 'Converting images to PDF...',
    subtitleMultiple: 'Converting {count} images to PDF...',
    icon: <ImageIcon />,
    gradientFrom: '#10B981',
    gradientTo: '#3B82F6',
    infoText: '🔒 Your files are processed securely',
  },
  'add-watermark': {
    title: 'Adding watermark',
    subtitle: 'Applying watermark to pages...',
    subtitleMultiple: 'Watermarking {count} PDF files...',
    icon: <WatermarkIcon />,
    gradientFrom: '#8B5CF6',
    gradientTo: '#6366F1',
    infoText: '🔒 Your files are processed securely',
  },
};

/**
 * Helper to get loading config with dynamic file count in subtitle
 */
export function getLoadingConfig(
  toolId: keyof typeof TOOL_LOADING_CONFIGS,
  fileCount: number
): ProcessingScreenProps {
  const config = TOOL_LOADING_CONFIGS[toolId];
  if (!config) {
    return {
      title: 'Processing...',
      subtitle: 'Please wait...',
      fileCount,
    };
  }

  return {
    ...config,
    fileCount,
    subtitleMultiple: config.subtitleMultiple?.replace(
      '{count}',
      String(fileCount)
    ),
  };
}