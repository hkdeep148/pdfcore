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
} from 'lucide-react';
import { openCookieSettings } from './CookieBanner';

export default function LandingFooter() {
  return (
    <>
      {/* ================ WHY CHOOSE US SECTION (DESKTOP) ================ */}
      <section className="relative">
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
      <footer className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ============ ⭐ MOBILE: Comparison Table ============ */}
          <div className="md:hidden -mx-4 pt-16 pb-14 px-5 bg-white">
            <div className="max-w-md mx-auto">

              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">
                  The Difference
                </p>
                <h3 className="text-[26px] font-semibold text-[#07122E] tracking-tight leading-[1.15]">
                  Why choose{' '}
                  <span className="text-[#5B4EF5]">PDF Core</span>
                  <span className="text-[#07122E]">?</span>
                </h3>
                <p className="text-[13.5px] text-slate-500 mt-3 leading-relaxed">
                  See how we compare to typical online PDF tools.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_72px_72px] bg-slate-50/70 border-b border-slate-200">
                  <div className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Feature
                  </div>
                  <div className="px-2 py-3.5 text-center">
                    <div className="text-[11px] font-bold text-[#5B4EF5] tracking-tight">
                      PDF Core
                    </div>
                  </div>
                  <div className="px-2 py-3.5 text-center">
                    <div className="text-[11px] font-semibold text-slate-400 tracking-tight">
                      Others
                    </div>
                  </div>
                </div>

                {/* Rows */}
                <ComparisonRow feature="100% Free forever" us={true} them={false} themLabel="Limited" />
                <ComparisonRow feature="No sign-up needed" us={true} them={false} />
                <ComparisonRow feature="Files stay on device" us={true} them={false} />
                <ComparisonRow feature="Works offline" us={true} them={false} />
                <ComparisonRow feature="Zero ads" us={true} them={false} />
                <ComparisonRow feature="No watermarks" us={true} them={false} isLast />
              </div>

              {/* Footnote */}
              <p className="text-[12px] text-slate-400 text-center mt-4 leading-relaxed">
                Based on common limitations of popular online PDF tools.
              </p>

              {/* CTA */}
              <Link
  href="/tools"
  className="group mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5B4EF5] to-[#8B5CF6] text-white text-[14px] font-semibold shadow-[0_4px_16px_-4px_rgba(91,78,245,0.4)] hover:shadow-[0_8px_24px_-4px_rgba(91,78,245,0.5)] hover:-translate-y-0.5 transition-all duration-200"
>
  Try PDF Core free
  <ArrowRight 
    size={15} 
    strokeWidth={2.5} 
    className="group-hover:translate-x-0.5 transition-transform" 
  />
</Link>

            </div>
          </div>

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
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
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

/* ============ COMPARISON ROW COMPONENT ============ */
interface ComparisonRowProps {
  feature: string;
  us: boolean;
  them: boolean;
  themLabel?: string;
  isLast?: boolean;
}

function ComparisonRow({ feature, us, them, themLabel, isLast }: ComparisonRowProps) {
  return (
    <div
      className={`grid grid-cols-[1fr_72px_72px] items-center ${
        !isLast ? 'border-b border-slate-100' : ''
      }`}
    >
      <div className="px-4 py-3.5 text-[13px] font-medium text-[#07122E]">
        {feature}
      </div>

      {/* Us column */}
      <div className="px-2 py-3.5 flex justify-center">
        {us ? (
          <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <span className="text-[12px] text-slate-400">—</span>
        )}
      </div>

      {/* Them column */}
      <div className="px-2 py-3.5 flex justify-center">
        {themLabel ? (
          <span className="text-[11px] font-medium text-slate-400">
            {themLabel}
          </span>
        ) : them ? (
          <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}