'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-[0_10px_24px_-6px_rgba(37,99,235,0.55)] hover:shadow-[0_14px_28px_-6px_rgba(37,99,235,0.65)]',
  secondary:
    'bg-white text-[#26324B] border-2 border-[#E2E2EE] hover:border-[#2563EB] hover:text-[#2563EB]',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-[0_8px_20px_-4px_rgba(239,68,68,0.5)]',
  ghost:
    'text-[#5B6472] hover:bg-[#F6F7FB]',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-[12px]',
  md: 'px-4 py-2.5 text-[13px]',
  lg: 'px-6 py-3.5 text-[14.5px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading…',
  icon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}