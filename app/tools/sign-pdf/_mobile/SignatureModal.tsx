'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignPdfContext } from '../_context/SignPdfContext';
import { INK_COLORS, SIGNATURE_FONTS } from '../_utils/signer';

type ModalView = 'menu' | 'draw' | 'type' | 'upload';

interface Props {
  open: boolean;
  onClose: () => void;
  onSignatureCreated: (sigId: string) => void;
}

export default function SignatureModal({ open, onClose, onSignatureCreated }: Props) {
  const {
    signatures,
    activeSignatureId,
    inkColor,
    setInkColor,
    penSize,
    typedText,
    setTypedText,
    selectedFont,
    setSelectedFont,
    createDrawnSignature,
    createTypedSignature,
    createUploadedSignature,
  } = useSignPdfContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigImageInputRef = useRef<HTMLInputElement>(null);
  const canvasInitialized = useRef(false);

  const [modalView, setModalView] = useState<ModalView>('menu');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    if (open) setModalView('menu');
    else canvasInitialized.current = false;
  }, [open]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!canvasInitialized.current) {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvasInitialized.current = true;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
  }, [inkColor, penSize]);

  useEffect(() => {
    if (open && modalView === 'draw') setTimeout(initCanvas, 200);
  }, [open, modalView, initCanvas]);

  const getCoords = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const coords = getCoords(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoords(e);
    if (!coords) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawing(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const saveDrawnSig = () => {
    if (!canvasRef.current || !hasDrawing) return;
    const newSig = createDrawnSignature(canvasRef.current);
    if (newSig) {
      onClose();
      clearCanvas();
      onSignatureCreated(newSig.id);
    }
  };

  const saveTypedSig = () => {
    const newSig = createTypedSignature();
    if (newSig) {
      onClose();
      onSignatureCreated(newSig.id);
    }
  };

  const handleSigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const newSig = await createUploadedSignature(f);
    if (newSig) {
      onClose();
      onSignatureCreated(newSig.id);
    }
    e.target.value = '';
  };

  const handleSelectSavedSig = (sigId: string) => {
    onClose();
    onSignatureCreated(sigId);
  };

  return (
    <>
      <input
        ref={sigImageInputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg"
        onChange={handleSigUpload}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#D1D5DB]" />
              </div>

              <div className="flex items-center justify-between px-5 pb-3">
                <div className="flex items-center gap-2">
                  {modalView !== 'menu' && (
                    <button
                      onClick={() => setModalView('menu')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B5563]"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </button>
                  )}
                  <h3 className="text-[17px] font-extrabold text-[#07122E]">
                    {modalView === 'menu' ? 'Create Signature' : modalView === 'draw' ? 'Draw' : modalView === 'type' ? 'Type' : 'Upload'}
                  </h3>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B5563]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="px-5 pb-8 overflow-y-auto max-h-[70vh]">
                {modalView === 'menu' && (
                  <div className="space-y-2">
                    <button onClick={() => setModalView('draw')} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#ECEDF3] active:bg-[#F1F5F9]">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[#ECEDF3]">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-bold text-[#07122E]">Draw</p>
                        <p className="text-[12px] text-[#8A93A3]">Draw your signature</p>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>

                    <button onClick={() => setModalView('type')} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#ECEDF3] active:bg-[#F1F5F9]">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[#ECEDF3]">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <polyline points="4 7 4 4 20 4 20 7" />
                          <line x1="9" y1="20" x2="15" y2="20" />
                          <line x1="12" y1="4" x2="12" y2="20" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-bold text-[#07122E]">Type</p>
                        <p className="text-[12px] text-[#8A93A3]">Type your signature</p>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>

                    <button onClick={() => setModalView('upload')} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#ECEDF3] active:bg-[#F1F5F9]">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[#ECEDF3]">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-bold text-[#07122E]">Upload Image</p>
                        <p className="text-[12px] text-[#8A93A3]">Upload signature image</p>
                      </div>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>

                    {signatures.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#ECEDF3]">
                        <p className="text-[11px] font-bold text-[#8A93A3] uppercase tracking-wider mb-3">Saved Signatures</p>
                        {signatures.map((sig) => (
                          <button
                            key={sig.id}
                            onClick={() => handleSelectSavedSig(sig.id)}
                            className={`w-full p-3 rounded-2xl border-2 mb-2 ${activeSignatureId === sig.id ? 'border-[#4F46E5] bg-[#F5F3FF]' : 'border-[#ECEDF3]'}`}
                          >
                            <img src={sig.imageDataUrl} alt="Sig" className="h-12 object-contain" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {modalView === 'draw' && (
                  <div className="space-y-4">
                    <div className="flex gap-1.5">
                      {Object.entries(INK_COLORS).map(([name, color]) => (
                        <button key={name} onClick={() => setInkColor(color)} className={`w-8 h-8 rounded-full border-[3px] ${inkColor === color ? 'border-[#4F46E5] scale-110' : 'border-transparent'}`}>
                          <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                        </button>
                      ))}
                    </div>
                    <div className="relative rounded-2xl border-2 border-[#E5E7EB] bg-white overflow-hidden">
                      <div className="absolute left-5 right-5 bottom-12 border-b-2 border-dashed border-[#E5E7EB] pointer-events-none" />
                      <canvas
                        ref={canvasRef}
                        className="w-full h-48 touch-none"
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={stopDraw}
                      />
                      {!hasDrawing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <p className="text-[14px] text-[#D1D5DB]">Draw your signature</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { clearCanvas(); setModalView('menu'); }} className="flex-1 py-3 rounded-2xl border border-[#E5E7EB] text-[14px] font-bold text-[#6B7280]">
                        Cancel
                      </button>
                      <button onClick={saveDrawnSig} disabled={!hasDrawing} className="flex-1 py-3 rounded-2xl bg-[#4F46E5] text-white text-[14px] font-bold disabled:opacity-30">
                        Save & Place
                      </button>
                    </div>
                  </div>
                )}

                {modalView === 'type' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={typedText}
                      onChange={(e) => setTypedText(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3.5 rounded-2xl border-2 border-[#E5E7EB] text-[15px] focus:outline-none focus:border-[#4F46E5]"
                    />
                    <div className="flex gap-1.5">
                      {Object.entries(INK_COLORS).map(([name, color]) => (
                        <button key={name} onClick={() => setInkColor(color)} className={`w-7 h-7 rounded-full border-[3px] ${inkColor === color ? 'border-[#4F46E5] scale-110' : 'border-transparent'}`}>
                          <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {SIGNATURE_FONTS.map((font) => (
                        <button key={font.name} onClick={() => setSelectedFont(font.family)} className={`w-full px-5 py-4 rounded-2xl border-2 text-left ${selectedFont === font.family ? 'border-[#4F46E5] bg-[#F5F3FF]' : 'border-[#E5E7EB]'}`}>
                          <p className="text-[24px]" style={{ fontFamily: font.family, color: inkColor }}>
                            {typedText.trim() || 'Your Name'}
                          </p>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setModalView('menu')} className="flex-1 py-3 rounded-2xl border border-[#E5E7EB] text-[14px] font-bold text-[#6B7280]">
                        Cancel
                      </button>
                      <button onClick={saveTypedSig} disabled={!typedText.trim()} className="flex-1 py-3 rounded-2xl bg-[#4F46E5] text-white text-[14px] font-bold disabled:opacity-30">
                        Save & Place
                      </button>
                    </div>
                  </div>
                )}

                {modalView === 'upload' && (
                  <div className="space-y-4">
                    <button onClick={() => sigImageInputRef.current?.click()} className="w-full py-14 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-[#F5F3FF] flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="text-[14px] font-bold text-[#07122E]">Upload Signature</p>
                      <p className="text-[11px] text-[#8A93A3]">PNG or JPG</p>
                    </button>
                    <button onClick={() => setModalView('menu')} className="w-full py-3 rounded-2xl border border-[#E5E7EB] text-[14px] font-bold text-[#6B7280]">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}