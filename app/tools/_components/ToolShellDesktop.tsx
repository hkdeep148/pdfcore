'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import DesktopSidebar from './DesktopSidebar';
import GlobalSearch from './GlobalSearch';

interface ToolShellDesktopProps {
  title?: string;                     // 👈 Optional
  subtitle?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
  rightPanelTitle?: string;
  bottomBar?: ReactNode;
  headerAction?: ReactNode;
  actionButton?: ReactNode;
  breadcrumbCategory?: string;
  hideSidebar?: boolean;              // 👈 NEW
  hideHeader?: boolean;               // 👈 NEW
}

export default function ToolShellDesktop({
  title,
  subtitle,
  children,
  rightPanel,
  rightPanelTitle = 'Page Options',
  bottomBar,
  headerAction,
  actionButton,
  breadcrumbCategory = 'Convert',
  hideSidebar = false,                // 👈 NEW
  hideHeader = false,                 // 👈 NEW
}: ToolShellDesktopProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden lg:flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* ============ TOP NAVBAR ============ */}
      <header className="flex-shrink-0 h-[72px] bg-white border-b border-[#E8EDF5] flex items-center justify-between px-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(79,70,229,0.4)]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span className="text-[18px] font-extrabold text-[#111827]">
              PDF<span className="text-[#4F46E5]">Tools</span>
            </span>
          </Link>

          <div className="h-8 w-px bg-[#E8EDF5]" />

          <nav className="flex items-center gap-2">
            <Link href="/" className="text-[#6B7280] hover:text-[#4F46E5] transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-[13.5px] font-medium text-[#6B7280]">{breadcrumbCategory}</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-[13.5px] font-bold text-[#111827]">{title || 'Success'}</span>
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0]">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[12px] font-semibold text-[#16A34A]">Files stay private</span>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 rounded-full border border-[#E8EDF5] hover:bg-[#F9FAFB] hover:border-[#C7D2FE] flex items-center justify-center transition-colors group"
            aria-label="Search"
            title="Search"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280] group-hover:text-[#4F46E5] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 h-10 rounded-full border border-[#E8EDF5] hover:bg-[#F9FAFB] transition-colors"
            aria-label="Language"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-[13px] font-semibold text-[#111827]">EN</span>
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="w-10 h-10 rounded-full border border-[#E8EDF5] hover:bg-[#F9FAFB] hover:border-[#C7D2FE] flex items-center justify-center transition-colors group"
              aria-label="Settings"
              title="Settings"
            >
              <svg viewBox="0 0 24 24" className={`w-4 h-4 text-[#6B7280] group-hover:text-[#4F46E5] transition-all ${settingsOpen ? 'rotate-90 text-[#4F46E5]' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            {settingsOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E8EDF5] rounded-xl shadow-[0_20px_40px_-12px_rgba(15,23,42,0.15)] overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#F1F5F9] bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC]">
                  <p className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider">
                    Menu
                  </p>
                </div>
                <div className="py-1">
                  <Link href="/about" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span>About</span>
                  </Link>
                  <Link href="/faq" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>FAQ</span>
                  </Link>
                  <Link href="/security" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Security</span>
                  </Link>
                  <Link href="/blog" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <span>Blog</span>
                  </Link>
                  <div className="my-1 border-t border-[#F1F5F9]" />
                  <Link href="/contact" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Contact</span>
                  </Link>
                  <div className="my-1 border-t border-[#F1F5F9]" />
                  <Link href="/privacy" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" onClick={() => setSettingsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-[12px] font-medium text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ============ MAIN LAYOUT WITH FLOATING SIDEBAR ============ */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* FLOATING LEFT SIDEBAR - Hidden when hideSidebar is true */}
        {!hideSidebar && <DesktopSidebar />}

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 flex overflow-hidden gap-4">
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Header with icon - Hidden when hideHeader is true */}
              {!hideHeader && title && (
                <div className="mb-5 flex-shrink-0 flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="pt-1">
                      <h1 className="text-[28px] font-extrabold text-[#111827] leading-tight tracking-tight">
                        {title}
                      </h1>
                      {subtitle && (
                        <p className="text-[14px] text-[#6B7280] mt-1">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {headerAction && <div className="flex-shrink-0 mt-2">{headerAction}</div>}
                </div>
              )}

              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {children}
              </div>

              {bottomBar && (
                <div className="mt-4 flex-shrink-0 bg-white rounded-2xl border border-[#E8EDF5] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] px-6 py-4">
                  {bottomBar}
                </div>
              )}
            </main>

            {rightPanel && (
              <aside className="w-[320px] flex-shrink-0 flex flex-col gap-4 overflow-hidden">
                <div className="flex-1 bg-white rounded-2xl border border-[#E8EDF5] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] p-5 overflow-y-auto">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14" />
                        <line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" />
                        <line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="1" y1="14" x2="7" y2="14" />
                        <line x1="9" y1="8" x2="15" y2="8" />
                        <line x1="17" y1="16" x2="23" y2="16" />
                      </svg>
                      <h2 className="text-[15px] font-bold text-[#111827]">
                        {rightPanelTitle}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="text-[#9CA3AF] hover:text-[#111827] transition-colors"
                      aria-label="Collapse"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                  </div>
                  {rightPanel}
                </div>

                {actionButton && (
                  <div className="flex-shrink-0">
                    {actionButton}
                  </div>
                )}
              </aside>
            )}

            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}