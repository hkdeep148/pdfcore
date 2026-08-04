'use client';

import { useState, useEffect, useRef } from 'react';

const DIMENSION_PRESETS = [
  { value: 0, label: 'Original', icon: '🖼️' },
  { value: 1920, label: 'Web (1920px)', icon: '💻' },
  { value: 1080, label: 'Social (1080px)', icon: '📱' },
  { value: 800, label: 'Email (800px)', icon: '✉️' },
  { value: 400, label: 'Thumbnail (400px)', icon: '🔍' },
];

interface ImageSizeDropdownProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

export default function ImageSizeDropdown({
  value,
  onChange,
  disabled,
}: ImageSizeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected =
    DIMENSION_PRESETS.find((p) => p.value === value) || DIMENSION_PRESETS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div>
      <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
        Image Size
      </label>
      <div className="relative" ref={dropdownRef}>

        {/* Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isOpen
              ? 'border-[#4F46E5] bg-[#EEF2FF]'
              : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'
          }`}
        >
          <span className="text-[16px]">{selected.icon}</span>
          <span className="flex-1 text-left text-[12.5px] font-bold text-[#111827]">
            {selected.label}
          </span>
          <svg
            viewBox="0 0 24 24"
            className={`w-4 h-4 text-[#6B7280] transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-[#E8EDF5] rounded-xl shadow-[0_10px_30px_-6px_rgba(15,23,42,0.15)] overflow-hidden z-20">
            {DIMENSION_PRESETS.map((preset) => {
              const isSelected = value === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => {
                    onChange(preset.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 transition-colors ${
                    isSelected
                      ? 'bg-[#EEF2FF] text-[#4F46E5]'
                      : 'text-[#111827] hover:bg-[#F8FAFF]'
                  }`}
                >
                  <span className="text-[15px]">{preset.icon}</span>
                  <span
                    className={`flex-1 text-left text-[12px] ${
                      isSelected ? 'font-extrabold' : 'font-semibold'
                    }`}
                  >
                    {preset.label}
                  </span>
                  {isSelected && (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-[#4F46E5]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}