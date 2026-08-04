'use client';

import { useCompressImageContext } from '../_context/CompressImageContext';
import ImageSizeDropdown from './ImageSizeDropdown';

// ============ CONSTANTS ============
const COMPRESSION_LEVELS = [
  { label: 'Light', value: 90, description: 'Best quality', icon: '🎯' },
  {
    label: 'Balanced',
    value: 75,
    description: 'Recommended',
    icon: '⚖️',
    recommended: true,
  },
  { label: 'Strong', value: 50, description: 'Max savings', icon: '⚡' },
];

const SIZE_PRESETS = [
  { label: '100 KB', value: 100 },
  { label: '500 KB', value: 500 },
  { label: '1 MB', value: 1024 },
  { label: '2 MB', value: 2048 },
];

export default function SettingsPanel() {
  const {
    mode, setMode,
    quality, setQuality,
    targetSize, setTargetSize,
    outputFormat, setOutputFormat,
    maxDimension, setMaxDimension,
    processing,
  } = useCompressImageContext();

  return (
    <div className="space-y-5">

      {/* ── Mode Toggle ── */}
      <div>
        <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
          Mode
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#F1F5F9]">
          <button
            onClick={() => setMode('quality')}
            disabled={processing}
            className={`px-3 py-2 rounded-md text-[12px] font-bold transition-all ${
              mode === 'quality'
                ? 'bg-white text-[#4F46E5] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Quality
          </button>
          <button
            onClick={() => setMode('size')}
            disabled={processing}
            className={`px-3 py-2 rounded-md text-[12px] font-bold transition-all ${
              mode === 'size'
                ? 'bg-white text-[#4F46E5] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            Target Size
          </button>
        </div>
      </div>

      {/* ── Quality Mode ── */}
      {mode === 'quality' && (
        <div>
          <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3 block">
            Compression Level
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {COMPRESSION_LEVELS.map((preset) => {
              const isSelected = quality === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => setQuality(preset.value)}
                  disabled={processing}
                  className={`relative p-3 rounded-lg border-2 transition-all disabled:opacity-50 ${
                    isSelected
                      ? 'border-[#4F46E5] bg-[#EEF2FF]'
                      : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'
                  }`}
                >
                  {preset.recommended && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8.5px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                      Recommended
                    </div>
                  )}
                  <div
                    className={`text-[18px] mb-1 ${
                      preset.recommended ? 'mt-1.5' : 'mt-0'
                    }`}
                  >
                    {preset.icon}
                  </div>
                  <div
                    className={`text-[12px] font-extrabold ${
                      isSelected ? 'text-[#4F46E5]' : 'text-[#111827]'
                    }`}
                  >
                    {preset.label}
                  </div>
                  <div className="text-[9.5px] text-[#6B7280] font-medium mt-0.5 leading-tight">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Size Mode ── */}
      {mode === 'size' && (
        <div>
          <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
            Target Size
          </label>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              min="10"
              max="10240"
              value={targetSize}
              onChange={(e) => setTargetSize(Number(e.target.value))}
              disabled={processing}
              className="flex-1 px-3 py-2 rounded-lg border border-[#E8EDF5] text-[13px] font-semibold text-[#111827] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] disabled:opacity-50"
            />
            <span className="text-[12px] font-bold text-[#6B7280]">KB</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {SIZE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setTargetSize(preset.value)}
                disabled={processing}
                className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all ${
                  targetSize === preset.value
                    ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                    : 'border-[#E8EDF5] bg-white text-[#4B5563] hover:border-[#C7D2FE]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Format ── */}
      <div>
        <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
          Format
        </label>
        <div className="space-y-2">

          {/* JPG */}
          <button
            onClick={() => setOutputFormat('image/jpeg')}
            disabled={processing}
            className={`relative w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              outputFormat === 'image/jpeg'
                ? 'border-[#4F46E5] bg-[#EEF2FF]'
                : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-[20px] shrink-0 ${
                outputFormat === 'image/jpeg' ? 'bg-white shadow-sm' : 'bg-[#F1F5F9]'
              }`}
            >
              🌍
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-[14px] font-extrabold ${
                    outputFormat === 'image/jpeg' ? 'text-[#4F46E5]' : 'text-[#111827]'
                  }`}
                >
                  JPG
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8.5px] font-extrabold uppercase tracking-wider leading-none">
                  Best for All
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-tight">
                Universal. High Quality.
              </p>
            </div>
            {outputFormat === 'image/jpeg' && (
              <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>

          {/* WEBP */}
          <button
            onClick={() => setOutputFormat('image/webp')}
            disabled={processing}
            className={`relative w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              outputFormat === 'image/webp'
                ? 'border-[#4F46E5] bg-[#EEF2FF]'
                : 'border-[#E8EDF5] bg-white hover:border-[#C7D2FE]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-[20px] shrink-0 ${
                outputFormat === 'image/webp' ? 'bg-white shadow-sm' : 'bg-[#F1F5F9]'
              }`}
            >
              ⚡
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-[14px] font-extrabold ${
                    outputFormat === 'image/webp' ? 'text-[#4F46E5]' : 'text-[#111827]'
                  }`}
                >
                  WEBP
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-[8.5px] font-extrabold uppercase tracking-wider leading-none">
                  Max Savings
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-tight">
                30% smaller. Modern only.
              </p>
            </div>
            {outputFormat === 'image/webp' && (
              <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* WEBP Warning */}
        {outputFormat === 'image/webp' && (
          <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-[10px] text-amber-800 leading-relaxed">
              <span className="font-bold">⚠ Not supported:</span> Older iOS, Outlook, PowerPoint
            </p>
          </div>
        )}
      </div>

      {/* ── Image Size Dropdown ── */}
      <ImageSizeDropdown
        value={maxDimension}
        onChange={setMaxDimension}
        disabled={processing}
      />

    </div>
  );
}