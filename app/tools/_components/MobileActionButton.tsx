'use client';

import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'secondary';

interface MobileActionButtonProps {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Label to show while loading (default: 'Processing...') */
  loadingLabel?: string;
  /** Optional badge number (e.g., number of items) */
  badge?: number;
  /** Button color variant (default: 'primary') */
  variant?: ButtonVariant;
  /** Optional icon before label */
  icon?: ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#3F6DE0] text-white shadow-[0_4px_14px_rgba(63,109,224,0.3)]',
  success:
    'bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-[0_4px_14px_rgba(16,185,129,0.4)]',
  danger:
    'bg-[#EF4444] text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]',
  secondary:
    'bg-[#F1F5F9] text-[#4B5563]',
};

export default function MobileActionButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  loadingLabel = 'Processing...',
  badge,
  variant = 'primary',
  icon,
}: MobileActionButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <div className="bg-white px-5 pt-2 pb-4 shrink-0">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-full h-[52px] text-[16px] font-bold rounded-[14px] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 ${VARIANT_STYLES[variant]}`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            {icon}
            {label}
            {badge !== undefined && badge > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[12px] font-bold">
                {badge}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}

/**
 * Dual-button variant for Cancel/Confirm actions (e.g., Preview Mode, Edit Mode)
 */
interface MobileDualActionButtonProps {
  leftLabel: string;
  leftOnClick: () => void;
  leftIcon?: ReactNode;
  leftVariant?: ButtonVariant;

  rightLabel: string;
  rightOnClick: () => void;
  rightIcon?: ReactNode;
  rightVariant?: ButtonVariant;

  disabled?: boolean;
}

export function MobileDualActionButton({
  leftLabel,
  leftOnClick,
  leftIcon,
  leftVariant = 'secondary',
  rightLabel,
  rightOnClick,
  rightIcon,
  rightVariant = 'success',
  disabled = false,
}: MobileDualActionButtonProps) {
  return (
    <div className="bg-white px-5 pt-2 pb-4 shrink-0 flex items-center gap-2">
      <button
        onClick={leftOnClick}
        disabled={disabled}
        className={`flex-1 h-[52px] rounded-[14px] text-[15px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 ${VARIANT_STYLES[leftVariant]}`}
      >
        {leftIcon}
        {leftLabel}
      </button>
      <button
        onClick={rightOnClick}
        disabled={disabled}
        className={`flex-1 h-[52px] rounded-[14px] text-[15px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 ${VARIANT_STYLES[rightVariant]}`}
      >
        {rightIcon}
        {rightLabel}
      </button>
    </div>
  );
}