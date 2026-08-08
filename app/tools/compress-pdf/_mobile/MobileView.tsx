'use client';

import { useRef } from 'react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useCompressPdfContext } from '../_context/CompressPdfContext';
import { formatBytes } from '../../_utils/browser';
import PdfList from './PdfList';
import BottomToolbar from './BottomToolbar';

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
  const tool = getToolByPath('/tools/compress-pdf')!;

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

  // ═══════════ SUCCESS SCREEN (renders OUTSIDE ToolShellMobile) ═══════════
  if (allDone) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Compress PDF"
        toolColor="#F43F5E"
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

  // ═══════════ NORMAL VIEW (inside ToolShellMobile) ═══════════
  return (
    <ToolShellMobile fixedHeight={hasItems}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {errorMessage && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between z-50">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {!hasItems ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        <div className="flex flex-col h-full bg-[#F4F5F7]">
          <MobileToolHeader
            filename={`${items.length} PDF${items.length > 1 ? 's' : ''}`}
            onFilenameChange={() => {}}
            editable={false}
            onBack={clearAll}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            <PdfList />
          </div>
          <BottomToolbar onAddPdfs={openFilePicker} />
        </div>
      )}
    </ToolShellMobile>
  );
}