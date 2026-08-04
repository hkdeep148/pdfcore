'use client';

import { Zap } from 'lucide-react';

interface MobileCompressingScreenProps {
  title?: string;
  subtitle?: string;
}

export default function MobileCompressingScreen({
  title = 'Compressing...',
  subtitle = 'Almost done',
}: MobileCompressingScreenProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] to-white overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8">

        {/* ═══════════ Animated Icon ═══════════ */}
        <div className="relative mb-8">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-full bg-[#4F46E5]/25 blur-2xl animate-pulse" />

          {/* Rotating ring */}
          <div className="absolute -inset-3 rounded-full border-2 border-transparent border-t-[#4F46E5] border-r-[#8B5CF6] animate-spin-slow" />

          {/* Main icon */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] shadow-[0_15px_40px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center animate-compress-pulse">
            <Zap size={44} className="text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
        </div>

        {/* ═══════════ Text ═══════════ */}
        <h1 className="text-[22px] font-extrabold text-[#07122E] text-center mb-1.5 tracking-tight">
          {title}
        </h1>
        <p className="text-[13.5px] text-[#6B7280] text-center font-medium mb-8">
          {subtitle}
        </p>

        {/* ═══════════ Progress Dots ═══════════ */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>

      </div>
    </div>
  );
}