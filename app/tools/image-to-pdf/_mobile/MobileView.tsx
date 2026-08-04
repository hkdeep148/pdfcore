'use client';

import { useRef, useState, useEffect } from 'react';
import { CirclePlus, LayoutGrid, RotateCw, Trash2, Maximize2 } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileBottomToolbar from '../../_components/MobileBottomToolbar';
import MobileActionButton from '../../_components/MobileActionButton';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import ReorderMode from './ReorderMode';
import MobilePageCarousel, { CarouselItem } from '../../_components/MobilePageCarousel';
import PageSizeSheet, { PageSizeOption, SizeScope } from '../../_components/PageSizeSheet';
import { PAGE_ASPECT_RATIOS } from '../_utils/pdfGenerator';
import type { ImageItem, PageSize, Orientation } from '../../_types';

interface ImageCarouselItem extends CarouselItem {
  image: ImageItem;
}

const IMAGE_TO_PDF_SIZES: PageSizeOption<PageSize>[] = [
  { id: 'A4',     name: 'A4',     dimensions: '210 × 297 mm', desc: 'Standard document' },
  { id: 'A3',     name: 'A3',     dimensions: '297 × 420 mm', desc: 'Large format' },
  { id: 'A5',     name: 'A5',     dimensions: '148 × 210 mm', desc: 'Small notebook' },
  { id: 'Letter', name: 'Letter', dimensions: '8.5 × 11 in',  desc: 'US standard' },
  { id: 'Legal',  name: 'Legal',  dimensions: '8.5 × 14 in',  desc: 'US legal' },
];

// Helper: compute aspect ratio for a given size + orientation
function getAspect(size: PageSize, orient: Orientation): number {
  return orient === 'Portrait'
    ? PAGE_ASPECT_RATIOS[size]
    : 1 / PAGE_ASPECT_RATIOS[size];
}

export default function MobileView() {
  const {
    images,
    addImages,
    removeImage,
    rotateImage,
    createPdf,
    downloadPdf,
    previewPdf,
    isConverting,
    isReady,
    lastPdfSize,
    pdfFilename,
    setPdfFilename,
    errorMessage,
    setErrorMessage,
    clearAll,
    pageSize,
    setPageSize,
    orientation,
    setOrientation,
    updateImageSize,
  } = useImageToPdfContext();

  const [isReorderMode, setIsReorderMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSizeSheet, setShowSizeSheet] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activePageRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/image-to-pdf')!;
  const prevImageCount = useRef(0);

  useEffect(() => {
    if (images.length > prevImageCount.current) {
      setCurrentPageIndex(images.length - 1);
    } else if (images.length > 0 && currentPageIndex >= images.length) {
      setCurrentPageIndex(images.length - 1);
    }
    prevImageCount.current = images.length;
  }, [images.length, currentPageIndex]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addImages(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const hasImages = images.length > 0;
  const currentImage = images[currentPageIndex];

  // ═══════════ Per-image effective size (falls back to global) ═══════════
  const currentImageSize = currentImage?.pageSize ?? pageSize;
  const currentImageOrientation = currentImage?.orientation ?? orientation;
  const currentAspect = getAspect(currentImageSize, currentImageOrientation);

  const handleRotate = () => {
    if (currentImage) rotateImage(currentImage.id, 'right');
  };

  const handleDelete = () => {
    if (currentImage) removeImage(currentImage.id);
  };

  const handleCreatePdf = async () => {
    const url = await createPdf();
    if (url) {
      setShowSuccess(true);
    }
  };

  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
    setCurrentPageIndex(0);
  };

  // ═══════════ Scope-aware size/orientation handlers ═══════════
  const handleSizeChange = (size: PageSize, scope: SizeScope) => {
    if (scope === 'all') {
      // Apply to global + clear all per-image overrides
      setPageSize(size);
      images.forEach((img) => {
        if (img.pageSize !== undefined) {
          updateImageSize(img.id, undefined, img.orientation);
        }
      });
    } else if (currentImage) {
      // Apply only to current image
      updateImageSize(
        currentImage.id,
        size,
        currentImage.orientation ?? orientation
      );
    }
  };

  const handleOrientationChange = (orient: Orientation, scope: SizeScope) => {
    if (scope === 'all') {
      setOrientation(orient);
      images.forEach((img) => {
        if (img.orientation !== undefined) {
          updateImageSize(img.id, img.pageSize, undefined);
        }
      });
    } else if (currentImage) {
      updateImageSize(
        currentImage.id,
        currentImage.pageSize ?? pageSize,
        orient
      );
    }
  };

  return (
    <ToolShellMobile fixedHeight={hasImages && !isReorderMode}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />

      {errorMessage && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between z-50">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {showSuccess && isReady ? (
        <MobileSuccessScreen
          title="PDF Created!"
          subtitle="Your images have been converted to PDF"
          filename={`${pdfFilename}.pdf`}
          fileSize={lastPdfSize || undefined}
          pageCount={images.length}
          onDownload={downloadPdf}
          onPreview={previewPdf}
          onStartOver={handleStartOver}
        />
      ) : !hasImages ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : isReorderMode ? (
        <ReorderMode onDone={() => setIsReorderMode(false)} />
      ) : (
        <div className="flex flex-col h-full bg-[#F4F5F7]">
          <MobileToolHeader
            filename={pdfFilename}
            onFilenameChange={setPdfFilename}
          />

          <div className="flex-1 min-h-0 relative">
            <MobilePageCarousel<ImageCarouselItem>
              items={images.map((image) => {
                const imgSize = image.pageSize ?? pageSize;
                const imgOrient = image.orientation ?? orientation;
                return {
                  id: image.id,
                  aspectRatio: getAspect(imgSize, imgOrient),
                  image,
                };
              })}
              currentIndex={currentPageIndex}
              onIndexChange={setCurrentPageIndex}
              onDoubleTap={() => setIsReorderMode(true)}
              onRemove={(item) => removeImage(item.image.id)}
              activePageRef={activePageRef}
              renderPage={(item) => {
                const isSideways =
                  item.image.rotation === 90 || item.image.rotation === 270;

                // Per-image effective container aspect
                const imgSize = item.image.pageSize ?? pageSize;
                const imgOrient = item.image.orientation ?? orientation;
                const containerAspect = getAspect(imgSize, imgOrient);

                const imageAspect = item.image.width / item.image.height;
                const effectiveAspect = isSideways ? 1 / imageAspect : imageAspect;

                // Scale factor so rotated image fits inside container
                let scale = 1;
                if (isSideways) {
                  const scaleByWidth = containerAspect / effectiveAspect;
                  const scaleByHeight = effectiveAspect / containerAspect;
                  scale = Math.min(1, scaleByWidth, scaleByHeight);
                }

                return (
                  <img
                    src={item.image.preview}
                    alt=""
                    className="w-full h-full object-contain bg-white select-none"
                    draggable={false}
                    style={{
                      transform: `rotate(${item.image.rotation}deg) scale(${scale})`,
                      transformOrigin: 'center',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                );
              }}
            />
          </div>

          <MobileBottomToolbar
            actions={[
              { icon: CirclePlus, label: 'Add', onClick: openFilePicker },
              {
                icon: LayoutGrid,
                label: 'Reorder',
                onClick: () => setIsReorderMode(true),
                disabled: !hasImages,
              },
              {
                icon: Maximize2,
                label: currentImageSize,   // 👈 shows THIS image's size
                onClick: () => setShowSizeSheet(true),
              },
              {
                icon: RotateCw,
                label: 'Rotate',
                onClick: handleRotate,
                disabled: !hasImages,
              },
              {
                icon: Trash2,
                label: 'Delete',
                onClick: handleDelete,
                disabled: !hasImages,
              },
            ]}
          />

          <MobileActionButton
            label="Create PDF"
            loadingLabel="Creating..."
            loading={isConverting}
            disabled={images.length === 0}
            onClick={handleCreatePdf}
            variant="primary"
          />
        </div>
      )}

      {/* Page Size Sheet — with scope toggle */}
      <PageSizeSheet<PageSize>
        open={showSizeSheet}
        onClose={() => setShowSizeSheet(false)}
        sizes={IMAGE_TO_PDF_SIZES}
        currentSize={currentImageSize}
        onSizeChange={handleSizeChange}
        currentOrientation={currentImageOrientation}
        onOrientationChange={handleOrientationChange}
        showScope={true}
      />
    </ToolShellMobile>
  );
}