'use client';

import { useState } from 'react';
import { useAddWatermarkContext } from '../_context/AddWatermarkContext';
import { SIZE_LABELS, POSITION_LABELS } from '../_utils/watermarker';
import type { WatermarkSize, WatermarkPosition } from '../../_types';

const sizes: WatermarkSize[] = ['small', 'medium', 'large', 'extra-large'];
const positions: WatermarkPosition[] = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

const presetColors = ['#EF4444', '#F59E0B', '#10B981', '#2563EB', '#8B5CF6', '#000000'];

export default function WatermarkOptionsPanel() {
  const { file, settings, updateSettings, resetSettings } = useAddWatermarkContext();
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!file) return null;

  return (
    <div className="space-y-4">
      {/* ⭐ Watermark Text */}
      <div>
        <label className="text-[11.5px] font-bold text-[#26324B] mb-1.5 block uppercase tracking-wide">
          Text
        </label>
        <input
          type="text"
          value={settings.text}
          onChange={(e) => updateSettings({ text: e.target.value })}
          placeholder="CONFIDENTIAL"
          className="w-full px-3 py-2.5 rounded-lg border-2 border-[#E2E2EE] focus:border-[#2563EB] text-[13px] font-bold outline-none transition-colors"
        />
      </div>

      {/* ⭐ Font Size - Compact 4-column grid */}
      <div>
        <label className="text-[11.5px] font-bold text-[#26324B] mb-1.5 block uppercase tracking-wide">
          Size
        </label>
        <div className="grid grid-cols-4 gap-1">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => updateSettings({ fontSize: size })}
              title={SIZE_LABELS[size]}
              className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                settings.fontSize === size
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white border border-[#E2E2EE] text-[#5B6472] hover:border-[#C9D8F3]'
              }`}
            >
              {size === 'extra-large' ? 'XL' : SIZE_LABELS[size].charAt(0)}
            </button>
          ))}
        </div>
      </div>

      {/* ⭐ Color - Compact single row */}
      <div>
        <label className="text-[11.5px] font-bold text-[#26324B] mb-1.5 block uppercase tracking-wide">
          Color
        </label>
        <div className="flex items-center gap-1.5">
          {/* Preset colors */}
          <div className="flex-1 grid grid-cols-6 gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateSettings({ color })}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  settings.color === color
                    ? 'border-[#2563EB] scale-110 shadow-md'
                    : 'border-[#E2E2EE] hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>
          {/* Custom color picker */}
          <div className="relative flex-shrink-0">
            <input
              type="color"
              value={settings.color}
              onChange={(e) => updateSettings({ color: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border-2 border-[#E2E2EE] appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-md"
              title="Custom color"
            />
          </div>
        </div>
      </div>

      {/* ⭐ Opacity + Rotation - Side by side sliders */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11.5px] font-bold text-[#26324B] uppercase tracking-wide">
              Opacity
            </label>
            <span className="text-[11px] font-bold text-[#2563EB]">
              {Math.round(settings.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={settings.opacity}
            onChange={(e) => updateSettings({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-[#2563EB]"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11.5px] font-bold text-[#26324B] uppercase tracking-wide">
              Rotation
            </label>
            <span className="text-[11px] font-bold text-[#2563EB]">
              {settings.rotation}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={settings.rotation}
            onChange={(e) => updateSettings({ rotation: parseInt(e.target.value, 10) })}
            className="w-full accent-[#2563EB]"
          />
        </div>
      </div>

      {/* ⭐ Position - Compact 3x3 grid */}
      <div>
        <label className="text-[11.5px] font-bold text-[#26324B] mb-1.5 block uppercase tracking-wide">
          Position
        </label>
        <div className="grid grid-cols-3 gap-1 max-w-[168px]">
          {positions.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => updateSettings({ position: pos })}
              className={`aspect-square rounded-md text-[14px] font-bold transition-all ${
                settings.position === pos
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white border border-[#E2E2EE] text-[#5B6472] hover:border-[#C9D8F3]'
              }`}
              aria-label={pos}
              title={pos.replace('-', ' ')}
            >
              {POSITION_LABELS[pos]}
            </button>
          ))}
        </div>
      </div>

      {/* ⭐ Apply To - Compact toggle */}
      <div>
        <label className="text-[11.5px] font-bold text-[#26324B] mb-1.5 block uppercase tracking-wide">
          Apply to
        </label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          <button
            type="button"
            onClick={() => updateSettings({ applyToAllPages: true })}
            className={`py-2 rounded-lg text-[12px] font-bold transition-all ${
              settings.applyToAllPages
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E2EE] text-[#5B6472] hover:border-[#C9D8F3]'
            }`}
          >
            All {file.totalPages}
          </button>
          <button
            type="button"
            onClick={() => updateSettings({ applyToAllPages: false })}
            className={`py-2 rounded-lg text-[12px] font-bold transition-all ${
              !settings.applyToAllPages
                ? 'bg-[#2563EB] text-white'
                : 'bg-white border border-[#E2E2EE] text-[#5B6472] hover:border-[#C9D8F3]'
            }`}
          >
            Specific
          </button>
        </div>
        {!settings.applyToAllPages && (
          <input
            type="text"
            value={settings.specificPages}
            onChange={(e) => updateSettings({ specificPages: e.target.value })}
            placeholder="e.g., 1, 3-5"
            className="w-full px-3 py-2 rounded-lg border-2 border-[#E2E2EE] focus:border-[#2563EB] text-[12px] outline-none"
          />
        )}
      </div>

      {/* ⭐ Advanced Settings (Collapsible) */}
      <div className="pt-2 border-t border-[#E2E2EE]">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-1 text-[11.5px] font-bold text-[#5B6472] hover:text-[#2563EB] transition-colors uppercase tracking-wide"
        >
          <span className="flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Advanced
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 animate-in fade-in duration-200">
            {/* Hex color input */}
            <div>
              <label className="text-[11px] font-semibold text-[#5B6472] mb-1 block">
                Hex color
              </label>
              <input
                type="text"
                value={settings.color.toUpperCase()}
                onChange={(e) => updateSettings({ color: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border-2 border-[#E2E2EE] focus:border-[#2563EB] text-[12px] font-mono outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ⭐ Reset button */}
      <button
        type="button"
        onClick={resetSettings}
        className="w-full py-2 rounded-lg border border-[#E2E2EE] text-[12px] font-bold text-[#5B6472] hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-[#FEE9E9] transition-colors flex items-center justify-center gap-1.5"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Reset to defaults
      </button>
    </div>
  );
}