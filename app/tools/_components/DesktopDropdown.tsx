'use client';

import { useEffect } from 'react';

interface DesktopDropdownProps<T extends string> {
  id: string;
  value: T;
  options: readonly T[];
  labels?: Partial<Record<T, string>>;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onChange: (v: T) => void;
}

/**
 * Reusable dropdown for the right options panel.
 * Auto-closes when clicking outside.
 */
export default function DesktopDropdown<T extends string>({
  id,
  value,
  options,
  labels,
  openId,
  setOpenId,
  onChange,
}: DesktopDropdownProps<T>) {
  const isOpen = openId === id;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-desktop-dropdown]')) {
        setOpenId(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [setOpenId]);

  return (
    <div className="relative" data-desktop-dropdown>
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-[#E2E2EE] bg-white text-[13px] font-medium text-[#26324B] hover:border-[#2563EB] transition-colors"
      >
        {labels?.[value] ?? value}
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-[#8A93A3] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-[#E2E2EE] rounded-lg shadow-xl z-50 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpenId(null);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-[13px] font-medium hover:bg-[#EFF3FF] transition-colors ${
                value === opt ? 'text-[#2563EB] bg-[#EFF3FF]' : 'text-[#26324B]'
              }`}
            >
              {labels?.[opt] ?? opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}