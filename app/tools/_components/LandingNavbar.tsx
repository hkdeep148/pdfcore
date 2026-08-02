'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Combine, Search } from 'lucide-react';
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

// Simple top-level links (clean & focused)
const simpleLinks = [
  { label: 'Merge PDF', href: 'tools/merge-pdf' },
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
      <nav ref={navRef}  className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#5B4EF5]/10"
>
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
                            {/* Category Label */}
                            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-[#5B4EF5] mb-2 mt-3 first:mt-0">
                              {category}
                            </p>
                            
                            {/* Tools in this category */}
                            <div className="space-y-0.5">
                              {items.map((tool: any) => (
                                <Link
                                  key={tool.href}
                                  href={tool.href}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold text-[#26324B] hover:bg-[#F5F3FF] hover:text-[#6366F1] transition-colors group"
                                >
                                  {/* Tool Icon (small) */}
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

                    {/* Bottom bar with "View All Tools" */}
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

            {/* ============ RIGHT: Compact Search ============ */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2.5 w-[220px] px-3.5 py-2 rounded-lg bg-[#F5F7FB] border border-[#E7ECF5] hover:border-[#C9D8F3] hover:bg-white transition-all group"
                aria-label="Search"
              >
                <Search size={15} className="text-[#8A93A3] group-hover:text-[#6366F1] transition-colors flex-shrink-0" strokeWidth={2.2} />
                <span className="text-[12.5px] text-[#8A93A3] group-hover:text-[#6366F1] transition-colors flex-1 text-left">
                  Search tools...
                </span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-500 bg-white border border-slate-200 shadow-xs">
                  ⌘K
                </kbd>
              </button>
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
                <div className="relative w-6 h-6">
                  {/* Hamburger */}
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
                  
                  {/* X icon */}
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

      {/* ============ ⭐ MOBILE MENU OVERLAY (with smooth animations) ============ */}
      <>
        {/* Backdrop - fades in/out */}
        <div
          className={`lg:hidden fixed inset-0 top-[72px] bg-black/30 z-40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel - slides down from top with fade */}
        <div
          className={`lg:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-white z-40 flex flex-col overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
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

      {/* ============ GLOBAL SEARCH MODAL ============ */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}