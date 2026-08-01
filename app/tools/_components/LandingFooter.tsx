// app/tools/_components/LandingFooter.tsx
'use client';

import Link from 'next/link';
import {
  FileText,
  Shield,
  Lock,
  ArrowRight,
  Zap,
  WifiOff,
  Layers,
  Mail,
} from 'lucide-react';
import { openCookieSettings } from './CookieBanner';

export default function LandingFooter() {
  return (
    <>
      {/* ================ WHY CHOOSE US SECTION ================ */}
      <section className="relative bg-white">

        {/* ============ DESKTOP WHY CHOOSE US (hidden md:block) ============ */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold uppercase tracking-wider mb-4 border border-indigo-100">
                Why Choose Us
              </div>
              <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
                Your files,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
                  your device
                </span>
                <span className="text-slate-900">.</span>
              </h2>
            </div>
            <p className="text-[14px] md:text-[15px] text-slate-500 font-medium max-w-md md:text-right leading-relaxed">
              Zero uploads. Zero tracking. All PDF processing happens locally in your browser.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="group h-full block bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <Shield size={22} className="text-emerald-600" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] md:text-base font-bold text-slate-900 mb-1.5">100% Private</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Your files are processed locally in your browser. They never leave your device.
              </p>
            </div>

            <div className="group h-full block bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <Zap size={22} className="text-purple-600" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] md:text-base font-bold text-slate-900 mb-1.5">Lightning Fast</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                No upload wait times. Processing happens instantly right on your device.
              </p>
            </div>

            <div className="group h-full block bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <WifiOff size={22} className="text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] md:text-base font-bold text-slate-900 mb-1.5">Works Offline</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                All processing runs in your browser. No servers, no internet needed after loading.
              </p>
            </div>

            <div className="group h-full block bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <Layers size={22} className="text-orange-600" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] md:text-base font-bold text-slate-900 mb-1.5">Always Free</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                All tools are completely free. No hidden costs, no sign-up, no limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================ FOOTER WITH INTEGRATED CTA ================ */}
      <footer className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ============ ⭐ MOBILE: What Makes Us Different (100% Honest) ============ */}
          <div className="md:hidden -mx-4 pt-16 pb-12 px-4 bg-gradient-to-b from-white via-[#FAF9FF] to-[#F4F2FF]">
            <div className="max-w-md mx-auto text-center">
              
              {/* Small label */}
              <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5B4EF5] mb-3">
                What Makes Us Different
              </p>

              {/* Headline */}
              <h3 className="text-[22px] font-extrabold text-[#07122E] tracking-tight leading-[1.2] mb-8">
                Built for people who{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  care about privacy.
                </span>
              </h3>

              {/* HONEST STATS GRID */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                  <div className="text-[20px] font-extrabold text-[#5B4EF5] leading-tight">10+</div>
                  <div className="text-[10.5px] font-semibold text-slate-500 mt-1 leading-tight">Free Tools</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                  <div className="text-[20px] font-extrabold text-emerald-600 leading-tight">100%</div>
                  <div className="text-[10.5px] font-semibold text-slate-500 mt-1 leading-tight">Private &amp; Local</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                  <div className="text-[20px] font-extrabold text-orange-600 leading-tight">0</div>
                  <div className="text-[10.5px] font-semibold text-slate-500 mt-1 leading-tight">Sign-ups Needed</div>
                </div>
              </div>

              {/* HOW IT WORKS */}
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-500 mb-5 text-center">
                  How It Works
                </p>
                
                <div className="flex items-center justify-between gap-2">
                  {/* Step 1 */}
                  <div className="text-center flex-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-2 flex items-center justify-center text-white text-[14px] font-extrabold shadow-[0_4px_10px_-2px_rgba(99,102,241,0.4)]">
                      1
                    </div>
                    <div className="text-[11px] font-bold text-[#07122E] leading-tight">
                      Choose Tool
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>

                  {/* Step 2 */}
                  <div className="text-center flex-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-2 flex items-center justify-center text-white text-[14px] font-extrabold shadow-[0_4px_10px_-2px_rgba(99,102,241,0.4)]">
                      2
                    </div>
                    <div className="text-[11px] font-bold text-[#07122E] leading-tight">
                      Add Your File
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>

                  {/* Step 3 */}
                  <div className="text-center flex-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto mb-2 flex items-center justify-center text-white text-[14px] font-extrabold shadow-[0_4px_10px_-2px_rgba(16,185,129,0.4)]">
                      ✓
                    </div>
                    <div className="text-[11px] font-bold text-[#07122E] leading-tight">
                      Done!
                    </div>
                  </div>
                </div>

                {/* Bottom note */}
                <p className="text-[11px] text-slate-500 text-center mt-4 leading-[1.5]">
                  Everything happens in your browser.<br/>
                  <span className="font-bold text-emerald-600">Nothing is uploaded.</span>
                </p>
              </div>
              
            </div>
          </div>

          {/* ⭐ Bottom fade back to white */}
          <div className="md:hidden -mx-4 h-12 bg-gradient-to-b from-[#F4F2FF] to-white" />

          {/* Desktop: Original "Ready to get started" CTA */}
          <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-6 py-10 md:py-14">
            <div className="text-center md:text-left">
              <h3 className="text-[22px] md:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight mb-1.5">
                Ready to get started?
              </h3>
              <p className="text-[14px] md:text-[15px] text-slate-500 font-medium">
                Try our free PDF tools right now. No sign-up needed.
              </p>
            </div>
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[15px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_14px_rgba(99,102,241,0.4)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_24px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              <Zap size={16} className="text-yellow-300" strokeWidth={2.5} fill="currentColor" />
              Start Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Footer Main Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12 md:py-16">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1 pr-4">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6D35FF] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(109,53,255,0.3)]">
                  <FileText size={16} className="text-white" />
                </div>
                <span className="text-[16px] font-extrabold text-slate-900">PDF Core</span>
              </Link>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-5 max-w-xs">
                Free, secure PDF tools that work right in your browser. Your files never leave your device.
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">
                  <Shield size={11} strokeWidth={2.5} />
                  <span>Privacy First</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700">
                  <Lock size={11} strokeWidth={2.5} />
                  <span>100% Free</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-2">
                <a href="https://twitter.com/pdfcore" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all group" aria-label="X (Twitter)">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://github.com/pdfcore" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all group" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="https://linkedin.com/company/pdfcore" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all group" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="mailto:hello@pdfcore.online" className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all group" aria-label="Email">
                  <Mail size={15} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Column 2: Tools */}
            <div>
              <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Tools</h4>
              <ul className="space-y-2.5">
                <FooterLink href="/tools/merge-pdf">Merge PDF</FooterLink>
                <FooterLink href="/tools/split-pdf">Split PDF</FooterLink>
                <FooterLink href="/tools/compress-pdf">Compress PDF</FooterLink>
                <FooterLink href="/tools/pdf-to-image">PDF to Image</FooterLink>
                <li>
                  <Link href="/tools" className="inline-flex items-center gap-1 text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group">
                    All Tools
                    <ArrowRight size={12} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5">
                <FooterLink href="/about">About</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/security">Security</FooterLink>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <li>
                  <button type="button" onClick={openCookieSettings} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors text-left">
                    Cookie Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-[12.5px] text-slate-600 font-medium">
                © {new Date().getFullYear()} <span className="text-slate-900 font-semibold">PDF Core</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-1.5 text-[12.5px] text-slate-600 font-medium">
                <span>Made with</span>
                <span className="text-red-500 text-[14px]">♥</span>
                <span>for everyone</span>
              </div>
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
      <Link href={href} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">
        {children}
      </Link>
    </li>
  );
}