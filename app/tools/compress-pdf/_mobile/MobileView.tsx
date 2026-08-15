'use client';

import { useRef, useEffect } from 'react';
import { Plus, Lock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useCompressPdfContext } from '../_context/CompressPdfContext';
import { formatBytes } from '../../_utils/browser';
import PdfList from './PdfList';
import BottomToolbar from './BottomToolbar';
import AddMoreSection from '../../_components/AddMoreSection';

export default function MobileView() {
  const {
    items,
    addPdfs,
    clearAll,
    errorMessage,
    setErrorMessage,
    totalOriginalBytes,
    totalCompressedBytes,
    totalSavedPercent,
    downloadOne,
    downloadAll,
  } = useCompressPdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/compress-pdf')!;

  // Auto-scroll to bottom when items count changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [items.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const hasItems = items.length > 0;
  const allDone = items.length > 0 && items.every((it) => it.status === 'done');
  const isSingleFile = items.length === 1;
  const savedBytes = totalOriginalBytes - totalCompressedBytes;
  const isAlreadyOptimized = savedBytes <= 0 || totalSavedPercent === 0;

  const handleDownload = () => {
    if (isSingleFile && items[0]) {
      downloadOne(items[0].id);
    } else {
      downloadAll();
    }
  };

  const handlePreview = () => {
    const firstDone = items.find((it) => it.status === 'done');
    if (!firstDone?.compressedBlob) return;
    const url = URL.createObjectURL(firstDone.compressedBlob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  // ═════════ SUCCESS SCREEN ═════════
  if (allDone) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Compress PDF"
        toolColor="#2563EB"
        onBack={clearAll}
        title={isAlreadyOptimized ? 'Already Optimized!' : 'Compression Successful!'}
        subtitle={
          isAlreadyOptimized
            ? 'Your PDF is already at optimal size.'
            : isSingleFile
              ? 'Your PDF has been compressed successfully.'
              : `${items.length} PDFs have been compressed successfully.`
        }
        files={items
          .filter((it) => it.status === 'done')
          .map((it) => ({
            id: it.id,
            name: it.name,
            size: it.compressedSizeMB || formatBytes(it.compressedBlob?.size || 0),
            onDownload: () => downloadOne(it.id),
          }))}
        onPreview={handlePreview}
        compressionStats={
          !isAlreadyOptimized
            ? {
                originalSize: formatBytes(totalOriginalBytes),
                compressedSize: formatBytes(totalCompressedBytes),
                savedPercentage: totalSavedPercent,
                savedBytes: formatBytes(savedBytes),
                format: 'PDF',
              }
            : undefined
        }
        downloadLabel={isSingleFile ? 'Download Compressed PDF' : `Download All (${items.length})`}
        onDownload={handleDownload}
        onStartOver={clearAll}
        collapsibleSummary={true}
      />
    );
  }

  // ═════════ EMPTY STATE ═════════
  if (!hasItems) {
    return (
      <div className="flex-1 overflow-y-auto bg-white min-h-0">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept="application/pdf"
        />
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      </div>
    );
  }

  // ═════════ MAIN VIEW ═════════
  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {/* ═══ SECTION 1: FIXED TOP (error + selection header) ═══ */}
      <div className="flex-shrink-0">
        {errorMessage && (
          <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-100 active:scale-90 transition"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="mt-3 mx-4 px-3 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded flex items-center justify-center bg-[#2563EB]">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="text-[13px] font-semibold text-[#0F172A]">
              {items.length} PDF{items.length > 1 ? 's' : ''}
            </span>
          </span>
          <span className="text-[11px] text-[#94A3B8] font-medium">
            {items.every((it) => it.status === 'done') ? 'All compressed' : 'Ready to compress'}
          </span>
        </div>
      </div>

      {/* ═══ SECTION 2: SCROLLABLE PDF LIST ═══ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 mx-4 mt-2">
        <PdfList />
      <AddMoreSection
    onAddMore={openFilePicker}
    label="Add more PDFs"
    hint="PDF • Max 50 files"
    accentColor="#2563EB"
    borderColor="#BFDBFE"
    bgColor="#F5F9FF"
  />
</div>
      


      {/* ═══ SECTION 4: STICKY BOTTOM BAR ═══ */}
      <BottomToolbar onAddPdfs={openFilePicker} barRef={bottomBarRef} />
    </div>
  );
}