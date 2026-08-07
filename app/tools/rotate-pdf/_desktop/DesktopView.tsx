'use client';

import { useRef } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import { useRotatePdfContext } from '../_context/RotatePdfContext';
import PdfPageCard from './PdfPageCard';
import OptionsPanel from './OptionsPanel';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { buildRotatePdfV2Config } from '../../_config/successScreenConfigs';

export default function DesktopView() {
const {
  pages, selectedIds, isProcessing, isLoadingPdf, loadProgress,
  errorMessage, setErrorMessage,
  addPdfs, removePage, rotatePage, toggleSelect,
  clearAll,
  rotateAndPrepare,
  rotatedPdfUrl,
  rotatedFiles,              // ⭐ NEW
  downloadRotatedFileById,   // ⭐ NEW
  previewRotatedFileById,    // ⭐ NEW
  downloadAllAsZip,          // ⭐ NEW
  rotatedCount,
} = useRotatePdfContext();

  useToolFileReceiver((files: File[]) => addPdfs(files));

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ⭐ Done state
  const isDone = rotatedFiles.length > 0 && !isProcessing;

  // ⭐ Loading screen hook
  const showLoading = useToolLoadingScreen(isProcessing, isDone, 1800);

  // ⭐ Trigger rotation (create only, no auto-download)
  const handleDesktopSave = async () => {
    await rotateAndPrepare();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) addPdfs(Array.from(e.dataTransfer.files));
  };

  // ============ HELPER: Rotate Selected Pages ============
  const rotateSelectedPages = (direction: 'left' | 'right') => {
    if (selectedIds.size === 0) {
      pages.forEach((page) => rotatePage(page.id, direction));
    } else {
      selectedIds.forEach((id) => rotatePage(id, direction));
    }
  };

  // ⭐ Helper: Get rotation description
  const getRotationDetails = (): string => {
    const rotations = pages
      .filter((p) => p.rotation !== 0)
      .map((p) => p.rotation);

    if (rotations.length === 0) return 'No rotation';

    // Check if all rotations are the same
    const uniqueRotations = [...new Set(rotations)];
    if (uniqueRotations.length === 1) {
      return `${uniqueRotations[0]}°`;
    }

    // Mixed rotations
    return 'Mixed rotations';
  };

  // ═══════════════════════════════════════════════════════════════
  // 1️⃣ LOADING SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (showLoading) {
    return (
      <DesktopProcessingScreen
        title="Rotating your PDF"
        subtitle={`Applying rotations to ${rotatedCount} ${rotatedCount === 1 ? 'page' : 'pages'}...`}
        fileCount={1}
        gradientFrom="#EC4899"
        gradientTo="#F43F5E"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
        icon={
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        }
      />
    );
  }

// ═══════════════════════════════════════════════════════════════
// 2️⃣ SUCCESS SCREEN (V2 Design) — Multi-file support
// ═══════════════════════════════════════════════════════════════
if (isDone && rotatedFiles.length > 0) {
  const config = buildRotatePdfV2Config({
    files: rotatedFiles.map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      onDownload: () => downloadRotatedFileById(f.id),
      onPreview: () => previewRotatedFileById(f.id),
    })),
    totalPages: pages.length,
    rotatedPagesCount: rotatedCount,
    rotationDetails: getRotationDetails(),
    onDownloadAll: downloadAllAsZip,
    onStartOver: clearAll,
    onDelete: clearAll,
  });

  return <SuccessScreenV2 config={config} />;
}
  // ═══════════════════════════════════════════════════════════════
  // 3️⃣ BOTTOM TOOLBAR
  // ═══════════════════════════════════════════════════════════════
  const bottomBar = (
    <ToolBottomBar
      actions={[
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ),
          label: 'Add PDFs',
          shortcut: 'Ctrl + O',
          onClick: () => fileInputRef.current?.click(),
          disabled: isProcessing,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          ),
          label: 'Rotate Left',
          shortcut: selectedIds.size > 0 ? `${selectedIds.size} selected` : 'All pages',
          onClick: () => rotateSelectedPages('left'),
          disabled: pages.length === 0,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          ),
          label: 'Rotate Right',
          shortcut: selectedIds.size > 0 ? `${selectedIds.size} selected` : 'All pages',
          onClick: () => rotateSelectedPages('right'),
          disabled: pages.length === 0,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          ),
          label: 'Clear All',
          shortcut: 'Delete',
          onClick: clearAll,
          disabled: pages.length === 0,
          danger: true,
        },
      ]}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 4️⃣ MAIN ACTION BUTTON
  // ═══════════════════════════════════════════════════════════════
  const actionButton = (
    <ToolActionButton
      onClick={handleDesktopSave}
      disabled={pages.length === 0}
      isLoading={isProcessing}
      loadingLabel="Processing…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      }
      label="Apply Rotation"
      subtitle="Rotate pages"
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 5️⃣ NORMAL TOOL SHELL (default view)
  // ═══════════════════════════════════════════════════════════════
  return (
    <ToolShellDesktop
      title="Rotate PDF"
      subtitle="Rotate individual pages or entire PDFs. Fast, secure, and private."
      rightPanel={<OptionsPanel />}
      rightPanelTitle="Rotation Options"
      bottomBar={bottomBar}
      actionButton={actionButton}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {errorMessage && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between flex-shrink-0">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {isLoadingPdf && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF pages...</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
        </div>
      )}

      {pages.length === 0 && !isLoadingPdf ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D1D5FF] bg-white/40"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#EFF3FF] flex items-center justify-center mb-5">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 15l3-3 3 3" />
              <line x1="12" y1="12" x2="12" y2="18" />
            </svg>
          </div>
          <p className="text-[18px] font-bold text-[#07122E] mb-1.5">Drop PDF files here</p>
          <p className="text-[14px] text-[#8A93A3] mb-6">Multiple PDFs supported</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-[#1E4FD1] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Choose PDFs
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {pages.map((page, index) => (
              <PdfPageCard
                key={page.id}
                page={page}
                index={index}
                isSelected={selectedIds.has(page.id)}
                onToggleSelect={toggleSelect}
                onRotateLeft={(id) => rotatePage(id, 'left')}
                onRotateRight={(id) => rotatePage(id, 'right')}
                onRemove={removePage}
              />
            ))}
          </div>
        </div>
      )}
    </ToolShellDesktop>
  );
}