// app/tools/_components/MobileHomeView.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Shield,
  Lock,
  Smartphone,
  ArrowRight,
  Image as ImageIcon,
  Combine,
  SplitSquareHorizontal,
  Files,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { popularTools } from '../_config/tools';

export default function MobileHomeView() {
  return (
    <div className="md:hidden pb-16 bg-white overflow-x-hidden">
      {/* ============ HERO SECTION (Subtle Gradient with Fade-out Effect) ============ */}
      <section className="relative bg-gradient-to-b from-[#F4F2FF] via-[#FAF9FF] to-white pt-10 pb-10 px-4 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-indigo-100/80 shadow-xs mb-5">
          <Layers size={13} className="text-[#5B4EF5]" strokeWidth={2.5} />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B4EF5]">
            ALL-IN-ONE SOLUTION
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-[34px] sm:text-[38px] font-extrabold tracking-tight text-[#07122E] leading-[1.12] mb-3">
          Complete <span className="text-[#5B4EF5]">PDF</span> Toolkit
        </h1>

        {/* Subtitle */}
        <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed max-w-[280px] mx-auto mb-6">
          Powerful and easy-to-use online PDF Core to handle all your PDF needs.
        </p>

        {/* 3 Trust Badges */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-[12px] font-bold text-[#07122E] mb-7">
          <div className="inline-flex items-center gap-1">
            <Shield size={13} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
            <span>100% Free</span>
          </div>

          <span className="text-slate-300 font-light">|</span>

          <div className="inline-flex items-center gap-1">
            <Lock size={13} className="text-slate-600 shrink-0" strokeWidth={2.5} />
            <span>Secure &amp; Private</span>
          </div>

          <span className="text-slate-300 font-light">|</span>

          <div className="inline-flex items-center gap-1">
            <Smartphone size={13} className="text-slate-600 shrink-0" strokeWidth={2.5} />
            <span>Works on All Devices</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mb-9">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#5B4EF5] hover:bg-[#4C3FE2] text-white text-[15px] font-bold shadow-[0_8px_20px_-4px_rgba(91,78,245,0.45)] active:scale-95 transition-all duration-200"
          >
            <span>Explore All Tools</span>
            <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
        </div>

        {/* 5 Circular Quick Tool Icons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Image to PDF */}
          <Link
            href="/tools/image-to-pdf"
            aria-label="Image to PDF"
            className="w-12 h-12 rounded-full bg-[#F3E8FF] text-[#8B3DFF] shadow-sm border border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <ImageIcon size={20} strokeWidth={2.2} />
          </Link>

          {/* PDF to Image */}
          <Link
            href="/tools/pdf-to-image"
            aria-label="PDF to Image"
            className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] shadow-sm border border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <ImageIcon size={20} strokeWidth={2.2} />
          </Link>

          {/* Merge PDF */}
          <Link
            href="/tools/merge-pdf"
            aria-label="Merge PDF"
            className="w-12 h-12 rounded-full bg-[#EAF1FF] text-[#2563EB] shadow-sm border border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Combine size={20} strokeWidth={2.2} />
          </Link>

          {/* Split PDF */}
          <Link
            href="/tools/split-pdf"
            aria-label="Split PDF"
            className="w-12 h-12 rounded-full bg-[#FFEDD5] text-[#F97316] shadow-sm border border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <SplitSquareHorizontal size={20} strokeWidth={2.2} />
          </Link>

          {/* Organize PDF */}
          <Link
            href="/tools/organize-pdf"
            aria-label="Organize PDF"
            className="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#7C3AED] shadow-sm border border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <Files size={20} strokeWidth={2.2} />
          </Link>
        </div>
      </section>

      {/* ============ MOST POPULAR TOOLS SECTION ============ */}
      <section className="bg-white px-4 pt-8 pb-12">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
            <Flame size={13} fill="currentColor" strokeWidth={0} />
            <span>POPULAR TOOLS</span>
          </div>

          {/* Headline */}
          <h2 className="text-[26px] font-extrabold text-[#07122E] tracking-tight mb-1">
            Most Popular Tools
          </h2>

          {/* Subtitle */}
          <p className="text-[13.5px] font-medium text-slate-500 mb-2">
            Quick access to our most used PDF Core
          </p>

          {/* View All Tools Link */}
          <div className="mb-6">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-[#5B4EF5] text-[13.5px] font-bold hover:underline"
            >
              <span>View All Tools</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Tool Cards List */}
        <div className="max-w-md mx-auto space-y-3.5">
          {popularTools.map((tool: any) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 active:scale-[0.99] transition-all duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Tool Icon Container */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: tool.bgColor,
                    color: tool.color,
                  }}
                >
                  <div className="scale-95">{tool.icon}</div>
                </div>

                {/* Tool Text */}
                <div className="min-w-0 text-left">
                  <h3 className="text-[16px] font-bold text-[#07122E] leading-tight group-hover:text-[#5B4EF5] transition-colors">
                    {tool.label}
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-0.5 line-clamp-1">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Right Chevron */}
              <ChevronRight
                size={18}
                className="text-slate-400 shrink-0 group-hover:text-[#5B4EF5] group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}