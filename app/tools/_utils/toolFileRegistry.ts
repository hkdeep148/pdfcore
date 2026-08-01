export type FileAcceptType = 'pdf' | 'image' | 'any';
export type LoadMode = 'single' | 'multiple';

export interface ToolFileConfig {
  path: string;
  accept: FileAcceptType;
  mode: LoadMode;
}

// ⭐ Only these 3 tools support file auto-loading from homepage
export const TOOL_FILE_REGISTRY: Record<string, ToolFileConfig> = {
  '/tools/image-to-pdf': {
    path: '/tools/image-to-pdf',
    accept: 'image',
    mode: 'multiple',
  },
  '/tools/merge-pdf': {
    path: '/tools/merge-pdf',
    accept: 'pdf',
    mode: 'multiple',
  },
  '/tools/compress-pdf': {
    path: '/tools/compress-pdf',
    accept: 'pdf',
    mode: 'multiple',
  },
};

export function getToolFileConfig(path: string): ToolFileConfig | undefined {
  // Handle trailing slash (Next.js trailingSlash: true adds / to paths)
  const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
  return TOOL_FILE_REGISTRY[cleanPath];
}

export function filterFilesByType(files: File[], accept: FileAcceptType): File[] {
  if (accept === 'any') return files;
  if (accept === 'pdf') return files.filter((f) => f.type === 'application/pdf');
  if (accept === 'image') return files.filter((f) => f.type.startsWith('image/'));
  return [];
}

export function applyLoadMode(files: File[], mode: LoadMode): File[] {
  if (mode === 'single' && files.length > 0) return [files[0]];
  return files;
}