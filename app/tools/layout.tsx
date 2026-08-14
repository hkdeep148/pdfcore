'use client';

import { usePathname } from 'next/navigation';
import LandingNavbar from './_components/LandingNavbar';
import LandingFooter from './_components/LandingFooter';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isToolsIndexPage = pathname === '/tools' || pathname === '/tools/';

  if (isToolsIndexPage) {
    return (
      <div className="min-h-[100dvh] bg-[#F8FAFC] text-[#0B1526] font-['Source_Sans_3','Adjusted_Arial_Fallback',sans-serif] overflow-x-hidden">
        <LandingNavbar />
        <main>{children}</main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] font-['Source_Sans_3','Adjusted_Arial_Fallback',sans-serif]">
      <LandingNavbar />
      {children}
    </div>
  );
}