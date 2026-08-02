// app/tools/_components/SimpleFooter.tsx
'use client';

import Link from 'next/link';
import {
  FileText,
  Shield,
  Lock,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { openCookieSettings } from './CookieBanner';

export default function SimpleFooter() {
  return (
    <footer className="relative bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-t border-slate-100">
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