'use client';

import { useState } from 'react';
import { Zap } from 'lucide-react';
import { useCompressImageContext } from '../_context/CompressImageContext';

const COMPRESSION_LEVELS = [
  { label: 'Light', value: 90, description: 'Best quality', icon: '🎯' },
  { label: 'Balanced', value: 75, description: 'Recommended', icon: '⚖️', recommended: true },
  { label: 'Strong', value: 50, description: 'Max savings', icon: '⚡' },
];

const SIZE_PRESETS = [
  { label: '100 KB', value: 100 },
  { label: '500 KB', value: 500 },
  { label: '1 MB', value: 1024 },
  { label: '2 MB', value: 2048 },
];

const DIMENSION_PRESETS = [
  { value: 0, label: 'Original', icon: '🖼️' },
  { value: 1920, label: 'Web (1920px)', icon: '💻' },
  { value: 1080, label: 'Social (1080px)', icon: '📱' },
  { value: 800, label: 'Email (800px)', icon: '✉️' },
  { value: 400, label: 'Thumbnail (400px)', icon: '🔍' },
];

export default function MobileSettingsSheet() {
  const {
    mode, setMode,
    quality, setQuality,
    targetSize, setTargetSize,
    outputFormat, setOutputFormat,
    maxDimension, setMaxDimension,
    processing,
  } = useCompressImageContext();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#E8EDF5] active:bg-[#F8FAFF] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center">
            <Zap size={12} className="text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-bold text-[#07122E]">Settings</p>
            <p className="text-[10px] text-[#6B7280]">
              {COMPRESSION_LEVELS.find((l) => l.value === quality)?.label} · {outputFormat === 'image/jpeg' ? 'JPG' : 'WEBP'}
            </p>
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-2 rounded-xl bg-white border border-[#E8EDF5] p-4 space-y-4">

          {/* Mode Toggle */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
              Mode
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#F1F5F9]">
              <button
                onClick={() => setMode('quality')}
                disabled={processing}
                className={`px-3 py-2 rounded-md text-[11px] font-bold transition-all ${
                  mode === 'quality' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                Quality
              </button>
              <button
                onClick={() => setMode('size')}
                disabled={processing}
                className={`px-3 py-2 rounded-md text-[11px] font-bold transition-all ${
                  mode === 'size' ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-[#6B7280]'
                }`}
              >
                Target Size
              </button>
            </div>
          </div>

          {/* Quality */}
          {mode === 'quality' && (
            <div>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
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
                      className={`relative p-2.5 rounded-lg border-2 transition-all active:scale-95 disabled:opacity-50 ${
                        isSelected ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white'
                      }`}
                    >
                      {preset.recommended && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[8px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                          Best
                        </div>
                      )}
                      <div className={`text-[16px] mb-0.5 ${preset.recommended ? 'mt-1' : ''}`}>
                        {preset.icon}
                      </div>
                      <div className={`text-[11px] font-extrabold ${isSelected ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>
                        {preset.label}
                      </div>
                      <div className="text-[8.5px] text-[#6B7280] font-medium mt-0.5 leading-tight">
                        {preset.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size */}
          {mode === 'size' && (
            <div>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
                Target Size
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  min="10"
                  max="10240"
                  value={targetSize}
                  onChange={(e) => setTargetSize(Number(e.target.value))}
                  disabled={processing}
                  className="flex-1 px-3 py-2 rounded-lg border border-[#E8EDF5] text-[13px] font-semibold text-[#07122E] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] disabled:opacity-50"
                />
                <span className="text-[12px] font-bold text-[#6B7280]">KB</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZE_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setTargetSize(preset.value)}
                    disabled={processing}
                    className={`px-2 py-2 rounded-lg text-[10px] font-bold border transition-all active:scale-95 ${
                      targetSize === preset.value
                        ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                        : 'border-[#E8EDF5] bg-white text-[#4B5563]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Format */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
              Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOutputFormat('image/jpeg')}
                disabled={processing}
                className={`relative p-3 rounded-lg border-2 transition-all active:scale-95 ${
                  outputFormat === 'image/jpeg' ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white'
                }`}
              >
                <div className="text-[18px] mb-0.5">🌍</div>
                <div className={`text-[12px] font-extrabold mb-0.5 ${outputFormat === 'image/jpeg' ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>
                  JPG
                </div>
                <div className="text-[9px] text-emerald-600 font-bold">Best for all</div>
              </button>
              <button
                onClick={() => setOutputFormat('image/webp')}
                disabled={processing}
                className={`relative p-3 rounded-lg border-2 transition-all active:scale-95 ${
                  outputFormat === 'image/webp' ? 'border-[#4F46E5] bg-[#EEF2FF]' : 'border-[#E8EDF5] bg-white'
                }`}
              >
                <div className="text-[18px] mb-0.5">⚡</div>
                <div className={`text-[12px] font-extrabold mb-0.5 ${outputFormat === 'image/webp' ? 'text-[#4F46E5]' : 'text-[#07122E]'}`}>
                  WEBP
                </div>
                <div className="text-[9px] text-purple-600 font-bold">Max savings</div>
              </button>
            </div>
            {outputFormat === 'image/webp' && (
              <p className="mt-2 text-[10px] text-amber-700 leading-relaxed">
                ⚠ Not supported on older iOS/Office
              </p>
            )}
          </div>

          {/* Image Size */}
          <div>
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
              Image Size
            </label>
            <select
              value={maxDimension}
              onChange={(e) => setMaxDimension(Number(e.target.value))}
              disabled={processing}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-[#E8EDF5] text-[12px] font-bold text-[#07122E] focus:outline-none focus:border-[#4F46E5] disabled:opacity-50 bg-white"
            >
              {DIMENSION_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.icon} {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
}