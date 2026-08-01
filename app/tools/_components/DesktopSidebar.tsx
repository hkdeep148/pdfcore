'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarSection {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: '',
    items: [
      {
        href: '/',
        label: 'Home',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'EDIT PDF',
    items: [
      {
        href: '/tools/merge-pdf',
        label: 'Merge',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <path d="M10 10l4 4" />
          </svg>
        ),
      },
      {
        href: '/tools/split-pdf',
        label: 'Split',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="8" height="18" rx="1" />
            <rect x="13" y="3" width="8" height="18" rx="1" />
          </svg>
        ),
      },
      {
        href: '/tools/compress-pdf',
        label: 'Compress',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ),
      },
      {
        href: '/tools/organize-pdf',
        label: 'Delete Pages',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        ),
      },
      // ✅ ADDED: Sign PDF
      {
        href: '/tools/sign-pdf',
        label: 'Sign PDF',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'CONVERT',
    items: [
      {
        href: '/tools/image-to-pdf',
        label: 'Image to PDF',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
      },
      {
        href: '/tools/pdf-to-image',
        label: 'PDF to Image',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'MORE',
    items: [
      {
        href: '/tools/add-watermark',
        label: 'Watermark',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        ),
      },
      {
        href: '/tools/unlock-pdf',
        label: 'Unlock PDF',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        ),
      },
    ],
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[240px] flex-shrink-0 bg-white rounded-2xl border border-[#E8EDF5] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] h-full overflow-hidden">
      {/* Menu Sections */}
      <nav className="flex-1 px-3 pt-5 pb-5 overflow-y-auto">
        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {section.label && (
              <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 mb-2">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4F46E5]'
                        : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                    }`}
                  >
                    <span className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Trust Badges */}
      <div className="p-3">
        <div className="bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-[#C7D2FE] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4F46E5]" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[13px] font-bold text-[#4F46E5]">Why Choose Us</span>
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[11.5px] text-[#4B5563] font-medium">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[11.5px] text-[#4B5563] font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#4F46E5]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[11.5px] text-[#4B5563] font-medium">Always Free</span>
            </div>
          </div>
          <Link
            href="/about"
            className="block w-full py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[12.5px] font-bold transition-colors text-center"
          >
            Learn More
          </Link>
        </div>
      </div>
    </aside>
  );
}