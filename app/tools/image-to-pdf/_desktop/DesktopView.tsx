'use client';

import { useState } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import PageGrid from '../../_components/PageGrid';
import AddMoreCard from '../../_components/AddMoreCard';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import ImagePreviewModal from '../_components/ImagePreviewModal';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { buildImageToPdfV2Config } from '../../_config/successScreenConfigs';
import type { ImageItem } from '../../_types';
import { formatBytes } from '../../_utils/browser';
import PageCard from './PageCard';
import OptionsPanel from './OptionsPanel';


export default function DesktopView() {
  const {
    images, isConverting, errorMessage, setErrorMessage,
    addImages, removeImage, reorderImages, clearAll,
    createPdf,   // ⭐ NEW: Create only (no download)
    downloadPdf, // ⭐ Still needed for success screen download
    previewPdf,
    pdfBlob, pdfUrl, pdfName, pageSize, orientation,
    currentPageRatio, marginPercent, pageFit, pageBackground,
    selectedId, setSelectedId,
  } = useImageToPdfContext();

  const [previewState, setPreviewState] = useState<{ isOpen: boolean; imageUrl: string; imageName: string }>({
    isOpen: false,
    imageUrl: '',
    imageName: '',
  });

  useToolFileReceiver((files: File[]) => addImages(files));

  const handlePreviewImage = (imageUrl: string, imageName: string) => {
    setPreviewState({ isOpen: true, imageUrl, imageName });
  };

  // ⭐ Done state
  const isDone = !!pdfBlob && !isConverting;

  // ⭐ Loading screen hook
  const showLoading = useToolLoadingScreen(isConverting, isDone, 2000);

  // ⭐ Download handler (from success screen)
  const handleDownloadPdf = () => {
    if (!pdfUrl || !pdfName) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          label: 'Add Images',
          shortcut: 'Ctrl + O',
          onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) addImages(Array.from(files));
            };
            input.click();
          },
          disabled: isConverting,
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
          disabled: images.length === 0 || isConverting,
          danger: true,
        },
      ]}
    />
  );

  // ============ MAIN ACTION BUTTON ============
  const actionButton = (
    <ToolActionButton
      onClick={createPdf}   // ⭐ CHANGED: was downloadPdf, now createPdf
      disabled={images.length === 0}
      isLoading={isConverting}
      loadingLabel="Converting…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          <line x1="12" y1="7" x2="12" y2="17" />
          <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
      }
      label={`Convert ${images.length > 0 ? `(${images.length})` : ''}`}
      subtitle="Convert images to PDF"
    />
  );

  // ═══════════ ⭐ LOADING SCREEN ═══════════
  if (showLoading) {
    return (
      <DesktopProcessingScreen
        title="Creating your PDF"
        subtitle={`Converting ${images.length > 0 ? images.length + ' images' : 'images'} to PDF...`}
        fileCount={images.length || 1}
        gradientFrom="#10B981"
        gradientTo="#059669"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
        icon={
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        }
      />
    );
  }

// ═══════════ ⭐ SUCCESS SCREEN (V2 Design) ═══════════
if (isDone && pdfBlob) {
  const config = buildImageToPdfV2Config({
    fileName: pdfName || 'images.pdf',
    pdfSize: formatBytes(pdfBlob.size),
    totalImages: images.length,
    pageSize: pageSize || 'A4',
    orientation: orientation,
    onDownload: handleDownloadPdf,
    onStartOver: clearAll,
    onDelete: clearAll,
    onPreview: previewPdf,
  });

  // ⭐ ADD: Pass PDF data for gallery preview
  const configWithPdf = {
    ...config,
    pdfBlob: pdfBlob,
    pdfPreviewUrl: pdfUrl,
  };

  return <SuccessScreenV2 config={configWithPdf} />;
}

  // ═══════════ Otherwise show normal tool shell ═══════════
  return (
    <>
    <ToolShellDesktop
      title="Image to PDF"
      subtitle="Convert images to PDF. Drag to reorder."
      rightPanel={<OptionsPanel />}
      rightPanelTitle="PDF Options"
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

      {images.length === 0 ? (
        <UploadZone
          onFiles={addImages}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          title="Drop images here"
          subtitle="You can add multiple images (JPG, PNG, WEBP)"
          buttonText="Choose Images"
        />
      ) : (
        <PageGrid
          items={images}
          onReorder={reorderImages}
          minCardSize={175}
          addMoreCard={
            <AddMoreCard
              onFiles={addImages}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              title="Add Images"
              subtitle="Click or drop"
            />
          }
        >
          {(item: ImageItem, index: number) => (
            <PageCard
              key={item.id}
              item={item}
              index={index}
              ratio={currentPageRatio}
              marginPercent={marginPercent}
              pageFit={pageFit}
              background={pageBackground}
              isSelected={selectedId === item.id}
              onSelect={setSelectedId}
              onRemove={removeImage}
              onPreview={handlePreviewImage}
            />
          )}
        </PageGrid>
      )}
    </ToolShellDesktop>

    <ImagePreviewModal
      isOpen={previewState.isOpen}
      imageUrl={previewState.imageUrl}
      imageName={previewState.imageName}
      onClose={() => setPreviewState(prev => ({ ...prev, isOpen: false }))}
    />
    </>
  );
}