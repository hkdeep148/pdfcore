'use client';

import { useRef, useState } from 'react';

interface AddMorePdfRowProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export default function AddMorePdfRow({ onFiles, disabled }: AddMorePdfRowProps) {
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
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === 'application/pdf'
    );
    if (files.length) onFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      disabled={disabled}
      className={`w-full rounded-2xl border-2 border-dashed p-4 flex items-center gap-4 transition-all cursor-pointer group ${
        isDragOver
          ? 'border-[#2563EB] bg-[#EFF3FF]'
          : 'border-[#C9D8F3] bg-white hover:border-[#2563EB] hover:bg-[#F8FAFF]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* Plus Icon */}
      <div
        className={`w-12 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
          isDragOver
            ? 'bg-[#2563EB]'
            : 'bg-[#EFF3FF] group-hover:bg-[#2563EB]'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 transition-colors ${
            isDragOver ? 'text-white' : 'text-[#2563EB] group-hover:text-white'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[14px] font-bold text-[#07122E] mb-1">
          Add more PDFs
        </p>
        <p className="text-[12px] text-[#8A93A3]">
          Drag & drop or click to browse
        </p>
      </div>

      {/* Right side arrow */}
      <div className="flex-shrink-0 text-[#8A93A3] group-hover:text-[#2563EB] transition-colors">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
    </button>
  );
}