'use client';

import { useState } from 'react';
import PdfGalleryViewer from './PdfGalleryViewer';
import { motion } from 'framer-motion';
// REMOVED: import LandingNavbar from '../LandingNavbar';
//
// REASON: tools/layout.tsx already wraps every tool page in <LandingNavbar />.
// Rendering it again here caused two stacked navbars on the desktop
// success screen. The navbar is a layout concern, not a page concern.
import SuccessLeftPanel from './SuccessLeftPanel';
import SuccessRightPanel from './SuccessRightPanel';
import ToolsQuickBar from './ToolsQuickBar';
import type { SuccessScreenV2Config } from '../../_config/successScreenConfigs';

interface Props {
  config: SuccessScreenV2Config;
}

export default function SuccessScreenV2({ config }: Props) {
  const {
    toolBadge,
    title,
    subtitle,
    variant,
    summary,
    security,
    reductionPercent,
    filesTitle,
    files,
    primaryButton,
    onStartOver,
    onDelete,
    extraAction,
  } = config;

  // ⭐ PDF Gallery viewer state
  const [pdfGalleryOpen, setPdfGalleryOpen] = useState(false);

  // ⭐ Find the first file with onPreview (for PDF preview)
  const firstPreviewableFile = files.find((f) => f.onPreview);

  // ⭐ Override Preview action to open gallery instead of new tab
  // Only for tools that DON'T have extraAction (i.e., PDF tools, not image tools)
  const previewAction = !extraAction && firstPreviewableFile
    ? {
        label: 'Preview',
        icon: (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
        onClick: () => setPdfGalleryOpen(true),
      }
    : undefined;

  // ⭐ Detect if we have PDF blob data for the gallery
  const pdfPreviewUrl = firstPreviewableFile?.onPreview
    ? (() => {
        return (config as any).pdfPreviewUrl || null;
      })()
    : null;

  return (
    /*
     * REMOVED: <LandingNavbar /> was here.
     * It was duplicating the navbar already rendered by tools/layout.tsx.
     * The outer layout-level min-h-screen wrapper handles the page shell.
     */
<div className="bg-[#F8F9FB] flex flex-col">
      <div className="flex-1 py-5 px-6">
        <div className="max-w-[1280px] mx-auto">

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white rounded-xl border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.04)] px-8 pt-8 pb-5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">

              <div>
                <SuccessLeftPanel
                  toolBadge={toolBadge}
                  title={title}
                  subtitle={subtitle}
                  variant={variant}
                  summary={summary}
                  security={security}
                  reductionPercent={reductionPercent}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04)] p-6"
              >
                <SuccessRightPanel
                  filesTitle={filesTitle}
                  files={files}
                  primaryButton={primaryButton}
                  onStartOver={onStartOver}
                  onDelete={onDelete}
                  extraAction={extraAction || previewAction}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Tools bar */}
          <div className="mt-6">
            <ToolsQuickBar />
          </div>
        </div>
      </div>

      {/* ⭐ PDF Gallery Viewer (same style as image gallery) */}
      {!extraAction && (
        <PdfGalleryViewer
          isOpen={pdfGalleryOpen}
          blob={(config as any).pdfBlob || null}
          url={(config as any).pdfPreviewUrl || null}
          fileName={files[0]?.name || 'document.pdf'}
          pageCount={files.length}
          onClose={() => setPdfGalleryOpen(false)}
          onDownload={primaryButton.onClick}
        />
      )}
    </div>
  );
}