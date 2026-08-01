'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Files,
  Layers,
  Flame,
  FileText,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { tools } from './tools/_config/tools';
import LandingNavbar from './tools/_components/LandingNavbar';
import LandingFooter from './tools/_components/LandingFooter';

export default function HomePage() {
  // First 5 tools for mobile floating icons
  const heroIcons = tools.slice(0, 5);

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* ============ NAVBAR ============ */}
      <LandingNavbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden">
        {/* Mobile gradient background */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[#EDE9FE] via-[#E8E0FF] to-[#F3F0FF] pointer-events-none" />

        {/* Mobile decorative circles */}
        <div className="md:hidden absolute top-10 -left-20 w-60 h-60 bg-[#DDD6FE]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="md:hidden absolute bottom-20 -right-20 w-60 h-60 bg-[#C4B5FD]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Desktop background */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-[#F5F3FF] via-white to-[#FCE7F3] opacity-60" />
        <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6366F1] opacity-[0.08] blur-3xl rounded-full" />

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-8 pt-8 md:pt-14 pb-6 md:pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 md:bg-[#EAF1FF] border border-[#E0D4FC] md:border-transparent text-[#6D35FF] md:text-[#1E63FF] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-4 md:mb-5 backdrop-blur-sm md:backdrop-blur-none shadow-sm md:shadow-none">
              <Layers size={13} />
              <span>All-in-One Solution</span>
            </div>

            {/* Heading */}
            <h1 className="font-['Space_Grotesk',sans-serif] text-[28px] leading-[1.1] sm:text-[38px] md:text-[54px] md:leading-tight font-extrabold tracking-tight text-[#07122E]">
              Complete{' '}
              <span className="bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
                PDF
              </span>{' '}
              Toolkit
            </h1>

            {/* Subtitle */}
            <p className="mt-3 md:mt-4 text-[14px] md:text-[18px] text-[#4B5874] font-medium px-4 md:px-0 max-w-2xl mx-auto leading-relaxed">
              Powerful and easy-to-use online PDF Core
              <br className="md:hidden" /> to handle all your PDF needs.
            </p>

            {/* Trust badges */}
            <div className="mt-5 md:mt-7 flex items-center justify-center gap-0 md:gap-10 text-[11px] md:text-[14px] font-semibold text-[#26324B]">
              <div className="flex items-center gap-1.5 px-3 md:px-0">
                <Shield size={14} className="text-[#16A34A]" />
                <span>100% Free</span>
              </div>
              <div className="h-4 md:h-6 w-px bg-[#C7CADB]/60 md:bg-[#D8E0EE]" />
              <div className="flex items-center gap-1.5 px-3 md:px-0">
                <Lock size={14} className="text-[#4B5874]" />
                <span className="text-center">
                  Secure &amp;<br className="md:hidden" /> Private
                </span>
              </div>
              <div className="h-4 md:h-6 w-px bg-[#C7CADB]/60 md:bg-[#D8E0EE]" />
              <div className="flex items-center gap-1.5 px-3 md:px-0">
                <Files size={14} className="text-[#4B5874]" />
                <span className="text-center">
                  Works on All<br className="md:hidden" /> Devices
                </span>
              </div>
            </div>

            {/* Explore All Tools button - MOBILE ONLY */}
            <div className="mt-6 md:hidden">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[15px] font-bold shadow-[0_12px_28px_-8px_rgba(109,53,255,0.5)] hover:opacity-95 transition-opacity"
              >
                Explore All Tools
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link
                href="/#tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[15px] font-semibold px-6 py-3.5 rounded-xl transition-all shadow-[0_10px_30px_-8px_rgba(99,102,241,0.5)] hover:shadow-[0_14px_36px_-8px_rgba(99,102,241,0.6)] hover:scale-[1.02]"
              >
                Start Using Tools
                <ArrowRight size={16} />
              </Link>
              <a
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#26324B] text-[15px] font-semibold px-6 py-3.5 rounded-xl border-2 border-[#ECEDF3] hover:border-[#D1D5FF] transition-colors"
              >
                Browse all tools
              </a>
            </div>
          </motion.div>

          {/* MOBILE ONLY: Floating icons with curved background */}
          <div className="md:hidden relative mt-8">
            {/* Large curved background circle */}
            <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[140%] h-[220px] rounded-[50%] bg-gradient-to-b from-[#DDD6FE]/50 to-[#C4B5FD]/30 blur-sm pointer-events-none" />

            {/* Dotted curved lines */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 top-2 w-[130%] h-[180px] pointer-events-none"
              viewBox="0 0 400 180"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 20 60 Q 200 -20 380 60"
                stroke="#A78BFA"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0.4"
              />
              <path
                d="M 10 90 Q 200 10 390 90"
                stroke="#A78BFA"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0.3"
              />
              <path
                d="M 0 120 Q 200 40 400 120"
                stroke="#A78BFA"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0.25"
              />
            </svg>

            {/* Icons row */}
            <div className="relative flex items-center justify-center gap-3 pt-4">
              {heroIcons.map((tool, index) => (
                <Link href={tool.href} key={`hero-icon-${index}`}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(109,53,255,0.3)] border border-white/80 backdrop-blur-sm"
                    style={{ backgroundColor: tool.bgColor, color: tool.color }}
                  >
                    <div className="scale-[0.65]">{tool.icon}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE ONLY: Bottom wave transition */}
        <div className="md:hidden relative h-8 -mt-2 pointer-events-none">
          <svg
            className="absolute bottom-0 w-full h-full"
            viewBox="0 0 400 32"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 32V12C80 -4 160 -4 240 12C320 28 360 28 400 12V32H0Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* ============ MOST POPULAR TOOLS SECTION ============ */}
      <section id="tools" className="bg-[#F8FAFC] md:bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 pb-10 md:pb-14 pt-4 md:pt-10">
          {/* Section Header */}
          <div className="text-center mb-5 md:mb-8">
            {/* Mobile badge */}
            <div className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Flame size={12} />
              <span>Popular Tools</span>
            </div>

            {/* Desktop badge */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[12px] font-bold uppercase tracking-wider mb-3">
              <FileText size={12} />
              <span>Core Features</span>
            </div>

            <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight">
              Most Popular Tools
            </h2>

            {/* Mobile subtitle */}
            <p className="md:hidden mt-1.5 text-[13px] text-[#4B5874]">
              Quick access to our most used PDF Core
            </p>

            {/* Mobile "View All Tools" link */}
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 mt-2 md:hidden text-[13px] font-bold text-[#6D35FF]"
            >
              View All Tools
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Desktop: View All button aligned right */}
          <div className="hidden md:flex justify-end -mt-14 mb-6">
            <Link
              href="/tools"
              className="group inline-flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#1E63FF] bg-[#F8FAFF] border border-[#E7ECF5] hover:border-[#C9D8F3] hover:bg-[#EAF1FF] px-4 py-2.5 rounded-lg transition-all"
            >
              View All Tools
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Tool Cards Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5">
  {tools.map((tool, index) => {
    const CardContent = (
      <div
        className={`group h-full bg-white border rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.08)] md:shadow-[0_12px_28px_-24px_rgba(15,23,42,0.45)] transition-all relative ${
          tool.comingSoon
            ? 'border-[#E7ECF5] opacity-70 cursor-not-allowed'
            : 'border-[#E7ECF5] md:border-[#DDE5F0] hover:shadow-[0_18px_36px_-24px_rgba(37,99,235,0.55)] hover:border-[#C9D8F3] active:scale-[0.98]'
        }`}
        style={{ animationDelay: `${index * 40}ms` }}
      >
        {/* Coming Soon Badge */}
        {tool.comingSoon && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
            Soon
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-12 h-12 md:w-[60px] md:h-[60px] rounded-xl flex items-center justify-center flex-shrink-0 ${
            tool.comingSoon ? 'grayscale' : ''
          }`}
          style={{ backgroundColor: tool.bgColor, color: tool.color }}
        >
          {tool.icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className={`text-[14px] md:text-[15px] font-extrabold truncate ${
              tool.comingSoon ? 'text-[#8A97AE]' : 'text-[#07122E]'
            }`}>
              {tool.label}
            </h3>
            {!tool.comingSoon && (
              <ChevronRight
                size={16}
                className="text-[#C0C8D8] md:text-[#8A97AE] group-hover:text-[#1E63FF] transition-colors ml-auto flex-shrink-0"
              />
            )}
          </div>
          <p className={`mt-1 md:mt-2 text-[12px] leading-relaxed ${
            tool.comingSoon ? 'text-[#B0B7C3]' : 'text-[#4B5874]'
          }`}>
            {tool.description}
          </p>
        </div>
      </div>
    );

    // If coming soon → non-clickable div
    // Otherwise → clickable Link
    return tool.comingSoon ? (
      <div key={tool.href}>{CardContent}</div>
    ) : (
      <Link href={tool.href} key={tool.href}>
        {CardContent}
      </Link>
    );
  })}
</div>
        </div>
      </section>

      {/* ============ FOOTER (Why Choose Us + Newsletter + Bottom Bar) ============ */}
      <LandingFooter />
    </div>
  );
}