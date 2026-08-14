'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  X,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';
import MobileListView from './_components/MobileListView';
import { tools, categoryLabels } from './_config/tools';

// Category display order
const categoryOrder = ['convert', 'organize', 'optimize', 'edit', 'security'];

const BG = '#F8FAFC';
const TEXT = '#0B1526';

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

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  const router = useRouter();

  // Mobile list items: exclude coming-soon tools (no real page) and add
  // the `id` that MobileListView requires (using the unique href).
  const mobileItems = filteredTools
    .filter((t) => !(t as { comingSoon?: boolean }).comingSoon)
    .map((t) => ({ ...t, id: t.href }));

  return (
    <div
      className="relative min-h-screen font-['Source_Sans_3','Adjusted_Arial_Fallback',sans-serif]"
      style={{ backgroundColor: BG, color: TEXT }}
    >
      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ============ HERO ============ */}
        <section className="pt-8 pb-6 text-center md:pt-20 md:pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E3EAF6] bg-white px-3.5 py-1.5 shadow-sm">
            <Sparkles size={14} className="text-[#1E63FF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1E63FF] md:text-[12px]">
              Complete PDF toolkit
            </span>
          </div>

          <h1 className="mt-5 font-['Space_Grotesk',sans-serif] text-[34px] font-extrabold leading-[1.08] tracking-tight text-[#0B1526] md:text-[52px] md:leading-[1.05]">
            Every{' '}
            <span className="bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
              PDF tool
            </span>{' '}
            you need
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-[#5B6472] md:mt-5 md:text-[17px]">
            {tools.length} free, fast, and private tools that run entirely in your browser —
            no signup, no uploads, no watermarks.
          </p>

          {/* Trust row */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[12.5px] font-semibold text-[#5B6472] md:mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3EAF6] bg-white px-3 py-1.5">
              <ShieldCheck size={14} className="text-[#16A34A]" /> 100% private
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3EAF6] bg-white px-3 py-1.5">
              <Zap size={14} className="text-[#F59E0B]" /> Instant & fast
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E3EAF6] bg-white px-3 py-1.5">
              <Lock size={14} className="text-[#1E63FF]" /> Free forever
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mx-auto mt-7 max-w-xl md:mt-9">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A3B6]"
            />
            <input
              type="text"
              placeholder="Search for a tool…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[#DCE4F0] bg-white py-3.5 pl-12 pr-12 text-[15px] text-[#0B1526] shadow-[0_10px_30px_-18px_rgba(15,23,42,0.5)] transition-all placeholder:text-[#98A3B6] focus:border-[#1E63FF] focus:outline-none focus:ring-4 focus:ring-[#E0EBFF] md:py-4"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#EEF2F8] text-[#5B6472] transition-colors hover:bg-[#E2E8F1]"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </section>

        {/* ============ CATEGORY FILTERS ============ */}
        <section className="pb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
            {categories.map((category) => {
              const count =
                category === 'All'
                  ? tools.length
                  : tools.filter((t) => categoryLabels[t.category] === category).length;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-[13.5px] font-bold transition-all md:px-5 md:py-2.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white shadow-[0_10px_22px_-10px_rgba(37,99,235,0.9)]'
                      : 'border border-[#DCE4F0] bg-white text-[#3A4663] hover:border-[#B9C9E6] hover:bg-[#F7FAFF]'
                  }`}
                >
                  {category}
                  <span
                    className={`ml-2 text-[11px] font-semibold ${
                      isActive ? 'text-white/85' : 'text-[#98A3B6]'
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
        <section className="pb-16 md:pb-24">
          {filteredTools.length > 0 ? (
            <>
              <p className="mb-6 text-center text-[13.5px] font-medium text-[#5B6472] md:mb-8 md:text-[14px]">
                Showing{' '}
                <span className="font-bold text-[#0B1526]">{filteredTools.length}</span>{' '}
                {filteredTools.length === 1 ? 'tool' : 'tools'}
                {activeCategory !== 'All' && (
                  <>
                    {' '}
                    in <span className="font-bold text-[#1E63FF]">{activeCategory}</span>
                  </>
                )}
              </p>

              <div className="hidden animate-tool-enter gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTools.map((tool) => (
                  <Link
                    href={tool.href}
                    key={tool.href}
                    className="group relative flex h-full flex-col rounded-2xl border border-[#DCE4F0] bg-white p-5 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.5)] transition-all duration-200 hover:-translate-y-1 hover:border-[#C3D4F2] hover:shadow-[0_22px_40px_-24px_rgba(37,99,235,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: tool.bgColor, color: tool.color }}
                      >
                        {tool.icon}
                      </div>
                      {tool.popular && (
                        <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[#4F46E5]">
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-[16px] font-extrabold tracking-tight text-[#0B1526]">
                      {tool.label}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-[#5B6472] line-clamp-2">
                      {tool.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1E63FF]">
                      Open tool
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Mobile-only list view — reuses the shared list design
                  used on the image-to-pdf / merge-pdf / pdf-to-image pages. */}
              <div className="sm:hidden">
                <MobileListView
                  items={mobileItems}
                  accentColor="#2563EB"
                  renderThumbnail={(tool) => (
                    <div
                      className="flex h-full w-full items-center justify-center rounded-lg"
                      style={{ backgroundColor: tool.bgColor, color: tool.color }}
                    >
                      <div className="scale-75">{tool.icon}</div>
                    </div>
                  )}
                  onThumbnailTap={(tool) => router.push(tool.href)}
                  renderPrimaryText={(tool) => tool.label}
                  renderSecondaryText={(tool) => tool.description}
                  actions={(tool) => [
                    {
                      icon: <ChevronRight size={18} strokeWidth={1.8} />,
                      ariaLabel: 'Open tool',
                      onClick: () => router.push(tool.href),
                    },
                  ]}
                />
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="mx-auto max-w-md py-16 text-center md:py-24">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1F5FB]">
                <Search size={32} className="text-[#98A3B6]" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#0B1526] md:text-[22px]">
                No tools found
              </h3>
              <p className="mt-2 text-[14.5px] text-[#5B6472]">
                Try a different search term or category.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] px-6 py-3 text-[14px] font-bold text-white shadow-[0_12px_24px_-10px_rgba(37,99,235,0.8)] transition-all hover:opacity-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E63FF] focus-visible:ring-offset-2"
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
