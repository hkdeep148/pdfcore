'use client';

import { useState } from 'react';
import { X, Lock, Eye, EyeOff, Download, FileText } from 'lucide-react';
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
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Top: File icon + name + remove */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-14 rounded-lg bg-[#EDE9FE] flex flex-col items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-[#8B5CF6]" strokeWidth={2} />
          <span className="text-[8px] font-bold text-[#8B5CF6] mt-0.5">PDF</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#0F172A] truncate">{item.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] text-[#94A3B8]">{item.sizeMB}</span>
            <span className="text-[10px] text-[#CBD5E1]">|</span>
            {isUnlocked ? (
              <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] text-[9px] font-extrabold uppercase tracking-wide">
                UNLOCKED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[9px] font-extrabold uppercase tracking-wide">
                LOCKED
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isUnlocking}
          className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center flex-shrink-0 active:scale-90 disabled:opacity-40"
          aria-label="Remove"
        >
          <X size={16} className="text-[#EF4444]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Status — Checking */}
      {isChecking && (
        <div className="flex items-center gap-2 text-[12px] text-[#8B5CF6] font-semibold py-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] animate-spin" />
          Checking if password-protected...
        </div>
      )}

      {/* Status — Error */}
      {isError && (
        <p className="text-[12px] text-[#EF4444] font-semibold py-2">
          {item.errorMessage || 'Failed to read PDF'}
        </p>
      )}

      {/* Password input & Unlock button */}
      {(needsPassword || isUnlocking) && (
        <>
          {isUnlocking && item.progress !== undefined && item.progress > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#8B5CF6] font-bold">Unlocking...</span>
                <span className="text-[#8B5CF6] font-bold">{item.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#EDE9FE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Password input with lock icon left + eye toggle right */}
          <div className="relative mb-2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Lock size={16} strokeWidth={2} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={item.password}
              onChange={(e) => onUpdatePassword(item.id, e.target.value)}
              placeholder="Enter PDF password"
              disabled={isUnlocking}
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#F8FAFC] border-2 text-[13px] text-[#0F172A] outline-none transition-colors ${
                item.errorMessage
                  ? 'border-[#EF4444]'
                  : 'border-transparent focus:border-[#8B5CF6] focus:bg-white'
              } disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
            </button>
          </div>

          {item.errorMessage && (
            <div className="mb-2 px-3 py-2 bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg">
              <p className="text-[11px] text-[#DC2626] font-semibold">{item.errorMessage}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => onUnlock(item.id)}
            disabled={!item.password || isUnlocking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#8B5CF6] text-white text-[14px] font-bold active:scale-[0.98] transition disabled:opacity-40 shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
          >
            {isUnlocking ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <Lock size={16} strokeWidth={2.5} />
                Unlock PDF
              </>
            )}
          </button>
        </>
      )}

      {/* Download button — unlocked */}
      {isUnlocked && (
        <button
          type="button"
          onClick={() => onDownload(item.id)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#10B981] text-white text-[14px] font-bold active:scale-[0.98] shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
        >
          <Download size={16} strokeWidth={2.5} />
          Download Unlocked PDF
        </button>
      )}
    </div>
  );
}