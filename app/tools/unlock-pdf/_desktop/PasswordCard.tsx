'use client';

import { useState } from 'react';
import type { UnlockPdfItem } from '../../_types';

interface PasswordCardProps {
  item: UnlockPdfItem;
  onUpdatePassword: (id: string, password: string) => void;
  onUnlock: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PasswordCard({
  item, onUpdatePassword, onUnlock, onDownload, onRemove,
}: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isChecking = item.status === 'checking';
  const needsPassword = item.status === 'needs-password';
  const isUnlocking = item.status === 'unlocking';
  const isUnlocked = item.status === 'unlocked';
  const isError = item.status === 'error';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && item.password) {
      onUnlock(item.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#ECEDF3] shadow-sm p-4 flex items-center gap-4">
      {/* Icon */}
      <div className={`w-12 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUnlocked ? 'bg-[#DCFCE7]' : needsPassword ? 'bg-[#FEF3C7]' : isError ? 'bg-[#FEE9E9]' : 'bg-[#EFF3FF]'
      }`}>
        {isUnlocked ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        ) : needsPassword ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : isError ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-[#2563EB]/30 border-t-[#2563EB] animate-spin" />
        )}
      </div>

      {/* Info + Password */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[#07122E] truncate mb-1">{item.name}</p>
        <p className="text-[11px] text-[#8A93A3] mb-2">{item.sizeMB}</p>

        {/* Status messages */}
        {isChecking && (
          <p className="text-[12px] text-[#2563EB] font-semibold">Checking encryption...</p>
        )}

        {/* ⭐ UNLOCKED STATE */}
        {isUnlocked && (
          <div className="space-y-1.5">
            <p className="text-[12px] text-[#10B981] font-semibold flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Successfully unlocked
            </p>
            
            {/* ⭐ Info badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[10px] font-bold">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                100% Private
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EFF3FF] text-[#1E40AF] text-[10px] font-bold">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                Print Quality
              </div>
            </div>
          </div>
        )}

        {isError && (
          <p className="text-[12px] text-[#EF4444] font-semibold">
            {item.errorMessage || 'Failed to read PDF'}
          </p>
        )}

        {/* Password input */}
        {(needsPassword || isUnlocking) && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={item.password}
                  onChange={(e) => onUpdatePassword(item.id, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter password"
                  disabled={isUnlocking}
                  className={`w-full px-3.5 py-2 pr-10 rounded-lg border-2 text-[13px] outline-none transition-colors ${
                    item.errorMessage
                      ? 'border-[#EF4444] focus:border-[#EF4444]'
                      : 'border-[#E2E2EE] focus:border-[#2563EB]'
                  } disabled:opacity-60`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#8A93A3] hover:text-[#26324B]"
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
              {item.errorMessage && needsPassword && (
                <p className="text-[11px] text-[#EF4444] font-medium">{item.errorMessage}</p>
              )}
            </div>

            {/* ⭐ PROGRESS BAR - appears during unlocking */}
            {isUnlocking && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] font-semibold text-[#2563EB] mb-1">
                  <span>Unlocking pages...</span>
                  <span>{item.progress ?? 0}%</span>
                </div>
                <div className="h-1.5 bg-[#EFF3FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-300 ease-out"
                    style={{ width: `${item.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {needsPassword && (
          <button
            type="button"
            onClick={() => onUnlock(item.id)}
            disabled={!item.password || isUnlocking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-40"
          >
            {isUnlocking ? (
              <>
                <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Unlock
              </>
            )}
          </button>
        )}

        {isUnlocked && (
          <button
            type="button"
            onClick={() => onDownload(item.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-white text-[12px] font-semibold hover:bg-[#059669] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        )}

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isUnlocking}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#EF4444] hover:bg-[#FEE9E9] transition-colors disabled:opacity-40"
          aria-label="Remove"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}