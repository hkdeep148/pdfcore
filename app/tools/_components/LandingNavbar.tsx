'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Combine, Search, Zap } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import { tools } from '../_config/tools';

// Group tools by category (for organized dropdown)
const toolsByCategory = {
  Convert: tools.filter(t => t.category === 'convert'),
  Organize: tools.filter(t => t.category === 'organize'),
  Edit: tools.filter(t => t.category === 'edit'),
  Optimize: tools.filter(t => t.category === 'optimize'),
  Security: tools.filter(t => t.category === 'security'),
};

// ⭐ QUICK COMPRESS TOOLS (customize as needed)
const quickCompressTools = [
  {
    href: '/tools/compress-image',
    label: 'Compress Image',
    description: 'JPG, PNG, WEBP',
    icon: '🖼️',
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    popular: true,
  },
  {
    href: '/tools/compress-pdf',
    label: 'Compress PDF',
    description: 'Reduce PDF size',
    icon: '📄',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
];

// Simple top-level links (clean & focused)
const simpleLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Security', href: '/security' },
  { label: 'About', href: '/about' },
];


export default function LandingNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const compressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      <nav ref={navRef}  className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#5B4EF5]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* ============ LOGO (Left) ============ */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(99,102,241,0.4)]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-[18px] font-bold text-[#07122E]">PDF Core</span>
            </Link>

            {/* ============ DESKTOP MENU (Centered) ============ */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              
              {/* Single "Tools" Dropdown (Mega Menu Style) */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  setOpenDropdown('Tools');
                }}
                onMouseLeave={() => {
                  closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
                }}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 px-5 py-2 text-[15px] font-medium font-[family-name:var(--font-inter)] transition-colors ${
                    openDropdown === 'Tools' ? 'text-[#5B4EF5]' : 'text-[#26324B] hover:text-[#5B4EF5]'
                  }`}
                >
                  Tools
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'Tools' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {openDropdown === 'Tools' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-white border border-[#ECEDF3] rounded-2xl shadow-[0_20px_50px_-12px_rgba(20,30,60,0.18)] overflow-hidden">
                    <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-1">
                      {Object.entries(toolsByCategory).map(([category, items]) => (
                        items.length > 0 && (
                          <div key={category} className="min-w-0">
                            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-[#5B4EF5] mb-2 mt-3 first:mt-0">
                              {category}
                            </p>
                            <div className="space-y-0.5">
                              {items.map((tool: any) => (
                                <Link
                                  key={tool.href}
                                  href={tool.href}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold text-[#26324B] hover:bg-[#F5F3FF] hover:text-[#6366F1] transition-colors group"
                                >
                                  <div 
                                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                                    style={{
                                      backgroundColor: tool.bgColor,
                                      color: tool.color,
                                    }}
                                  >
                                    <div className="scale-[0.55]">{tool.icon}</div>
                                  </div>
                                  <span>{tool.label}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>

                    <div className="border-t border-slate-100 px-5 py-3 bg-slate-50">
                      <Link
                        href="/tools"
                        className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-[#5B4EF5] hover:gap-2 transition-all"
                      >
                        <span>View All Tools</span>
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {simpleLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-5 py-2 text-[15px] font-medium font-[family-name:var(--font-inter)] text-[#26324B] hover:text-[#5B4EF5] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ============ RIGHT: Quick Compress + Search ============ */}
            <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
              
              {/* ⭐ QUICK COMPRESS DROPDOWN */}
<div
  className="relative"
  onMouseEnter={() => {
    if (compressTimeoutRef.current) clearTimeout(compressTimeoutRef.current);
    setOpenDropdown('Compress');
  }}
  onMouseLeave={() => {
    compressTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }}
>
  <button
    type="button"
    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all ${
      openDropdown === 'Compress'
        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_4px_12px_-2px_rgba(99,102,241,0.5)]'
        : 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_2px_8px_-2px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_14px_-2px_rgba(99,102,241,0.5)] hover:-translate-y-0.5'
    }`}
    aria-label="Quick Compress"
  >
    <Zap size={14} strokeWidth={2.5} fill="currentColor" />
    <span>Quick Compress</span>
    <svg
      viewBox="0 0 24 24"
      className={`w-3 h-3 transition-transform ${openDropdown === 'Compress' ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>

  {/* Dropdown Menu */}
  {openDropdown === 'Compress' && (
    <div className="absolute top-full right-0 mt-1.5 w-[320px] bg-white border border-[#ECEDF3] rounded-2xl shadow-[0_20px_50px_-12px_rgba(20,30,60,0.18)] overflow-hidden z-50">
      
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-br from-[#F5F3FF] via-[#EEF2FF] to-[#F5F3FF] border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
            <Zap size={12} className="text-white" strokeWidth={2.5} fill="currentColor" />
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5B4EF5]">
            Quick Compress
          </p>
        </div>
        <p className="text-[11px] text-[#4B5563] mt-1 font-medium">
          Reduce file sizes instantly
        </p>
      </div>

      {/* Tool List */}
      <div className="p-2">
        {quickCompressTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F5F3FF] transition-all"
          >
            {/* Icon */}
            <div 
              className="w-11 h-11 rounded-lg flex items-center justify-center text-[22px] shrink-0 shadow-sm transition-transform group-hover:scale-110"
              style={{
                backgroundColor: tool.bgColor,
              }}
            >
              {tool.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-[13.5px] font-bold text-[#07122E] group-hover:text-[#5B4EF5] transition-colors">
                  {tool.label}
                </p>
                {tool.popular && (
                  <span className="text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider leading-none">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium">
                {tool.description}
              </p>
            </div>

            {/* Arrow */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#5B4EF5] group-hover:translate-x-0.5 transition-all shrink-0" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
        <Link
          href="/tools"
          className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#5B4EF5] hover:gap-2 transition-all"
        >
          <span>View All Tools</span>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  )}
</div>

{/* ⭐ Subtle Divider */}
<div className="w-px h-6 bg-slate-200" />

              {/* Search Icon Button */}
<button
  type="button"
  onClick={() => setSearchOpen(true)}
  className="group relative w-10 h-10 rounded-lg bg-[#F5F7FB] border border-[#E7ECF5] hover:border-[#C9D8F3] hover:bg-white flex items-center justify-center transition-all"
  aria-label="Search (⌘K)"
  title="Search (⌘K)"
>
  <Search size={16} className="text-[#8A93A3] group-hover:text-[#6366F1] transition-colors" strokeWidth={2.2} />
  
  {/* Tooltip with keyboard shortcut */}
  <span className="absolute top-full mt-2 right-0 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity flex items-center gap-1.5 shadow-lg">
    Search
    <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold">
      ⌘K
    </kbd>
  </span>
</button>
            </div>

            {/* ============ MOBILE ACTIONS ============ */}
            <div className="lg:hidden flex items-center gap-1">
              {/* Mobile Quick Compress Button */}
              <Link
  href="/tools/compress-image"
  className="p-2 text-[#6366F1] hover:text-[#5B4EF5] transition-colors"
  aria-label="Quick Compress"
>
  <Zap size={20} strokeWidth={2.5} fill="currentColor" />
</Link>

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
                <div className="relative w-6 h-6">
                  <svg
                    viewBox="0 0 24 24"
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-out ${
                      mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  
                  <svg
                    viewBox="0 0 24 24"
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ease-out ${
                      mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ MOBILE MENU OVERLAY ============ */}
      <>
        <div
          className={`lg:hidden fixed inset-0 top-[72px] bg-black/30 z-40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        <div
          className={`lg:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-white z-40 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex-1 overflow-y-auto px-4 py-4">
            
            {/* ⭐ QUICK COMPRESS SECTION (Mobile) */}
<div className="mb-5">
  <div className="flex items-center gap-2 px-2 mb-2">
    <Zap size={12} className="text-[#6366F1]" strokeWidth={2.5} fill="currentColor" />
    <p className="text-[11px] font-bold text-[#5B4EF5] uppercase tracking-wider">
      Quick Compress
    </p>
  </div>
  <div className="grid grid-cols-2 gap-2">
    {quickCompressTools.map((tool) => (
      <Link
        key={tool.href}
        href={tool.href}
        onClick={() => setMobileMenuOpen(false)}
        className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8EDF5] bg-white hover:border-[#6366F1] hover:bg-[#F5F3FF] active:scale-95 transition-all"
      >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px] shadow-sm"
                      style={{ backgroundColor: tool.bgColor }}
                    >
                      {tool.icon}
                    </div>
                    <div className="text-center">
                      <p className="text-[12px] font-bold text-[#07122E]">
                        {tool.label}
                      </p>
                      <p className="text-[10px] text-[#6B7280] font-medium mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#F1F5F9] my-4" />

            {/* Tools grouped by category */}
            {(() => {
              const categorized = tools.reduce((acc, tool) => {
                if (!acc[tool.category]) acc[tool.category] = [];
                acc[tool.category].push(tool);
                return acc;
              }, {} as Record<string, typeof tools>);

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

      {/* ============ GLOBAL SEARCH MODAL ============ */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}