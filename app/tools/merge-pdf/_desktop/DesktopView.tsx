'use client';

import ToolShellDesktop from '../../_components/ToolShellDesktop';
import UploadZone from '../../_components/UploadZone';
import Button from '../../_components/Button';
import PageGrid from '../../_components/PageGrid';
import AddMoreCard from '../../_components/AddMoreCard';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import { useMergePdfContext } from '../_context/MergePdfContext';
import PdfMergeCard from './PdfMergeCard';
import OptionsPanel from './OptionsPanel';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { buildMergePdfV2Config } from '../../_config/successScreenConfigs';

export default function DesktopView() {
  const {
    items, isLoadingPdf, loadProgress, isProcessing,
    errorMessage, setErrorMessage,
    addPdfs, removePdf, reorderPdfs, clearAll,
    performMerge, downloadMerged, previewMerged, mergeResult,
    pdfFilename,
  } = useMergePdfContext();

  useToolFileReceiver((files: File[]) => addPdfs(files));

  // ⭐ Done state
  const isDone = !!mergeResult && !isProcessing;

  // ⭐ Loading screen hook
  const showLoading = useToolLoadingScreen(isProcessing, isDone, 1800);

  // ═══════════════════════════════════════════════════════════════
  // 1️⃣ LOADING SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (showLoading) {
    return (
      <DesktopProcessingScreen
        title="Merging PDFs"
        subtitle={`Combining ${items.length} PDFs into one document...`}
        fileCount={items.length}
        gradientFrom="#3B82F6"
        gradientTo="#6366F1"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
        icon={
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            <line x1="12" y1="7" x2="12" y2="17" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
        }
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 2️⃣ SUCCESS SCREEN (V2 Design)
  // ═══════════════════════════════════════════════════════════════
  if (isDone && mergeResult) {
    const finalFilename = `${pdfFilename || 'merged'}.pdf`;

    const config = buildMergePdfV2Config({
      fileName: finalFilename,
      fileSize: mergeResult.mergedSizeMB,
      inputCount: mergeResult.filesCount,
      totalPages: mergeResult.totalPages,
      onDownload: downloadMerged,
      onStartOver: clearAll,
      onDelete: clearAll,
      onPreview: previewMerged,
    });

    return <SuccessScreenV2 config={config} />;
  }

  // ═══════════════════════════════════════════════════════════════
  // 3️⃣ BOTTOM BAR (default view)
  // ═══════════════════════════════════════════════════════════════
  const bottomBar = (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant="secondary"
        size="md"
        onClick={clearAll}
        disabled={items.length === 0 || isProcessing}
        icon={
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        }
      >
        Clear All
      </Button>

      <Button
        variant="primary"
        size="lg"
        onClick={performMerge}
        isLoading={isProcessing}
        loadingText="Merging..."
        disabled={items.length < 2}
        icon={
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            <line x1="12" y1="7" x2="12" y2="17" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
        }
      >
        Merge {items.length > 0 ? `(${items.length})` : ''} PDFs
      </Button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // 4️⃣ NORMAL TOOL SHELL (default view)
  // ═══════════════════════════════════════════════════════════════
  return (
    <ToolShellDesktop
      title="Merge PDF"
      subtitle="Combine multiple PDF files into a single document. Drag to reorder."
      rightPanel={<OptionsPanel />}
      rightPanelTitle="Merge Options"
      bottomBar={bottomBar}
    >
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
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDFs...</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
        </div>
      )}

      {items.length === 0 && !isLoadingPdf ? (
        <UploadZone
          onFiles={addPdfs}
          accept="application/pdf"
          title="Drop PDF files here"
          subtitle="You can add multiple PDFs to merge"
          buttonText="Choose PDFs"
        />
      ) : (
        <PageGrid
          items={items}
          onReorder={reorderPdfs}
          minCardSize={180}
          addMoreCard={
            <AddMoreCard
              onFiles={addPdfs}
              accept="application/pdf"
              title="Add More PDFs"
              subtitle="Click or drop"
              disabled={isProcessing}
            />
          }
        >
          {(item, index) => (
            <PdfMergeCard
              key={item.id}
              item={item}
              index={index}
              totalItems={items.length}
              onRemove={removePdf}
            />
          )}
        </PageGrid>
      )}
    </ToolShellDesktop>
  );
}