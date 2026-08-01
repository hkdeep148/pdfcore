'use client';

import { usePathname } from 'next/navigation';
import LandingNavbar from './_components/LandingNavbar';
import { ToastProvider } from './_components/ToastProvider';
import LandingFooter from './_components/LandingFooter';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isToolsIndexPage = pathname === '/tools' || pathname === '/tools/';

  // Tools index page — keep LandingNavbar for consistency
  if (isToolsIndexPage) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif] overflow-x-hidden">
          <LandingNavbar />
          <main>{children}</main>
          <LandingFooter />
        </div>
      </ToastProvider>
    );
  }

  // Individual tool pages — desktop uses its own sidebar, mobile keeps LandingNavbar
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',sans-serif]">
        {/* Only show LandingNavbar on mobile — desktop uses DesktopSidebar */}
        <div className="lg:hidden">
          <LandingNavbar />
        </div>
        <div className="h-[calc(100dvh-73px)] lg:h-screen flex flex-col">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}