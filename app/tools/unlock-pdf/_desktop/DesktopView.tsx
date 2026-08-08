'use client';

import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import { useUnlockPdfContext } from '../_context/UnlockPdfContext';
import PasswordCard from './PasswordCard';
import AddMorePdfRow from './AddMorePdfRow';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { buildUnlockPdfV2Config } from '../../_config/successScreenConfigs';
import { formatBytes } from '../../_utils/browser';

export default function DesktopView() {
  const {
    items, errorMessage, setErrorMessage,
    unlockedCount, needsPasswordCount, allUnlocked,
    addPdfs, updatePassword, unlockOne, downloadOne, downloadAll,
    removePdf, clearAll,
  } = useUnlockPdfContext();

  useToolFileReceiver((files: File[]) => addPdfs(files));

  const isSingleFile = items.length === 1;

  const handleSmartDownload = () => {
    if (isSingleFile && items[0]) {
      downloadOne(items[0].id);
    } else {
      downloadAll();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 1️⃣ SUCCESS SCREEN (all files unlocked)
  // ═══════════════════════════════════════════════════════════════
if (allUnlocked) {
  const unlockedItems = items.filter((it) => it.status === 'unlocked');

  const config = buildUnlockPdfV2Config({
    files: unlockedItems.map((it) => ({
      id: it.id,
      name: it.name.replace(/\.pdf$/i, '-unlocked.pdf'),
      size: it.unlockedBlob ? formatBytes(it.unlockedBlob.size) : it.sizeMB,
      onDownload: () => downloadOne(it.id),
      // ⭐ ADD: Preview opens unlocked PDF in new tab
      onPreview: it.unlockedBlob
        ? () => {
            const url = URL.createObjectURL(it.unlockedBlob!);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 60000);
          }
        : undefined,
    })),
    onDownloadAll: handleSmartDownload,
    onStartOver: clearAll,
    onDelete: clearAll,
  });

  // ⭐ ADD: Pass PDF preview URL for gallery viewer
  const firstUnlocked = unlockedItems[0];
  const configWithPdf = {
    ...config,
    pdfPreviewUrl: firstUnlocked?.unlockedBlob
      ? URL.createObjectURL(firstUnlocked.unlockedBlob)
      : null,
  };

  return <SuccessScreenV2 config={configWithPdf} />;
}

  // ═══════════════════════════════════════════════════════════════
  // 2️⃣ RIGHT PANEL
  // ═══════════════════════════════════════════════════════════════
  const rightPanel = (
    <>
      <div className="mb-4">
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-1.5 block">
          Progress
        </label>
        <div className="bg-[#F6F7FB] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-[12px]">
            <span className="text-[#8A93A3]">Total files</span>
            <span className="font-bold text-[#07122E]">{items.length}</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#8A93A3]">Need password</span>
            <span className="font-bold text-[#F59E0B]">{needsPasswordCount}</span>
          </div>
          <div className="flex justify-between text-[12px]">
            <span className="text-[#8A93A3]">Unlocked</span>
            <span className="font-bold text-[#10B981]">{unlockedCount}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl px-4 py-3.5 flex items-start gap-2.5 mb-3">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <div>
          <p className="text-[12px] text-[#1E40AF] font-bold mb-1">How it works</p>
          <p className="text-[12px] text-[#1E40AF] leading-relaxed">
            1. Upload your password-protected PDF<br />
            2. Enter the password<br />
            3. Download the unlocked version
          </p>
        </div>
      </div>

      <div className="mb-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-4 py-3 flex items-start gap-2.5">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div className="text-[12px] text-[#166534] leading-relaxed">
          <strong>100% Private:</strong> Your PDFs are unlocked in your browser and never uploaded to any server.
        </div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════════════
  // 3️⃣ BOTTOM TOOLBAR
  // ═══════════════════════════════════════════════════════════════
  const bottomBar = (
    <ToolBottomBar
      actions={[
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ),
          label: 'Add PDFs',
          shortcut: 'Ctrl + O',
          onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf';
            input.multiple = true;
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) addPdfs(Array.from(files));
            };
            input.click();
          },
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          ),
          label: 'Clear All',
          shortcut: 'Delete',
          onClick: clearAll,
          disabled: items.length === 0,
          danger: true,
        },
      ]}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 4️⃣ ACTION BUTTON
  // ═══════════════════════════════════════════════════════════════
  const downloadLabel = isSingleFile
    ? 'Download PDF'
    : unlockedCount > 0
      ? `Download All (${unlockedCount})`
      : 'Download All';

  const actionButton = (
    <ToolActionButton
      onClick={handleSmartDownload}
      disabled={unlockedCount === 0}
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      }
      label={downloadLabel}
      subtitle={isSingleFile ? 'Get unlocked PDF' : 'Get unlocked PDFs'}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 5️⃣ NORMAL TOOL SHELL
  // ═══════════════════════════════════════════════════════════════
  return (
    <ToolShellDesktop
      title="Unlock PDF"
      subtitle="Remove password protection from your PDFs. Fast, secure, and private."
      rightPanel={rightPanel}
      rightPanelTitle="Info"
      bottomBar={bottomBar}
      actionButton={actionButton}
    >
      {errorMessage && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between flex-shrink-0">
          <span className="text-[13px] text-red-600 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <UploadZone
          onFiles={addPdfs}
          accept="application/pdf"
          title="Drop password-protected PDFs here"
          subtitle="We'll help you unlock them"
          buttonText="Choose PDFs"
          icon={
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          }
        />
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
          {items.map((item) => (
            <PasswordCard
              key={item.id}
              item={item}
              onUpdatePassword={updatePassword}
              onUnlock={unlockOne}
              onDownload={downloadOne}
              onRemove={removePdf}
            />
          ))}
          <AddMorePdfRow onFiles={addPdfs} />
        </div>
      )}
    </ToolShellDesktop>
  );
}