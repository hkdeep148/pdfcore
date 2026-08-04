'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { Minus } from 'lucide-react';

export interface CarouselItem {
  id: string;
  /** Optional custom aspect ratio (width / height). Falls back to prop.aspectRatio */
  aspectRatio?: number;
}

interface MobilePageCarouselProps<T extends CarouselItem> {
  /** Array of items (pages/images) to display */
  items: T[];
  /** Currently active index */
  currentIndex: number;
  /** Called when active index changes (swipe) */
  onIndexChange: (index: number) => void;
  /** Render the main page content (image, PDF thumbnail, etc.) */
  renderPage: (item: T, isActive: boolean) => ReactNode;
  /** Optional overlay rendered ON TOP of each page (e.g., signatures) */
  renderOverlay?: (item: T, isActive: boolean) => ReactNode;
  /** Optional callback to remove active item (shows red minus button) */
  onRemove?: (item: T) => void;
  /** Optional double-tap handler (e.g., enter reorder mode) */
  onDoubleTap?: () => void;
  /** Default aspect ratio (width/height) if item doesn't specify one. Default: 3/5 */
  defaultAspectRatio?: number;
  /** Disable page swiping (e.g., while dragging signatures). Default: false */
  disableSwipe?: boolean;
  /** Show page indicator (e.g., "1 / 5"). Default: true */
  showPageIndicator?: boolean;
  /** Ref to the currently active page container (for measurements) */
  activePageRef?: React.RefObject<HTMLDivElement | null>;
}

export default function MobilePageCarousel<T extends CarouselItem>({
  items,
  currentIndex,
  onIndexChange,
  renderPage,
  renderOverlay,
  onRemove,
  onDoubleTap,
  defaultAspectRatio = 3 / 5,
  disableSwipe = false,
  showPageIndicator = true,
  activePageRef,
}: MobilePageCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const lastTouchX = useRef(0);
  const velocity = useRef(0);

  const safeIndex = Math.min(currentIndex, Math.max(0, items.length - 1));
  const activeItem = items[safeIndex];
  const activeAspect = activeItem?.aspectRatio ?? defaultAspectRatio;

  // Track container size
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

  // Card sizing calculations
  const maxCardHeight = containerSize.height * 0.9;
  const maxCardWidth = containerSize.width * 0.75;
  const heightBasedWidth = maxCardHeight * activeAspect;
  const cardWidth = Math.min(maxCardWidth, heightBasedWidth);
  const cardHeight = cardWidth / activeAspect;
  const cardGap = 20;

  const containerCenter = containerSize.width / 2;
  const activeCardLeft = containerCenter - cardWidth / 2;
  const cardSpacing = cardWidth + cardGap;
  const trackOffset = activeCardLeft - safeIndex * cardSpacing;

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disableSwipe || e.touches.length > 1) return;
    touchStartX.current = e.touches[0].clientX;
    lastTouchX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    velocity.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disableSwipe || e.touches.length > 1 || !isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    velocity.current = currentX - lastTouchX.current;
    lastTouchX.current = currentX;

    let offset = diff;
    if (safeIndex === 0 && diff > 0) offset = diff * 0.3;
    else if (safeIndex === items.length - 1 && diff < 0) offset = diff * 0.3;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging || disableSwipe) {
      setIsDragging(false);
      return;
    }
    const distance = dragOffset;
    const elapsed = Date.now() - touchStartTime.current;
    const swipeVelocity = Math.abs(velocity.current);
    const threshold = cardWidth * 0.25;
    const isQuickSwipe = swipeVelocity > 8 && elapsed < 300;

    if (
      (distance < -threshold || (isQuickSwipe && distance < -20)) &&
      safeIndex < items.length - 1
    ) {
      onIndexChange(safeIndex + 1);
    } else if (
      (distance > threshold || (isQuickSwipe && distance > 20)) &&
      safeIndex > 0
    ) {
      onIndexChange(safeIndex - 1);
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  if (items.length === 0 || containerSize.width === 0) {
    return <div ref={containerRef} className="w-full h-full" />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={onDoubleTap}
    >
      {/* Sliding Track */}
      <div
        className="flex items-center absolute"
        style={{
          top: '50%',
          left: 0,
          transform: `translate(${trackOffset + dragOffset}px, -50%)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          gap: `${cardGap}px`,
          willChange: 'transform',
        }}
      >
        {items.map((item, index) => {
          const distance = Math.abs(index - safeIndex);
          const isActive = index === safeIndex;
          const cardScale = isActive ? 1 : Math.max(0.9, 1 - distance * 0.05);
          const cardOpacity = isActive ? 1 : Math.max(0.6, 1 - distance * 0.2);
          const itemAspect = item.aspectRatio ?? defaultAspectRatio;

          return (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
              }}
            >
              <div
  className="relative w-full h-full"
  style={{
    transform: `scale(${cardScale})`,
    opacity: cardOpacity,
    transition: 'transform 0.4s ease, opacity 0.4s ease',
  }}
>
  {/* Page Container — A4 paper card with margin */}
<div
  ref={isActive ? activePageRef : undefined}
  className={`
    relative w-full h-full bg-white overflow-hidden
    rounded-[10px] p-4
    ${isActive
      ? 'shadow-[0_10px_35px_-8px_rgba(15,23,42,0.18),0_2px_6px_-2px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]'
      : 'shadow-[0_4px_18px_-6px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.03]'
    }
  `}
  style={{
    aspectRatio: `${itemAspect}`,
  }}
>
  {/* Inner content area (with margin from paper edge) */}
  <div className="relative w-full h-full">
    {/* Main page content (slot) */}
    {renderPage(item, isActive)}

    {/* Overlay slot (e.g., signatures) */}
    {renderOverlay && renderOverlay(item, isActive)}
  </div>
</div>

                {/* Red Minus Remove Button */}
                {isActive && onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item);
                    }}
                    className="absolute -top-2 -left-2 w-7 h-7 bg-[#FF3B30] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(255,59,48,0.4)] active:scale-90 transition-transform z-30"
                    aria-label="Remove page"
                  >
                    <Minus className="w-4 h-4 text-white" strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Indicator */}
      {showPageIndicator && items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[12px] font-medium px-3 py-1 rounded-full z-20 pointer-events-none">
          {safeIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
}