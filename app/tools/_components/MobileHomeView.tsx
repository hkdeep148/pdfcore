// app/tools/_components/MobileHomeView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, X } from 'lucide-react';
import { tools } from '../_config/tools';

// Infer the tool type from your config
type Tool = (typeof tools)[number];

export default function MobileHomeView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools based on search query
  const filteredTools = useMemo<Tool[]>(() => {
    if (!searchQuery.trim()) return tools;

    const query = searchQuery.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.label.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="md:hidden bg-white overflow-x-hidden">
      {/* ============ SEARCH-FIRST HERO ============ */}
      <section className="relative bg-gradient-to-b from-[#F4F2FF] via-[#FAF9FF] to-white pt-12 pb-8 px-4">
        
        {/* Compact Headline */}
        <div className="text-center mb-6">
          <h1 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#07122E] leading-[1.2] mb-2">
            Find the perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B4EF5] to-[#8B5CF6]">
              PDF tool.
            </span>
          </h1>
          <p className="text-[13px] font-medium text-slate-500 leading-[1.5] mb-5">
            Fast, free, and works right in your browser
          </p>
        </div>

        {/* ============ ⭐ SEARCH BAR ============ */}
        <div className="max-w-md mx-auto mb-2">
          <div className="relative group">
            <Search
              size={18}
              strokeWidth={2.2}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5B4EF5] transition-colors"
            />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PDF tools..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border-2 border-white shadow-[0_4px_16px_-2px_rgba(91,78,245,0.12)] text-[15px] font-medium text-[#07122E] placeholder:text-slate-400 focus:outline-none focus:border-[#5B4EF5] focus:shadow-[0_4px_20px_-2px_rgba(91,78,245,0.25)] transition-all duration-200"
              autoComplete="off"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 active:scale-90 transition-all"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {!searchQuery && (
            <p className="text-[11.5px] text-center text-slate-400 mt-3 font-medium">
              Try &quot;merge&quot;, &quot;compress&quot;, or &quot;convert&quot;
            </p>
          )}
        </div>

        {/* ============ TOOLS LIST ============ */}
        <div className="max-w-md mx-auto space-y-3 mt-8">
          {filteredTools.length > 0 ? (
            <>
              {searchQuery && (
                <p className="text-[12px] font-semibold text-slate-500 px-1 mb-1">
                  {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
                </p>
              )}

{filteredTools.map((tool) => {
  const isComingSoon = !!(tool as any).comingSoon;

  const cardContent = (
    <>
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
            isComingSoon ? 'opacity-50 grayscale' : 'group-hover:scale-110 group-hover:rotate-3'
          }`}
          style={{
            backgroundColor: tool.bgColor,
            color: tool.color,
          }}
        >
          <div className="scale-90">{tool.icon}</div>
        </div>
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h3 className={`text-[15px] font-bold leading-[1.35] transition-colors ${
              isComingSoon ? 'text-slate-400' : 'text-[#07122E] group-hover:text-[#5B4EF5]'
            }`}>
              {tool.label}
            </h3>
            {isComingSoon && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase tracking-wider">
                Soon
              </span>
            )}
          </div>
          <p className={`text-[12.5px] leading-[1.5] mt-0.5 line-clamp-1 ${
            isComingSoon ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {tool.description}
          </p>
        </div>
      </div>
      {!isComingSoon && (
        <ChevronRight
          size={18}
          className="text-slate-400 shrink-0 group-hover:text-[#5B4EF5] group-hover:translate-x-1 transition-all"
        />
      )}
    </>
  );

  // ⭐ Coming Soon: render as div (non-clickable)
  if (isComingSoon) {
    return (
      <div
        key={tool.href}
        className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/50 border border-slate-200 opacity-75 cursor-default"
      >
        {cardContent}
      </div>
    );
  }

  // ⭐ Normal: render as Link (clickable)
  return (
    <Link
      key={tool.href}
      href={tool.href}
      className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_10px_-2px_rgba(91,78,245,0.08)] hover:shadow-[0_8px_20px_-4px_rgba(91,78,245,0.15)] hover:bg-white hover:border-indigo-200 active:scale-[0.98] transition-all duration-200"
    >
      {cardContent}
    </Link>
  );
})}
            </>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search size={24} className="text-slate-400" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-[#07122E] mb-1">
                No tools found
              </h3>
              <p className="text-[13px] text-slate-500 leading-[1.5] mb-4">
                Try searching for something else
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B4EF5] text-white text-[12.5px] font-bold hover:bg-[#4C3FE2] active:scale-95 transition-all"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}