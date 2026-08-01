'use client';

import { useState } from 'react';
import type { UnlockPdfItem } from '../../_types';

interface MobilePasswordCardProps {
  item: UnlockPdfItem;
  onUpdatePassword: (id: string, password: string) => void;
  onUnlock: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function MobilePasswordCard({
  item,
  onUpdatePassword,
  onUnlock,
  onDownload,
  onRemove,
}: MobilePasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isChecking = item.status === 'checking';
  const needsPassword = item.status === 'needs-password';
  const isUnlocking = item.status === 'unlocking';
  const isUnlocked = item.status === 'unlocked';
  const isError = item.status === 'error';

  return (
    <div
      className={`bg-white rounded-2xl border-2 p-3 transition-all ${
        isUnlocked
          ? 'border-[#10B981] shadow-[0_4px_12px_rgba(16,185,129,0.15)]'
          : isError
          ? 'border-[#EF4444]'
          : isUnlocking
          ? 'border-[#2563EB]'
          : needsPassword
          ? 'border-[#F59E0B]'
          : 'border-[#E8E8F0]'
      }`}
    >
      {/* Top: icon + name + remove */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-11 h-13 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isUnlocked
              ? 'bg-[#DCFCE7]'
              : needsPassword
              ? 'bg-[#FEF3C7]'
              : isError
              ? 'bg-[#FEE9E9]'
              : 'bg-[#EFF3FF]'
          }`}
        >
          {isUnlocked ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          ) : needsPassword ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ) : isError ? (
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#07122E] truncate">{item.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-[#8A93A3]">{item.sizeMB}</span>
            {isUnlocked && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-0.5">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Unlocked
              </span>
            )}
            {needsPassword && !item.errorMessage && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[9px] font-extrabold uppercase tracking-wide">
                Locked
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isUnlocking}
          className="w-8 h-8 rounded-full bg-[#FEE9E9] flex items-center justify-center flex-shrink-0 active:scale-90 disabled:opacity-40"
          aria-label="Remove"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Status - Checking */}
      {isChecking && (
        <div className="flex items-center gap-2 text-[12px] text-[#2563EB] font-semibold">
          <div className="w-3 h-3 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
          Checking if password-protected...
        </div>
      )}

      {/* Status - Error */}
      {isError && (
        <p className="text-[12px] text-[#EF4444] font-semibold">
          {item.errorMessage || 'Failed to read PDF'}
        </p>
      )}

      {/* Password input - needs-password OR unlocking */}
      {(needsPassword || isUnlocking) && (
        <>
          {/* Progress bar during unlock */}
          {isUnlocking && item.progress !== undefined && item.progress > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#2563EB] font-bold">Unlocking...</span>
                <span className="text-[#2563EB] font-bold">{item.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#EFF6FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={item.password}
              onChange={(e) => onUpdatePassword(item.id, e.target.value)}
              placeholder="Enter PDF password"
              disabled={isUnlocking}
              className={`w-full px-3 py-2.5 pr-10 rounded-lg border-2 text-[13px] outline-none transition-colors ${
                item.errorMessage
                  ? 'border-[#EF4444] focus:border-[#EF4444]'
                  : 'border-[#E2E2EE] focus:border-[#2563EB]'
              } disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#8A93A3]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {item.errorMessage && (
            <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-[#FEE9E9] border border-[#FCA5A5] rounded-lg">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#EF4444] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[11px] text-[#DC2626] font-semibold">{item.errorMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => onUnlock(item.id)}
            disabled={!item.password || isUnlocking}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#2563EB] text-white text-[13px] font-bold active:scale-[0.98] disabled:opacity-40"
          >
            {isUnlocking ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Unlock PDF
              </>
            )}
          </button>
        </>
      )}

      {/* Download button - unlocked state */}
      {isUnlocked && (
        <button
          type="button"
          onClick={() => onDownload(item.id)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#10B981] text-white text-[13px] font-bold active:scale-[0.98] shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Unlocked PDF
        </button>
      )}
    </div>
  );
}