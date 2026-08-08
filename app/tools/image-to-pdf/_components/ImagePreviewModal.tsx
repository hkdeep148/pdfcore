'use client';

import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName?: string;
  onClose: () => void;
}

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  imageName = 'image',
  onClose,
}: ImagePreviewModalProps) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setZoom(1);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Content box */}
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#ECEDF3] bg-[#FAFBFC]">
                <h3 className="text-[14px] font-bold text-[#07122E] truncate max-w-[70%]">
                  {imageName}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom out"
                  >
                    <ZoomOut size={18} className="text-[#6B7280]" />
                  </button>
                  <span className="text-[12px] font-medium text-[#6B7280] min-w-[40px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Zoom in"
                  >
                    <ZoomIn size={18} className="text-[#6B7280]" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={18} className="text-[#6366F1]" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-[#F5F7FB] rounded-lg transition-colors"
                    title="Close"
                  >
                    <X size={18} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Image container with scroll */}
              <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F5F5FA]">
                <motion.div
                  animate={{ scale: zoom }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={imageUrl}
                    alt={imageName}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
