'use client';

import { useRef, useState, useEffect } from 'react';
import { Lock, Shield, HelpCircle, FileText, Unlock } from 'lucide-react';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileSuccessScreen from '../../_components/SuccessScreen/MobileSuccessScreen';
import { getToolByPath } from '../../_config/tools';
import { useUnlockPdfContext } from '../_context/UnlockPdfContext';
import MobilePasswordCard from './MobilePasswordCard';

export default function MobileView() {
  const {
    items,
    errorMessage,
    setErrorMessage,
    addPdfs,
    clearAll,
    updatePassword,
    unlockOne,
    downloadOne,
    removePdf,
    allUnlocked,
  } = useUnlockPdfContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tool = getToolByPath('/tools/unlock-pdf')!;
  const [showSuccess, setShowSuccess] = useState(false);

  const hasItems = items.length > 0;
  const isSingleFile = items.length === 1;

  useEffect(() => {
    if (isSingleFile && allUnlocked) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [isSingleFile, allUnlocked]);

  // Auto-scroll to bottom when items added
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

  const handleStartOver = () => {
    clearAll();
    setShowSuccess(false);
  };

  const handleBackToEdit = () => {
    setShowSuccess(false);
  };

  const handlePreview = () => {
    const item = items[0];
    if (!item?.unlockedBlob) return;
    const url = URL.createObjectURL(item.unlockedBlob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const handleDownload = () => {
    if (items[0]) downloadOne(items[0].id);
  };

  const successFile = isSingleFile && items[0] ? items[0] : null;

  // ═════════ SUCCESS SCREEN ═════════
  if (showSuccess && successFile) {
    return (
      <MobileSuccessScreen
        toolIcon={tool.icon}
        toolName="Unlock PDF"
        toolColor="#8B5CF6"
        onBack={handleBackToEdit}
        title="PDF Unlocked!"
        subtitle="Password removed. Ready to download."
        filename={successFile.name.replace(/\.pdf$/i, '-unlocked.pdf')}
        fileSize={successFile.sizeMB}
        onDownload={handleDownload}
        onPreview={handlePreview}
        onStartOver={handleStartOver}
        summaryTitle="Unlock Summary"
        summaryRows={[
          { icon: <Unlock size={13} />, iconBg: '#EDE9FE', iconColor: '#8B5CF6', label: 'Status', value: 'Unlocked' },
          { icon: <FileText size={13} />, iconBg: '#D1FAE5', iconColor: '#10B981', label: 'File Size', value: successFile.sizeMB || '—', valueColor: '#10B981' },
          { icon: <FileText size={13} />, iconBg: '#FEF3C7', iconColor: '#F59E0B', label: 'Format', value: 'PDF' },
        ]}
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

  // ═════════ MAIN VIEW - New design matching image ═════════
  return (
    <div className="flex-1 flex flex-col bg-[#F5F5FA] min-h-0">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="application/pdf"
      />

      {errorMessage && (
        <div className="flex-shrink-0 mx-4 mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 text-xl leading-none">×</button>
        </div>
      )}

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto min-h-0 px-4 pt-4 pb-4">

        {/* PDF Cards */}
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <MobilePasswordCard
              key={item.id}
              item={item}
              onUpdatePassword={updatePassword}
              onUnlock={unlockOne}
              onDownload={downloadOne}
              onRemove={removePdf}
            />
          ))}
        </div>

        {/* Add more button */}
        {items.length > 0 && (
          <button
            onClick={openFilePicker}
            className="w-full py-3 mb-4 rounded-xl border border-dashed border-[#DDD6FE] bg-white flex items-center justify-center gap-1.5 active:scale-[0.98] transition text-[#8B5CF6]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-[13px] font-semibold">Add another PDF</span>
          </button>
        )}

        {/* Your files are safe card */}
        <div className="rounded-2xl bg-[#F1F0FA] p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-[#8B5CF6]" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#0F172A] mb-1">
              Your files are safe
            </p>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              We don't store or share your files.
              <br />
              All processing happens on your device.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ STICKY BOTTOM — Need help footer ═══ */}
      <div className="flex-shrink-0 bg-white border-t border-[#E2E8F0] px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-[13px] font-bold">
            N
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0F172A] leading-tight">
              Need help?
            </p>
            <p className="text-[10px] text-[#94A3B8]">
              Make sure you have the correct password.
            </p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] active:scale-95 transition">
          <HelpCircle size={20} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}