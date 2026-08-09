'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Maximize2, ZoomIn, ZoomOut, FileText } from 'lucide-react';
import { getPdfjs } from '../../_utils/pdf';

interface Props {
  isOpen: boolean;
  blob?: Blob | null;
  url?: string | null;
  fileName: string;
  pageCount?: number;
  onClose: () => void;
  onDownload?: () => void;
}

interface PdfDoc {
  numPages: number;
  getPage: (n: number) => Promise<any>;
}

export default function PdfGalleryViewer({
  isOpen,
  blob,
  url,
  fileName,
  pageCount = 1,
  onClose,
  onDownload,
}: Props) {
  const [pdfDoc, setPdfDoc] = useState<PdfDoc | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pageImageUrl, setPageImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const totalPages = pdfDoc?.numPages || pageCount || 1;

  // ═══════════ LOAD PDF ═══════════
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function loadPdf() {
      if (!blob && !url) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const pdfjs = await getPdfjs();

        let data: ArrayBuffer;
        if (blob) {
          data = await blob.arrayBuffer();
        } else if (url) {
          const res = await fetch(url);
          data = await res.arrayBuffer();
        } else {
          throw new Error('No PDF source');
        }

        if (cancelled) return;

        const loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;

        if (cancelled) return;

        setPdfDoc(pdf as unknown as PdfDoc);
        setIsLoading(false);
      } catch (err) {
        console.error('PDF load error:', err);
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [isOpen, blob, url]);

  // ═══════════ RENDER CURRENT PAGE AS IMAGE ═══════════
  useEffect(() => {
    if (!pdfDoc || !isOpen) return;

    let cancelled = false;

async function renderPage() {
  if (!pdfDoc) return;

  try {
    const page = await pdfDoc.getPage(currentPage);
    if (cancelled) return;

    /*
      Render scale reasoning:
        - 1.5 is enough for crisp text at 100% zoom
        - Multiplying by zoom/100 makes zoom actually visible
        - devicePixelRatio removed — it was making the canvas
          physically huge, then CSS was shrinking it back down,
          which is why zoom appeared to do nothing.
    */
    const baseScale = 1.5;
    const scale = baseScale * (zoom / 100);
    const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (cancelled) return;

        // Convert canvas to image URL for smooth display
        const imageUrl = canvas.toDataURL('image/png');

        // Clean up previous image URL
        if (pageImageUrl) URL.revokeObjectURL(pageImageUrl);

        setPageImageUrl(imageUrl);
      } catch (err) {
        console.error('Page render error:', err);
      }
    }

    renderPage();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, zoom, isOpen]);

  // ═══════════ GENERATE THUMBNAILS ═══════════
  useEffect(() => {
    if (!pdfDoc || !isOpen) return;

    let cancelled = false;

    async function generateThumbnails() {
      if (!pdfDoc) return;

      const thumbs: string[] = [];

      for (let i = 1; i <= Math.min(pdfDoc.numPages, 30); i++) {
        try {
          const page = await pdfDoc.getPage(i);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: 0.2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          if (cancelled) return;

          thumbs.push(canvas.toDataURL('image/jpeg', 0.6));
        } catch (err) {
          console.error('Thumbnail error:', err);
        }
      }

      if (!cancelled) setThumbnails(thumbs);
    }

    generateThumbnails();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, isOpen]);

  // ═══════════ NAVIGATION ═══════════
  const goToPrev = useCallback(() => {
    setCurrentPage((p) => (p === 1 ? totalPages : p - 1));
  }, [totalPages]);

  const goToNext = useCallback(() => {
    setCurrentPage((p) => (p === totalPages ? 1 : p + 1));
  }, [totalPages]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(200, z + 25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(50, z - 25));
  }, []);

  // ═══════════ KEYBOARD SHORTCUTS ═══════════
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, goToPrev, goToNext, handleZoomIn, handleZoomOut]);

  // ═══════════ BODY SCROLL LOCK ═══════════
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setZoom(100);
    }
  }, [isOpen]);

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
            className="flex items-center justify-between px-6 py-3.5 bg-black/40 backdrop-blur-sm shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-white min-w-0">
              <span className="text-[13px] font-bold tabular-nums px-3 py-1 rounded-lg bg-white/10">
                {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="text-white/60 shrink-0" />
                <span className="text-[14px] font-semibold truncate">
                  {fileName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom controls */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="w-7 h-7 rounded flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-40 transition-all"
                  title="Zoom out"
                >
                  <ZoomOut size={14} strokeWidth={2} />
                </button>
                <span className="text-[12px] font-semibold text-white tabular-nums min-w-[40px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="w-7 h-7 rounded flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-40 transition-all"
                  title="Zoom in"
                >
                  <ZoomIn size={14} strokeWidth={2} />
                </button>
              </div>

              {/* Download */}
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[13px] font-semibold transition-all"
                >
                  <Download size={14} strokeWidth={2.5} />
                  Download
                </button>
              )}

              {/* Open in new tab */}
              <button
                onClick={() => {
                  if (url) window.open(url, '_blank');
                }}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                title="Open full size"
              >
                <Maximize2 size={14} strokeWidth={2.5} />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                title="Close (Esc)"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

{/* ═══════════ MAIN PAGE AREA ═══════════ */}
{/*
  overflow-auto on this wrapper allows the zoomed page to scroll
  both horizontally and vertically when it exceeds the viewport.
  The prev/next buttons are absolutely positioned so they stay
  fixed on screen while the page scrolls behind them.
*/}
<div
  className="flex-1 relative min-h-0 overflow-auto"
  onClick={(e) => e.stopPropagation()}
>
  {/* Prev button */}
  {totalPages > 1 && (
    <button
      onClick={goToPrev}
      className="fixed left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
      title="Previous page (←)"
    >
      <ChevronLeft size={24} strokeWidth={2.5} />
    </button>
  )}

  {/*
    Inner flex container sized to at least fill the viewport so the
    page is vertically + horizontally centered when zoom <= 100%.
    When zoom > 100% and the image outgrows the container, the outer
    overflow-auto takes over and lets the user scroll around.
  */}
  <div className="min-w-full min-h-full flex items-center justify-center p-8">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="flex items-center justify-center"
      >
        {isLoading ? (
          <div className="bg-white rounded-lg w-[400px] h-[560px] flex items-center justify-center shadow-2xl">
            <div className="animate-pulse space-y-4 w-3/4">
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-200 rounded w-4/6" />
              <div className="h-32 bg-slate-100 rounded mt-6" />
            </div>
          </div>
        ) : pageImageUrl ? (
          /*
            No max-w / max-h on the image — the pdf.js render scale
            already produces a canvas at the correct zoom size, so
            we let the <img> render at its natural pixel dimensions.
            The parent overflow-auto handles anything that exceeds
            the viewport.
          */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pageImageUrl}
            alt={`Page ${currentPage}`}
            className="rounded-lg shadow-2xl bg-white block"
          />
        ) : (
          <div className="text-white/40 text-center">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>Failed to render page</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  </div>

  {/* Next button */}
  {totalPages > 1 && (
    <button
      onClick={goToNext}
      className="fixed right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
      title="Next page (→)"
    >
      <ChevronRight size={24} strokeWidth={2.5} />
    </button>
  )}
</div>

          {/* ═══════════ FOOTER (Page info + thumbnails) ═══════════ */}
          <div
            className="bg-black/40 backdrop-blur-sm border-t border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thumbnails strip */}
            {totalPages > 1 && thumbnails.length > 0 && (
              <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto gallery-scrollbar">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`shrink-0 rounded-md overflow-hidden transition-all ${
                      idx + 1 === currentPage
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105'
                        : 'ring-1 ring-white/20 opacity-60 hover:opacity-100'
                    }`}
                    style={{ width: '48px', height: '64px' }}
                    title={`Page ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb}
                      alt={`Page ${idx + 1}`}
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