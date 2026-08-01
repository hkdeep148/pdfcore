'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import { tools } from '../_config/tools';

// Group tools for dropdown menus
const dropdownGroups = {
  Tools: tools.map(t => ({ href: t.href, label: t.label })),
  Convert: tools.filter(t => t.category === 'convert').map(t => ({ href: t.href, label: t.label })),
  Edit: [...tools.filter(t => t.category === 'edit' || t.category === 'organize')].map(t => ({ href: t.href, label: t.label })),
  Compress: tools.filter(t => t.category === 'optimize' || t.category === 'security').map(t => ({ href: t.href, label: t.label })),
};

// Simple links
const simpleLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Security', href: '/security' },
  { label: 'About', href: '/about' },
];

export default function LandingNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ⭐ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#ECEDF3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* ============ LOGO ============ */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(99,102,241,0.4)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-[18px] font-bold text-[#07122E]">PDF Core</span>
            </Link>

            {/* ============ DESKTOP MENU ============ */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Dropdowns */}
              {Object.entries(dropdownGroups).map(([label, items]) => (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-4 py-2 text-[14px] font-semibold rounded-lg transition-colors ${
                      openDropdown === label ? 'text-[#6366F1] bg-[#F5F3FF]' : 'text-[#26324B] hover:text-[#6366F1]'
                    }`}
                  >
                    {label}
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-3.5 h-3.5 transition-transform ${openDropdown === label ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {openDropdown === label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#ECEDF3] rounded-xl shadow-[0_20px_40px_-12px_rgba(20,30,60,0.15)] overflow-hidden">
                      <div className="py-2">
                        {items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2.5 text-[13.5px] font-medium text-[#26324B] hover:bg-[#F5F3FF] hover:text-[#6366F1] transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {simpleLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-[14px] font-semibold text-[#26324B] hover:text-[#6366F1] rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ============ RIGHT SIDE (Desktop) ============ */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-3 w-[280px] px-4 py-2.5 rounded-lg bg-[#F5F7FB] border border-[#E7ECF5] hover:border-[#C9D8F3] hover:bg-white transition-all group"
                aria-label="Search"
              >
                <Search size={16} className="text-[#8A93A3] group-hover:text-[#6366F1] transition-colors flex-shrink-0" />
                <span className="text-[13px] text-[#8A93A3] group-hover:text-[#6366F1] transition-colors flex-1 text-left">
                  Search tools, articles...
                </span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13.5px] font-semibold text-[#5B6472] hover:text-[#6366F1] rounded-lg transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  English
                  <svg viewBox="0 0 24 24" className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {langDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-[#ECEDF3] rounded-xl shadow-[0_20px_40px_-12px_rgba(20,30,60,0.15)] overflow-hidden">
                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-[#6366F1] bg-[#F5F3FF] text-left">
                        <span className="text-lg">🇬🇧</span>
                        <span className="flex-1">English</span>
                        <span className="text-[10px] font-bold">✓</span>
                      </button>
                      {[
                        { code: 'es', flag: '🇪🇸', name: 'Español' },
                        { code: 'fr', flag: '🇫🇷', name: 'Français' },
                        { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
                        { code: 'pt', flag: '🇵🇹', name: 'Português' },
                        { code: 'ja', flag: '🇯🇵', name: '日本語' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-[#26324B] hover:bg-[#F5F3FF] hover:text-[#6366F1] transition-colors text-left"
                          onClick={() => {
                            alert(`${lang.name} coming soon! We're working on it.`);
                            setLangDropdownOpen(false);
                          }}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="flex-1">{lang.name}</span>
                          <span className="text-[9px] font-bold text-[#8A93A3] bg-[#F1F5F9] px-1.5 py-0.5 rounded">SOON</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============ MOBILE ACTIONS ============ */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#26324B] hover:text-[#6366F1] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -mr-2 text-[#26324B]"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ ⭐ MOBILE MENU OVERLAY (moved OUTSIDE nav) ============ */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[72px] bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel - Fixed positioning with own scroll */}
          <div className="lg:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-white z-40 flex flex-col overflow-hidden">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Tools grouped by category */}
{(() => {
  // Group tools by category
  const categorized = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  // Category display names & order
  const categoryOrder: { key: string; label: string }[] = [
    { key: 'convert', label: 'Convert' },
    { key: 'organize', label: 'Organize' },
    { key: 'edit', label: 'Edit' },
    { key: 'optimize', label: 'Optimize' },
    { key: 'security', label: 'Security' },
  ];

  return categoryOrder.map(({ key, label }) => {
    const items = categorized[key];
    if (!items || items.length === 0) return null;

    return (
      <div key={key} className="mb-5">
        <p className="text-[11px] font-bold text-[#8A93A3] uppercase tracking-wider px-2 mb-2">
          {label}
        </p>
        {items.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-[#26324B] rounded-lg hover:bg-[#F5F3FF] hover:text-[#6366F1] active:bg-[#F5F3FF] transition-colors"
          >
            <span style={{ color: tool.color }}>{tool.icon}</span>
            {tool.label}
          </Link>
        ))}
      </div>
    );
  });
})()}
            </div>

            {/* Sticky Search Button at Bottom */}
            <div className="flex-shrink-0 border-t border-[#ECEDF3] p-4 bg-white">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-[14px] font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg shadow-[0_4px_12px_-2px_rgba(99,102,241,0.4)]"
              >
                <Search size={16} />
                Search Tools & Articles
              </button>
            </div>
          </div>
        </>
      )}

      {/* ============ GLOBAL SEARCH MODAL ============ */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}