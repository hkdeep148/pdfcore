'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Home,
  ArrowLeft,
  Search,
  FileQuestion,
  BookOpen,
  HelpCircle,
  Mail,
  Wrench,
} from 'lucide-react';
import LandingNavbar from './tools/_components/LandingNavbar';
import LandingFooter from './tools/_components/LandingFooter';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] flex flex-col">
      <LandingNavbar />

      <main className="flex-1 flex items-center justify-center py-16 md:py-24 px-5 md:px-8">
        <div className="max-w-[900px] mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated 404 Illustration */}
            <div className="relative mb-8 md:mb-12">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFF3FF] via-[#F5F3FF] to-[#FCE7F3] rounded-full blur-3xl opacity-60 animate-pulse" />

              {/* Main 404 text */}
              <div className="relative flex items-center justify-center gap-2 md:gap-4">
                <span className="font-['Space_Grotesk',sans-serif] text-[120px] md:text-[180px] font-extrabold leading-none bg-gradient-to-br from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
                  4
                </span>

                {/* Animated icon in middle */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-[#1E63FF] to-[#6D35FF] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)]">
                    <FileQuestion className="w-12 h-12 md:w-20 md:h-20 text-white" strokeWidth={2} />
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F59E0B] rounded-full animate-ping" />
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#EC4899] rounded-full animate-pulse" />
                </motion.div>

                <span className="font-['Space_Grotesk',sans-serif] text-[120px] md:text-[180px] font-extrabold leading-none bg-gradient-to-br from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
                  4
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8 md:mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase tracking-wider mb-4">
                <FileQuestion size={12} />
                <span>Page Not Found</span>
              </div>

              <h1 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-[#07122E] leading-tight tracking-tight mb-4">
                Oops! This page doesn&apos;t exist
              </h1>

              <p className="text-[15px] md:text-[17px] text-[#4B5874] max-w-xl mx-auto leading-relaxed">
                The page you&apos;re looking for might have been moved, deleted, or never existed. 
                Don&apos;t worry, let&apos;s get you back on track!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 md:mb-16">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[15px] font-bold shadow-[0_12px_28px_-8px_rgba(109,53,255,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(109,53,255,0.6)] hover:scale-[1.02] transition-all"
              >
                <Home size={18} />
                Back to Home
              </Link>

              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#07122E] text-[15px] font-bold border-2 border-[#E7ECF5] hover:border-[#C9D8F3] transition-all"
              >
                <Wrench size={18} />
                Explore Tools
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="border-t border-[#ECEDF3] pt-10 md:pt-12">
              <p className="text-[12px] font-bold text-[#8A93A3] uppercase tracking-wider mb-6">
                Popular Pages
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
                <HelpLink
                  href="/tools"
                  icon={<Wrench size={20} />}
                  title="PDF Tools"
                  color="#1E63FF"
                  bgColor="#DBEAFE"
                />
                <HelpLink
                  href="/blog"
                  icon={<BookOpen size={20} />}
                  title="Blog"
                  color="#7C3AED"
                  bgColor="#EDE9FE"
                />
                <HelpLink
                  href="/faq"
                  icon={<HelpCircle size={20} />}
                  title="FAQ"
                  color="#16A34A"
                  bgColor="#DCFCE7"
                />
                <HelpLink
                  href="/contact"
                  icon={<Mail size={20} />}
                  title="Contact"
                  color="#EC4899"
                  bgColor="#FCE7F3"
                />
              </div>
            </div>

            {/* Search Suggestion */}
            <div className="mt-10 md:mt-12 p-6 md:p-8 bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] rounded-2xl border border-[#E0D4FC]">
              <div className="flex items-start gap-4 max-w-xl mx-auto text-left">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Search className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#07122E] mb-1">
                    Looking for something specific?
                  </h3>
                  <p className="text-[13px] text-[#4B5874] leading-relaxed mb-3">
                    Try searching our blog for tutorials and guides, or explore all our free PDF tools.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E7ECF5] text-[12px] font-bold text-[#7C3AED] hover:border-[#C4B5FD] transition-colors"
                    >
                      <BookOpen size={12} />
                      Browse Blog
                    </Link>
                    <Link
                      href="/tools"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E7ECF5] text-[12px] font-bold text-[#7C3AED] hover:border-[#C4B5FD] transition-colors"
                    >
                      <Wrench size={12} />
                      View All Tools
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button (subtle) */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4B5874] hover:text-[#1E63FF] transition-colors"
              >
                <ArrowLeft size={14} />
                Go back to previous page
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

/* ============ HELP LINK COMPONENT ============ */

interface HelpLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  bgColor: string;
}

function HelpLink({ href, icon, title, color, bgColor }: HelpLinkProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 p-4 md:p-5 bg-white rounded-2xl border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_8px_20px_-6px_rgba(15,23,42,0.08)] transition-all"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <span className="text-[13px] md:text-[14px] font-extrabold text-[#07122E] group-hover:text-[#1E63FF] transition-colors">
        {title}
      </span>
    </Link>
  );
}