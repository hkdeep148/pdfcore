'use client';

import { Plus, Lock } from 'lucide-react';

interface AddMoreSectionProps {
  onAddMore: () => void;
  label?: string;
  hint?: string;
  accentColor?: string;
  borderColor?: string;
  bgColor?: string;
  securityText?: string;
}

export default function AddMoreSection({
  onAddMore,
  label = 'Add more files',
  hint = 'Max 50 files',
  accentColor = '#2563EB',
  borderColor = '#BFDBFE',
  bgColor = '#F5F9FF',
  securityText = 'Your files are 100% secure. We never store your data.',
}: AddMoreSectionProps) {
  return (
    <div className="mt-3 mb-3">
      {/* Add more button */}
      <button
        onClick={onAddMore}
        className="w-full py-3 rounded-md border border-dashed flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] transition"
        style={{
          borderColor: borderColor,
          backgroundColor: bgColor,
        }}
      >
        <div className="flex items-center gap-1.5" style={{ color: accentColor }}>
          <Plus size={16} strokeWidth={2.5} />
          <span className="text-[13px] font-semibold">{label}</span>
        </div>
        <p className="text-[10px] text-[#94A3B8]">{hint}</p>
      </button>

      {/* Security footer */}
      <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
        <Lock size={11} />
        {securityText}
      </div>
    </div>
  );
}