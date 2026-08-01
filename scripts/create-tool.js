#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// ============ CONFIG ============
const toolName = process.argv[2];

if (!toolName) {
  console.error('❌ Usage: npm run new-tool <tool-name>');
  console.error('   Example: npm run new-tool image-to-pdf');
  process.exit(1);
}

// Validate tool name (only lowercase letters, numbers, and hyphens)
if (!/^[a-z][a-z0-9-]*$/.test(toolName)) {
  console.error('❌ Tool name must be lowercase with hyphens only (e.g., "image-to-pdf")');
  process.exit(1);
}

// Convert kebab-case to PascalCase (image-to-pdf -> ImageToPdf)
const toPascalCase = (str) =>
  str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');

// Convert kebab-case to Title Case (image-to-pdf -> Image To Pdf)
const toTitleCase = (str) =>
  str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

const PascalName = toPascalCase(toolName);
const TitleName = toTitleCase(toolName);
const contextName = `${PascalName}Context`;
const hookName = `use${PascalName}`;

const basePath = path.join('app', 'tools', toolName);

// ============ FOLDER STRUCTURE ============
const folders = [
  '_context',
  '_hooks',
  '_utils',
  '_desktop',
  '_mobile',
];

// ============ FILES WITH BOILERPLATE ============
const files = {
  'page.tsx': `'use client';

import dynamic from 'next/dynamic';
import { ${PascalName}Provider } from './_context/${contextName}';

const DesktopView = dynamic(() => import('./_desktop/DesktopView'), { ssr: false });
const MobileView = dynamic(() => import('./_mobile/MobileView'), { ssr: false });

export default function ${PascalName}Page() {
  return (
    <${PascalName}Provider>
      <DesktopView />
      <MobileView />
    </${PascalName}Provider>
  );
}
`,

  [`_context/${contextName}.tsx`]: `'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ${hookName}, ${PascalName}State } from '../_hooks/${hookName}';

const ${PascalName}Context = createContext<${PascalName}State | null>(null);

export function ${PascalName}Provider({ children }: { children: ReactNode }) {
  const state = ${hookName}();
  return (
    <${PascalName}Context.Provider value={state}>
      {children}
    </${PascalName}Context.Provider>
  );
}

export function use${PascalName}Context(): ${PascalName}State {
  const context = useContext(${PascalName}Context);
  if (!context) {
    throw new Error('use${PascalName}Context must be used inside <${PascalName}Provider>');
  }
  return context;
}
`,

    [`_hooks/${hookName}.ts`]: `'use client';

import { useState, useCallback } from 'react';
import { useToast } from '../../_components/ToastProvider';

export function ${hookName}() {
  const toast = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setErrorMessage(null);
    toast.success(\`\${newFiles.length} file\${newFiles.length > 1 ? 's' : ''} added\`);
  }, [toast]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setErrorMessage(null);
  }, []);

  return {
    files,
    isProcessing,
    errorMessage,
    addFiles,
    removeFile,
    clearAll,
    setIsProcessing,
    setErrorMessage,
  };
}

export type ${PascalName}State = ReturnType<typeof ${hookName}>;
`,

  '_utils/processor.ts': `// Tool-specific processing logic goes here
// Example: PDF generation, image compression, format conversion, etc.

export async function process${PascalName}() {
  // TODO: Implement processing logic
  console.log('Processing ${toolName}...');
}
`,

  '_desktop/DesktopView.tsx': `'use client';

import { useRef } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import UploadZone from '../../_components/UploadZone';
import Button from '../../_components/Button';
import { use${PascalName}Context } from '../_context/${contextName}';

export default function DesktopView() {
  const { files, addFiles, isProcessing } = use${PascalName}Context();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bottomBar = (
    <div className="flex items-center justify-end">
      <Button
        variant="primary"
        size="lg"
        isLoading={isProcessing}
        disabled={files.length === 0}
        icon={
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        }
      >
        Download
      </Button>
    </div>
  );

  return (
    <ToolShellDesktop
      title="${TitleName}"
      subtitle="Tool description here"
      rightPanel={<div className="text-[13px] text-[#8A93A3]">Options coming soon...</div>}
      rightPanelTitle="Options"
      bottomBar={bottomBar}
    >
      {files.length === 0 ? (
        <UploadZone
          onFiles={addFiles}
          title="Drop files here"
          subtitle="or click to browse"
          buttonText="Choose files"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#8A93A3]">Files loaded: {files.length}</p>
        </div>
      )}
    </ToolShellDesktop>
  );
}
`,
  '_mobile/MobileView.tsx': `'use client';

import { use${PascalName}Context } from '../_context/${contextName}';

export default function MobileView() {
  const { files } = use${PascalName}Context();

  return (
    <div className="lg:hidden flex flex-col min-h-[calc(100dvh-3.5rem)] bg-[#F5F5FA]">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#07122E] mb-2">${TitleName}</h1>
          <p className="text-[#8A93A3]">Mobile view — coming soon</p>
          <p className="text-sm text-[#B0B7C3] mt-4">Files loaded: {files.length}</p>
        </div>
      </div>
    </div>
  );
}
`,
};

// ============ HELPER: ADD TOOL TO CONFIG ============
function addToolToConfig() {
  const configPath = path.join('app', 'tools', '_config', 'tools.tsx');

  if (!fs.existsSync(configPath)) {
    console.log(`\n⚠️  Config file not found at ${configPath}`);
    console.log(`   Please manually add the tool to your config later.\n`);
    return;
  }

  const configContent = fs.readFileSync(configPath, 'utf-8');

  // Check if tool already exists in config
  if (configContent.includes(`href: '/tools/${toolName}'`)) {
    console.log(`\n⚠️  Tool "${toolName}" already exists in config. Skipping...`);
    return;
  }

  const newToolEntry = `  {
    href: '/tools/${toolName}',
    label: '${TitleName}',
    description: 'Description for ${TitleName}',
    category: 'convert',
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },`;

  // Insert before the closing ]; of the tools array
  const updatedContent = configContent.replace(
    /(\n\];)/,
    `\n${newToolEntry}$1`
  );

  fs.writeFileSync(configPath, updatedContent);
  console.log(`✏️  Added "${toolName}" to sidebar config`);
}

// ============ CREATE STRUCTURE ============
console.log(`\n🚀 Creating tool: ${toolName}\n`);

// Check if tool already exists
if (fs.existsSync(basePath)) {
  console.error(`❌ Tool "${toolName}" already exists at ${basePath}`);
  console.error('   Delete the folder first if you want to recreate it.\n');
  process.exit(1);
}

// Create folders
folders.forEach(folder => {
  const folderPath = path.join(basePath, folder);
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`📁 Created folder: ${folderPath}`);
});

// Create files with boilerplate
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(basePath, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`📄 Created file: ${fullPath}`);
});

// Auto-add to config
addToolToConfig();

console.log(`\n✅ Tool "${toolName}" created successfully!\n`);
console.log(`Next steps:`);
console.log(`  1. Update the icon in app/tools/_config/tools.tsx`);
console.log(`  2. Visit http://localhost:3000/tools/${toolName}\n`);