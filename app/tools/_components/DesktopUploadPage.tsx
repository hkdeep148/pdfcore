'use client';

import { useRef, useState } from 'react';
import LandingNavbar from './LandingNavbar';
import { Upload, Zap, Shield, Package } from 'lucide-react';
import { validateFiles } from '../_utils/fileValidation';
import { useToast } from './ToastProvider';

interface DesktopUploadPageProps {
  toolName: string;
  toolAccent: string;
  toolDescription: string;
  supportedFormats?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  fileType: 'pdf' | 'image';
  buttonText?: string;
  uploadIcon?: React.ReactNode;
  features?: {
    icon: 'shield' | 'zap' | 'package';
    title: string;
    description: string;
  }[];
  onFilesSelected: (files: File[]) => void;
}

const defaultFeatures = {
  pdf: [
    { icon: 'shield' as const, title: '100% Private', description: 'Files never leave your device' },
    { icon: 'zap' as const, title: 'Lightning Fast', description: 'No upload wait times' },
    { icon: 'package' as const, title: 'Free Forever', description: 'No sign-up required' },
  ],
  image: [
    { icon: 'shield' as const, title: '100% Private', description: 'Files never leave your device' },
    { icon: 'zap' as const, title: 'Lightning Fast', description: 'No upload wait times' },
    { icon: 'package' as const, title: 'Batch Support', description: 'Process multiple at once' },
  ],
};

const featureIcons = {
  shield: (
    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
      <Shield size={20} className="text-emerald-600" strokeWidth={2} />
    </div>
  ),
  zap: (
    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
      <Zap size={20} className="text-purple-600" strokeWidth={2} />
    </div>
  ),
  package: (
    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
      <Package size={20} className="text-blue-600" strokeWidth={2} />
    </div>
  ),
};

export default function DesktopUploadPage({
  toolName,
  toolAccent,
  toolDescription,
  supportedFormats = 'JPG, PNG, WEBP',
  maxSizeMB = 50,
  multiple = true,
  fileType = 'image',
  buttonText = 'Choose Files',
  uploadIcon,
  features,
  onFilesSelected,
}: DesktopUploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const displayFeatures = features || defaultFeatures[fileType];

  /**
   * Validate + notify + forward valid files.
   * Called by both drop and file-picker handlers.
   */
  const processFiles = (files: File[]) => {
    const result = validateFiles(files);

    // Show errors for rejected files (0-byte, corrupt, etc.)
    result.rejectedFiles.forEach(({ file, reason }) => {
      toast.error(`"${file.name}": ${reason}`);
    });

    // Notify about large files (still process them!)
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
      onFilesSelected(result.validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  // Split tool name for accent coloring
  const nameParts = toolName.split(toolAccent);
  const beforeAccent = nameParts[0] || '';
  const afterAccent = nameParts.length > 1 ? nameParts[1] : '';

  return (
    // ⭐ FIX: Changed `hidden lg:flex h-full` → `flex min-h-screen`
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        className="hidden"
        multiple={multiple}
      />

      {/* ⭐ HOMEPAGE NAVBAR */}
      <LandingNavbar />

      {/* ⭐ CENTERED UPLOAD CONTENT */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
      >
        <div className="max-w-2xl w-full">
          
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-[40px] font-extrabold text-[#07122E] tracking-tight leading-[1.1] mb-3">
              {beforeAccent}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] bg-clip-text text-transparent">
                {toolAccent}
              </span>
              {afterAccent}
            </h1>

            <p className="text-[16px] text-[#6B7280] font-medium max-w-lg mx-auto leading-relaxed">
              {toolDescription}
            </p>
          </div>

          {/* Upload Zone */}
          <div className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? 'border-[#4F46E5] bg-[#EEF2FF] scale-[1.01]'
              : 'border-[#D1D5FF] bg-white/60 hover:border-[#A5B4FC] hover:bg-white'
          }`}>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center py-16 px-8 cursor-pointer"
            >
              {/* Upload Icon with Glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-2xl bg-[#4F46E5]/20 blur-2xl animate-pulse" />
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] transition-transform duration-300 ${
                  isDragging ? 'scale-110 rotate-3' : ''
                }`}>
                  {uploadIcon || <Upload size={32} className="text-white" strokeWidth={2} />}
                </div>
              </div>

              <h2 className="text-[22px] font-extrabold text-[#07122E] mb-2">
                {isDragging ? 'Drop your files here' : 'Drop files or click to upload'}
              </h2>

              <p className="text-[14px] text-[#6B7280] mb-8 text-center">
                <span className="font-semibold text-[#07122E]">{supportedFormats}</span>
                {' '}· No size limit
                {multiple && ' · Multiple files'}
              </p>

              <div className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6D5DF6] text-white text-[15px] font-bold shadow-[0_8px_30px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_40px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all">
                <Upload size={18} strokeWidth={2.5} />
                {buttonText}
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-[#E8EDF5] hover:border-[#C7D2FE] hover:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.1)] transition-all">
                {featureIcons[feature.icon]}
                <h3 className="text-[13px] font-bold text-[#07122E] mb-1">{feature.title}</h3>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Shield size={16} className="text-emerald-500" strokeWidth={2.5} />
            <p className="text-[12px] text-[#6B7280] font-medium">
              Your files stay private — processed entirely on your device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}