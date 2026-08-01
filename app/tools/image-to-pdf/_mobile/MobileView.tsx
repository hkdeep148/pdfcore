'use client';

import { useRef, useState, useEffect } from 'react';
import { CirclePlus, LayoutGrid, RotateCw, Trash2 } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileBottomToolbar from '../../_components/MobileBottomToolbar';
import MobileActionButton from '../../_components/MobileActionButton';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import PageCarousel from './PageCarousel';
import ReorderMode from './ReorderMode';

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
  } = useImageToPdfContext();

  const [isReorderMode, setIsReorderMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleRotate = () => {
    if (currentImage) rotateImage(currentImage.id, 'right');
  };

  const handleDelete = () => {
    if (currentImage) removeImage(currentImage.id);
  };

  // 🎊 Trigger create + show success screen
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

  const handleBackToEdit = () => {
    setShowSuccess(false);
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

      {/* 🎊 SUCCESS SCREEN */}
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
    onBack={handleBackToEdit}
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
            <PageCarousel
              currentPageIndex={currentPageIndex}
              onPageChange={setCurrentPageIndex}
              onEnterReorderMode={() => setIsReorderMode(true)}
            />
          </div>

          <MobileBottomToolbar
            actions={[
              { icon: CirclePlus, label: 'Add Page', onClick: openFilePicker },
              {
                icon: LayoutGrid,
                label: 'Reorder',
                onClick: () => setIsReorderMode(true),
                disabled: !hasImages,
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
    </ToolShellMobile>
  );
}