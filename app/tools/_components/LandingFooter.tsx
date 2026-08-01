'use client';

import Link from 'next/link';
import { FileText, Shield, Lock, ImageIcon, ArrowRight } from 'lucide-react';
import { openCookieSettings } from './CookieBanner';

export default function LandingFooter() {
  return (
    <>
      {/* ================ WHY CHOOSE US SECTION ================ */}
      <section className="bg-gradient-to-b from-[#F5F3FF] via-[#EEF2FF] to-[#F5F3FF]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.6fr] gap-8 md:gap-10 items-center">
            {/* Left column: Heading */}
            <div className="text-center lg:text-left">
              <p className="text-[13px] md:text-[14px] font-bold text-[#7C3AED] mb-2 md:mb-3">
                Why Choose Us?
              </p>
              <h2 className="font-['Space_Grotesk',sans-serif] text-[26px] md:text-[32px] font-extrabold text-[#07122E] leading-tight mb-3 md:mb-4">
                Simple. Fast. Secure.
              </h2>
              <p className="text-[14px] text-[#4B5874] leading-relaxed mb-5 md:mb-6 max-w-md mx-auto lg:mx-0">
                We built our tools to make your PDF work smarter, not harder. All tools are free and work right in your browser.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#C4B5FD] text-[14px] font-bold text-[#7C3AED] hover:bg-white hover:border-[#7C3AED] transition-all"
              >
                Learn More
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right column: 4 feature cards with dividers */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Dashed divider lines (desktop only) */}
              <div className="hidden lg:block absolute inset-y-4 left-1/4 w-px border-l border-dashed border-[#C7CADB]" />
              <div className="hidden lg:block absolute inset-y-4 left-1/2 w-px border-l border-dashed border-[#C7CADB]" />
              <div className="hidden lg:block absolute inset-y-4 left-3/4 w-px border-l border-dashed border-[#C7CADB]" />

              {/* Feature 1: Privacy (Green Shield) */}
              <div className="text-center px-2 md:px-3">
                <div className="relative w-20 h-20 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-200/40 rounded-full blur-xl pointer-events-none" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg flex items-center justify-center">
                    <Shield size={30} className="text-white" fill="white" fillOpacity={0.2} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full opacity-70 pointer-events-none" />
                  <div className="absolute -bottom-1 -left-2 w-2 h-2 bg-emerald-400 rounded-full opacity-60 pointer-events-none" />
                </div>
                <h3 className="text-[14px] md:text-[15px] font-extrabold text-[#07122E] mb-2">Your Privacy Matters</h3>
                <p className="text-[12px] text-[#4B5874] leading-relaxed">
                  Files are processed locally in your browser. Nothing is uploaded.
                </p>
              </div>

              {/* Feature 2: Lightning (Purple Bolt) */}
              <div className="text-center px-2 md:px-3">
                <div className="relative w-20 h-20 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-purple-200/40 rounded-full blur-xl pointer-events-none" />
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-14 h-14 drop-shadow-lg" fill="url(#lightning-gradient)">
                      <defs>
                        <linearGradient id="lightning-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A78BFA" />
                          <stop offset="100%" stopColor="#7C3AED" />
                        </linearGradient>
                      </defs>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 right-0 w-2 h-2 bg-purple-300 rounded-full opacity-70 pointer-events-none" />
                  <div className="absolute bottom-0 -left-1 w-3 h-3 bg-purple-400 rounded-full opacity-60 pointer-events-none" />
                </div>
                <h3 className="text-[14px] md:text-[15px] font-extrabold text-[#07122E] mb-2">Lightning Fast</h3>
                <p className="text-[12px] text-[#4B5874] leading-relaxed">
                  Our tools are optimized for speed so you can get things done quickly.
                </p>
              </div>

              {/* Feature 3: No Installation (Blue Browser) */}
              <div className="text-center px-2 md:px-3">
                <div className="relative w-20 h-20 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-200/40 rounded-full blur-xl pointer-events-none" />
                  <div className="relative w-16 h-14 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg overflow-hidden">
                    {/* Browser top bar */}
                    <div className="h-3 bg-blue-700/40 flex items-center gap-1 px-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    </div>
                    {/* Checkmark */}
                    <div className="flex items-center justify-center h-[calc(100%-12px)]">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full opacity-70 pointer-events-none" />
                </div>
                <h3 className="text-[14px] md:text-[15px] font-extrabold text-[#07122E] mb-2">No Installation</h3>
                <p className="text-[12px] text-[#4B5874] leading-relaxed">
                  Everything works online. No downloads or installations required.
                </p>
              </div>

              {/* Feature 4: Always Accessible (Orange Layers) */}
              <div className="text-center px-2 md:px-3">
                <div className="relative w-20 h-20 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-orange-200/40 rounded-full blur-xl pointer-events-none" />
                  <div className="relative w-16 h-14 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-9 h-9 text-white/95" fill="currentColor">
                      <path
                        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-1 right-1 w-2 h-2 bg-orange-300 rounded-full opacity-70 pointer-events-none" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full opacity-60 pointer-events-none" />
                </div>
                <h3 className="text-[14px] md:text-[15px] font-extrabold text-[#07122E] mb-2">Always Accessible</h3>
                <p className="text-[12px] text-[#4B5874] leading-relaxed">
                  Use our tools on any device, anytime, anywhere.
                </p>
              </div>
            </div>
          </div>

          {/* ================ CTA BANNER (Dark) ================ */}
          <div className="mt-10 md:mt-12 relative bg-[#0B1729] rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(11,23,41,0.5)]">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center px-6 md:px-10 py-8 text-center lg:text-left">
              {/* Left: Folder illustration */}
              <div className="relative w-28 h-20 lg:w-32 lg:h-24 flex-shrink-0">
                {/* Back folder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#6D35FF] rounded-lg transform -rotate-6 translate-x-2 translate-y-1 shadow-lg" />
                {/* Front folder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] rounded-lg shadow-xl">
                  <div className="absolute top-0 left-0 w-12 h-3 bg-[#6D35FF] rounded-t-lg" />
                </div>
                {/* Image icon overlay */}
                <div className="absolute top-1 right-1 w-7 h-7 rounded-md bg-gradient-to-br from-[#C4B5FD] to-[#8B5CF6] flex items-center justify-center shadow-md">
                  <ImageIcon size={14} className="text-white" />
                </div>
                {/* Lock icon overlay */}
                <div className="absolute bottom-1 right-2 w-6 h-6 rounded-md bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center shadow-md">
                  <Lock size={12} className="text-white" fill="white" fillOpacity={0.3} />
                </div>
              </div>

              {/* Middle: Text */}
              <div className="flex-1">
                <h3 className="font-['Space_Grotesk',sans-serif] text-[20px] md:text-[24px] font-extrabold text-white mb-2">
                  Ready to work with PDFs?
                </h3>
                <p className="text-[13px] md:text-[15px] text-[#B8C4D9]">
                  Explore our free PDF tools — no signup required, no hidden costs.
                </p>
              </div>

              {/* Right: CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full lg:w-auto flex-shrink-0">
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6D35FF] text-white text-[14px] font-bold hover:opacity-95 transition-opacity whitespace-nowrap shadow-lg"
                >
                  Explore All Tools
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white text-[14px] font-bold border border-white/20 hover:bg-white/20 transition-all whitespace-nowrap"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================ MAIN FOOTER WITH LINKS ================ */}
      <footer className="bg-[#0B1729] text-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-6">
            {/* Column 1: Brand */}
            <div className="col-span-2 lg:col-span-2 pr-4">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6D35FF] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(109,53,255,0.5)]">
                  <FileText size={18} className="text-white" />
                </div>
                <span className="text-[18px] font-extrabold text-white">
                  PDF <span className="text-[#A78BFA]">Core</span>
                </span>
              </Link>
              <p className="text-[13px] text-[#B8C4D9] leading-relaxed mb-5 max-w-sm">
                Free, secure, and fast PDF tools that work right in your browser. Your files never leave your device.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold text-[#B8C4D9]">
                  <Shield size={11} className="text-emerald-400" />
                  <span>Privacy First</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold text-[#B8C4D9]">
                  <Lock size={11} className="text-blue-400" />
                  <span>100% Free</span>
                </div>
              </div>
            </div>

            {/* Column 2: Tools */}
            <div>
              <h4 className="text-[13px] font-extrabold text-white uppercase tracking-wider mb-4">
                Tools
              </h4>
              <ul className="space-y-2.5">
                <FooterLink href="/tools/merge-pdf">Merge PDF</FooterLink>
                <FooterLink href="/tools/split-pdf">Split PDF</FooterLink>
                <FooterLink href="/tools/compress-pdf">Compress PDF</FooterLink>
                <FooterLink href="/tools/pdf-to-image">PDF to Image</FooterLink>
                <FooterLink href="/tools/image-to-pdf">Image to PDF</FooterLink>
                <li className="pt-1">
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-1 text-[13px] font-bold text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
                  >
                    All Tools
                    <ArrowRight size={12} />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-[13px] font-extrabold text-white uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/security">Security</FooterLink>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className="text-[13px] font-extrabold text-white uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/security">Security</FooterLink>
                <li>
                  <button
                    type="button"
                    onClick={openCookieSettings}
                    className="text-[13px] text-[#B8C4D9] hover:text-white transition-colors text-left"
                  >
                    Cookie Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              <span className="text-[12.5px] text-[#7F8CA3]">
                © {new Date().getFullYear()} PDF Core. All rights reserved.
              </span>
              <span className="hidden md:inline text-[#3F4A5F]">•</span>
              <span className="text-[12.5px] text-[#7F8CA3]">
                Made with <span className="text-[#EF4444]">♥</span> for everyone
              </span>
            </div>

            <div className="flex items-center gap-4 text-[12.5px] text-[#7F8CA3]">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-[#3F4A5F]">•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="text-[#3F4A5F]">•</span>
              <button
                type="button"
                onClick={openCookieSettings}
                className="hover:text-white transition-colors"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ============ FOOTER LINK COMPONENT ============ */

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-[#B8C4D9] hover:text-white transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}