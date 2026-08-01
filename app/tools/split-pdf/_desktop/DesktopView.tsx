'use client';

import { useMemo, useRef, useEffect } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import PageGrid from '../../_components/PageGrid';
import { useSplitPdfContext } from '../_context/SplitPdfContext';
import PageThumbnail, { GROUP_COLORS } from './PageThumbnail';
import SplitOptionsPanel from './SplitOptionsPanel';

export default function DesktopView() {
  const {
    file, pages, pageGroups, canSplit, outputCount,
    mode, extractMode, selectedPages, togglePageSelection,
    isCalculatingSize,
    isLoadingPdf, loadProgress, isProcessing,
    errorMessage, setErrorMessage,
    addPdf, clearFile,
    splitAndPrepare,           // ⭐ CHANGED (was splitAndDownload)
    splitResult,               // ⭐ ADDED
  } = useSplitPdfContext();

  // ⭐ Auto-download flag
  const shouldDownloadRef = useRef(false);

  // ⭐ Watch for splitResult → auto-download when ready
  useEffect(() => {
    if (splitResult && shouldDownloadRef.current) {
      shouldDownloadRef.current = false;
      console.log('⬇️ Auto-downloading split file:', splitResult.filename);

      const link = document.createElement('a');
      link.href = splitResult.blobUrl;
      link.download = splitResult.filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [splitResult]);

  // ⭐ Desktop handler — split then useEffect handles download
  const handleDesktopSplit = async () => {
    shouldDownloadRef.current = true;
    const url = await splitAndPrepare();
    if (!url) {
      shouldDownloadRef.current = false;
    }
  };

  const pageToGroup = useMemo(() => {
    const map = new Map<number, number>();
    pageGroups.forEach((group, groupIdx) => {
      group.forEach((pageIdx) => map.set(pageIdx, groupIdx));
    });
    return map;
  }, [pageGroups]);

  // Is selection mode active?
  const isSelectMode = mode === 'pages' && extractMode === 'select';

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
          label: 'Add PDF',
          shortcut: 'Ctrl + O',
          onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf';
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) addPdf([files[0]]);
            };
            input.click();
          },
          disabled: isProcessing,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="8" height="18" rx="1" />
              <rect x="13" y="3" width="8" height="18" rx="1" />
            </svg>
          ),
          label: isSelectMode ? 'Click Pages' : 'Split Pages',
          shortcut: isSelectMode ? 'To select' : 'Select Range',
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
      onClick={handleDesktopSplit}          // ⭐ CHANGED
      disabled={!canSplit}
      isLoading={isProcessing}
      loadingLabel="Splitting…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
        </svg>
      }
      label={
        outputCount > 1
          ? `Split into ${outputCount} PDFs`
          : outputCount === 1
          ? 'Download PDF'
          : 'Split PDF'
      }
      subtitle="Extract selected pages"
    />
  );

  return (
    <ToolShellDesktop
      title="Split PDF"
      subtitle="Extract pages or split PDFs into multiple documents."
      rightPanel={<SplitOptionsPanel />}
      rightPanelTitle="Split"
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
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
        </div>
      )}

      {!file && !isLoadingPdf ? (
        <UploadZone
          onFiles={addPdf}
          accept="application/pdf"
          multiple={false}
          title="Drop a PDF here"
          subtitle="Select a PDF to split into pages"
          buttonText="Choose PDF"
        />
      ) : file && pages.length > 0 && (
        <>
          {/* File info bar */}
          <div className="mb-4 px-4 py-3 bg-white rounded-xl border border-[#ECEDF3] flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-12 rounded-lg bg-[#FEE9E9] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#07122E] truncate">{file.name}</p>
              <p className="text-[11px] text-[#8A93A3]">{file.totalPages} pages</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#8A93A3]">Output</p>
              <p className="text-[15px] font-bold text-[#10B981]">{outputCount} PDF{outputCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Size mode calculating indicator */}
          {mode === 'size' && isCalculatingSize && (
            <div className="mb-4 px-4 py-3 bg-[#EFF3FF] border border-[#DBEAFE] rounded-xl flex items-center gap-3 flex-shrink-0">
              <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
              <span className="text-[13px] text-[#1E40AF] font-semibold">
                Calculating optimal size splits...
              </span>
            </div>
          )}

          {/* Show hint when in select mode */}
          {isSelectMode && selectedPages.size === 0 && (
            <div className="mb-4 px-4 py-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center gap-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#10B981] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              <p className="text-[13px] text-[#166534] font-semibold">
                Click on the pages you want to extract
              </p>
            </div>
          )}

          {/* Page grid */}
          <PageGrid
            items={pages}
            minCardSize={150}
            disableDrag
          >
            {(page) => {
              // Select mode: interactive selection
              if (isSelectMode) {
                return (
                  <PageThumbnail
                    key={page.id}
                    page={page}
                    groupIndex={null}
                    groupColor=""
                    isSelectable
                    isSelected={selectedPages.has(page.pageIndex)}
                    onToggleSelect={togglePageSelection}
                  />
                );
              }

              // Default mode: group coloring
              const groupIdx = pageToGroup.get(page.pageIndex);
              const groupColor = groupIdx !== undefined
                ? GROUP_COLORS[groupIdx % GROUP_COLORS.length]
                : '#ECEDF3';
              return (
                <PageThumbnail
                  key={page.id}
                  page={page}
                  groupIndex={groupIdx ?? null}
                  groupColor={groupColor}
                />
              );
            }}
          </PageGrid>
        </>
      )}
    </ToolShellDesktop>
  );
}