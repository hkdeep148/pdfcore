'use client';

import { useRef } from 'react';
import { useSignPdfContext } from '../_context/SignPdfContext';

export default function UploadSignature() {
  const { createUploadedSignature } = useSignPdfContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG)');
      return;
    }

    await createUploadedSignature(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-8 rounded-xl border-2 border-dashed border-[#C7D2FE] hover:border-[#4F46E5] hover:bg-[#F5F7FF] transition-all flex flex-col items-center gap-3"
      >
        <div className="w-14 h-14 rounded-full bg-[#EEF2FF] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[14px] font-bold text-[#07122E]">
            Click to upload signature
          </p>
          <p className="text-[11.5px] text-[#8A93A3] mt-1">
            PNG or JPG (transparent PNG recommended)
          </p>
        </div>
      </button>

      {/* Tips */}
      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4">
        <div className="flex items-start gap-2.5 mb-2">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-[12px] font-bold text-[#1E40AF]">Best Results</p>
        </div>
        <ul className="text-[11.5px] text-[#1E40AF] space-y-1 ml-6 list-disc">
          <li>Use PNG with transparent background</li>
          <li>High resolution (300+ DPI)</li>
          <li>Signed with dark pen on white paper</li>
          <li>Cropped to just the signature</li>
        </ul>
      </div>
    </div>
  );
}