'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, ImageIcon } from 'lucide-react';

interface ImagePreviewPanelProps {
  images: Array<{ url: string; name: string }>;
  fileName: string;
}

export default function ImagePreviewPanel({ images, fileName }: ImagePreviewPanelProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const totalImages = images.length;
  const currentImage = images[currentIdx];

  const goToPrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const goToNext = () => setCurrentIdx((i) => Math.min(totalImages - 1, i + 1));

  const openFullscreen = () => {
    if (currentImage?.url) window.open(currentImage.url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <ImageIcon size={16} className="text-slate-500 shrink-0" />
          <span className="text-[13.5px] font-semibold text-slate-800 truncate">
            {fileName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12.5px] text-slate-500 tabular-nums font-medium">
            {currentIdx + 1} / {totalImages}
          </span>
          <button
            onClick={goToPrev}
            disabled={currentIdx <= 0}
            className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center transition-all"
          >
            <ChevronLeft size={14} className="text-slate-600" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIdx >= totalImages - 1}
            className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center transition-all"
          >
            <ChevronRight size={14} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main preview area */}
      <div className="flex bg-slate-50 flex-1 min-h-0">
        {/* Thumbnails sidebar */}
        <div className="w-[110px] bg-white/40 border-r border-slate-100 overflow-y-auto py-4 flex flex-col items-center gap-3 custom-scrollbar shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`relative flex flex-col items-center gap-1 transition-all ${
                currentIdx === idx ? 'scale-105' : 'hover:scale-105'
              }`}
            >
              <div
                className={`w-[74px] h-[74px] rounded-md overflow-hidden bg-white shadow-sm ${
                  currentIdx === idx
                    ? 'ring-2 ring-indigo-500 shadow-md'
                    : 'ring-1 ring-slate-200'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  currentIdx === idx ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {idx + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6">
          {currentImage && (
            <div className="bg-white shadow-lg rounded-md overflow-hidden max-w-full max-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage.url}
                alt={currentImage.name}
                className="max-w-full max-h-[500px] block object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-slate-100 bg-white shrink-0">
        <button
          onClick={openFullscreen}
          className="w-8 h-8 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all"
          title="Open full size"
        >
          <Maximize2 size={14} className="text-slate-600" />
        </button>
      </div>
    </motion.div>
  );
}