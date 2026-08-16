'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tools } from '../_config/tools';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

/**
 * Shared sidebar used on all tool pages.
 * - Desktop: always visible on the left
 * - Mobile: slides in from left when opened
 */
export default function Sidebar({
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* LOGO / HEADER */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#ECEDF3]">
        <Link href="/" className="flex items-center gap-2.5">
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E6BFF] to-[#6D35FF] flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_-2px_rgba(99,102,241,0.4)]">
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
</div>
  <span className="text-[15px] font-bold text-[#07122E]">SpellPDF</span>
</Link>

        {/* Close button (mobile only) */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 -mr-2"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#07122E]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* TOOL LINKS */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {tools.map((tool) => {
  const isActive = pathname === tool.href;
  
  // Coming soon → non-clickable, grayed out
  if (tool.comingSoon) {
    return (
      <div
        key={tool.href}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-[#B0B7C3] cursor-not-allowed opacity-60"
      >
        <span className="text-[#B0B7C3] grayscale">
          {tool.icon}
        </span>
        <span className="flex-1">{tool.label}</span>
        <span className="text-[9px] font-bold uppercase text-[#F59E0B] bg-[#FEF3C7] px-1.5 py-0.5 rounded">
          Soon
        </span>
      </div>
    );
  }

  // Normal tool link
  return (
    <Link
      key={tool.href}
      href={tool.href}
      onClick={onCloseMobile}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-colors ${
        isActive
          ? 'text-[#07122E]'
          : 'text-[#5B6472] hover:bg-[#F6F7FB]'
      }`}
      style={isActive ? { backgroundColor: tool.bgColor } : undefined}
    >
      <span style={{ color: isActive ? tool.color : '#9AA2B1' }}>
        {tool.icon}
      </span>
      {tool.label}
    </Link>
  );
})}
      </nav>

      {/* FOOTER */}
      <div className="px-3 py-4 border-t border-[#ECEDF3] space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-[#5B6472] hover:bg-[#F6F7FB] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#9AA2B1]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-[#5B6472] hover:bg-[#F6F7FB] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#9AA2B1]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Help
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (always visible on lg+ screens) */}
      <aside className="hidden lg:flex w-[220px] flex-shrink-0 bg-white border-r border-[#ECEDF3] flex-col">
        {sidebarContent}
      </aside>

      {/* MOBILE OVERLAY (dark background) */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onCloseMobile}
        />
      )}

      {/* MOBILE SIDEBAR (slides in from left) */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white z-50 transform transition-transform duration-300 flex flex-col ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}