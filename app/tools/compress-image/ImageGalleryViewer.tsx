'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';

export interface GalleryImage {
  id: string;
  name: string;
  url: string;              // Compressed image URL (blob URL)
  originalUrl?: string;      // Original image URL for comparison
  originalSize?: string;
  compressedSize?: string;
  reductionPercent?: number;
  onDownload?: () => void;
}

interface Props {
  isOpen: boolean;
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageGalleryViewer({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  const total = images.length;
  const currentImage = images[currentIdx];

  // Reset to initial index when opening
  useEffect(() => {
    if (isOpen) setCurrentIdx(initialIndex);
  }, [isOpen, initialIndex]);

  // Navigation
  const goToPrev = useCallback(() => {
    setCurrentIdx((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const goToNext = useCallback(() => {
    setCurrentIdx((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, goToPrev, goToNext]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col"
          onClick={onClose}
        >
          {/* ═══════════ HEADER ═══════════ */}
          <div
            className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-white min-w-0">
              <span className="text-[13px] font-bold tabular-nums px-3 py-1 rounded-lg bg-white/10">
                {currentIdx + 1} / {total}
              </span>
              <span className="text-[14px] font-semibold truncate">
                {currentImage.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentImage.onDownload && (
                <button
                  onClick={currentImage.onDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[13px] font-semibold transition-all"
                >
                  <Download size={14} strokeWidth={2.5} />
                  Download
                </button>
              )}

              <button
                onClick={() => window.open(currentImage.url, '_blank')}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                title="Open full size"
              >
                <Maximize2 size={14} strokeWidth={2.5} />
              </button>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                title="Close (Esc)"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ═══════════ MAIN IMAGE AREA ═══════════ */}
          <div
            className="flex-1 flex items-center justify-center p-8 relative min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev button */}
            {total > 1 && (
              <button
                onClick={goToPrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
                title="Previous (←)"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.url}
                  alt={currentImage.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 200px)' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Next button */}
            {total > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
                title="Next (→)"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* ═══════════ FOOTER (info + thumbnails) ═══════════ */}
          <div
            className="bg-black/40 backdrop-blur-sm border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* File info bar */}
            {(currentImage.originalSize || currentImage.compressedSize) && (
              <div className="px-6 py-3 flex items-center justify-center gap-6 text-white">
                {currentImage.originalSize && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/60 uppercase tracking-wider font-bold">
                      Original
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums line-through text-white/60">
                      {currentImage.originalSize}
                    </span>
                  </div>
                )}
                {currentImage.compressedSize && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-bold">
                      Compressed
                    </span>
                    <span className="text-[13px] font-bold tabular-nums text-emerald-400">
                      {currentImage.compressedSize}
                    </span>
                  </div>
                )}
                {currentImage.reductionPercent !== undefined && currentImage.reductionPercent > 0 && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    -{currentImage.reductionPercent}%
                  </span>
                )}
              </div>
            )}

            {/* Thumbnails strip */}
            {total > 1 && (
              <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto gallery-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`shrink-0 rounded-md overflow-hidden transition-all ${
                      idx === currentIdx
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                        : 'ring-1 ring-white/20 opacity-60 hover:opacity-100'
                    }`}
                    style={{ width: '56px', height: '56px' }}
                    title={img.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom scrollbar */}
          <style jsx>{`
            .gallery-scrollbar::-webkit-scrollbar {
              height: 4px;
            }
            .gallery-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .gallery-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 999px;
            }
            .gallery-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}