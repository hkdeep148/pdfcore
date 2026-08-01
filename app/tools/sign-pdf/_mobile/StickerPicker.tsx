'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSignPdfContext } from '../_context/SignPdfContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const STICKERS = [
  { id: 'approved', label: '✓ APPROVED', bg: '#DCFCE7', color: '#16A34A', border: '#86EFAC' },
  { id: 'rejected', label: '✗ REJECTED', bg: '#FEE2E2', color: '#DC2626', border: '#FCA5A5' },
  { id: 'reviewed', label: '✓ REVIEWED', bg: '#DBEAFE', color: '#2563EB', border: '#93C5FD' },
  { id: 'important', label: '⚠ IMPORTANT', bg: '#FEF3C7', color: '#D97706', border: '#FCD34D' },
  { id: 'confidential', label: '🔒 CONFIDENTIAL', bg: '#EDE9FE', color: '#7C3AED', border: '#C4B5FD' },
  { id: 'signed', label: '✍ SIGNED', bg: '#F0FDF4', color: '#166534', border: '#86EFAC' },
  { id: 'draft', label: '📝 DRAFT', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
  { id: 'copy', label: '📋 COPY', bg: '#FFF7ED', color: '#EA580C', border: '#FDBA74' },
];

export default function StickerPicker({ open, onClose }: Props) {
  const { addSticker } = useSignPdfContext();

  return (
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
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D1D5DB]" />
            </div>

            <div className="flex items-center justify-between px-5 pb-3">
              <h3 className="text-[17px] font-extrabold text-[#07122E]">Add Stamp</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4B5563]">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-8 grid grid-cols-2 gap-3">
              {STICKERS.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => {
                    addSticker(sticker.id);
                    onClose();
                  }}
                  className="py-4 rounded-2xl border-2 text-center active:scale-[0.95] transition-transform"
                  style={{ backgroundColor: sticker.bg, borderColor: sticker.border }}
                >
                  <span className="text-[14px] font-extrabold" style={{ color: sticker.color }}>
                    {sticker.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}