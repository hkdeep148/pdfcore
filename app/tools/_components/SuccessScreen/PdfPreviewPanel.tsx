'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, FileText, Edit3 } from 'lucide-react';

interface PdfPreviewPanelProps {
  blob?: Blob | null;
  url?: string | null;
  fileName: string;
  pageCount?: number;
}

interface PdfDoc {
  numPages: number;
  getPage: (n: number) => Promise<any>;
}

export default function PdfPreviewPanel({
  blob,
  url,
  fileName,
  pageCount = 1,
}: PdfPreviewPanelProps) {
  const [pdfDoc, setPdfDoc] = useState<PdfDoc | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);

  // ═══════════ LOAD PDF ═══════════
  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!blob && !url) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const pdfjs = await import('pdfjs-dist');

        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = new URL(
            'pdfjs-dist/build/pdf.worker.min.mjs',
            import.meta.url
          ).toString();
        }

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
        if (!cancelled) {
          setError('Failed to load PDF preview');
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [blob, url]);

// ═══════════ TRACK CONTAINER SIZE ═══════════
const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
  width: 0,
  height: 0,
});
const previewContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!previewContainerRef.current) return;

  const updateSize = () => {
    if (previewContainerRef.current) {
      setContainerSize({
        width: previewContainerRef.current.clientWidth,
        height: previewContainerRef.current.clientHeight,
      });
    }
  };

  // Initial measurement
  updateSize();

  // Watch for size changes
  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(previewContainerRef.current);

  return () => resizeObserver.disconnect();
}, []);

// ═══════════ RENDER MAIN PAGE ═══════════
useEffect(() => {
  if (!pdfDoc || !mainCanvasRef.current) return;
  // ⭐ Wait for container to be measured
  if (containerSize.width === 0 || containerSize.height === 0) return;

  let cancelled = false;

  async function renderPage() {
    if (!pdfDoc || !mainCanvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(currentPage);
      if (cancelled || !mainCanvasRef.current) return;

      // ⭐ Use measured container size (always accurate now)
      const containerPadding = 32; // 16px padding * 2 sides
      const availableWidth = containerSize.width - containerPadding;
      const availableHeight = containerSize.height - containerPadding;

      const baseViewport = page.getViewport({ scale: 1 });

      // ⭐ Fit to smaller dimension
      const scaleByWidth = availableWidth / baseViewport.width;
      const scaleByHeight = availableHeight / baseViewport.height;
      const fitScale = Math.min(scaleByWidth, scaleByHeight);

      const dpr = window.devicePixelRatio || 1;
      const finalScale = fitScale * (zoom / 100) * dpr;

      const viewport = page.getViewport({ scale: finalScale });

      const canvas = mainCanvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const displayWidth = viewport.width / dpr;
      const displayHeight = viewport.height / dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    } catch (err) {
      console.error('Render error:', err);
    }
  }

  renderPage();

  return () => {
    cancelled = true;
  };
}, [pdfDoc, currentPage, zoom, containerSize]); // ⭐ Re-render when container size changes

  useEffect(() => {
    const handleResize = () => {
      setZoom((z) => z);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ═══════════ GENERATE THUMBNAILS ═══════════
  useEffect(() => {
    if (!pdfDoc) return;

    let cancelled = false;

    async function generateThumbnails() {
      if (!pdfDoc) return;

      const totalPages = pdfDoc.numPages;
      const thumbs: string[] = [];

      for (let i = 1; i <= Math.min(totalPages, 20); i++) {
        try {
          const page = await pdfDoc.getPage(i);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: 0.28 });
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

          thumbs.push(canvas.toDataURL('image/png'));
        } catch (err) {
          console.error('Thumbnail error:', err);
        }
      }

      if (!cancelled) {
        setThumbnails(thumbs);
      }
    }

    generateThumbnails();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    if (!pdfDoc) return;
    setCurrentPage((p) => Math.min(pdfDoc.numPages, p + 1));
  }, [pdfDoc]);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(200, z + 25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(50, z - 25));
  }, []);

  const openFullscreen = useCallback(() => {
    if (url) {
      window.open(url, '_blank');
    }
  }, [url]);

  const totalPages = pdfDoc?.numPages || pageCount || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden flex flex-col h-full"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(99, 102, 241, 0.08)',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      {/* ═══════════ ⭐ SUBTLE RADIAL GLOW BACKGROUND ═══════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top, rgba(99, 102, 241, 0.08), transparent 1%)',
        }}
      />

      {/* ═══════════ HEADER ═══════════ */}
      <div
        className="relative flex items-center justify-between shrink-0"
        style={{
          background: '#ffffff',
          padding: '18px 24px',
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* File icon — light lavender rounded square */}
          <div
            className="w-8 h-8 flex items-center justify-center shrink-0"
            style={{
              background: '#EEF2FF',
              borderRadius: '10px',
            }}
          >
            <FileText size={15} style={{ color: '#6366F1' }} strokeWidth={2} />
          </div>

          {/* Filename */}
          <span
            className="truncate"
            style={{
              fontWeight: 600,
              fontSize: '15px',
              color: '#111827',
            }}
          >
            {fileName}
          </span>

          {/* Edit button */}
          <button
            className="transition-all duration-200 p-1 rounded hover:bg-[#EEF2FF]"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#6366F1')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
            title="Rename"
          >
            <Edit3 size={13} />
          </button>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Page counter */}
          <span
            className="tabular-nums px-1"
            style={{
              fontWeight: 600,
              fontSize: '13px',
              color: '#374151',
            }}
          >
            {currentPage} / {totalPages}
          </span>

          {/* Prev button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(99, 102, 241, 0.12)',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => {
              if (currentPage > 1) {
                e.currentTarget.style.background = '#EEF2FF';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.color = '#4F46E5';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.color = '#6B7280';
            }}
          >
            <ChevronLeft size={14} style={{ color: '#6B7280' }} strokeWidth={2.2} />
          </button>

          {/* Next button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(99, 102, 241, 0.12)',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => {
              if (currentPage < totalPages) {
                e.currentTarget.style.background = '#EEF2FF';
                const svg = e.currentTarget.querySelector('svg');
                if (svg) svg.style.color = '#4F46E5';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.color = '#6B7280';
            }}
          >
            <ChevronRight size={14} style={{ color: '#6B7280' }} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* ═══════════ MAIN PREVIEW AREA ═══════════ */}
      <div
        ref={previewAreaRef}
        className="relative flex flex- min-h-0 overflow-hidden gap-4 p-4"
      >
        {/* Left: Thumbnails sidebar (floating card look) */}
        <div
          className="overflow-y-auto py-5 px-3 flex flex-col items-center gap-3 shrink-0 premium-scrollbar"
          style={{
            width: '110px',
            background: '#FAFAFC',
            border: '1px solid rgba(99, 102, 241, 0.06)',
            borderRadius: '20px',
          }}
        >
          {isLoading && !thumbnails.length && (
            <ThumbnailSkeleton count={Math.min(4, totalPages)} />
          )}
          {thumbnails.map((thumb, idx) => {
            const isActive = currentPage === idx + 1;
            return (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className="relative flex flex-col items-center gap-1.5 transition-all duration-200 group"
                style={{
                  transform: isActive ? 'none' : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{
                    width: '76px',
                    borderRadius: '12px',
                    background: isActive ? '#EEF2FF' : '#FFFFFF',
                    border: isActive
                      ? '2px solid #6366F1'
                      : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(99, 102, 241, 0.08)'
                      : '0 2px 8px rgba(15, 23, 42, 0.04)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-auto block"
                    style={{
                      padding: isActive ? '2px' : '0',
                      borderRadius: '10px',
                    }}
                  />
                </div>
                <span
                  className="tabular-nums transition-colors duration-200"
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#4F46E5' : '#6B7280',
                  }}
                >
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

{/* Right: Main preview */}
<div
  ref={previewContainerRef}  // ⭐ ADD THIS
  className={`relative flex-1 flex items-center justify-center ${
    zoom > 100 ? 'overflow-auto premium-scrollbar' : 'overflow-hidden'
  }`}
  style={{
    background: '#F8FAFC',
    borderRadius: '20px',
    boxShadow: 'inset 0 1px 3px rgba(15, 23, 42, 0.04)',
    padding: '16px',
  }}
>
  {isLoading ? (
    <PreviewSkeleton />
  ) : error ? (
    <div className="text-center self-center" style={{ color: '#6B7280' }}>
      <FileText size={40} className="mx-auto mb-2 opacity-30" />
      <p className="text-sm">{error}</p>
    </div>
  ) : (
    <div
      className="overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
      }}
    >
      <canvas ref={mainCanvasRef} className="block" />
    </div>
  )}
</div>
      </div>

      {/* ═══════════ BOTTOM TOOLBAR (floating pill) ═══════════ */}
      <div className="relative flex items-center justify-center py-4 shrink-0">
        <div
          className="flex items-center gap-2"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(99, 102, 241, 0.08)',
            borderRadius: '999px',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
            padding: '8px 14px',
          }}
        >
          {/* Zoom Out */}
          <ToolbarButton onClick={handleZoomOut} disabled={zoom <= 50} title="Zoom out">
            <ZoomOut size={14} strokeWidth={2.2} />
          </ToolbarButton>

          {/* Zoom percentage badge */}
          <div
            className="tabular-nums text-center"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(99, 102, 241, 0.08)',
              borderRadius: '999px',
              padding: '6px 16px',
              fontWeight: 600,
              fontSize: '12.5px',
              color: '#111827',
              minWidth: '68px',
            }}
          >
            {zoom}%
          </div>

          {/* Zoom In */}
          <ToolbarButton onClick={handleZoomIn} disabled={zoom >= 200} title="Zoom in">
            <ZoomIn size={14} strokeWidth={2.2} />
          </ToolbarButton>

          {/* Divider */}
          <div
            className="mx-1"
            style={{
              width: '1px',
              height: '20px',
              background: 'rgba(99, 102, 241, 0.12)',
            }}
          />

          {/* Fullscreen */}
          <ToolbarButton onClick={openFullscreen} title="Open fullscreen">
            <Maximize2 size={13} strokeWidth={2.2} />
          </ToolbarButton>
        </div>
      </div>

      {/* ═══════════ PREMIUM SCROLLBAR STYLES ═══════════ */}
      <style jsx>{`
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.18);
          border-radius: 999px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOOLBAR BUTTON (reusable)
// ═══════════════════════════════════════════════════════════════
function ToolbarButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        width: '32px',
        height: '32px',
        background: '#FFFFFF',
        borderRadius: '999px',
        color: '#6B7280',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = '#EEF2FF';
          e.currentTarget.style.color = '#4F46E5';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#FFFFFF';
        e.currentTarget.style.color = '#6B7280';
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// SKELETONS
// ═══════════════════════════════════════════════════════════════
function ThumbnailSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div
            className="animate-pulse"
            style={{
              width: '76px',
              height: '98px',
              background: 'linear-gradient(135deg, rgba(226,232,240,0.6), rgba(241,245,249,0.6))',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          />
          <div
            className="animate-pulse"
            style={{
              width: '14px',
              height: '8px',
              background: 'rgba(226, 232, 240, 0.6)',
              borderRadius: '4px',
            }}
          />
        </div>
      ))}
    </>
  );
}

function PreviewSkeleton() {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '300px',
        height: '400px',
        background: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="animate-pulse space-y-4 w-3/4">
        <div
          style={{
            height: '20px',
            background: 'linear-gradient(90deg, #E2E8F0, #F1F5F9)',
            borderRadius: '4px',
            width: '75%',
          }}
        />
        <div
          style={{
            height: '12px',
            background: 'linear-gradient(90deg, #E2E8F0, #F1F5F9)',
            borderRadius: '4px',
            width: '100%',
          }}
        />
        <div
          style={{
            height: '12px',
            background: 'linear-gradient(90deg, #E2E8F0, #F1F5F9)',
            borderRadius: '4px',
            width: '85%',
          }}
        />
        <div
          style={{
            height: '12px',
            background: 'linear-gradient(90deg, #E2E8F0, #F1F5F9)',
            borderRadius: '4px',
            width: '65%',
          }}
        />
        <div
          style={{
            height: '128px',
            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
            borderRadius: '8px',
            marginTop: '24px',
          }}
        />
      </div>
    </div>
  );
}