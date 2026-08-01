'use client';

import { useRef, useState, ReactNode } from 'react';

interface UploadZoneProps {
  /** Called with selected files */
  onFiles: (files: File[]) => void;
  /** MIME types to accept (e.g. "application/pdf" or "image/*") */
  accept?: string;
  /** Allow multiple files (default: true) */
  multiple?: boolean;
  /** Main heading text */
  title?: string;
  /** Subtitle text below title */
  subtitle?: string;
  /** Button text */
  buttonText?: string;
  /** Optional custom icon (defaults to upload icon) */
  icon?: ReactNode;
  /** Additional classes */
  className?: string;
}

export default function UploadZone({
  onFiles,
  accept = '*',
  multiple = true,
  title = 'Drop files here',
  subtitle = 'or click to browse',
  buttonText = 'Choose files',
  icon,
  className = '',
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) onFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const defaultIcon = (
    <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
        isDragging
          ? 'border-[#2563EB] bg-[#EFF3FF] scale-[1.02]'
          : 'border-[#D1D5FF] bg-white/40'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        onChange={handleFileChange}
        accept={accept}
      />

      <div className={`w-20 h-20 rounded-2xl bg-[#EFF3FF] flex items-center justify-center mb-5 transition-transform ${isDragging ? 'scale-110' : ''}`}>
        {icon || defaultIcon}
      </div>

      <p className="text-[18px] font-bold text-[#07122E] mb-1.5">{title}</p>
      <p className="text-[14px] text-[#8A93A3] mb-6">{subtitle}</p>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-[#1E4FD1] transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {buttonText}
      </button>
    </div>
  );
}