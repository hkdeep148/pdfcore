'use client';

import { FileText } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] opacity-20 blur-2xl animate-pulse" />

          {/* Logo container */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_20px_50px_-15px_rgba(99,102,241,0.5)]">
            <FileText className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
          </div>

          {/* Rotating spinner around logo */}
          <div className="absolute -inset-3 rounded-full border-4 border-[#6366F1]/20 border-t-[#6366F1] animate-spin" />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[16px] md:text-[18px] font-extrabold text-[#07122E]">
              PDF <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">Core</span>
            </span>
          </div>

          {/* Loading dots */}
          <div className="flex items-center gap-1">
            <span className="text-[13px] text-[#4B5874] font-medium">Loading</span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}