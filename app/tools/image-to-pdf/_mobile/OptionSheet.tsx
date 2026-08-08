'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';

export interface OptionItem<T extends string> {
  id: T;
  label: string;
  hint?: string;
}

interface OptionSheetProps<T extends string> {
  open: boolean;
  title: string;
  options: OptionItem<T>[];
  value: T;
  onChange: (val: T) => void;
  onClose: () => void;
}

export default function OptionSheet<T extends string>({
  open, title, options, value, onChange, onClose,
}: OptionSheetProps<T>) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pb-6 animate-in slide-in-from-bottom duration-300">
        {/* handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#CBD5E1] rounded-full" />
        </div>

        {/* title */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#0F172A]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[14px] font-semibold text-[#2563EB] active:opacity-70"
          >
            Done
          </button>
        </div>

        {/* options */}
        <div className="max-h-[60vh] overflow-y-auto">
          {options.map((opt) => {
            const active = opt.id === value;
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 active:bg-[#F8FAFC] transition ${
                  active ? 'bg-[#EFF6FF]' : ''
                }`}
              >
                <div className="flex-1 text-left">
                  <div className={`text-[15px] font-semibold ${active ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                    {opt.label}
                  </div>
                  {opt.hint && (
                    <div className="text-[12px] text-[#94A3B8] mt-0.5">{opt.hint}</div>
                  )}
                </div>
                {active && <Check size={20} className="text-[#2563EB]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}