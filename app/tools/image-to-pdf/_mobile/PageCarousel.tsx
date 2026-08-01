'use client';

import { useRef, useState, useEffect } from 'react';
import { Minus } from 'lucide-react';
import { useImageToPdfContext } from '../_context/ImageToPdfContext';
import type { ImageItem } from '../../_types';

interface Props {
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onEnterReorderMode: () => void;
}

export default function PageCarousel({
  currentPageIndex,
  onPageChange,
  onEnterReorderMode,
}: Props) {
  const { images, removeImage } = useImageToPdfContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const lastTouchX = useRef(0);
  const velocity = useRef(0);

  const safeIndex = Math.min(currentPageIndex, Math.max(0, images.length - 1));

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Card sizing
  const maxCardHeight = containerSize.height * 0.9;
  const maxCardWidth = containerSize.width * 0.75;
  const heightBasedWidth = maxCardHeight * (3 / 5);
  const cardWidth = Math.min(maxCardWidth, heightBasedWidth);
  const cardHeight = cardWidth * (5 / 3);
  const cardGap = 20;
  
  // ✅ Center of container
  const containerCenter = containerSize.width / 2;
  // ✅ Where the active card SHOULD be (centered)
  const activeCardLeft = containerCenter - cardWidth / 2;
  // ✅ Each card takes (cardWidth + gap) horizontal space
  const cardSpacing = cardWidth + cardGap;
  // ✅ Offset to shift track so active card is centered
  const trackOffset = activeCardLeft - safeIndex * cardSpacing;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1 || isZooming) return;
    touchStartX.current = e.touches[0].clientX;
    lastTouchX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    velocity.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1 || isZooming || !isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;

    velocity.current = currentX - lastTouchX.current;
    lastTouchX.current = currentX;

    let offset = diff;
    if (safeIndex === 0 && diff > 0) {
      offset = diff * 0.3;
    } else if (safeIndex === images.length - 1 && diff < 0) {
      offset = diff * 0.3;
    }

    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isZooming) {
      setIsDragging(false);
      return;
    }

    const distance = dragOffset;
    const elapsed = Date.now() - touchStartTime.current;
    const swipeVelocity = Math.abs(velocity.current);

    const threshold = cardWidth * 0.25;
    const isQuickSwipe = swipeVelocity > 8 && elapsed < 300;

    if ((distance < -threshold || (isQuickSwipe && distance < -20)) && safeIndex < images.length - 1) {
      onPageChange(safeIndex + 1);
    } else if ((distance > threshold || (isQuickSwipe && distance > 20)) && safeIndex > 0) {
      onPageChange(safeIndex - 1);
    }

    setDragOffset(0);
    setIsDragging(false);
  };

  if (images.length === 0 || containerSize.width === 0) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={onEnterReorderMode}
    >
            {/* Sliding Track */}
      <div
        className="flex items-center absolute"
        style={{
          top: '50%',
          left: 0,
          transform: `translate(${trackOffset + dragOffset}px, -50%)`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          gap: `${cardGap}px`,
          willChange: 'transform',
        }}
      >
        {images.map((image, index) => {
          const distance = Math.abs(index - safeIndex);
          const isActive = index === safeIndex;

          return (
            <div
              key={image.id}
              className="flex-shrink-0"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
              }}
            >
              <ImagePreviewCard
                image={image}
                isActive={isActive}
                onRemove={isActive ? () => removeImage(image.id) : undefined}
                onZoomChange={isActive ? setIsZooming : undefined}
                distance={distance}
              />
            </div>
          );
        })}
      </div>

      {/* Page Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[12px] font-medium px-3 py-1 rounded-full z-20 pointer-events-none">
        {safeIndex + 1} / {images.length}
      </div>
    </div>
  );
}

/* ============ IMAGE PREVIEW CARD ============ */

interface CardProps {
  image: ImageItem;
  isActive?: boolean;
  onRemove?: () => void;
  onZoomChange?: (isZooming: boolean) => void;
  distance?: number;
}

function ImagePreviewCard({
  image,
  isActive = false,
  onRemove,
  onZoomChange,
  distance = 0,
}: CardProps) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDistance = useRef(0);
  const lastTouchCenter = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  useEffect(() => {
    if (!isActive && scale !== 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [isActive, scale]);

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touches: React.TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.stopPropagation();
      lastDistance.current = getDistance(e.touches);
      lastTouchCenter.current = getCenter(e.touches);
      onZoomChange?.(true);
    } else if (e.touches.length === 1 && scale > 1) {
      e.stopPropagation();
      isPanning.current = true;
      lastTouchCenter.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      onZoomChange?.(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.stopPropagation();
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const delta = newDistance / lastDistance.current;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * delta));
      setScale(newScale);
      lastDistance.current = newDistance;

      if (newScale <= 1) {
  setTranslate({ x: 0, y: 0 });
}
    } else if (e.touches.length === 1 && isPanning.current && scale > 1) {
      e.stopPropagation();
      e.preventDefault();
      const dx = e.touches[0].clientX - lastTouchCenter.current.x;
      const dy = e.touches[0].clientY - lastTouchCenter.current.y;

      const maxTranslate = 100 * (scale - 1);
      setTranslate((prev) => ({
        x: Math.max(-maxTranslate, Math.min(maxTranslate, prev.x + dx)),
        y: Math.max(-maxTranslate, Math.min(maxTranslate, prev.y + dy)),
      }));

      lastTouchCenter.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      isPanning.current = false;
      setTimeout(() => onZoomChange?.(false), 100);
    }
  };

  const handleDoubleTap = () => {
  if (scale !== 1) {
    // Reset to normal from any zoom level (in or out)
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  } else {
    setScale(2);
  }
};

  const cardScale = isActive ? 1 : Math.max(0.9, 1 - distance * 0.05);
  const cardOpacity = isActive ? 1 : Math.max(0.6, 1 - distance * 0.2);

  return (
    <div
      className="relative w-full h-full"
      style={{
        transform: `scale(${cardScale})`,
        opacity: cardOpacity,
        transition: 'transform 0.4s ease, opacity 0.4s ease',
      }}
    >
      {/* Outer Card - 3:5 Frame */}
      <div
        className={`bg-white rounded-[20px] overflow-hidden flex items-center justify-center p-4 w-full h-full ${
          isActive
            ? 'shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
            : 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Inner A4 Page */}
        <div
          className="bg-white overflow-hidden rounded-[8px] border border-[#EEEEEE] relative"
          style={{
            height: '100%',
            aspectRatio: '1 / 1.4142',
            maxWidth: '100%',
            touchAction: isActive && scale > 1 ? 'none' : 'auto',
          }}
          onTouchStart={isActive ? handleTouchStart : undefined}
          onTouchMove={isActive ? handleTouchMove : undefined}
          onTouchEnd={isActive ? handleTouchEnd : undefined}
          onDoubleClick={isActive ? handleDoubleTap : undefined}
        >
          <img
            src={image.preview}
            alt=""
            className="w-full h-full object-contain bg-white select-none"
            draggable={false}
            style={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale}) rotate(${image.rotation}deg)`,
              transition: isPanning.current ? 'none' : 'transform 0.2s ease',
              transformOrigin: 'center',
            }}
          />
        </div>
      </div>

      {/* Red Minus Button */}
      {isActive && onRemove && scale === 1 && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -left-2 w-7 h-7 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(255,59,48,0.4)] active:scale-90 transition-transform z-30"
          aria-label="Remove page"
        >
          <Minus className="w-4 h-4 text-white" strokeWidth={3} />
        </button>
      )}

      {/* Zoom Indicator */}
      {isActive && scale > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-full z-30">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}