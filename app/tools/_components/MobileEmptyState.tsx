'use client';

import { motion } from 'framer-motion';
import { Folder, ArrowUp, ShieldCheck } from 'lucide-react';

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
    <div className="bg-white">
      <div className="px-6 pt-6 pb-6">
        {/* ============ TITLE ============ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-[26px] font-extrabold text-[#07122E] leading-[1.15] mb-2">
            {titleLine1}{' '}
            {line2Before}
            <span className="text-[#2563EB]">{titleAccent}</span>
            {line2After}
          </h1>
          <p className="text-[14px] text-[#5B6472] leading-relaxed">
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
          className="w-full bg-white rounded-3xl border-2 border-dashed border-[#93C5FD] hover:border-[#2563EB] py-8 px-6 active:scale-[0.99] transition-all"
        >
          {/* Upload Icon with Ripple */}
          <div className="relative w-18 h-18 mx-auto mb-4" style={{ width: '72px', height: '72px' }}>
            <div className="absolute inset-0 rounded-full bg-[#DBEAFE] animate-ping opacity-40" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(37,99,235,0.5)]">
              <ArrowUp size={28} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-[17px] font-bold text-[#07122E] mb-1.5">
            {uploadTitle}
          </h2>

          {/* Subtitle */}
          <p className="text-center text-[12.5px] text-[#8A93A3] mb-5">
            {uploadSubtitle.replace(/\n/g, ' ')}
          </p>

          {/* CTA Button */}
          <div className="w-full py-3 rounded-2xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_6px_20px_-6px_rgba(37,99,235,0.5)]">
            <Folder size={16} strokeWidth={2.5} />
            {buttonText}
          </div>

          {/* File info */}
          <p className="text-center text-[11.5px] text-[#B0B7C3] mt-4 font-medium">
            {fileSizeNote}
          </p>
        </motion.button>

        {/* ============ PRIVACY FOOTER ============ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 flex items-center justify-center gap-2"
        >
          <ShieldCheck size={14} className="text-[#16A34A]" strokeWidth={2.5} />
          <p className="text-[11.5px] text-[#5B6472] font-medium">
            Your files stay private &mdash; processed on your device
          </p>
        </motion.div>
      </div>
    </div>
  );
}