// app/page.tsx
'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
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
import LandingNavbar from './tools/_components/LandingNavbar';
import LandingFooter from './tools/_components/LandingFooter';
import MobileHomeView from './tools/_components/MobileHomeView';
import { analyzeFiles, FileAnalysis } from './tools/_utils/fileAnalysis';

export default function HomePage() {
  const router = useRouter();
  const { setPendingFiles } = usePendingFile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Handle file drop/upload
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Filter valid files
    const validFiles = Array.from(files).filter(
      (f: File) => f.type === 'application/pdf' || f.type.startsWith('image/')
    );

    if (validFiles.length === 0) {
      alert('Please upload PDF or image files');
      return;
    }

    // Analyze
    const result = analyzeFiles(validFiles);
    setSelectedFiles(validFiles);
    setAnalysis(result);
  };

  // Navigate to tool WITH files
  const goToTool = (href: string) => {
    if (selectedFiles.length > 0) {
      setPendingFiles(selectedFiles, '/');
    }
    router.push(href);
  };

  // Reset to upload again
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

      {/* ============ ⭐ REDESIGNED MOBILE HOMEPAGE VIEW (md:hidden) ============ */}
      <MobileHomeView />

      {/* ============ DESKTOP HOMEPAGE VIEW (hidden md:block) ============ */}
      <div className="hidden md:block">
        {/* ============ HERO SECTION ============ */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 md:pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* LEFT: TEXT CONTENT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] md:text-xs font-semibold uppercase tracking-wider mb-6 border border-indigo-100">
                  <Zap size={14} strokeWidth={2.5} />
                  Instant Smart Analysis
                </div>

                <h1 className="text-[38px] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.05] font-extrabold tracking-tight text-slate-900 mb-5 md:mb-6">
                  The smart way to handle{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                    PDFs
                  </span>
                  <span className="text-slate-900">.</span>
                </h1>

                <p className="text-[15px] md:text-lg text-slate-500 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Drop one or multiple files. We instantly analyze them and recommend the perfect tools for the job.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold">
                    <Check size={16} className="text-emerald-500" strokeWidth={2.5} />
                    100% Free
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold">
                    <Lock size={14} className="text-emerald-500" strokeWidth={2.5} />
                    Secure &amp; Private
                  </div>
                </div>
              </motion.div>

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
                    /* ⭐ UPLOAD DROPZONE */
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
                      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                        isDragging
                          ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                          : 'border-slate-300 bg-white/50 hover:border-indigo-400 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center px-8 py-16 md:py-20 text-center">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                            isDragging
                              ? 'bg-indigo-600 scale-110'
                              : 'bg-indigo-50 group-hover:bg-indigo-100'
                          }`}
                        >
                          <Upload
                            size={28}
                            className={`transition-colors ${isDragging ? 'text-white' : 'text-indigo-600'}`}
                            strokeWidth={2}
                          />
                        </div>

                        <h3 className="text-[20px] md:text-[22px] font-bold text-slate-900 mb-2">
                          {isDragging ? 'Drop them here!' : 'Drop your files here'}
                        </h3>

                        <p className="text-[13px] text-slate-500 mb-6">
                          Merge PDF · Compress PDF · Image to PDF
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold shadow-sm transition-all"
                        >
                          Browse Files
                        </button>
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

                      {/* File list preview (for multiple files) */}
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
                            Recommended for you
                          </p>
                        </div>

                        {/* Top Recommendation Card */}
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
                                  Best Match
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

                        {/* Other Recommendations */}
                        {analysis.otherRecommendations.length > 0 && (
                          <>
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">
                              Or try these
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                              {analysis.otherRecommendations.map((tool: any) => (
                                <button
                                  key={tool.href}
                                  onClick={() => goToTool(tool.href)}
                                  className="group flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all"
                                >
                                  <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                      backgroundColor: tool.bgColor,
                                      color: tool.color,
                                    }}
                                  >
                                    <div className="scale-75">{tool.icon}</div>
                                  </div>
                                  <div className="flex-1 text-left">
                                    <h4 className="text-[13px] font-semibold text-slate-900">
                                      {tool.label}
                                    </h4>
                                  </div>
                                  <ChevronRight
                                    size={16}
                                    className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all"
                                  />
                                </button>
                              ))}
                            </div>
                          </>
                        )}

                        {/* Upload Different Files */}
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
                Explore All Tools
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