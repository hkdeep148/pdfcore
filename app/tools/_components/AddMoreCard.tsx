'use client';

import { useRef, useState } from 'react';

interface AddMoreCardProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: string;
  disabled?: boolean;
}

export default function AddMoreCard({
  onFiles,
  accept = 'application/pdf',
  title = 'Add More',
  subtitle = 'Click or drop',
  aspectRatio = '1/1.414',
  disabled = false,
}: AddMoreCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) onFiles(Array.from(files));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
      disabled={disabled}
      className={`relative bg-white rounded-xl border-2 border-dashed transition-all p-2 group cursor-pointer ${
        isDragOver
          ? 'border-[#4F46E5] bg-[#F5F7FF]'
          : 'border-[#C9D8F3] hover:border-[#4F46E5] hover:bg-[#F5F7FF]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div
        className="w-full bg-[#F5F5FA] group-hover:bg-white rounded overflow-hidden flex flex-col items-center justify-center mt-3 transition-colors"
        style={{ aspectRatio }}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
            isDragOver
              ? 'bg-[#4F46E5]'
              : 'bg-[#EEF2FF] group-hover:bg-[#4F46E5]'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-6 h-6 transition-colors ${
              isDragOver ? 'text-white' : 'text-[#4F46E5] group-hover:text-white'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <p className="text-[13px] font-bold text-[#4F46E5] px-2 text-center">
          {title}
        </p>
        <p className="text-[10.5px] text-[#8A93A3] px-2 text-center mt-1">
          {subtitle}
        </p>
      </div>

      <div className="mt-2 h-7" />

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </button>
  );
}