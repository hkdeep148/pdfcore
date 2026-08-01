'use client';

import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import PageGrid from '../../_components/PageGrid';
import PageGridCard from '../../_components/PageGridCard';
import AddMoreCard from '../../_components/AddMoreCard';
import { useOrganizePdfContext } from '../_context/OrganizePdfContext';
import OrganizeOptionsPanel from './OrganizeOptionsPanel';

export default function DesktopView() {
  const {
    pages, selectedIds, isLoadingPdf, loadProgress, isProcessing,
    errorMessage, setErrorMessage,
    addPdfs, reorderPages, rotatePage, deletePage, toggleSelect,
    clearAll,
    organizeAndPrepare,       // ⭐ CHANGED (was downloadPdf)
    downloadOrganizedFile,    // ⭐ ADDED
    pdfFilename,  
  } = useOrganizePdfContext();

  // ⭐ NEW: Desktop handler — generate then auto-download
  const handleDesktopSave = async () => {
  const url = await organizeAndPrepare();
  if (url) {
    // ⭐ Use the returned URL directly instead of state
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdfFilename || 'organized'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  // ============ BOTTOM TOOLBAR ============
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
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          ),
          label: 'Reorder',
          shortcut: 'Drag & Drop',
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

  // ============ MAIN ACTION BUTTON ============
  const actionButton = (
    <ToolActionButton
      onClick={handleDesktopSave}                // ⭐ CHANGED (was downloadPdf)
      disabled={pages.length === 0}
      isLoading={isProcessing}
      loadingLabel="Building PDF…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      }
      label={`Save PDF (${pages.length})`}
      subtitle="Download organized PDF"
    />
  );

  return (
    <ToolShellDesktop
      title="Organize PDF"
      subtitle="Reorder, rotate, and delete pages. Combine multiple PDFs seamlessly."
      rightPanel={pages.length > 0 ? <OrganizeOptionsPanel /> : <div className="text-[13px] text-[#8A93A3]">Upload PDFs to begin</div>}
      rightPanelTitle="Actions"
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

      {pages.length === 0 && !isLoadingPdf ? (
        <UploadZone
          onFiles={addPdfs}
          accept="application/pdf"
          title="Drop PDF files here"
          subtitle="Combine and organize multiple PDFs"
          buttonText="Choose PDFs"
        />
      ) : (
        <PageGrid
          items={pages}
          onReorder={reorderPages}
          minCardSize={175}
          addMoreCard={
            <AddMoreCard
              onFiles={addPdfs}
              accept="application/pdf"
              title="Add PDFs"
              subtitle="Merge more docs"
            />
          }
        >
          {(page, index) => (
            <PageGridCard
              key={page.id}
              id={page.id}
              preview={page.preview}
              index={index}
              isSelected={selectedIds.has(page.id)}
              rotation={page.userRotation}
              onSelect={() => toggleSelect(page.id)}
              actions={[
                {
                  label: 'Rotate left',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  ),
                  onClick: () => rotatePage(page.id, 'left'),
                },
                {
                  label: 'Rotate right',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  ),
                  onClick: () => rotatePage(page.id, 'right'),
                },
                {
                  label: 'Delete',
                  variant: 'danger',
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  ),
                  onClick: () => deletePage(page.id),
                },
              ]}
            />
          )}
        </PageGrid>
      )}
    </ToolShellDesktop>
  );
}