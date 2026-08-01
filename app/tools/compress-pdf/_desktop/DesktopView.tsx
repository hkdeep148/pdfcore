'use client';

import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import PageGrid from '../../_components/PageGrid';
import AddMoreCard from '../../_components/AddMoreCard';
import { useCompressPdfContext } from '../_context/CompressPdfContext';
import PdfCard from './PdfCard';
import OptionsPanel from './OptionsPanel';

export default function DesktopView() {
  const {
    items, isProcessing, errorMessage, setErrorMessage,
    addPdfs, removePdf, clearAll, compressAll, downloadOne, downloadAll,
  } = useCompressPdfContext();

  const allCompressed = items.length > 0 && items.every((it) => it.status === 'done');
  const someCompressed = items.some((it) => it.status === 'done');

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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          ),
          label: 'Download All',
          shortcut: 'Ctrl + S',
          onClick: downloadAll,
          disabled: !someCompressed || isProcessing,
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
          disabled: items.length === 0 || isProcessing,
          danger: true,
        },
      ]}
    />
  );

  // ============ MAIN ACTION BUTTON ============
  const actionButton = allCompressed ? (
    <ToolActionButton
      onClick={downloadAll}
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      }
      label="Download All"
      subtitle="Get all compressed files"
    />
  ) : (
    <ToolActionButton
      onClick={compressAll}
      disabled={items.length === 0}
      isLoading={isProcessing}
      loadingLabel="Compressing…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      }
      label={`Compress ${items.length > 0 ? `(${items.length})` : ''}`}
      subtitle="Reduce file size"
    />
  );

  return (
    <ToolShellDesktop
      title="Compress PDF"
      subtitle="Reduce PDF file size while maintaining quality. Fast, secure, and private."
      rightPanel={<OptionsPanel />}
      rightPanelTitle="Compression Options"
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

      {items.length === 0 ? (
        <UploadZone
          onFiles={addPdfs}
          accept="application/pdf"
          title="Drop PDF files here"
          subtitle="Compress multiple PDFs at once"
          buttonText="Choose PDFs"
        />
      ) : (
        <PageGrid
          items={items}
          minCardSize={180}
          disableDrag
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
          {(item) => (
            <PdfCard
              key={item.id}
              item={item}
              onRemove={removePdf}
              onDownload={downloadOne}
            />
          )}
        </PageGrid>
      )}
    </ToolShellDesktop>
  );
}