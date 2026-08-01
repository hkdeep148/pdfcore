'use client';

import { useCallback, useState } from 'react';
import { useSignPdfContext } from '../_context/SignPdfContext';

export interface PreviewSig {
  signatureId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SignatureOverlayProps {
  pageIndex: number;
  isActive: boolean;
  previewSig: PreviewSig | null;
  setPreviewSig: React.Dispatch<React.SetStateAction<PreviewSig | null>>;
  selectedPlacedId: string | null;
  setSelectedPlacedId: (id: string | null) => void;
  pdfContainerRef: React.RefObject<HTMLDivElement | null>;
  onDragStateChange: (isDragging: boolean) => void;
}

export default function SignatureOverlay({
  pageIndex,
  isActive,
  previewSig,
  setPreviewSig,
  selectedPlacedId,
  setSelectedPlacedId,
  pdfContainerRef,
  onDragStateChange,
}: SignatureOverlayProps) {
  const {
    signatures,
    placedSignatures,
    updatePlacedSignature,
    removePlacedSignature,
  } = useSignPdfContext();

  const [touchDrag, setTouchDrag] = useState<{
    placedId: string | 'preview';
    type: 'move' | 'resize';
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const haptic = (type: 'light' | 'medium' = 'light') => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
    if (type === 'light') navigator.vibrate(10);
    else if (type === 'medium') navigator.vibrate(20);
  };

  const getCurrentDimensions = useCallback(() => {
    if (!pdfContainerRef.current) return null;
    const rect = pdfContainerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, [pdfContainerRef]);

  const handleTouchStart = (
    e: React.TouchEvent,
    placedId: string | 'preview',
    type: 'move' | 'resize'
  ) => {
    e.stopPropagation();
    onDragStateChange(true);
    const touch = e.touches[0];

    let orig;
    if (placedId === 'preview' && previewSig) {
      orig = { x: previewSig.x, y: previewSig.y, w: previewSig.width, h: previewSig.height };
    } else {
      const placed = placedSignatures.find((p) => p.id === placedId);
      if (!placed) return;
      orig = { x: placed.x, y: placed.y, w: placed.width, h: placed.height };
    }

    setTouchDrag({
      placedId,
      type,
      startX: touch.clientX,
      startY: touch.clientY,
      origX: orig.x,
      origY: orig.y,
      origW: orig.w,
      origH: orig.h,
    });
    haptic('light');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDrag) return;
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - touchDrag.startX;
    const dy = touch.clientY - touchDrag.startY;
    const dims = getCurrentDimensions();

    if (touchDrag.placedId === 'preview' && previewSig) {
      if (touchDrag.type === 'move') {
        setPreviewSig({
          ...previewSig,
          x: touchDrag.origX + dx,
          y: touchDrag.origY + dy,
        });
      } else {
        const newW = Math.max(30, touchDrag.origW + dx);
        setPreviewSig({
          ...previewSig,
          width: newW,
          height: newW * (touchDrag.origH / touchDrag.origW),
        });
      }
    } else {
      if (touchDrag.type === 'move') {
        updatePlacedSignature(touchDrag.placedId as string, {
          x: touchDrag.origX + dx,
          y: touchDrag.origY + dy,
          ...(dims && { displayWidth: dims.width, displayHeight: dims.height }),
        });
      } else {
        const newW = Math.max(30, touchDrag.origW + dx);
        updatePlacedSignature(touchDrag.placedId as string, {
          width: newW,
          height: newW * (touchDrag.origH / touchDrag.origW),
          ...(dims && { displayWidth: dims.width, displayHeight: dims.height }),
        });
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchDrag(null);
    setTimeout(() => onDragStateChange(false), 100);
  };

  if (!isActive) return null;

  const pageSignatures = placedSignatures.filter((p) => p.pageIndex === pageIndex);

  return (
    <div
      className="absolute inset-0 z-10"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Placed signatures */}
      {pageSignatures.map((placed) => {
        const sig = signatures.find((s) => s.id === placed.signatureId);
        if (!sig) return null;
        const isDragging = touchDrag?.placedId === placed.id;
        const isSelected = selectedPlacedId === placed.id;

        return (
          <div
            key={placed.id}
            className={`absolute ${isDragging || isSelected ? 'z-50' : 'z-10'}`}
            style={{
              left: placed.x,
              top: placed.y,
              width: placed.width,
              height: placed.height,
              touchAction: 'none',
              transition: isDragging ? 'none' : 'transform 0.15s',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlacedId(placed.id);
            }}
          >
            <div
              className="w-full h-full"
              onTouchStart={(e) => {
                setSelectedPlacedId(placed.id);
                handleTouchStart(e, placed.id, 'move');
              }}
            >
              <img
                src={sig.imageDataUrl}
                alt="Sig"
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>

            {(isSelected || isDragging) && (
              <>
                <div className="absolute inset-0 border-2 border-dashed border-[#4F46E5] rounded pointer-events-none" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlacedSignature(placed.id);
                    setSelectedPlacedId(null);
                    haptic('medium');
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-lg z-20"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div
                  className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#4F46E5] flex items-center justify-center shadow-lg z-20"
                  onTouchStart={(e) => handleTouchStart(e, placed.id, 'resize')}
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                  </svg>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Preview signature */}
      {previewSig && (() => {
        const sig = signatures.find((s) => s.id === previewSig.signatureId);
        if (!sig) return null;
        const isDragging = touchDrag?.placedId === 'preview';
        return (
          <div
            className={`absolute ${isDragging ? 'z-50' : 'z-40'}`}
            style={{
              left: previewSig.x,
              top: previewSig.y,
              width: previewSig.width,
              height: previewSig.height,
              touchAction: 'none',
              opacity: 0.85,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full h-full"
              onTouchStart={(e) => handleTouchStart(e, 'preview', 'move')}
            >
              <img
                src={sig.imageDataUrl}
                alt="Preview"
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>
            <div className="absolute inset-0 border-2 border-dashed border-[#10B981] rounded pointer-events-none animate-pulse" />
            <div
              className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg z-20"
              onTouchStart={(e) => handleTouchStart(e, 'preview', 'resize')}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
              </svg>
            </div>
          </div>
        );
      })()}
    </div>
  );
}