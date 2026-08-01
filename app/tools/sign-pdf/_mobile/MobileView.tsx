'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Pencil, Calendar, Stamp, Undo2 } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileBottomToolbar from '../../_components/MobileBottomToolbar';
import MobileActionButton, {
  MobileDualActionButton,
} from '../../_components/MobileActionButton';
import MobilePageCarousel, {
  CarouselItem,
} from '../../_components/MobilePageCarousel';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useSignPdfContext } from '../_context/SignPdfContext';
import SignatureOverlay, { PreviewSig } from './SignatureOverlay';
import SignatureModal from './SignatureModal';
import StickerPicker from './StickerPicker';

interface CarouselPage extends CarouselItem {
  preview: string;
  width: number;
  height: number;
}

export default function MobileView() {
  const {
    file,
    signatures,
    placedSignatures,
    activeSignatureId,
    currentPageIndex,
    setCurrentPageIndex,
    isLoadingPdf,
    isProcessing,
    errorMessage,
    setErrorMessage,
    addPdf,
    clearFile,
    placeSignatureExact,
    removePlacedSignature,
    setActiveSignatureId,
    addDateStamp,
    signAndPreparePdf,
    downloadSignedFile,
    previewSignedPdf,
    signedPdfUrl,
    signedPdfSize,
  } = useSignPdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/sign-pdf')!;

  const [filename, setFilename] = useState('Signed_Document');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [previewSig, setPreviewSig] = useState<PreviewSig | null>(null);
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);
  const [isDraggingSignature, setIsDraggingSignature] = useState(false);

  const isInPreviewMode = previewSig !== null;
  const isInEditMode = selectedPlacedId !== null && !isInPreviewMode;

  const haptic = (type: 'light' | 'medium' | 'success' = 'light') => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    if (type === 'light') navigator.vibrate(10);
    else if (type === 'medium') navigator.vibrate(20);
    else if (type === 'success') navigator.vibrate([10, 50, 10]);
  };

  // Sync filename with file name
  useEffect(() => {
    if (file?.name) {
      setFilename(file.name.replace(/\.pdf$/i, '') + '-signed');
    }
  }, [file?.name]);

  const getCurrentDimensions = useCallback(() => {
    if (!pdfContainerRef.current) return null;
    const rect = pdfContainerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  const enterPreviewMode = useCallback(
    (sigId: string) => {
      const dims = getCurrentDimensions();
      if (!dims) return;
      const sig = signatures.find((s) => s.id === sigId);
      if (!sig) return;

      const maxWidth = 200;
      const scale = sig.width > maxWidth ? maxWidth / sig.width : 1;
      const w = sig.width * scale;
      const h = sig.height * scale;
      const centerX = (dims.width - w) / 2;
      const centerY = (dims.height - h) / 2;

      setPreviewSig({
        signatureId: sigId,
        x: centerX,
        y: centerY,
        width: w,
        height: h,
      });
      haptic('medium');
    },
    [signatures, getCurrentDimensions]
  );

  useEffect(() => {
    if (signatures.length > 0 && activeSignatureId && !previewSig) {
      const lastSig = signatures[signatures.length - 1];
      if (lastSig.id === activeSignatureId) {
        const alreadyPlaced = placedSignatures.some((p) => p.signatureId === activeSignatureId);
        if (!alreadyPlaced) {
          setTimeout(() => enterPreviewMode(lastSig.id), 100);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatures.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      addPdf(Array.from(e.target.files));
      setTimeout(() => setShowSignatureModal(true), 1500);
    }
    e.target.value = '';
  };

  const confirmPlace = () => {
    if (!previewSig || !file) return;
    const dims = getCurrentDimensions();
    if (!dims) return;

    placeSignatureExact(
      previewSig.signatureId,
      currentPageIndex,
      previewSig.x,
      previewSig.y,
      previewSig.width,
      previewSig.height,
      dims.width,
      dims.height
    );
    setPreviewSig(null);
    haptic('success');
  };

  const cancelPreview = () => {
    setPreviewSig(null);
    haptic('light');
  };

  const handleDeleteSelected = () => {
    if (!selectedPlacedId) return;
    removePlacedSignature(selectedPlacedId);
    setSelectedPlacedId(null);
    haptic('medium');
  };

  const handleUndo = () => {
    if (placedSignatures.length === 0) return;
    const lastId = placedSignatures[placedSignatures.length - 1].id;
    removePlacedSignature(lastId);
    haptic('medium');
  };

  const handleSignatureCreated = (sigId: string) => {
    setActiveSignatureId(sigId);
    setTimeout(() => enterPreviewMode(sigId), 200);
  };

  // 🎊 Handle sign & show success screen (NO auto-download)
  const handleSignPdf = async () => {
    const url = await signAndPreparePdf();
    if (url) {
      setShowSuccess(true);
      haptic('success');
    }
  };

  const handleStartOver = () => {
    clearFile();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
  };

  const carouselItems: CarouselPage[] = (file?.pages || []).map((page) => ({
    id: page.id,
    preview: page.preview,
    width: page.width,
    height: page.height,
    aspectRatio: page.width / page.height,
  }));

  const hasFile = file !== null;

  return (
    <ToolShellMobile fixedHeight={hasFile}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="application/pdf"
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

      {isLoadingPdf && (
        <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-[#4F46E5]/30 border-t-[#4F46E5] animate-spin" />
          <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
        </div>
      )}

      {/* 🎊 SUCCESS SCREEN */}
      {showSuccess && signedPdfUrl ? (
        <MobileSuccessScreen
          title="PDF Signed!"
          subtitle="Your document has been signed successfully"
          filename={`${filename}.pdf`}
          fileSize={signedPdfSize || undefined}
          pageCount={file?.totalPages}
          onDownload={downloadSignedFile}
          onPreview={previewSignedPdf}
          onStartOver={handleStartOver}
          onBack={handleBackToEdit}
        />
      ) : !hasFile && !isLoadingPdf ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={() => fileInputRef.current?.click()} />
      ) : (
        hasFile && (
          <div className="flex flex-col h-full bg-[#F4F5F7]">
            <MobileToolHeader
              filename={filename}
              onFilenameChange={setFilename}
            />

            {isInPreviewMode && (
              <div className="mx-4 mb-2 px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full flex items-center justify-center gap-1.5 shrink-0">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 9v6m4-8v10m4-12v14m4-10v6" />
                </svg>
                <span className="text-[10.5px] font-bold text-[#166534]">
                  Drag to position, then tap Place Here
                </span>
              </div>
            )}

            <div
              className="flex-1 min-h-0 relative"
              onClick={() => setSelectedPlacedId(null)}
            >
              <MobilePageCarousel
                items={carouselItems}
                currentIndex={currentPageIndex}
                onIndexChange={setCurrentPageIndex}
                disableSwipe={isInPreviewMode || !!selectedPlacedId || isDraggingSignature}
                activePageRef={pdfContainerRef}
                renderPage={(item) => (
                  <img
                    src={item.preview}
                    alt="Page"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                )}
                renderOverlay={(item, isActive) => {
                  const pageIndex = carouselItems.findIndex((p) => p.id === item.id);
                  return (
                    <SignatureOverlay
                      pageIndex={pageIndex}
                      isActive={isActive}
                      previewSig={previewSig}
                      setPreviewSig={setPreviewSig}
                      selectedPlacedId={selectedPlacedId}
                      setSelectedPlacedId={setSelectedPlacedId}
                      pdfContainerRef={pdfContainerRef}
                      onDragStateChange={setIsDraggingSignature}
                    />
                  );
                }}
              />
            </div>

            <MobileBottomToolbar
              actions={[
                {
                  icon: Pencil,
                  label: 'Sign',
                  onClick: () => {
                    setShowSignatureModal(true);
                    haptic('light');
                  },
                },
                {
                  icon: Calendar,
                  label: 'Date',
                  onClick: () => {
                    addDateStamp();
                    haptic('light');
                  },
                },
                {
                  icon: Stamp,
                  label: 'Stamp',
                  onClick: () => {
                    setShowStickerPicker(true);
                    haptic('light');
                  },
                },
                {
                  icon: Undo2,
                  label: 'Undo',
                  onClick: handleUndo,
                  disabled: placedSignatures.length === 0,
                },
              ]}
            />

            {isInPreviewMode ? (
              <MobileDualActionButton
                leftLabel="Cancel"
                leftOnClick={cancelPreview}
                leftVariant="secondary"
                leftIcon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                }
                rightLabel="Place Here"
                rightOnClick={confirmPlace}
                rightVariant="success"
                rightIcon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              />
            ) : isInEditMode ? (
              <MobileDualActionButton
                leftLabel="Delete"
                leftOnClick={handleDeleteSelected}
                leftVariant="danger"
                leftIcon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                }
                rightLabel="Done"
                rightOnClick={() => setSelectedPlacedId(null)}
                rightVariant="primary"
                rightIcon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              />
            ) : (
              <MobileActionButton
                label="Sign PDF"
                loadingLabel="Signing..."
                loading={isProcessing}
                disabled={placedSignatures.length === 0}
                onClick={handleSignPdf}
                badge={placedSignatures.length}
                variant="primary"
              />
            )}
          </div>
        )
      )}

      <SignatureModal
        open={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSignatureCreated={handleSignatureCreated}
      />
      <StickerPicker
        open={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
      />
    </ToolShellMobile>
  );
}