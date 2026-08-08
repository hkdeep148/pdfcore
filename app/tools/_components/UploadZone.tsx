'use client';

import { useRef, useState, ReactNode } from 'react';
import { Upload, FileText } from 'lucide-react';
import { validateFiles } from '../_utils/fileValidation';
import { useToast } from './ToastProvider';

interface UploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  icon?: ReactNode;
  className?: string;
  /** Optional small info line below button (e.g. "PDF · Multiple files · No size limit") */
  infoText?: string;
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
  infoText,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  /**
   * Validate + notify + forward valid files.
   * Called by both drop and file-picker handlers.
   */
  const processFiles = (files: File[]) => {
    const result = validateFiles(files);

    // Show errors for rejected files (e.g., 0-byte files)
    result.rejectedFiles.forEach(({ file, reason }) => {
      toast.error(`"${file.name}": ${reason}`);
    });

    // Notify about large files (but still process them!)
    result.largeFiles.forEach(({ file, assessment }) => {
      const message = `"${file.name}" — ${assessment.message}`;
      if (assessment.category === 'info') {
        toast.info(message);
      } else if (assessment.category === 'warning' || assessment.category === 'confirm') {
        toast.warning(message);
      }
    });

    // Forward valid files (large ones included — user was notified)
    if (result.validFiles.length > 0) {
      onFiles(result.validFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) processFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        flex-1 flex flex-col items-center justify-center 
        rounded-2xl border transition-all cursor-pointer
        ${isDragging
          ? 'border-slate-900 bg-slate-50'
          : 'border-slate-200 border-dashed bg-white hover:border-slate-300 hover:bg-slate-50/50'
        }
        ${className}
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        onChange={handleFileChange}
        accept={accept}
      />

      {/* Icon */}
      <div
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all
          ${isDragging
            ? 'bg-slate-900 text-white scale-110'
            : 'bg-slate-100 text-slate-500'
          }
        `}
      >
        {icon || <Upload size={22} strokeWidth={2} />}
      </div>

      {/* Text */}
      <p className="text-[17px] font-semibold text-slate-900 mb-1.5">
        {isDragging ? 'Drop to upload' : title}
      </p>
      <p className="text-[13px] text-slate-500 mb-6">{subtitle}</p>

      {/* Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        className="inline-flex items-center gap-2 bg-slate-900 text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
      >
        {buttonText}
      </button>

      {/* Optional info line */}
      {infoText && (
        <p className="text-[11.5px] text-slate-400 mt-5 font-medium">
          {infoText}
        </p>
      )}
    </div>
  );
}