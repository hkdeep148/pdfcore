'use client';

import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import PageGrid from '../../_components/PageGrid';
import AddMoreCard from '../../_components/AddMoreCard';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';  // ⭐ NEW
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { useCompressPdfContext } from '../_context/CompressPdfContext';
import { formatBytes } from '../../_utils/browser';
import PdfCard from './PdfCard';
import OptionsPanel from './OptionsPanel';
import { buildCompressPdfV2Config } from '../../_config/successScreenConfigs';  // ⭐ NEW

export default function DesktopView() {
  const {
    items, isProcessing, errorMessage, setErrorMessage,
    addPdfs, removePdf, clearAll, compressAll, downloadOne, downloadAll,
    totalOriginalBytes,
    totalCompressedBytes,
    totalSavedPercent,
  } = useCompressPdfContext();

  const noChangeInSize = totalSavedPercent === 0 ||
                       (totalSavedPercent > 0 && totalSavedPercent < 5);

  useToolFileReceiver((files: File[]) => addPdfs(files));

  const allCompressed = items.length > 0 && items.every((it) => it.status === 'done');
  const someCompressed = items.some((it) => it.status === 'done');
  const isSingleFile = items.length === 1;

  const showLoading = useToolLoadingScreen(isProcessing, allCompressed, 2000);

  const handleSmartDownload = () => {
    if (isSingleFile && items[0]) {
      downloadOne(items[0].id);
    } else {
      downloadAll();
    }
  };

  const handlePreview = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item?.compressedBlob) return;
    const url = URL.createObjectURL(item.compressedBlob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          ),
          label: isSingleFile ? 'Download' : 'Download All',
          shortcut: 'Ctrl + S',
          onClick: handleSmartDownload,
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
  const actionButton = (
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
      label={isSingleFile ? 'Compress PDF' : `Compress ${items.length > 0 ? `(${items.length})` : ''}`}
      subtitle="Reduce file size"
    />
  );

  // ═══════════ ⭐ LOADING SCREEN ═══════════
  if (showLoading) {
    return (
      <DesktopProcessingScreen
        title={isSingleFile ? 'Compressing your PDF' : 'Compressing your PDFs'}
        subtitle="Optimizing file size..."
        subtitleMultiple={`Optimizing ${items.length} PDF files...`}
        fileCount={items.length}
        gradientFrom="#6366F1"
        gradientTo="#8B5CF6"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
      />
    );
  }

// ═══════════ ⭐ SUCCESS SCREEN (V2 - Multi-file support) ═══════════
if (allCompressed) {
  const savedBytes = totalOriginalBytes - totalCompressedBytes;
  const doneFiles = items.filter((it) => it.status === 'done');
  const firstFile = doneFiles[0];

  const config = buildCompressPdfV2Config({
    originalSize: formatBytes(totalOriginalBytes),
    compressedSize: formatBytes(totalCompressedBytes),
    sizeReducedBytes: formatBytes(savedBytes),
    reductionPercent: totalSavedPercent,

    files: doneFiles.map((it) => ({
      id: it.id,
      name: it.name,
      size: it.compressedSizeMB || formatBytes(it.compressedBlob?.size || 0),
      onDownload: () => downloadOne(it.id),
      onPreview: () => handlePreview(it.id),
    })),

    onDownload: isSingleFile && items[0]
      ? () => downloadOne(items[0].id)
      : downloadAll,

    onStartOver: clearAll,
    onDelete: clearAll,
  });

  // ⭐ Add PDF data for gallery preview
  const configWithPdf = {
    ...config,
    pdfBlob: firstFile?.compressedBlob || null,
    pdfPreviewUrl: firstFile?.compressedBlob
      ? URL.createObjectURL(firstFile.compressedBlob)
      : null,
  };

  return <SuccessScreenV2 config={configWithPdf} />;
}

  // ═══════════ Otherwise show normal tool shell ═══════════
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
          title="Drop your PDF here"
          subtitle="or click Choose PDFs to browse"
          buttonText="Choose PDFs"
          infoText="PDF · Multiple files supported · No size limit"
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