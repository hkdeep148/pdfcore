'use client';

import { ReactNode } from 'react';
import DesktopSidebar from './DesktopSidebar';

interface ToolShellDesktopProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
  rightPanelTitle?: string;
  bottomBar?: ReactNode;
  headerAction?: ReactNode;
  actionButton?: ReactNode;
  /*
    breadcrumbCategory used to control the breadcrumb in the removed
    inner header. Kept in the props type so existing call sites keep
    compiling even though it's no longer rendered anywhere.
  */
  breadcrumbCategory?: string;
  hideSidebar?: boolean;
  hideHeader?: boolean;
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
  hideSidebar = false,
  hideHeader = false,
}: ToolShellDesktopProps) {
  return (
    /*
      REMOVED: the inner <header> that duplicated navbar functionality
      (PDFTools logo, breadcrumb, "Files stay private", search, EN,
      settings). The universal LandingNavbar rendered by
      tools/layout.tsx is now the single navbar on desktop tool pages,
      matching mobile behavior. Tool identity is shown by the
      LandingNavbar itself (tool icon + tool name + "by spellpdf").
    */
    <div className="hidden lg:flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* ============ MAIN LAYOUT WITH FLOATING SIDEBAR ============ */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {!hideSidebar && <DesktopSidebar />}

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 flex overflow-hidden gap-4">
<main className="flex-1 flex flex-col overflow-hidden min-w-0">
  {/*
    REMOVED: in-page tool title header (icon + name + subtitle).
    The universal LandingNavbar now shows the tool icon, tool name,
    and "by spellpdf" subtitle — so this header was duplicating the
    same information. Removing it reclaims ~80px of vertical space
    for the actual tool content below.

    headerAction (if any tool passes it) is still rendered above the
    content so tools that inject header-level actions (like a filename
    editor) don't lose that capability.
  */}
  {headerAction && (
    <div className="mb-4 flex-shrink-0 flex justify-end">
      {headerAction}
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
          </div>
        </div>
      </div>
    </div>
  );
}