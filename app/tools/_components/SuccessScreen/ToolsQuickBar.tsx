'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { tools } from '../../_config/tools';

// ⭐ Featured tools shown in the bar
const FEATURED_TOOL_HREFS = [
  '/tools/compress-pdf',
  '/tools/merge-pdf',
  '/tools/split-pdf',
  '/tools/add-watermark',
  '/tools/rotate-pdf',
];

export default function ToolsQuickBar() {
  const featuredTools = tools.filter((t) => FEATURED_TOOL_HREFS.includes(t.href));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="w-full bg-white rounded-xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] px-6 py-3.5"
    >
      <div className="flex items-center gap-4 overflow-x-auto premium-scrollbar-horizontal">

        {/* ═══════════ LABEL WITH INDIGO ACCENT ═══════════ */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-1 h-4 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #6366F1, #8B5CF6)',
            }}
          />
          <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">
            Explore more tools
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 shrink-0" />

        {/* ═══════════ TOOL LINKS ═══════════ */}
        <div className="flex items-center gap-1 shrink-0">
          {featuredTools.map((tool, idx) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.04 }}
            >
              <Link
                href={tool.href}
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-all shrink-0"
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: tool.bgColor, color: tool.color }}
                >
                  <div className="scale-[0.6]">{tool.icon}</div>
                </div>
                <span className="text-[12.5px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                  {tool.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ═══════════ "VIEW ALL" LINK (pushed to the right) ═══════════ */}
        <Link
          href="/tools"
          className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-all group"
        >
          <span className="text-[12px] font-bold whitespace-nowrap">View all</span>
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>

      {/* Horizontal scrollbar */}
      <style jsx>{`
        .premium-scrollbar-horizontal::-webkit-scrollbar {
          height: 3px;
        }
        .premium-scrollbar-horizontal::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.1);
          border-radius: 999px;
        }
        .premium-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.25);
        }
      `}</style>
    </motion.div>
  );
}