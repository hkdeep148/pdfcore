'use client';

import { useState } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import ImageGalleryViewer from '../../compress-image/ImageGalleryViewer';
import type { GalleryImage } from '../../compress-image/ImageGalleryViewer';
import { usePdfToImageContext } from '../_context/PdfToImageContext';
import PageThumbnail from './PageThumbnail';
import OptionsPanel from './OptionsPanel';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { buildPdfToImagesV2Config } from '../../_config/successScreenConfigs';

export default function DesktopView() {
  const {
    pages, selectedIds, isLoadingPdf, loadProgress,
    isProcessing, errorMessage, setErrorMessage,
    addPdfs, removePage, toggleSelect, clearAll,
    downloadOne,
    convertAndPrepare,
    conversionResult,
    convertedImages,
    downloadConvertedFile,
    format, resolution,
    downloadingPageId,
  } = usePdfToImageContext();

  useToolFileReceiver((files: File[]) => addPdfs(files));

  // ⭐ Gallery viewer state
  const [galleryOpen, setGalleryOpen] = useState(false);

  // ⭐ Done state
  const isDone = !!conversionResult && !isProcessing;

  // ⭐ Loading screen hook
  const showLoading = useToolLoadingScreen(isProcessing, isDone, 1800);

  // ⭐ Handle convert (no auto-download)
  const handleConvert = async () => {
    await convertAndPrepare();
  };

  // Helper: format resolution for display
  const formatResolution = (): string => {
    const map: Record<string, string> = {
      low: 'Standard',
      medium: 'High',
      high: 'Best Quality',
    };
    return map[resolution] || resolution;
  };

  // ═══════════════════════════════════════════════════════════════
  // 1️⃣ LOADING SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (showLoading) {
    return (
      <DesktopProcessingScreen
        title="Converting to images"
        subtitle={`Rendering ${selectedIds.size} ${selectedIds.size === 1 ? 'page' : 'pages'} as ${format.toUpperCase()}...`}
        fileCount={selectedIds.size}
        gradientFrom="#F97316"
        gradientTo="#EF4444"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
        icon={
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        }
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 2️⃣ SUCCESS SCREEN (V2 Design)
  // ═══════════════════════════════════════════════════════════════
  if (isDone && conversionResult && convertedImages.length > 0) {
    // Prepare gallery images
    const galleryImages: GalleryImage[] = convertedImages.map((img) => ({
      id: img.id,
      name: img.name,
      url: img.url,
      compressedSize: img.size,
      onDownload: () => {
        const link = document.createElement('a');
        link.href = img.url;
        link.download = img.name;
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }));

    const config = buildPdfToImagesV2Config({
      totalImages: conversionResult.outputCount,
      totalPages: pages.length,
      format: format,
      resolution: formatResolution(),
      fileSize: conversionResult.fileSize,
      isSingleImage: conversionResult.outputCount === 1,
      files: convertedImages.map((img) => ({
        id: img.id,
        name: img.name,
        size: img.size,
        onDownload: () => {
          const link = document.createElement('a');
          link.href = img.url;
          link.download = img.name;
          link.rel = 'noopener';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        onPreview: () => window.open(img.url, '_blank'),
      })),
      onDownloadAll: downloadConvertedFile,
      onStartOver: clearAll,
      onDelete: clearAll,
      onViewImages: () => setGalleryOpen(true),
    });

    return (
      <>
        <SuccessScreenV2 config={config} />

        {/* Gallery Viewer */}
        <ImageGalleryViewer
          isOpen={galleryOpen}
          images={galleryImages}
          onClose={() => setGalleryOpen(false)}
        />
      </>
    );
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

  // ═══════════════════════════════════════════════════════════════
  // 4️⃣ MAIN ACTION BUTTON
  // ═══════════════════════════════════════════════════════════════
  const actionButton = (
    <ToolActionButton
      onClick={handleConvert}
      disabled={selectedIds.size === 0}
      isLoading={isProcessing}
      loadingLabel="Converting…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      }
      label={
        selectedIds.size > 1
          ? `Convert ${selectedIds.size} Pages`
          : selectedIds.size === 1
          ? 'Convert Page'
          : 'Select pages'
      }
      subtitle={`Extract as ${format.toUpperCase()}`}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 5️⃣ NORMAL TOOL SHELL
  // ═══════════════════════════════════════════════════════════════
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