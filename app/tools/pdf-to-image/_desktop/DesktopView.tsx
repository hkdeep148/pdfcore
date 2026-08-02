'use client';

import { useEffect, useRef } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import { usePdfToImageContext } from '../_context/PdfToImageContext';
import PageThumbnail from './PageThumbnail';
import OptionsPanel from './OptionsPanel';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';

export default function DesktopView() {
  const {
    pages, selectedIds, isLoadingPdf, loadProgress,
    isProcessing, processProgress, errorMessage, setErrorMessage,
    addPdfs, removePage, toggleSelect, clearAll,
    downloadOne,
    convertAndPrepare,
    conversionResult,
    downloadingPageId, 
  } = usePdfToImageContext();

  useToolFileReceiver((files: File[]) => addPdfs(files));

  // ⭐ Auto-download flag
  const shouldDownloadRef = useRef(false);

  // ⭐ Watch for conversion result → auto-download
  useEffect(() => {
    if (conversionResult && shouldDownloadRef.current) {
      shouldDownloadRef.current = false;
      console.log('⬇️ Auto-downloading:', conversionResult.filename);

      // Direct download using the fresh state
      const link = document.createElement('a');
      link.href = conversionResult.blobUrl;
      link.download = conversionResult.filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [conversionResult]);

  const handleDesktopDownload = async () => {
    shouldDownloadRef.current = true;
    const url = await convertAndPrepare();
    if (!url) {
      shouldDownloadRef.current = false;
    }
  };

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
          onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf';
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) addPdfs(Array.from(files));
            };
            input.click();
          },
          disabled: isProcessing,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          ),
          label: 'Select All',
          shortcut: 'Ctrl + A',
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
          disabled: pages.length === 0 || isProcessing,
          danger: true,
        },
      ]}
    />
  );

  const actionButton = (
    <ToolActionButton
      onClick={handleDesktopDownload}
      disabled={selectedIds.size === 0}
      isLoading={isProcessing}
      loadingLabel={`Converting… ${Math.round(processProgress)}%`}
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      }
      label={
        selectedIds.size > 1
          ? `Download ${selectedIds.size} as ZIP`
          : selectedIds.size === 1
          ? 'Download Image'
          : 'Select pages'
      }
      subtitle="Extract as images"
    />
  );

  return (
    <ToolShellDesktop
      title="PDF to Image"
      subtitle="Convert PDF pages into PNG or JPG images. Fast, secure, and private."
      rightPanel={<OptionsPanel />}
      rightPanelTitle="Conversion Options"
      bottomBar={bottomBar}
      actionButton={actionButton}
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
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF pages...</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
        </div>
      )}

      {isProcessing && processProgress > 0 && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#10B981]/30 border-t-[#10B981] animate-spin" />
            <span className="text-[13px] text-[#166534] font-semibold">Converting pages... {Math.round(processProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#10B981] transition-all duration-300" style={{ width: `${processProgress}%` }} />
          </div>
        </div>
      )}

      {pages.length === 0 && !isLoadingPdf ? (
        <UploadZone
          onFiles={addPdfs}
          accept="application/pdf"
          title="Drop PDF files here"
          subtitle="Each page will be converted to an image"
          buttonText="Choose PDFs"
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                page={page}
                index={index}
                isSelected={selectedIds.has(page.id)}
                isProcessing={downloadingPageId === page.id}
                onToggleSelect={toggleSelect}
                onDownload={downloadOne}
                onRemove={removePage}
              />
            ))}
          </div>
        </div>
      )}
    </ToolShellDesktop>
  );
}