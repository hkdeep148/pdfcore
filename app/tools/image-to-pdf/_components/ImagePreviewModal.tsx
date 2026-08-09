'use client';

import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PageFit, PageBackground } from '../../_types';
import { PAGE_BACKGROUND_HEX } from '../_utils/pdfGenerator';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName?: string;
  onClose: () => void;
  /*
    Page-level preview settings.
    When these are supplied, the modal renders a paper-page preview
    with the image inside — matching the desktop PageCard output.
    All are optional so existing call sites still work.
  */
  pageRatio?: number;         // width / height, e.g. 595/842 for A4 portrait
  marginPercent?: number;     // 0–20 or so
  pageFit?: PageFit;          // 'Fill page' | 'Fit to page' etc.
  pageBackground?: PageBackground;
  rotation?: number;          // per-image rotation in degrees
}

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  imageName = 'image',
  onClose,
  pageRatio,
  marginPercent = 0,
  pageFit = 'Fit to page',
  pageBackground = 'White',
  rotation = 0,
}: ImagePreviewModalProps) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoom(1);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 1));

  const showPagePreview = typeof pageRatio === 'number';
  const bgHex = PAGE_BACKGROUND_HEX[pageBackground];
  const pageBgClass =
    bgHex === null
      ? 'bg-[repeating-conic-gradient(#f0f0f5_0%_25%,white_0%_50%)] [background-size:14px_14px]'
      : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#ECEDF3] bg-[#FAFBFC]">
                <h3 className="text-[14px] font-bold text-[#07122E] truncate max-w-[70%]">
                  {imageName}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom out"
                  >
                    <ZoomOut size={18} className="text-[#6B7280]" />
                  </button>
                  <span className="text-[12px] font-medium text-[#6B7280] min-w-[40px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom in"
                  >
                    <ZoomIn size={18} className="text-[#6B7280]" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors"
                    title="Close"
                  >
                    <X size={18} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/*
                Preview area.
                - If pageRatio is provided, render a paper-page preview
                  with margins, fit, background, and rotation exactly
                  matching how the PDF will look.
                - Otherwise fall back to the plain image preview
                  (backward compatible).
              */}
              <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F5F5FA] p-6">
                <motion.div
                  animate={{ scale: zoom }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="flex items-center justify-center"
                >
                  {showPagePreview ? (
                    <div
                      className={`relative border border-[#E2E2EE] shadow-lg overflow-hidden ${
                        bgHex === '#000000'
                          ? 'bg-black'
                          : bgHex === '#FFFFFF'
                          ? 'bg-white'
                          : pageBgClass
                      }`}
                      style={{
                        aspectRatio: pageRatio,
                        // Size the paper to fill most of the modal
                        width: 'min(80vw, 700px)',
                        maxHeight: '70vh',
                      }}
                    >
                      <div
                        className="absolute flex items-center justify-center overflow-hidden"
                        style={{
                          left: `${marginPercent}%`,
                          top: `${marginPercent}%`,
                          right: `${marginPercent}%`,
                          bottom: `${marginPercent}%`,
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={imageName}
                          draggable={false}
                          style={{
                            width: pageFit === 'Fill page' ? '100%' : 'auto',
                            height: pageFit === 'Fill page' ? '100%' : 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: pageFit === 'Fill page' ? 'cover' : 'contain',
                            transform: `rotate(${rotation}deg)`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imageUrl}
                      alt={imageName}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}