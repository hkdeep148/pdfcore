'use client';

import { useRef, useState, useEffect } from 'react';
import ToolShellMobile from '../../_components/ToolShellMobile';
import MobileEmptyState from '../../_components/MobileEmptyState';
import MobileToolHeader from '../../_components/MobileToolHeader';
import MobileSuccessScreen from '../../_components/MobileSuccessScreen';
import { downloadFile } from '../../_utils/browser';
import { getToolByPath } from '../../_config/tools';
import { useUnlockPdfContext } from '../_context/UnlockPdfContext';
import MobilePasswordCard from './MobilePasswordCard';
import UnlockSummary from './UnlockSummary';
import UnlockBottomBar from './UnlockBottomBar';

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
  const tool = getToolByPath('/tools/unlock-pdf')!;
  const [showSuccess, setShowSuccess] = useState(false);

  const hasItems = items.length > 0;
  const isSingleFile = items.length === 1;

  // Auto-show success screen for single unlocked file
  useEffect(() => {
    if (isSingleFile && allUnlocked) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [isSingleFile, allUnlocked]);

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

  // For success screen: preview single unlocked file
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

  // Get file info for success screen
  const successFile = isSingleFile && items[0] ? items[0] : null;

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

      {/* 🎊 SUCCESS SCREEN - only for single unlocked file */}
      {showSuccess && successFile ? (
        <MobileSuccessScreen
          title="PDF Unlocked!"
          subtitle="Password removed. Ready to download."
          filename={successFile.name.replace(/\.pdf$/i, '-unlocked.pdf')}
          fileSize={successFile.sizeMB}
          onDownload={handleDownload}
          onPreview={handlePreview}
          onStartOver={handleStartOver}
          onBack={handleBackToEdit}
          iconVariant="unlocked"
          statusBadge={{ label: 'Unlocked', color: 'green' }}
        />
      ) : !hasItems ? (
        <MobileEmptyState {...tool.mobileUpload} onUpload={openFilePicker} />
      ) : (
        // MULTI-FILE view (list of password cards)
        <div className="flex flex-col h-full bg-[#F4F5F7]">
          {/* Shared Header - Back button clears all */}
          <MobileToolHeader
            filename={`${items.length} PDF${items.length > 1 ? 's' : ''}`}
            onFilenameChange={() => {}}
            editable={false}
            onBack={clearAll}
          />

          {/* Success Banner - shows when all files unlocked */}
          <UnlockSummary />

          {/* File cards list */}
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 space-y-2.5">
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

          {/* Bottom bar - context-aware */}
          <UnlockBottomBar onAddPdfs={openFilePicker} />
        </div>
      )}
    </ToolShellMobile>
  );
}