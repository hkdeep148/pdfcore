'use client';

import { useRef, useState, useEffect } from 'react';
import { useSignPdfContext } from '../_context/SignPdfContext';
import { INK_COLORS } from '../_utils/signer';

export default function DrawSignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { inkColor, setInkColor, penSize, setPenSize, createDrawnSignature } = useSignPdfContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (high DPI for crisp lines)
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Configure drawing style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
  }, []);

  // Update stroke style when color/size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
  }, [inkColor, penSize]);

  // Get coordinates from mouse or touch
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;
    createDrawnSignature(canvas);
    clearCanvas();
  };

  return (
    <div className="space-y-4">
      {/* Color Selector */}
      <div>
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-2 block">
          Ink Color
        </label>
        <div className="flex items-center gap-2">
          {Object.entries(INK_COLORS).map(([name, color]) => (
            <button
              key={name}
              type="button"
              onClick={() => setInkColor(color)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                inkColor === color
                  ? 'border-[#4F46E5] scale-110 shadow-md'
                  : 'border-[#E5E7EB] hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`${name} color`}
              title={name}
            />
          ))}
        </div>
      </div>

      {/* Pen Size */}
      <div>
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-2 block flex items-center justify-between">
          <span>Pen Thickness</span>
          <span className="text-[11px] text-[#8A93A3]">{penSize}px</span>
        </label>
        <input
          type="range"
          min="1"
          max="6"
          step="0.5"
          value={penSize}
          onChange={(e) => setPenSize(parseFloat(e.target.value))}
          className="w-full accent-[#4F46E5]"
        />
      </div>

      {/* Drawing Canvas */}
      <div>
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-2 block">
          Draw Your Signature
        </label>
        <div className="relative bg-white rounded-xl border-2 border-[#E5E7EB] overflow-hidden">
          {/* Signature line */}
          <div className="absolute left-4 right-4 bottom-8 border-b-2 border-dashed border-[#D1D5DB] pointer-events-none" />
          
          {/* X mark for signature line */}
          <div className="absolute left-4 bottom-6 text-[#9CA3AF] text-[14px] font-bold pointer-events-none">
            ✕
          </div>

          <canvas
            ref={canvasRef}
            className="w-full h-40 cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          {!hasDrawing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[13px] text-[#9CA3AF]">Sign here</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={clearCanvas}
            disabled={!hasDrawing}
            className="flex-1 py-2 rounded-lg border border-[#E5E7EB] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={saveSignature}
            disabled={!hasDrawing}
            className="flex-1 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
}