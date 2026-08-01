'use client';

import { ReactNode } from 'react';

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function LoadingButton({
  isLoading,
  loadingText = 'Loading...',
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}