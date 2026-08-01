'use client';

import { FONT_SIZES } from '../_utils/watermarker';
import type { WatermarkPosition, WatermarkSize } from '../../_types';

interface WatermarkPageCardProps {
  id: string;
  preview: string;
  pageIndex: number;
  hasWatermark: boolean;
  settings: {
    text: string;
    fontSize: WatermarkSize;
    color: string;
    opacity: number;
    rotation: number;
    position: WatermarkPosition;
  };
  pageWidth: number;
  pageHeight: number;
}

export default function WatermarkPageCard({
  preview,
  pageIndex,
  hasWatermark,
  settings,
  pageWidth,
  pageHeight,
}: WatermarkPageCardProps) {
  const isEmpty = !settings.text.trim();
  const showWatermark = hasWatermark && !isEmpty;

  return (
    <div className="select-none w-full">
      <div
        className={`relative bg-white rounded-xl border-2 p-2 group transition-all ${
          hasWatermark
            ? 'border-[#ECEDF3] shadow-[0_4px_14px_rgba(20,30,60,0.06)] hover:border-[#D1D5FF] hover:shadow-[0_8px_20px_-4px_rgba(20,30,60,0.15)]'
            : 'border-[#ECEDF3] opacity-50 hover:opacity-70'
        }`}
      >
        {/* Page number badge (top-left) */}
        <div
          className={`absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-md pointer-events-none ${
            hasWatermark ? 'bg-[#4F46E5]' : 'bg-[#94A3B8]'
          }`}
        >
          {pageIndex + 1}
        </div>

        {/* Status badge (top-right) */}
        {showWatermark && (
          <div className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shadow-md pointer-events-none">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {!hasWatermark && (
          <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-full bg-[#94A3B8] text-white text-[9px] font-bold shadow-sm pointer-events-none">
            Skipped
          </div>
        )}

        {/* Preview area */}
        <div
          className="relative w-full bg-[#F5F5FA] rounded overflow-hidden mt-3"
          style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}
        >
          {/* Page image */}
          <img
            src={preview}
            alt={`Page ${pageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Accurate watermark overlay */}
          {showWatermark && (
            <AccurateWatermarkOverlay
              text={settings.text}
              fontSize={FONT_SIZES[settings.fontSize]}
              color={settings.color}
              opacity={settings.opacity}
              rotation={settings.rotation}
              position={settings.position}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
            />
          )}

          {/* Skipped overlay */}
          {!hasWatermark && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] pointer-events-none">
              <span className="text-[10px] font-bold text-[#6B7280] bg-white px-2 py-1 rounded shadow-sm border border-[#E8EDF5]">
                No watermark
              </span>
            </div>
          )}
        </div>

        {/* Page label footer */}
        <div className="mt-2 flex items-center justify-center h-7">
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
              showWatermark
                ? 'bg-[#EEF2FF] text-[#4F46E5]'
                : 'bg-[#F1F5F9] text-[#5B6472]'
            }`}
          >
            Page {pageIndex + 1}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ HELVETICA-BOLD METRICS (matches pdf-lib) ============

const HELVETICA_BOLD_WIDTHS: Record<string, number> = {
  ' ': 0.278, '!': 0.333, '"': 0.474, '#': 0.556, '$': 0.556,
  '%': 0.889, '&': 0.722, "'": 0.238, '(': 0.333, ')': 0.333,
  '*': 0.389, '+': 0.584, ',': 0.278, '-': 0.333, '.': 0.278,
  '/': 0.278,
  '0': 0.556, '1': 0.556, '2': 0.556, '3': 0.556, '4': 0.556,
  '5': 0.556, '6': 0.556, '7': 0.556, '8': 0.556, '9': 0.556,
  ':': 0.333, ';': 0.333, '<': 0.584, '=': 0.584, '>': 0.584,
  '?': 0.611, '@': 0.975,
  'A': 0.722, 'B': 0.722, 'C': 0.722, 'D': 0.722, 'E': 0.667,
  'F': 0.611, 'G': 0.778, 'H': 0.722, 'I': 0.278, 'J': 0.556,
  'K': 0.722, 'L': 0.611, 'M': 0.833, 'N': 0.722, 'O': 0.778,
  'P': 0.667, 'Q': 0.778, 'R': 0.722, 'S': 0.667, 'T': 0.611,
  'U': 0.722, 'V': 0.667, 'W': 0.944, 'X': 0.667, 'Y': 0.667,
  'Z': 0.611,
  '[': 0.333, '\\': 0.278, ']': 0.333, '^': 0.584, '_': 0.556,
  '`': 0.333,
  'a': 0.556, 'b': 0.611, 'c': 0.556, 'd': 0.611, 'e': 0.556,
  'f': 0.333, 'g': 0.611, 'h': 0.611, 'i': 0.278, 'j': 0.278,
  'k': 0.556, 'l': 0.278, 'm': 0.889, 'n': 0.611, 'o': 0.611,
  'p': 0.611, 'q': 0.611, 'r': 0.389, 's': 0.556, 't': 0.333,
  'u': 0.611, 'v': 0.556, 'w': 0.778, 'x': 0.556, 'y': 0.556,
  'z': 0.500,
  '{': 0.389, '|': 0.280, '}': 0.389, '~': 0.584,
};

function calculateHelveticaBoldWidth(text: string, fontSize: number): number {
  let width = 0;
  for (const char of text) {
    const charWidth = HELVETICA_BOLD_WIDTHS[char] ?? 0.556;
    width += charWidth;
  }
  return width * fontSize;
}

function calculateHelveticaBoldHeight(fontSize: number): number {
  return fontSize * 0.718;
}

// ============ SVG WATERMARK OVERLAY (matches PDF exactly) ============

interface AccurateWatermarkOverlayProps {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number;
  position: WatermarkPosition;
  pageWidth: number;
  pageHeight: number;
}

function AccurateWatermarkOverlay({
  text,
  fontSize,
  color,
  opacity,
  rotation,
  position,
  pageWidth,
  pageHeight,
}: AccurateWatermarkOverlayProps) {
  const margin = 40;

  const textWidth = calculateHelveticaBoldWidth(text, fontSize);
  const textHeight = calculateHelveticaBoldHeight(fontSize);

  let centerX: number;
  if (position.includes('left')) {
    centerX = margin + textWidth / 2;
  } else if (position.includes('right')) {
    centerX = pageWidth - margin - textWidth / 2;
  } else {
    centerX = pageWidth / 2;
  }

  let pdfCenterY: number;
  if (position.includes('top')) {
    pdfCenterY = pageHeight - margin - textHeight / 2;
  } else if (position.includes('bottom')) {
    pdfCenterY = margin + textHeight / 2;
  } else {
    pdfCenterY = pageHeight / 2;
  }

  const svgCenterY = pageHeight - pdfCenterY;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${pageWidth} ${pageHeight}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x={centerX}
        y={svgCenterY}
        fontSize={fontSize}
        fill={color}
        fillOpacity={opacity}
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${-rotation}, ${centerX}, ${svgCenterY})`}
      >
        {text}
      </text>
    </svg>
  );
}