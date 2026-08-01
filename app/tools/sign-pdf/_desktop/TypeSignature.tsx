'use client';

import { useSignPdfContext } from '../_context/SignPdfContext';
import { INK_COLORS, SIGNATURE_FONTS } from '../_utils/signer';

export default function TypeSignature() {
  const {
    typedText,
    setTypedText,
    selectedFont,
    setSelectedFont,
    inkColor,
    setInkColor,
    createTypedSignature,
  } = useSignPdfContext();

  return (
    <div className="space-y-4">
      {/* Font Selection */}
      <div>
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-2 block">
          Signature Style
        </label>
        <div className="grid grid-cols-1 gap-2">
          {SIGNATURE_FONTS.map((font) => (
            <button
              key={font.name}
              type="button"
              onClick={() => setSelectedFont(font.family)}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                selectedFont === font.family
                  ? 'border-[#4F46E5] bg-[#EEF2FF]'
                  : 'border-[#E5E7EB] hover:border-[#C7D2FE]'
              }`}
            >
              <p
                className="text-[24px] leading-none"
                style={{
                  fontFamily: font.family,
                  color: inkColor,
                }}
              >
                {typedText.trim() || 'Your Name'}
              </p>
              <p className="text-[10px] text-[#9CA3AF] mt-1">{font.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-2 block">
          Ink Color
        </label>
        <div className="flex items-center gap-2">
          {Object.entries(INK_COLORS).map(([name, color]) => (
            <button
              key={name}
              type="button"
              onClick={() => setInkColor(color)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                inkColor === color
                  ? 'border-[#4F46E5] scale-110 shadow-md'
                  : 'border-[#E5E7EB] hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`${name} color`}
              title={name}
            />
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div>
        <label className="text-[12.5px] font-semibold text-[#26324B] mb-2 block">
          Type Your Name
        </label>
        <input
          type="text"
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          placeholder="John Smith"
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[14px] text-[#07122E] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
        />
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={createTypedSignature}
        disabled={!typedText.trim()}
        className="w-full py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[14px] font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Create Signature
      </button>
    </div>
  );
}