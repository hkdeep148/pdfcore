'use client';

import { useRef, useState, useEffect } from 'react';
import {
  CirclePlus, LayoutGrid, RotateCw, Trash2, Maximize2,
  FileText, Image as ImageIcon,
} from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileBottomToolbar from '../../_components/MobileBottomToolbar';
import MobileActionButton from '../../_components/MobileActionButton';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
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

function getAspect(size: PageSize, orient: Orientation): number {
  return orient === 'Portrait'
    ? PAGE_ASPECT_RATIOS[size]
    : 1 / PAGE_ASPECT_RATIOS[size];
}

// ═══════════════════════════════════════════════════════════════
// RotatableImage
// ═══════════════════════════════════════════════════════════════
function RotatableImage({
  src,
  rotation,
}: {
  src: string;
  rotation: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const isSideways = rotation === 90 || rotation === 270;

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const rect = el.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });

    const observer = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: r.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxW = isSideways ? size.h : size.w;
  const maxH = isSideways ? size.w : size.h;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-white overflow-hidden"
    >
      {size.w > 0 && (
        <img
          src={src}
          alt=""
          draggable={false}
          className="select-none block"
          style={{
            maxWidth: `${maxW}px`,
            maxHeight: `${maxH}px`,
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN VIEW
// ═══════════════════════════════════════════════════════════════
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

  const currentImageSize = currentImage?.pageSize ?? pageSize;
  const currentImageOrientation = currentImage?.orientation ?? orientation;

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

  const handleSizeChange = (size: PageSize, scope: SizeScope) => {
    if (scope === 'all') {
      setPageSize(size);
      images.forEach((img) => {
        if (img.pageSize !== undefined) {
          updateImageSize(img.id, undefined, img.orientation);
        }
      });
    } else if (currentImage) {
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

  // ═══════════════════════════════════════════════════════════════
  // ⭐ SUCCESS SCREEN (renders OUTSIDE ToolShellMobile)
  // ═══════════════════════════════════════════════════════════════
  if (showSuccess && isReady) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Image to PDF"
        toolColor="#8B3DFF"
        onBack={handleStartOver}
        title="PDF Created!"
        subtitle={
          images.length === 1
            ? 'Your image has been converted to PDF.'
            : `${images.length} images have been converted to PDF.`
        }
        files={[{
          id: 'created-pdf',
          name: `${pdfFilename}.pdf`,
          size: lastPdfSize || '—',
          pages: images.length,
        }]}
        onPreview={previewPdf}
        summaryTitle="Conversion Summary"
        summaryRows={[
          {
            icon: <ImageIcon size={13} />,
            iconBg: '#F3E8FF',
            iconColor: '#8B3DFF',
            label: 'Total Images',
            value: `${images.length}`,
          },
          {
            icon: <FileText size={13} />,
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            label: 'Page Size',
            value: `${pageSize} • ${orientation}`,
          },
          {
            icon: <FileText size={13} />,
            iconBg: '#D1FAE5',
            iconColor: '#10B981',
            label: 'File Size',
            value: lastPdfSize || '—',
            valueColor: '#10B981',
          },
          {
            icon: <FileText size={13} />,
            iconBg: '#FEF3C7',
            iconColor: '#F59E0B',
            label: 'Format',
            value: 'PDF',
          },
        ]}
        downloadLabel="Download PDF"
        onDownload={downloadPdf}
        onStartOver={handleStartOver}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ⭐ NORMAL VIEW (inside ToolShellMobile)
  // ═══════════════════════════════════════════════════════════════
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

      {!hasImages ? (
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
              renderPage={(item) => (
                <RotatableImage
                  src={item.image.preview}
                  rotation={item.image.rotation}
                />
              )}
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
                label: currentImageSize,
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

      {/* Page Size Sheet */}
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