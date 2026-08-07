'use client';

import { useRef, useState, useEffect } from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { usePdfToImageContext } from '../_context/PdfToImageContext';
import PageGrid from './PageGrid';
import BottomToolbar from './BottomToolbar';

export default function MobileView() {
  const {
    pages,
    addPdfs,
    clearAll,
    isLoadingPdf,
    loadProgress,
    errorMessage,
    setErrorMessage,
    isProcessing,
    conversionResult,
    downloadConvertedFile,
    previewConvertedFile,
    resetConversion,
    format,
  } = usePdfToImageContext();

  const tool = getToolByPath('/tools/pdf-to-image')!;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState('PDF_Images');
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-show success screen when conversion is done
  useEffect(() => {
    if (conversionResult && !isProcessing) {
      setShowSuccess(true);
    }
  }, [conversionResult, isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addPdfs(Array.from(e.target.files));
    e.target.value = '';
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
    resetConversion();
  };

  const hasPages = pages.length > 0;

  return (
    <ToolShellMobile fixedHeight={hasPages}>
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

      {isLoadingPdf && (
        <div className="mx-4 mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
          </div>
          <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 🎊 SUCCESS SCREEN */}
      {showSuccess && conversionResult ? (
        <MobileSuccessScreen
          toolIcon={tool.icon}
          toolName="PDF to Image"
          toolColor="#EC4899"
          onBack={handleStartOver}
          title={conversionResult.isZip ? 'Images Ready!' : 'Image Ready!'}
          subtitle={
            conversionResult.isZip
              ? `${conversionResult.outputCount} pages converted to ${conversionResult.format.toUpperCase()}`
              : `Converted to ${conversionResult.format.toUpperCase()}`
          }
          files={[{
            id: 'converted-image',
            name: conversionResult.filename,
            size: conversionResult.fileSize,
            pages: conversionResult.outputCount,
          }]}
          onPreview={conversionResult.isZip ? undefined : previewConvertedFile}
          onDownload={downloadConvertedFile}
          onStartOver={handleStartOver}
          summaryTitle="Conversion Summary"
          summaryRows={[
            {
              icon: <ImageIcon size={13} />,
              iconBg: '#FCE7F3',
              iconColor: '#EC4899',
              label: 'Images Created',
              value: `${conversionResult.outputCount}`,
            },
            {
              icon: <FileText size={13} />,
              iconBg: '#DBEAFE',
              iconColor: '#2563EB',
              label: 'Format',
              value: conversionResult.format.toUpperCase(),
            },
            {
              icon: <FileText size={13} />,
              iconBg: '#D1FAE5',
              iconColor: '#10B981',
              label: 'Total Size',
              value: conversionResult.fileSize || '—',
              valueColor: '#10B981',
            },
            {
              icon: <FileText size={13} />,
              iconBg: '#FEF3C7',
              iconColor: '#F59E0B',
              label: 'Output',
              value: conversionResult.isZip ? 'ZIP' : conversionResult.format.toUpperCase(),
            },
          ]}
        />
      ) : !hasPages && !isLoadingPdf ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        hasPages && (
          <div className="flex flex-col h-full bg-[#F4F5F7]">
            {/* Shared Header */}
            <MobileToolHeader
              filename={filename}
              onFilenameChange={setFilename}
              onBack={clearAll}
            />

            {/* Grid */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <PageGrid />
            </div>

            {/* Existing tool-specific bottom toolbar */}
            <BottomToolbar onAddPdfs={openFilePicker} />
          </div>
        )
      )}
    </ToolShellMobile>
  );
}