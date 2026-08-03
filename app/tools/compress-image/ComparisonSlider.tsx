'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Move, ZoomIn } from 'lucide-react';

interface ComparisonSliderProps {
  originalUrl: string;
  compressedUrl: string;
  originalSize: number;
  compressedSize: number;
  reduction: number;
  filename: string;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function ComparisonSlider({
  originalUrl,
  compressedUrl,
  originalSize,
  compressedSize,
  reduction,
  filename,
  onClose,
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle drag/click to move slider
  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0].clientX);
  };

  // Global mouse/touch move + up handlers
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => updateSliderPosition(clientX);
    
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    
    const handleUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, updateSliderPosition]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSliderPosition((prev) => Math.max(0, prev - 2));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSliderPosition((prev) => Math.min(100, prev + 2));
      } else if (e.key === '0') {
        setSliderPosition(50);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
              Before / After Comparison
            </p>
            <p className="text-[14px] font-semibold truncate">
              {filename}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Comparison Container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden bg-slate-900 select-none aspect-video max-h-[70vh] cursor-ew-resize shadow-2xl"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Compressed Image (Full - background) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={compressedUrl}
              alt="Compressed"
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Original Image (Clipped - overlays from left) */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={originalUrl}
              alt="Original"
              className="max-w-full max-h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_0_20px_rgba(0,0,0,0.3)] pointer-events-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          />

          {/* Draggable Handle */}
          <div
            className="absolute top-1/2 pointer-events-none"
            style={{ 
              left: `${sliderPosition}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <div className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform ${isDragging ? 'scale-110' : ''}`}>
              <Move size={18} className="text-[#0EA5E9] rotate-90" strokeWidth={2.5} />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Original
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/50 backdrop-blur-md text-white/90 text-[11px] font-semibold">
              {formatBytes(originalSize)}
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0EA5E9]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Compressed
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/50 backdrop-blur-md text-white/90 text-[11px] font-semibold">
              {formatBytes(compressedSize)}
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold ml-1">
                -{reduction}%
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-white/70 text-[12px]">
          <div className="inline-flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold">← →</kbd>
            <span>Arrow keys</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold">0</kbd>
            <span>Center</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold">ESC</kbd>
            <span>Close</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Move size={12} className="rotate-90" />
            <span>Drag divider</span>
          </div>
        </div>
      </div>
    </div>
  );
}