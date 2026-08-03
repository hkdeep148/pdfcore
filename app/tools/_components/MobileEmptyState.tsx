'use client';

import { motion } from 'framer-motion';
import { Upload, Zap, FileText, Package, Image as ImageIcon } from 'lucide-react';

export interface MobileEmptyStateProps {
  titleLine1: string;
  titleLine2: string;
  titleAccent: string;
  description: string;
  uploadTitle: string;
  uploadSubtitle: string;
  buttonText: string;
  fileSizeNote: string;
  fileType: 'pdf' | 'image';
  onUpload: () => void;
}

export default function MobileEmptyState({
  titleLine1,
  titleLine2,
  titleAccent,
  description,
  uploadTitle,
  uploadSubtitle,
  buttonText,
  fileSizeNote,
  fileType,
  onUpload,
}: MobileEmptyStateProps) {
  const line2Parts = titleLine2.split(titleAccent);
  const line2Before = line2Parts[0] || '';
  const line2After = line2Parts[1] || '';

  return (
    <div className="lg:hidden flex-1 bg-[#F8F9FC] font-['Inter',sans-serif] text-[#07122E]">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-8">
        
        {/* ============ COMPACT HEADER ============ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#07122E] leading-tight mb-1">
            {titleLine1}{' '}
            {line2Before}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] bg-clip-text text-transparent">
              {titleAccent}
            </span>
            {line2After}
          </h1>
          <p className="text-[13px] text-[#6B7280] font-medium">
            {description.replace(/\n/g, ' ')}
          </p>
        </motion.div>

        {/* ============ UPLOAD ZONE ============ */}
        <motion.button
          type="button"
          onClick={onUpload}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full relative border-2 border-dashed border-[#DDE5F0] hover:border-[#4F46E5]/50 active:border-[#4F46E5] bg-white rounded-2xl transition-all"
        >
          <div className="flex flex-col items-center justify-center py-12 px-6">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center mb-4 shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)]">
              <Upload size={26} className="text-white" strokeWidth={2.2} />
            </div>

            {/* Title */}
            <h2 className="text-[17px] font-bold text-[#07122E] mb-1 text-center">
              {uploadTitle}
            </h2>

            {/* Subtitle */}
            <p className="text-[12px] text-[#6B7280] text-center mb-4">
              {uploadSubtitle.replace(/\n/g, ' ')}
            </p>

            {/* CTA Button (visual, whole area is button) */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[13px] font-bold shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)]">
              {fileType === 'image' ? (
                <ImageIcon size={14} strokeWidth={2.5} />
              ) : (
                <FileText size={14} strokeWidth={2.5} />
              )}
              {buttonText}
            </div>

            {/* File info */}
            <p className="text-[11px] text-[#9CA3AF] mt-4 font-medium">
              {fileSizeNote}
            </p>
          </div>
        </motion.button>

        {/* ============ FEATURE CHIPS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-3 gap-2 mt-4"
        >
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-[#E8EDF5]">
            <Zap size={16} className="text-[#4F46E5] mb-1.5" strokeWidth={2.2} />
            <p className="text-[10px] font-bold text-[#07122E]">Fast</p>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-[#E8EDF5]">
            {fileType === 'image' ? (
              <ImageIcon size={16} className="text-emerald-600 mb-1.5" strokeWidth={2.2} />
            ) : (
              <FileText size={16} className="text-emerald-600 mb-1.5" strokeWidth={2.2} />
            )}
            <p className="text-[10px] font-bold text-[#07122E]">Batch</p>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-[#E8EDF5]">
            <Package size={16} className="text-purple-600 mb-1.5" strokeWidth={2.2} />
            <p className="text-[10px] font-bold text-[#07122E]">Private</p>
          </div>
        </motion.div>

        {/* ============ PRIVACY FOOTER ============ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-1.5 py-2"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-3 h-3 text-emerald-600" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-[10.5px] text-[#6B7280] font-medium">
            Your files stay private — processed on your device
          </p>
        </motion.div>

      </main>
    </div>
  );
}