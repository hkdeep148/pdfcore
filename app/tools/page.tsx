'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  X,
  ChevronRight,
} from 'lucide-react';
import { tools, categoryLabels } from './_config/tools';

// Category display order
const categoryOrder = ['convert', 'organize', 'optimize', 'edit', 'security'];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Build categories list dynamically
  const categories = ['All', ...categoryOrder.map((c) => categoryLabels[c])];

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || categoryLabels[tool.category] === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-['Inter',sans-serif] text-[#07122E]">
      <main>
        {/* ============ HERO ============ */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 md:pb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-3 md:mb-4">
            <Sparkles size={14} />
            <span>Complete Toolkit</span>
          </div>

          <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] md:text-[48px] md:leading-tight font-extrabold tracking-tight text-[#07122E]">
            Every{' '}
            <span className="bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
              PDF Tool
            </span>{' '}
            You Need
          </h1>

          <p className="mt-3 md:mt-4 text-[15px] md:text-[17px] text-[#4B5874] font-medium max-w-2xl mx-auto">
            Browse our complete collection of {tools.length} free, fast, and secure PDF Core.
          </p>

          {/* Search Bar */}
          <div className="mt-6 md:mt-8 max-w-xl mx-auto relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A97AE] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search for a tool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 md:py-4 rounded-xl border border-[#DDE5F0] bg-white text-[14px] md:text-[15px] placeholder:text-[#8A97AE] focus:outline-none focus:border-[#1E63FF] focus:ring-4 focus:ring-[#EAF1FF] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#F1F5FF] hover:bg-[#E7ECF5] transition-colors"
                aria-label="Clear search"
              >
                <X size={14} className="text-[#4B5874]" />
              </button>
            )}
          </div>
        </section>

        {/* ============ CATEGORY FILTERS ============ */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {categories.map((category) => {
              const count =
                category === 'All'
                  ? tools.length
                  : tools.filter((t) => categoryLabels[t.category] === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-[14px] font-bold transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,0.8)]'
                      : 'bg-white border border-[#DDE5F0] text-[#26324B] hover:border-[#C9D8F3] hover:bg-[#F8FAFF]'
                  }`}
                >
                  {category}
                  <span
                    className={`ml-2 text-[11px] ${
                      activeCategory === category ? 'text-white/80' : 'text-[#8A97AE]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ============ TOOLS GRID ============ */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-14 md:pb-20">
          {filteredTools.length > 0 ? (
            <>
              <p className="text-center text-[13px] md:text-[14px] text-[#4B5874] mb-6 md:mb-8">
                Showing{' '}
                <span className="font-bold text-[#07122E]">{filteredTools.length}</span>{' '}
                {filteredTools.length === 1 ? 'tool' : 'tools'}
                {activeCategory !== 'All' && (
                  <>
                    {' '}
                    in <span className="font-bold text-[#1E63FF]">{activeCategory}</span>
                  </>
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {filteredTools.map((tool, index) => (
                  <Link href={tool.href} key={tool.href}>
                    <div
                      className="group h-full bg-white border border-[#DDE5F0] rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.45)] hover:shadow-[0_18px_36px_-24px_rgba(37,99,235,0.55)] hover:border-[#C9D8F3] active:scale-[0.98] transition-all"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <div
                        className="w-14 h-14 md:w-[60px] md:h-[60px] rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: tool.bgColor, color: tool.color }}
                      >
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-extrabold text-[#07122E] truncate">
                            {tool.label}
                          </h3>
                          <ChevronRight
                            size={18}
                            className="text-[#8A97AE] group-hover:text-[#1E63FF] transition-colors ml-auto flex-shrink-0"
                          />
                        </div>
                        <p className="mt-1.5 md:mt-2 text-[12px] leading-relaxed text-[#4B5874] line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16 md:py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#F8FAFF] flex items-center justify-center">
                <Search size={32} className="text-[#8A97AE]" />
              </div>
              <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#07122E] mb-2">
                No tools found
              </h3>
              <p className="text-[14px] text-[#4B5874] mb-6">
                Try a different search term or category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[14px] font-bold hover:opacity-95 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}