'use client';

interface ProcessingOverlayProps {
  isVisible: boolean;
  stage: 'idle' | 'merging' | 'compressing' | 'watermarking';
  progress: number;
  title?: string;
  /** Optional: specify the workflow type. If not provided, infers from stage. */
  workflow?: 'merge' | 'watermark';
}

export default function ProcessingOverlay({
  isVisible,
  stage,
  progress,
  title,
  workflow,
}: ProcessingOverlayProps) {
  if (!isVisible) return null;

  const stageInfo = {
    merging: {
      label: 'Merging PDFs',
      subtitle: 'Combining your files into one document...',
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
    },
    compressing: {
      label: 'Compressing PDF',
      subtitle: 'Optimizing images to reduce file size...',
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      ),
    },
    watermarking: {
      label: 'Adding Watermarks',
      subtitle: 'Applying watermarks to each page...',
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
          <path d="M8 10L16 10" strokeOpacity="0.5" />
          <path d="M8 14L16 14" strokeOpacity="0.5" />
          <path d="M12 6L15 9L9 15L6 12L12 6Z" />
        </svg>
      ),
    },
    idle: {
      label: 'Processing',
      subtitle: 'Please wait...',
      icon: null,
    },
  };

  const info = stageInfo[stage];

  // Infer workflow from stage if not explicitly provided
  const currentWorkflow = workflow || (stage === 'watermarking' ? 'watermark' : 'merge');
  const firstStepLabel = currentWorkflow === 'watermark' ? 'Watermark' : 'Merge';
  const firstStepStage = currentWorkflow === 'watermark' ? 'watermarking' : 'merging';

  const isFirstActive = stage === firstStepStage;
  const isFirstDone = stage === 'compressing';
  const isSecondActive = stage === 'compressing';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Icon + Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center text-[#2563EB] flex-shrink-0">
            {info.icon || (
              <div className="w-6 h-6 rounded-full border-[3px] border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#07122E]">
              {title || info.label}
            </h3>
            <p className="text-[13px] text-[#8A93A3] mt-0.5">{info.subtitle}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[12px] font-semibold mb-2">
            <span className="text-[#26324B]">{info.label}...</span>
            <span className="text-[#2563EB]">{progress}%</span>
          </div>
          <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex items-center gap-2 mt-4">
          {/* First step (Merge OR Watermark) */}
          <div className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg transition-all ${
            isFirstActive
              ? 'bg-[#EFF3FF] text-[#2563EB]'
              : isFirstDone
              ? 'bg-[#F0FDF4] text-[#10B981]'
              : 'bg-gray-50 text-gray-400'
          }`}>
            {isFirstDone ? (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <div className={`w-2 h-2 rounded-full ${
                isFirstActive ? 'bg-[#2563EB] animate-pulse' : 'bg-gray-300'
              }`} />
            )}
            <span className="text-[11px] font-semibold">{firstStepLabel}</span>
          </div>

          <div className="text-gray-300">→</div>

          {/* Second step (Compress) */}
          <div className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-2 rounded-lg transition-all ${
            isSecondActive
              ? 'bg-[#EFF3FF] text-[#2563EB]'
              : 'bg-gray-50 text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isSecondActive ? 'bg-[#2563EB] animate-pulse' : 'bg-gray-300'
            }`} />
            <span className="text-[11px] font-semibold">Compress</span>
          </div>
        </div>

        {/* Tip */}
        <p className="text-[11px] text-[#8A93A3] text-center mt-5 leading-relaxed">
          💡 Please don&apos;t close this window until processing is complete
        </p>
      </div>
    </div>
  );
}