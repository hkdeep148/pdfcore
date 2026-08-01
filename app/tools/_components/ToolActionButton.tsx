'use client';

import { ReactNode } from 'react';

interface ToolActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  icon: ReactNode;
  label: string;
  loadingLabel?: string;
  subtitle?: string;
}

export default function ToolActionButton({
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  label,
  loadingLabel = 'Processing…',
  subtitle,
}: ToolActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] hover:from-[#4338CA] hover:to-[#5B4FE0] text-white font-bold shadow-[0_8px_20px_-4px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <span className="text-[15px]">{loadingLabel}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5">{icon}</span>
            <span className="text-[15px]">{label}</span>
          </div>
          {subtitle && (
            <span className="text-[11.5px] text-white/80 font-medium">
              {subtitle}
            </span>
          )}
        </>
      )}
    </button>
  );
}