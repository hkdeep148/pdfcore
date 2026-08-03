export type FileAcceptType = 'pdf' | 'image' | 'any';
export type LoadMode = 'single' | 'multiple';

export interface ToolFileConfig {
  path: string;
  accept: FileAcceptType;
  mode: LoadMode;
}

// ⭐ Registry of all tools that support file auto-loading from homepage
export const TOOL_FILE_REGISTRY: Record<string, ToolFileConfig> = {
  // ============ CONVERT ============
  '/tools/image-to-pdf': {
    path: '/tools/image-to-pdf',
    accept: 'image',
    mode: 'multiple',
  },
  '/tools/pdf-to-image': {
    path: '/tools/pdf-to-image',
    accept: 'pdf',
    mode: 'single',
  },

  // ============ ORGANIZE ============
  '/tools/merge-pdf': {
    path: '/tools/merge-pdf',
    accept: 'pdf',
    mode: 'multiple',
  },
  '/tools/split-pdf': {
    path: '/tools/split-pdf',
    accept: 'pdf',
    mode: 'single',
  },
  '/tools/organize-pdf': {
    path: '/tools/organize-pdf',
    accept: 'pdf',
    mode: 'single',
  },

  // ============ OPTIMIZE ============
'/tools/compress-pdf': {
  path: '/tools/compress-pdf',
  accept: 'pdf',
  mode: 'multiple',
},
'/tools/compress-image': {
  path: '/tools/compress-image',
  accept: 'image',
  mode: 'multiple',
},

  // ============ EDIT ============
  '/tools/rotate-pdf': {
    path: '/tools/rotate-pdf',
    accept: 'pdf',
    mode: 'single',
  },
  '/tools/sign-pdf': {
    path: '/tools/sign-pdf',
    accept: 'pdf',
    mode: 'single',
  },

  // ============ SECURITY ============
  '/tools/unlock-pdf': {
    path: '/tools/unlock-pdf',
    accept: 'pdf',
    mode: 'single',
  },
  '/tools/add-watermark': {
    path: '/tools/add-watermark',
    accept: 'pdf',
    mode: 'single',
  },
};

export function getToolFileConfig(path: string): ToolFileConfig | undefined {
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