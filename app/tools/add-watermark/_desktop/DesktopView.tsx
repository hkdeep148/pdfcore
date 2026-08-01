'use client';

import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import ProcessingOverlay from '../../_components/ProcessingOverlay';
import { useAddWatermarkContext } from '../_context/AddWatermarkContext';
import PreviewPanel from './PreviewPanel';
import WatermarkOptionsPanel from './WatermarkOptionsPanel';

export default function DesktopView() {
  const {
    file, isLoadingPdf, isProcessing, processProgress,
    errorMessage, setErrorMessage,
    addPdf, clearFile,
    applyAndPrepare,          // ⭐ CHANGED (was downloadWatermarked)
    downloadWatermarkedFile,  // ⭐ ADDED
  } = useAddWatermarkContext();

  // ⭐ NEW: Desktop handler — apply then auto-download
  const handleDesktopSave = async () => {
    const url = await applyAndPrepare();
    if (url) {
      downloadWatermarkedFile();
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
          label: 'Add File',
          shortcut: 'Ctrl + O',
          onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf';
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) addPdf(Array.from(files));
            };
            input.click();
          },
          disabled: isProcessing,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          ),
          label: 'Clear',
          shortcut: 'Delete',
          onClick: clearFile,
          disabled: !file || isProcessing,
          danger: true,
        },
      ]}
    />
  );

  const actionButton = (
    <ToolActionButton
      onClick={handleDesktopSave}        // ⭐ CHANGED (was downloadWatermarked)
      disabled={!file}
      isLoading={isProcessing}
      loadingLabel="Adding watermark…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      }
      label="Add Watermark"
      subtitle="Apply and download PDF"
    />
  );

  return (
    <>
      <ToolShellDesktop
        title="Add Watermark"
        subtitle="Add custom text watermarks to your PDFs. Live preview included."
        rightPanel={file ? <WatermarkOptionsPanel /> : <div className="text-[13px] text-[#8A93A3]">Upload a PDF to start</div>}
        rightPanelTitle="Watermark Options"
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
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
              <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
            </div>
          </div>
        )}

        {!file && !isLoadingPdf ? (
          <UploadZone
            onFiles={addPdf}
            accept="application/pdf"
            multiple={false}
            title="Drop a PDF here"
            subtitle="Add custom watermarks with live preview"
            buttonText="Choose PDF"
          />
        ) : (
          <PreviewPanel />
        )}
      </ToolShellDesktop>

      {/* Processing Overlay - only shows watermarking */}
      <ProcessingOverlay
        isVisible={isProcessing}
        stage="watermarking"
        progress={processProgress}
      />
    </>
  );
}