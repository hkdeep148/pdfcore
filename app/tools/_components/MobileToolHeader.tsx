'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Check } from 'lucide-react';

interface MobileToolHeaderProps {
  /** The filename (without extension) to display and edit */
  filename: string;
  /** Callback when filename changes */
  onFilenameChange: (name: string) => void;
  /** Optional custom back action (default: router.back()) */
  onBack?: () => void;
  /** Optional slot on the right side (e.g., custom action button) */
  rightAction?: ReactNode;
  /** Whether the filename is editable (default: true) */
  editable?: boolean;
}

export default function MobileToolHeader({
  filename,
  onFilenameChange,
  onBack,
  rightAction,
  editable = true,
}: MobileToolHeaderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <header className="flex items-center justify-between gap-2 px-3 pt-5 pb-2 shrink-0">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-[#26324B] border border-[#D5DBE5] rounded-md hover:bg-[#F5F7FB] hover:border-[#6366F1] hover:text-[#6366F1] active:scale-[0.97] transition-all shrink-0"
        aria-label="Back"
      >
        <ArrowLeft className="w-[16px] h-[16px]" strokeWidth={2.2} />
        Back
      </button>

      {/* Rename Section - Center */}
      <div className="flex items-center gap-1.5 flex-1 justify-center min-w-0">
        {editable && isEditing ? (
          <div className="flex items-center gap-1.5 max-w-full">
            <input
              type="text"
              value={filename}
              onChange={(e) => onFilenameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              autoFocus
              className="text-[15px] font-semibold text-[#07122E] text-center bg-transparent outline-none border-b border-[#6366F1] px-2 py-1 min-w-0 max-w-[220px]"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="w-7 h-7 flex items-center justify-center text-[#6366F1] active:opacity-50 transition-opacity shrink-0"
              aria-label="Save filename"
            >
              <Check className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        ) : editable ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-2 py-1 active:opacity-60 transition-opacity min-w-0 max-w-full group"
          >
            <span className="text-[15px] font-semibold text-[#07122E] truncate">
              {filename || 'Untitled'}
            </span>
            <Pencil
              className="w-[14px] h-[14px] text-[#8A93A3] group-hover:text-[#6366F1] transition-colors shrink-0"
              strokeWidth={2}
            />
          </button>
        ) : (
          <span className="text-[15px] font-semibold text-[#07122E] truncate px-2 py-1">
            {filename || 'Untitled'}
          </span>
        )}
      </div>

      {/* Right Action Slot / Spacer for symmetry */}
      {rightAction ? (
        <div className="shrink-0">{rightAction}</div>
      ) : (
        <div className="w-[76px] shrink-0" />
      )}
    </header>
  );
}