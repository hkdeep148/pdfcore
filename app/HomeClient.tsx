// app/page.tsx
'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Lock,
  Upload,
  ChevronRight,
  Sparkles,
  FileText,
  ArrowRight,
  X,
  Star,
  Files,
} from 'lucide-react';
import { popularTools, tools } from './tools/_config/tools';
import { usePendingFile } from './_context/PendingFileContext';
import { useToast } from './tools/_components/ToastProvider';
import { validateFiles } from './tools/_utils/fileValidation';
import LandingNavbar from './tools/_components/LandingNavbar';
import LandingFooter from './tools/_components/LandingFooter';
import MobileHomeView from './tools/_components/MobileHomeView';
import { analyzeFiles, FileAnalysis } from './tools/_utils/fileAnalysis';

export default function HomeClient() {
  const router = useRouter();
  const { setPendingFiles } = usePendingFile();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle file drop/upload
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    // 1. Filter to only PDF/image types
    const typeFiltered = filesArray.filter(
      (f: File) => f.type === 'application/pdf' || f.type.startsWith('image/')
    );

    // Report unsupported file types
    const unsupportedFiles = filesArray.filter(
      (f: File) => f.type !== 'application/pdf' && !f.type.startsWith('image/')
    );
    unsupportedFiles.forEach((file) => {
      toast.error(`"${file.name}" is not supported. Please upload PDFs or images (JPG, PNG, WEBP).`);
    });

    if (typeFiltered.length === 0) return;

    // 2. Validate file sizes (warn about large files, reject empty ones)
    const validation = validateFiles(typeFiltered);

    // Show errors for rejected files (0-byte, corrupt, etc.)
    validation.rejectedFiles.forEach(({ file, reason }) => {
      toast.error(`"${file.name}": ${reason}`);
    });

    // Notify about large files (informational — still proceed)
    validation.largeFiles.forEach(({ file, assessment }) => {
      const message = `"${file.name}" — ${assessment.message}`;
      if (assessment.category === 'info') {
        toast.info(message);
      } else if (assessment.category === 'warning' || assessment.category === 'confirm') {
        toast.warning(message);
      }
    });

    if (validation.validFiles.length === 0) return;

    // 3. Analyze the valid files (reads PDF pages, etc.)
    const result = await analyzeFiles(validation.validFiles);
    setSelectedFiles(validation.validFiles);
    setAnalysis(result);
  };

  const goToTool = (href: string) => {
    if (selectedFiles.length > 0) {
      setPendingFiles(selectedFiles, '/');
    }
    router.push(href);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="min-h-screen relative font-['Inter',sans-serif] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden bg-gradient-to-br from-[#F8F9FB] via-[#F8F9FB] to-[#EEF0F8]">
      <LandingNavbar />

      {/* ============ MOBILE HOMEPAGE ============ */}
      <MobileHomeView />

      {/* ============ DESKTOP HOMEPAGE ============ */}
      <div className="hidden md:block">
        {/* ============ HERO SECTION (Balanced) ============ */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              
              {/* LEFT: TEXT CONTENT (Bigger & Balanced) */}
<AnimatePresence mode="wait">
  {!analysis ? (
    /* ⭐ HERO CONTENT (before upload) */
    <motion.div
      key="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center lg:text-left"
    >
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-[0_2px_8px_-2px_rgba(99,102,241,0.15)] mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-[0.12em]">
          🪄 Instant PDF Magic
        </span>
      </div>

      {/* Headline */}
<h1 className="text-[38px] leading-[1.15] sm:text-[46px] md:text-[52px] lg:text-[58px] lg:leading-[1.1] font-extrabold tracking-tight text-slate-900 mb-6 md:mb-7">
  PDF tasks,{' '}
  <span className="relative inline-block whitespace-nowrap">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-600">
      done like magic.
    </span>
          <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
            <path d="M0,6 Q100,-2 200,4" stroke="url(#gradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </h1>

      {/* Subheadline */}
<p className="text-[16px] md:text-[18px] text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 font-medium leading-[1.65]">
  Merge, split, convert, and compress PDFs in a single click. Files up to{' '}
  <span className="text-slate-900 font-semibold">any size</span>, processed{' '}
  <span className="text-slate-900 font-semibold">entirely in your browser</span>.
  No uploads. No waiting. Pure magic. ✨
</p>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5 text-[13.5px] font-semibold text-slate-700">
        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={12} className="text-emerald-600" strokeWidth={3} />
          </div>
          <span>100% Free</span>
        </div>

        <div className="w-1 h-1 rounded-full bg-slate-300" />

        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
            <Lock size={11} className="text-indigo-600" strokeWidth={2.5} />
          </div>
          <span>Zero Uploads</span>
        </div>

        <div className="w-1 h-1 rounded-full bg-slate-300" />

        <div className="inline-flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
            <Files size={11} className="text-purple-600" strokeWidth={2.5} />
          </div>
          <span>No Size Limit</span>
        </div>
      </div>
    </motion.div>
  ) : (
    /* ⭐ SMART TIPS PANEL (after upload) */
    <motion.div
      key="tips"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="lg:pr-8"
    >
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-[0_2px_8px_-2px_rgba(245,158,11,0.15)] mb-5">
        <Sparkles size={12} className="text-amber-600" strokeWidth={2.5} />
<span className="text-[11px] font-bold text-amber-700 uppercase tracking-[0.12em]">
  ✨ Magic Suggestions
</span>
      </div>

      {/* Compact Headline */}
<h2 className="text-[20px] md:text-[22px] font-bold tracking-tight text-slate-900 mb-2">
  Magic ready for your{' '}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-600">
    {analysis.type === 'pdf' ? 'PDF' : analysis.type === 'image' ? 'image' : 'files'}
  </span>
</h2>

{/* Small Description */}
<p className="text-[13px] text-slate-500 mb-5 font-medium leading-[1.5]">
  Pick a spell to transform your file instantly
</p>

      {/* Smart Suggestions List */}
<div className="space-y-3">
  
  {/* ⭐ Tip: Smart PDF Content Analysis */}
{analysis.type === 'pdf' && analysis.pageCount > 0 && (
  <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center shrink-0">
      <span className="text-[18px]">
        {analysis.isScanned ? '📷' :
         analysis.isImageHeavy ? '🖼️' :
         analysis.isTextBased ? '📝' :
         analysis.hasForms ? '📋' :
         analysis.isSigned ? '✍️' :
         analysis.isInvoice ? '🧾' :
         '📖'}
      </span>
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
        {analysis.pageCount} {analysis.pageCount === 1 ? 'page' : 'pages'} · {analysis.totalSize}
      </h4>
      <p className="text-[12.5px] text-slate-500 leading-[1.5]">
        {analysis.isScanned ? 'Scanned document detected' :
         analysis.isImageHeavy ? 'Image-heavy PDF detected' :
         analysis.isTextBased ? 'Text-based PDF detected' :
         analysis.hasForms ? 'Form PDF with fillable fields' :
         analysis.isSigned ? 'Signed document detected' :
         analysis.isInvoice ? 'Invoice or receipt detected' :
         analysis.isSinglePage ? 'Single-page document' :
         `Multi-page document with ${analysis.pageCount} pages`}
      </p>
    </div>
  </div>
)}

  {/* ⭐ Tip: Smart Compression Info (Filename + Size-per-page detection) */}
{analysis.type === 'pdf' && (() => {
  const sizeStr = analysis.totalSize;
  const sizeNum = parseFloat(sizeStr);
  const sizeInKB = sizeStr.includes('MB') ? sizeNum * 1024 : sizeNum;
  const pageCount = analysis.pageCount || 1;
  const kbPerPage = sizeInKB / pageCount;

  // Check filename for compression hints
  const filename = analysis.files[0]?.name?.toLowerCase() || '';
  const alreadyCompressed = 
    filename.includes('compressed') || 
    filename.includes('optimized') || 
    filename.includes('reduced') ||
    filename.includes('small') ||
    filename.includes('-min');

  let title = '';
  let description = '';
  let iconColor = 'from-rose-100 to-rose-200';
  let emoji = '✨';

  if (alreadyCompressed) {
    // Filename indicates already compressed
    title = 'Appears already compressed';
    description = 'Try other tools like split, sign, or convert';
    iconColor = 'from-emerald-100 to-emerald-200';
    emoji = '✅';
  } else if (kbPerPage < 30) {
    // Very small per page = text-only or optimized
    title = 'Already well-optimized';
    description = 'Text-based PDF with minimal compression potential';
    iconColor = 'from-emerald-100 to-emerald-200';
    emoji = '✅';
  } else if (kbPerPage < 80) {
    // Small per page = likely optimized
    title = 'Well-optimized (5-15% possible)';
    description = 'Small size per page suggests good optimization';
    iconColor = 'from-blue-100 to-blue-200';
    emoji = '📊';
  } else if (kbPerPage < 200) {
    // Normal per page
    title = 'Compressible by 20-35%';
    description = 'Standard PDF with moderate compression potential';
  } else if (kbPerPage < 500) {
    // High per page = has images
    title = 'Compressible by 35-55%';
    description = 'Contains images that can be optimized';
  } else {
    // Very high per page = image-heavy
    title = 'Compressible by up to 65%';
    description = 'Image-heavy PDF, great compression potential';
  }
  
  return (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shrink-0`}>
        <span className="text-[18px]">{emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
          {title}
        </h4>
        <p className="text-[12.5px] text-slate-500 leading-[1.5]">
          {description}
        </p>
      </div>
    </div>
  );
})()}

  {/* ⭐ Tip: Split (only if PDF has 2+ pages) */}
  {analysis.type === 'pdf' && !analysis.isMultiple && analysis.pageCount > 1 && (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center shrink-0">
        <span className="text-[18px]">📄</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
          Split into {analysis.pageCount} pages
        </h4>
        <p className="text-[12.5px] text-slate-500 leading-[1.5]">
          Extract specific pages or split into multiple files
        </p>
      </div>
    </div>
  )}

  {/* ⭐ Tip: Merge (only for multiple PDFs) */}
  {analysis.type === 'pdf' && analysis.isMultiple && (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center shrink-0">
        <span className="text-[18px]">🔗</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
          Merged into 1 file
        </h4>
        <p className="text-[12.5px] text-slate-500 leading-[1.5]">
          Combine all {analysis.count} PDFs into a single document
        </p>
      </div>
    </div>
  )}

  {/* ⭐ Tip: Organize (only for 2-10 page PDFs) */}
  {analysis.type === 'pdf' && !analysis.isMultiple && analysis.pageCount > 1 && analysis.pageCount <= 10 && (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center shrink-0">
        <span className="text-[18px]">🗂️</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
          Reorder pages easily
        </h4>
        <p className="text-[12.5px] text-slate-500 leading-[1.5]">
          Drag and drop to rearrange pages
        </p>
      </div>
    </div>
  )}

  {/* ⭐ Tip: Convert to Images (for all PDFs) */}
  {analysis.type === 'pdf' && (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center shrink-0">
        <span className="text-[18px]">🖼️</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
          Converted to {analysis.pageCount === 1 ? '1 image' : `${analysis.pageCount} images`}
        </h4>
        <p className="text-[12.5px] text-slate-500 leading-[1.5]">
          Extract each page as PNG or JPG images
        </p>
      </div>
    </div>
  )}

  {/* ⭐ Tip: Sign PDF (prioritize for 1-page PDFs) */}
  {analysis.type === 'pdf' && analysis.isSinglePage && (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shrink-0">
        <span className="text-[18px]">✍️</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
          Perfect for signing
        </h4>
        <p className="text-[12.5px] text-slate-500 leading-[1.5]">
          Add your digital signature in seconds
        </p>
      </div>
    </div>
  )}

  {/* ⭐ IMAGE tips */}
  {analysis.type === 'image' && (
    <>
      <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center shrink-0">
          <span className="text-[18px]">📄</span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
            {analysis.isMultiple ? `Combined into 1 PDF` : 'Converted to PDF'}
          </h4>
          <p className="text-[12.5px] text-slate-500 leading-[1.5]">
            {analysis.isMultiple 
              ? `Merge all ${analysis.count} images into a single PDF document`
              : 'Convert your image to a professional PDF file'
            }
          </p>
        </div>
      </div>

      <div className="group flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.1)] transition-all">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center shrink-0">
          <span className="text-[18px]">📥</span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">
            Ready in seconds
          </h4>
          <p className="text-[12.5px] text-slate-500 leading-[1.5]">
            Instant conversion right in your browser
          </p>
        </div>
      </div>
    </>
  )}

</div>

      {/* Bottom Message */}
<div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-[12.5px] text-slate-500 font-medium">
  <Lock size={12} className="text-emerald-500" strokeWidth={2.5} />
  <span>All in seconds. All free. All private. All magic. ✨</span>
</div>
    </motion.div>
  )}
</AnimatePresence>

              {/* RIGHT: UPLOAD or ANALYSIS PANEL */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:pl-8"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
                />

                <AnimatePresence mode="wait">
                  {!analysis ? (
                    /* ⭐ UPLOAD DROPZONE (Rectangle) */
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer group overflow-hidden ${
                        isDragging
                          ? 'border-indigo-500 bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-50 scale-[1.02] shadow-[0_20px_50px_-12px_rgba(99,102,241,0.35)]'
                          : 'border-slate-300 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 hover:border-indigo-400 hover:shadow-[0_20px_50px_-12px_rgba(99,102,241,0.2)] hover:-translate-y-1'
                      }`}
                    >
                      {/* Decorative floating file icons */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-4 right-6 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500">
                          <FileText size={56} strokeWidth={1.5} className="text-indigo-600 rotate-12" />
                        </div>
                        <div className="absolute bottom-4 left-6 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500">
                          <Files size={60} strokeWidth={1.5} className="text-purple-600 -rotate-12" />
                        </div>
                        <div className="absolute top-8 left-14 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
                          <FileText size={28} strokeWidth={1.5} className="text-purple-500 -rotate-6" />
                        </div>
                        <div className="absolute bottom-8 right-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
                          <FileText size={36} strokeWidth={1.5} className="text-indigo-500 rotate-6" />
                        </div>
                      </div>

                      {/* Main Content (Rectangle padding) */}
                      <div className="relative flex flex-col items-center justify-center px-6 md:px-8 py-12 md:py-14 text-center">
                        
                        {/* Upload Icon Container (Smaller) */}
                        <div className="relative mb-4">
                          {/* Glow effect */}
                          <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                            isDragging 
                              ? 'bg-indigo-500/40 blur-xl scale-125' 
                              : 'bg-indigo-500/0 blur-xl scale-100 group-hover:bg-indigo-500/20 group-hover:scale-110'
                          }`} />
                          
                          {/* Icon container - smaller now */}
                          <div
                            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              isDragging
                                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 scale-110 rotate-6'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-105 group-hover:-rotate-6 shadow-[0_10px_30px_-5px_rgba(99,102,241,0.5)]'
                            }`}
                          >
                            <Upload
                              size={26}
                              className="text-white"
                              strokeWidth={2.5}
                            />
                          </div>

                          {/* Floating indicator dots */}
                          {!isDragging && (
                            <>
                              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                              <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-amber-400 border-2 border-white" />
                            </>
                          )}
                        </div>

                        {/* Headline */}
<h3 className="text-[20px] md:text-[22px] font-extrabold text-slate-900 mb-2 tracking-tight">
  {isDragging ? '🪄 Cast the spell!' : 'Drop your files here'}
</h3>

                        {/* Subheadline */}
                        <p className="text-[14px] text-slate-500 mb-1 max-w-xs">
                          or click anywhere to browse
                        </p>

                        {/* Smart hint */}
<p className="text-[12px] text-indigo-600 font-semibold mb-5 flex items-center gap-1.5">
  <Sparkles size={12} strokeWidth={2.5} />
  <span>We&apos;ll cast the perfect spell for your file</span>
</p>

                        {/* Browse Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-[13px] font-bold shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_-4px_rgba(99,102,241,0.3)] transition-all"
                        >
                          <FileText size={15} strokeWidth={2.2} />
                          Browse Files
                        </button>

                        {/* File format pills */}
                        <div className="flex items-center gap-2 mt-5">
                          <span className="px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            PDF
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            JPG
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            PNG
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-white/80 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            WEBP
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* ⭐ SMART RECOMMENDATION PANEL */
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-2xl bg-white border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] overflow-hidden"
                    >
                      {/* File Info Header */}
                      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                            {analysis.isMultiple ? (
                              <Files size={18} className="text-indigo-600" strokeWidth={2} />
                            ) : (
                              <FileText size={18} className="text-indigo-600" strokeWidth={2} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            {analysis.isMultiple ? (
                              <>
                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                  {analysis.count} files selected
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {analysis.type === 'pdf'
                                    ? `${analysis.count} PDFs`
                                    : analysis.type === 'image'
                                    ? `${analysis.count} images`
                                    : `${analysis.count} mixed files`}{' '}
                                  • {analysis.totalSize}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                  {analysis.files[0].name}
                                </p>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {analysis.type === 'pdf' ? 'PDF' : 'Image'} •{' '}
                                  {analysis.totalSize}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={resetAnalysis}
                          className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shrink-0"
                          aria-label="Remove files"
                        >
                          <X size={16} strokeWidth={2} />
                        </button>
                      </div>

                      {/* File list preview */}
                      {analysis.isMultiple && analysis.files.length <= 5 && (
                        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.files.map((file: File, idx: number) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-600 font-medium max-w-[140px]"
                              >
                                <FileText size={10} strokeWidth={2} className="text-slate-400 shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.isMultiple && analysis.files.length > 5 && (
                        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
                          <p className="text-[11px] text-slate-500 font-medium">
                            {analysis.files.slice(0, 3).map((f: File) => f.name).join(', ')}{' '}
                            and {analysis.files.length - 3} more...
                          </p>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div className="p-6">
<div className="flex items-center gap-2 mb-4">
  <Sparkles size={14} className="text-indigo-600" strokeWidth={2.5} />
  <p className="text-[12px] font-bold text-indigo-600 uppercase tracking-wider">
    🪄 Perfect Spell for You
  </p>
</div>

                        <button
                          onClick={() => goToTool(analysis.topRecommendation.href)}
                          className="group w-full p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.3)] transition-all duration-300 mb-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                              style={{
                                backgroundColor: analysis.topRecommendation.bgColor,
                                color: analysis.topRecommendation.color,
                              }}
                            >
                              <div className="scale-90">{analysis.topRecommendation.icon}</div>
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
<span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1">
  <Star size={9} fill="currentColor" strokeWidth={0} />
  Best Spell
</span>
                              </div>
                              <h4 className="text-[15px] font-bold text-slate-900">
                                {analysis.topRecommendation.label}
                              </h4>
                              <p className="text-[12px] text-slate-600 truncate font-medium">
                                {analysis.topReason}
                              </p>
                            </div>
                            <ArrowRight
                              size={18}
                              className="text-indigo-600 group-hover:translate-x-1 transition-transform shrink-0"
                              strokeWidth={2.5}
                            />
                          </div>
                        </button>

                        {analysis.otherRecommendations.length > 0 && (
  <>
<p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-5">
  Or cast another spell
</p>
    <div className="grid grid-cols-2 gap-2">
      {analysis.otherRecommendations.map((tool: any) => (
        <button
          key={tool.href}
          onClick={() => goToTool(tool.href)}
          className="group flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm transition-all text-left"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
            style={{
              backgroundColor: tool.bgColor,
              color: tool.color,
            }}
          >
            <div className="scale-[0.65]">{tool.icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[12.5px] font-bold text-slate-900 truncate">
              {tool.label}
            </h4>
          </div>
        </button>
      ))}
    </div>
  </>
)}

                        <button
                          onClick={resetAnalysis}
                          className="w-full mt-4 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-[13px] font-semibold transition-all"
                        >
                          Upload different files
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ TOOL GRID SECTION ============ */}
        <section id="tools" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-32">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
<h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-slate-900">
  Your Magic Toolkit
</h2>
            </div>
            <Link
              href="/tools"
              className="flex items-center gap-1 text-indigo-600 text-[14px] font-medium hover:text-indigo-700 group"
            >
              View All ({tools.length})
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {popularTools.map((tool: any) => {
              const CardContent = (
                <div
                  className={`group h-full block bg-white p-5 md:p-6 rounded-2xl border border-slate-100 transition-all duration-300 relative ${
                    tool.comingSoon
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:border-slate-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] cursor-pointer'
                  }`}
                >
                  {tool.comingSoon && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      Soon
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${
                      tool.comingSoon ? 'grayscale' : ''
                    }`}
                    style={{ backgroundColor: tool.bgColor, color: tool.color }}
                  >
                    <div className="scale-90">{tool.icon}</div>
                  </div>

                  <h3
                    className={`text-[15px] md:text-base font-bold mb-1.5 ${
                      tool.comingSoon ? 'text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {tool.label}
                  </h3>

                  <p
                    className={`text-[13px] leading-relaxed ${
                      tool.comingSoon ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {tool.description}
                  </p>
                </div>
              );

              return tool.comingSoon ? (
                <div key={tool.href}>{CardContent}</div>
              ) : (
                <Link href={tool.href} key={tool.href}>
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}