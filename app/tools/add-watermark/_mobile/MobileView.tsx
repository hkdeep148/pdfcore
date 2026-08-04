'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useAddWatermarkContext } from '../_context/AddWatermarkContext';
import { FONT_SIZES, SIZE_LABELS, POSITION_LABELS } from '../_utils/watermarker';
import type { WatermarkPosition, WatermarkSize } from '../../_types';

const sizes: WatermarkSize[] = ['small', 'medium', 'large', 'extra-large'];
const positions: WatermarkPosition[] = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];
const presetColors = ['#EF4444', '#F59E0B', '#10B981', '#2563EB', '#8B5CF6', '#000000'];

const DRAWER_WIDTH = 200;

export default function MobileView() {
  const {
    file, settings, isLoadingPdf, isProcessing,
    errorMessage, setErrorMessage,
    addPdf, clearFile, updateSettings,
    applyAndPrepare,
    downloadWatermarkedFile,
    previewWatermarkedPdf,
    resetWatermarked,
    watermarkedPdfUrl,
    watermarkedPdfSize,
  } = useAddWatermarkContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tool = getToolByPath('/tools/add-watermark')!;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filename, setFilename] = useState('Watermarked_Document');

  // Sync filename with file
  useEffect(() => {
    if (file?.name) {
      setFilename(file.name.replace(/\.pdf$/i, '') + '-watermarked');
    }
  }, [file?.name]);

  // Auto-show success screen when PDF is ready
  useEffect(() => {
    if (watermarkedPdfUrl && !isProcessing) {
      setShowSuccess(true);
      setIsSheetOpen(false); // Close drawer if open
    }
  }, [watermarkedPdfUrl, isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdf(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleStartOver = () => {
    clearFile();
    setShowSuccess(false);
  };

  const pages = file?.allPagePreviews && file.allPagePreviews.length > 0
    ? file.allPagePreviews
    : file ? [file.firstPagePreview] : [];

  const willBeWatermarked = (pageIndex: number): boolean => {
    if (!file) return false;
    if (settings.applyToAllPages) return true;
    const pageStr = settings.specificPages || '';
    const parts = pageStr.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && pageIndex + 1 >= start && pageIndex + 1 <= end) {
          return true;
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p === pageIndex + 1) return true;
      }
    }
    return false;
  };

  const watermarkedCount = pages.filter((_, i) => willBeWatermarked(i)).length;
  const hasWatermarkText = settings.text.trim().length > 0;

  return (
    <ToolShellMobile fixedHeight={file !== null}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {errorMessage && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between z-50">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {isLoadingPdf && (
        <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
          <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
        </div>
      )}

      {/* 🎊 SUCCESS SCREEN */}
      {showSuccess && watermarkedPdfUrl ? (
        <MobileSuccessScreen
          title="Watermark Added!"
          subtitle={
            hasWatermarkText
              ? `"${settings.text}" applied to ${watermarkedCount} page${watermarkedCount !== 1 ? 's' : ''}`
              : 'Your watermarked PDF is ready'
          }
          filename={`${filename}.pdf`}
          fileSize={watermarkedPdfSize || undefined}
          pageCount={file?.totalPages}
          onDownload={downloadWatermarkedFile}
          onPreview={previewWatermarkedPdf}
          onStartOver={handleStartOver}
          iconVariant="pdf"
          statusBadge={{ label: 'Watermarked', color: 'purple' }}
        />
      ) : !file && !isLoadingPdf ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : file && (
        <>
          {/* Shared Header with filename editor */}
          <motion.div
            animate={{ paddingRight: isSheetOpen ? `${DRAWER_WIDTH}px` : '0px' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          >
            <MobileToolHeader
              filename={filename}
              onFilenameChange={setFilename}
              onBack={clearFile}
            />
          </motion.div>

          {/* Info banner */}
          <motion.div
            animate={{ paddingRight: isSheetOpen ? `${DRAWER_WIDTH + 12}px` : '12px' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="pl-3 pb-2 shrink-0"
          >
            <div className="px-3 py-2 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  hasWatermarkText ? 'bg-[#4F46E5]' : 'bg-[#94A3B8]'
                }`}>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#3730A3] leading-tight">
                    {hasWatermarkText ? `"${settings.text}"` : 'No watermark yet'}
                  </p>
                  <p className="text-[9px] text-[#6366F1]">
                    {hasWatermarkText
                      ? `→ ${watermarkedCount} of ${file.totalPages} pages`
                      : 'Tap "Add Watermark" to start'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* PDF Preview */}
          <motion.div
            animate={{
              paddingLeft: '16px',
              paddingRight: isSheetOpen ? `${DRAWER_WIDTH + 16}px` : '16px',
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="flex-1 overflow-y-auto bg-[#F5F5FA] py-4 pb-[140px]"
          >
            <div className="space-y-4 mx-auto" style={{ maxWidth: isSheetOpen ? '100%' : '400px' }}>
              {pages.map((preview, index) => {
                const hasWatermark = willBeWatermarked(index) && hasWatermarkText;
                return (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className={`w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${
                        hasWatermark ? 'bg-[#4F46E5]' : 'bg-[#94A3B8]'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-[11px] font-semibold text-[#5B6472]">Page {index + 1}</span>
                      {hasWatermark && (
                        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[9px] font-bold">
                          <svg viewBox="0 0 24 24" className="w-2 h-2" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Watermarked
                        </div>
                      )}
                    </div>

                    <div
                      className={`relative bg-white rounded-xl overflow-hidden shadow-md w-full ${
                        hasWatermark ? 'ring-2 ring-[#4F46E5]/20' : ''
                      }`}
                      style={{
                        aspectRatio: `${file.pageWidth} / ${file.pageHeight}`,
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Page ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-contain"
                        draggable={false}
                      />

                      {hasWatermark && (
                        <AccurateWatermarkOverlay
                          text={settings.text}
                          fontSize={FONT_SIZES[settings.fontSize]}
                          color={settings.color}
                          opacity={settings.opacity}
                          rotation={settings.rotation}
                          position={settings.position}
                          pageWidth={file.pageWidth}
                          pageHeight={file.pageHeight}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom Actions */}
          {!isSheetOpen && (
            <>
              <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-white via-white to-transparent pt-6">
                <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-2">
                  {!hasWatermarkText ? (
                    <button
                      type="button"
                      onClick={() => setIsSheetOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white border-2 border-dashed border-[#4F46E5] text-[#4F46E5] text-[14px] font-bold active:scale-[0.98] transition-transform shadow-lg"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add Watermark
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyAndPrepare}
                      disabled={isProcessing}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] text-white text-[14px] font-bold shadow-[0_8px_24px_-4px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-transform disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Applying Watermark...
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Apply Watermark
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {hasWatermarkText && (
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(true)}
                  className="absolute right-4 bottom-24 z-30 w-14 h-14 rounded-full bg-[#4F46E5] shadow-[0_8px_24px_-4px_rgba(79,70,229,0.5)] flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Edit watermark"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
            </>
          )}

          {/* RIGHT-SIDE DRAWER */}
          <AnimatePresence>
            {isSheetOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="fixed top-0 right-0 bottom-0 z-50 bg-white shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.15)] flex flex-col"
                style={{ width: `${DRAWER_WIDTH}px` }}
              >
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#F1F5F9] flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    <h3 className="text-[13px] font-bold text-[#07122E]">Watermark</h3>
                  </div>
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4B5563] active:bg-[#F1F5F9]"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5">
                  {/* Text */}
                  <div>
                    <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide mb-1 block">Text</label>
                    <input
                      type="text"
                      value={settings.text}
                      onChange={(e) => updateSettings({ text: e.target.value })}
                      placeholder="CONFIDENTIAL"
                      autoFocus={!settings.text}
                      className="w-full px-2.5 py-1.5 rounded-md border border-[#E2E2EE] focus:border-[#4F46E5] text-[12px] font-bold outline-none"
                      style={{ color: settings.color }}
                    />
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide mb-1 block">Color</label>
                    <div className="grid grid-cols-6 gap-1">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => updateSettings({ color })}
                          className={`w-full aspect-square rounded-full transition-all ${
                            settings.color === color
                              ? 'ring-2 ring-[#4F46E5] ring-offset-1 scale-105'
                              : 'ring-1 ring-[#E2E2EE]'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide mb-1 block">Size</label>
                    <div className="grid grid-cols-4 gap-1">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => updateSettings({ fontSize: size })}
                          className={`py-1.5 rounded-md text-[10px] font-bold transition-all ${
                            settings.fontSize === size
                              ? 'bg-[#4F46E5] text-white'
                              : 'bg-[#F6F7FB] text-[#5B6472]'
                          }`}
                        >
                          {size === 'extra-large' ? 'XL' : SIZE_LABELS[size].charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opacity */}
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide">Opacity</label>
                      <span className="text-[9px] font-bold text-[#4F46E5]">{Math.round(settings.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={settings.opacity}
                      onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
                      className="w-full accent-[#4F46E5] h-1"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <div className="flex justify-between mb-0.5">
                      <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide">Rotation</label>
                      <span className="text-[9px] font-bold text-[#4F46E5]">{settings.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={settings.rotation}
                      onChange={(e) => updateSettings({ rotation: parseInt(e.target.value, 10) })}
                      className="w-full accent-[#4F46E5] h-1"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide mb-1 block">Position</label>
                    <div className="grid grid-cols-3 gap-1 max-w-[120px]">
                      {positions.map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => updateSettings({ position: pos })}
                          className={`aspect-square rounded text-[11px] font-bold transition-all ${
                            settings.position === pos
                              ? 'bg-[#4F46E5] text-white'
                              : 'bg-[#F6F7FB] text-[#5B6472]'
                          }`}
                        >
                          {POSITION_LABELS[pos]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply To */}
                  <div>
                    <label className="text-[9px] font-bold text-[#8A93A3] uppercase tracking-wide mb-1 block">Apply To</label>
                    <div className="grid grid-cols-2 gap-1 mb-1.5">
                      <button
                        type="button"
                        onClick={() => updateSettings({ applyToAllPages: true })}
                        className={`py-1.5 rounded-md text-[10px] font-bold transition-all ${
                          settings.applyToAllPages ? 'bg-[#4F46E5] text-white' : 'bg-[#F6F7FB] text-[#5B6472]'
                        }`}
                      >
                        All ({file.totalPages})
                      </button>
                      <button
                        type="button"
                        onClick={() => updateSettings({ applyToAllPages: false })}
                        className={`py-1.5 rounded-md text-[10px] font-bold transition-all ${
                          !settings.applyToAllPages ? 'bg-[#4F46E5] text-white' : 'bg-[#F6F7FB] text-[#5B6472]'
                        }`}
                      >
                        Specific
                      </button>
                    </div>
                    {!settings.applyToAllPages && (
                      <input
                        type="text"
                        value={settings.specificPages}
                        onChange={(e) => updateSettings({ specificPages: e.target.value })}
                        placeholder="1, 3-5"
                        className="w-full px-2.5 py-1.5 rounded-md border border-[#E2E2EE] focus:border-[#4F46E5] text-[11px] outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* Footer - Done button (just closes drawer) */}
<div className="border-t border-[#F1F5F9] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex-shrink-0">
  <button
    type="button"
    onClick={() => setIsSheetOpen(false)}
    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] text-white text-[12px] font-bold active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(79,70,229,0.3)]"
  >
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
    Done
  </button>
</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </ToolShellMobile>
  );
}

// ============ HELVETICA-BOLD METRICS ============

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
  text, fontSize, color, opacity, rotation, position, pageWidth, pageHeight,
}: AccurateWatermarkOverlayProps) {
  const margin = 40;
  const textWidth = calculateHelveticaBoldWidth(text, fontSize);
  const textHeight = calculateHelveticaBoldHeight(fontSize);

  let centerX: number;
  if (position.includes('left')) centerX = margin + textWidth / 2;
  else if (position.includes('right')) centerX = pageWidth - margin - textWidth / 2;
  else centerX = pageWidth / 2;

  let pdfCenterY: number;
  if (position.includes('top')) pdfCenterY = pageHeight - margin - textHeight / 2;
  else if (position.includes('bottom')) pdfCenterY = margin + textHeight / 2;
  else pdfCenterY = pageHeight / 2;

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