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

  // Tools index page
if (isToolsIndexPage) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Source_Sans_3','Adjusted_Arial_Fallback',sans-serif] overflow-x-hidden">
      <LandingNavbar />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}

// Individual tool pages
return (
  <div className="min-h-screen bg-[#F8FAFC] font-['Source_Sans_3','Adjusted_Arial_Fallback',sans-serif]">
      {/*
        LandingNavbar handles its own responsive logic:
        - Desktop: original navbar
        - Mobile: floating tool navbar
      */}
      <LandingNavbar />

      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}