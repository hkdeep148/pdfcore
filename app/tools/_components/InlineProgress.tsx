'use client';

interface InlineProgressProps {
  isVisible: boolean;
  stage: 'idle' | 'merging' | 'compressing';
  progress: number;
}

export default function InlineProgress({ isVisible, stage, progress }: InlineProgressProps) {
  if (!isVisible) return null;

  const stageLabel = {
    merging: '📎 Merging PDFs',
    compressing: '🗜️ Compressing',
    idle: 'Processing',
  };

  return (
    <div className="w-full bg-white border-2 border-[#DBEAFE] rounded-xl p-4 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center text-[13px] font-bold mb-2">
        <span className="text-[#26324B] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          {stageLabel[stage]}...
        </span>
        <span className="text-[#2563EB]">{progress}%</span>
      </div>
      <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-300 ease-out"
          style={{ width: `${Math.max(2, progress)}%` }}
        />
      </div>
    </div>
  );
}