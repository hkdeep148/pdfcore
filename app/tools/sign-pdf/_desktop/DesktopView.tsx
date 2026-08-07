'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ToolShellDesktop from '../../_components/ToolShellDesktop';
import ToolBottomBar from '../../_components/ToolBottomBar';
import ToolActionButton from '../../_components/ToolActionButton';
import UploadZone from '../../_components/UploadZone';
import SuccessScreenV2 from '../../_components/SuccessScreen/SuccessScreenV2';
import DesktopProcessingScreen from '../../_components/DesktopProcessingScreen';
import { useSignPdfContext } from '../_context/SignPdfContext';
import SignaturePanel from './SignaturePanel';
import { useToolFileReceiver } from '../../_hooks/useToolFileReceiver';
import { useToolLoadingScreen } from '../../_hooks/useToolLoadingScreen';
import { buildSignPdfV2Config } from '../../_config/successScreenConfigs';

type DragState = {
  type: 'move' | 'resize';
  placedId: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origWidth: number;
  origHeight: number;
};

export default function DesktopView() {
  const {
    file, signatures, placedSignatures, activeSignatureId,
    currentPageIndex, setCurrentPageIndex,
    isLoadingPdf, isProcessing,
    errorMessage, setErrorMessage,
    addPdf, clearFile, placeSignature, updatePlacedSignature, removePlacedSignature,
    signAndPreparePdf,
    downloadSignedFile,
    previewSignedPdf,
    signedPdfUrl,
    signedPdfSize,
  } = useSignPdfContext();

  useToolFileReceiver((files: File[]) => addPdf(files));

  const [dragState, setDragState] = useState<DragState | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const justFinishedDragRef = useRef(false);

  // ⭐ Done state
  const isDone = !!signedPdfUrl && !isProcessing;

  // ⭐ Loading screen hook
  const showLoading = useToolLoadingScreen(isProcessing, isDone, 1800);

  // ⭐ Handle sign (just create, no auto-download)
  const handleDesktopSign = async () => {
    await signAndPreparePdf();
  };

  // Helper to get current preview dimensions
  const getCurrentDimensions = useCallback(() => {
    if (!previewRef.current) return null;
    const rect = previewRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  // ============ DRAG & RESIZE HANDLERS ============
  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    placedId: string,
    type: 'move' | 'resize'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const placed = placedSignatures.find(p => p.id === placedId);
    if (!placed) return;
    setDragState({
      type, placedId,
      startX: e.clientX, startY: e.clientY,
      origX: placed.x, origY: placed.y,
      origWidth: placed.width, origHeight: placed.height,
    });
  }, [placedSignatures]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    const dims = getCurrentDimensions();

    if (dragState.type === 'move') {
      updatePlacedSignature(dragState.placedId, {
        x: dragState.origX + deltaX,
        y: dragState.origY + deltaY,
        ...(dims && { displayWidth: dims.width, displayHeight: dims.height }),
      });
    } else if (dragState.type === 'resize') {
      const newWidth = Math.max(40, dragState.origWidth + deltaX);
      const aspectRatio = dragState.origHeight / dragState.origWidth;
      const newHeight = newWidth * aspectRatio;
      updatePlacedSignature(dragState.placedId, {
        width: newWidth, height: newHeight,
        ...(dims && { displayWidth: dims.width, displayHeight: dims.height }),
      });
    }
  }, [dragState, updatePlacedSignature, getCurrentDimensions]);

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      justFinishedDragRef.current = true;
      setTimeout(() => { justFinishedDragRef.current = false; }, 100);
    }
    setDragState(null);
  }, [dragState]);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState) return;
    if (!activeSignatureId || !file) return;
    if (justFinishedDragRef.current) { justFinishedDragRef.current = false; return; }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    placeSignature(activeSignatureId, currentPageIndex, x, y, rect.width, rect.height);
  };

  // ═══════════════════════════════════════════════════════════════
  // 1️⃣ LOADING SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (showLoading) {
    return (
      <DesktopProcessingScreen
        title="Signing PDF"
        subtitle={`Applying ${placedSignatures.length} signature${placedSignatures.length !== 1 ? 's' : ''}...`}
        fileCount={1}
        gradientFrom="#6366F1"
        gradientTo="#8B5CF6"
        infoText="Your files are processed securely in your browser"
        progressDuration={1.8}
        icon={
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        }
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // 2️⃣ SUCCESS SCREEN (V2 Design)
  // ═══════════════════════════════════════════════════════════════
  if (isDone && signedPdfUrl && file) {
    const signedName = file.name.replace(/\.pdf$/i, '-signed.pdf');

    const config = buildSignPdfV2Config({
      fileName: signedName,
      fileSize: signedPdfSize || '—',
      totalSignatures: placedSignatures.length,
      totalPages: file.totalPages,
      onDownload: downloadSignedFile,
      onStartOver: clearFile,
      onDelete: clearFile,
      onPreview: previewSignedPdf,
    });

    // ⭐ Add PDF data for gallery preview
    const configWithPdf = {
      ...config,
      pdfPreviewUrl: signedPdfUrl,
    };

    return <SuccessScreenV2 config={configWithPdf} />;
  }

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
          label: 'Add File',
          shortcut: 'Ctrl + O',
          onClick: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/pdf';
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files?.length) addPdf(Array.from(files));
            };
            input.click();
          },
          disabled: isProcessing,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ),
          label: 'Prev Page',
          shortcut: '←',
          onClick: () => setCurrentPageIndex(Math.max(0, currentPageIndex - 1)),
          disabled: !file || currentPageIndex === 0,
        },
        {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ),
          label: 'Next Page',
          shortcut: '→',
          onClick: () => setCurrentPageIndex(Math.min((file?.totalPages || 1) - 1, currentPageIndex + 1)),
          disabled: !file || currentPageIndex >= (file?.totalPages || 1) - 1,
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
          onClick: clearFile,
          disabled: !file || isProcessing,
          danger: true,
        },
      ]}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 4️⃣ MAIN ACTION BUTTON
  // ═══════════════════════════════════════════════════════════════
  const actionButton = (
    <ToolActionButton
      onClick={handleDesktopSign}
      disabled={!file || placedSignatures.length === 0}
      isLoading={isProcessing}
      loadingLabel="Signing…"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      }
      label="Sign PDF"
      subtitle={placedSignatures.length > 0 ? `${placedSignatures.length} signature${placedSignatures.length > 1 ? 's' : ''} placed` : 'Place signatures first'}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // 5️⃣ NORMAL TOOL SHELL
  // ═══════════════════════════════════════════════════════════════
  const currentPage = file?.pages[currentPageIndex];
  const currentPageSignatures = placedSignatures.filter(
    (ps) => ps.pageIndex === currentPageIndex
  );

  return (
    <ToolShellDesktop
      title="Sign PDF"
      subtitle="Add your signature to any PDF document. Draw, type, or upload."
      rightPanel={file ? <SignaturePanel /> : <div className="text-[13px] text-[#8A93A3]">Upload a PDF to start signing</div>}
      rightPanelTitle="Signature"
      bottomBar={bottomBar}
      actionButton={actionButton}
      breadcrumbCategory="Edit"
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

      {isLoadingPdf && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
            <span className="text-[13px] text-[#1E40AF] font-semibold">Loading PDF...</span>
          </div>
        </div>
      )}

      {!file && !isLoadingPdf ? (
        <UploadZone
          onFiles={addPdf}
          accept="application/pdf"
          multiple={false}
          title="Drop a PDF here"
          subtitle="Add your signature to any PDF document"
          buttonText="Choose PDF"
        />
      ) : file && currentPage && (
        <div className="flex-1 flex flex-col bg-[#F5F5FA] rounded-2xl border border-[#ECEDF3] overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-3 border-b border-[#ECEDF3] bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-10 rounded bg-[#EEF2FF] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#07122E]">{file.name}</p>
                <p className="text-[10.5px] text-[#8A93A3]">{file.totalPages} pages • {file.sizeMB}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                disabled={currentPageIndex === 0}
                className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <span className="text-[13px] font-bold text-[#07122E] min-w-[60px] text-center">
                {currentPageIndex + 1} / {file.totalPages}
              </span>
              <button
                onClick={() => setCurrentPageIndex(Math.min(file.totalPages - 1, currentPageIndex + 1))}
                disabled={currentPageIndex >= file.totalPages - 1}
                className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            {activeSignatureId && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-[11.5px] font-bold text-[#166534]">Click to place</span>
              </div>
            )}
          </div>

          <div
            className="flex-1 flex items-start justify-center p-8 overflow-y-auto overflow-x-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              ref={previewRef}
              className={`relative bg-white shadow-2xl overflow-visible select-none flex-shrink-0 ${
                activeSignatureId && !dragState ? 'cursor-crosshair' : 'cursor-default'
              }`}
              style={{
                width: '100%',
                maxWidth: '550px',
                aspectRatio: `${currentPage.width} / ${currentPage.height}`,
              }}
              onClick={handlePageClick}
            >
              <img
                src={currentPage.preview}
                alt={`Page ${currentPageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                draggable={false}
              />

              {currentPageSignatures.map((placed) => {
                const sig = signatures.find((s) => s.id === placed.signatureId);
                if (!sig) return null;
                const isDragging = dragState?.placedId === placed.id;

                return (
                  <div
                    key={placed.id}
                    className={`absolute group ${isDragging ? 'z-50' : 'z-10'}`}
                    style={{ left: placed.x, top: placed.y, width: placed.width, height: placed.height }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className="w-full h-full cursor-grab active:cursor-grabbing"
                      onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); handleMouseDown(e, placed.id, 'move'); }}
                    >
                      <img src={sig.imageDataUrl} alt="Signature" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />
                    </div>

                    <div className={`absolute inset-0 border-2 border-dashed rounded pointer-events-none transition-opacity ${
                      isDragging ? 'border-[#4F46E5] opacity-100' : 'border-[#4F46E5]/40 opacity-100 group-hover:border-[#4F46E5]'
                    }`} />

                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); removePlacedSignature(placed.id); }}
                      className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>

                    <div
                      className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#4F46E5] hover:bg-[#4338CA] rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 flex items-center justify-center"
                      onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); handleMouseDown(e, placed.id, 'resize'); }}
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                      </svg>
                    </div>

                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#07122E] text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 whitespace-nowrap pointer-events-none">
                      Drag to move
                    </div>
                  </div>
                );
              })}

              {activeSignatureId && currentPageSignatures.length === 0 && !dragState && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#4F46E5]/5 pointer-events-none">
                  <div className="bg-white/95 rounded-xl px-6 py-4 shadow-xl text-center">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#4F46E5] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <p className="text-[14px] font-bold text-[#07122E]">Click to place your signature</p>
                    <p className="text-[11.5px] text-[#6B7280] mt-1">Then drag to position & resize</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ToolShellDesktop>
  );
}