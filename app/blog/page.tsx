'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  TrendingUp,
  Sparkles,
  FileText,
  Lightbulb,
  Wrench,
  Shield,
  Newspaper,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import LandingFooter from '../tools/_components/LandingFooter';
import {
  getAllPosts,
  getFeaturedPosts,
  categoryLabels,
  categoryColors,
  formatDate,
  type BlogCategory,
  type BlogPost,
} from './_config/posts';

const categoryIcons: Record<BlogCategory, React.ReactNode> = {
  guides: <BookOpen size={16} />,
  tips: <Lightbulb size={16} />,
  tutorials: <Wrench size={16} />,
  security: <Shield size={16} />,
  updates: <Newspaper size={16} />,
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');

  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    // Category filter
    if (activeCategory !== 'all' && post.category !== activeCategory) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Exclude featured posts from main grid (unless searching/filtering)
  const gridPosts = (searchQuery || activeCategory !== 'all')
    ? filteredPosts
    : filteredPosts.filter(post => !post.featured);

  const mainFeaturedPost = featuredPosts[0];
  const secondaryFeaturedPost = featuredPosts[1];

  const showFeaturedSection = !searchQuery && activeCategory === 'all';

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <LandingNavbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3FF] via-white to-[#EFF6FF] opacity-70 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6366F1] opacity-[0.08] blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-5">
              <BookOpen size={13} />
              <span>PDF Learning Hub</span>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] sm:text-[44px] md:text-[54px] md:leading-tight font-extrabold tracking-tight text-[#07122E] mb-4">
              Master PDFs with{' '}
              <span className="bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
                Expert Guides
              </span>
            </h1>

            <p className="text-[15px] md:text-[17px] text-[#4B5874] font-medium max-w-2xl mx-auto leading-relaxed mb-8">
              Discover tips, tutorials, and best practices to work smarter with PDFs. Learn from our comprehensive guides.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8A93A3]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-14 pr-5 py-4 rounded-xl border-2 border-[#E7ECF5] bg-white text-[15px] text-[#07122E] placeholder-[#8A93A3] focus:border-[#1E63FF] focus:outline-none focus:ring-4 focus:ring-[#1E63FF]/10 transition-all shadow-[0_4px_20px_-8px_rgba(15,23,42,0.1)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors"
                    aria-label="Clear search"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#4B5874]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CATEGORY FILTERS ============ */}
      <section className="py-6 md:py-8 border-y border-[#ECEDF3] bg-white sticky top-[72px] z-30 backdrop-blur-lg bg-white/90">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#07122E] text-white shadow-[0_4px_12px_-2px_rgba(15,23,42,0.3)]'
                  : 'bg-white border border-[#E7ECF5] text-[#4B5874] hover:border-[#C9D8F3] hover:text-[#07122E]'
              }`}
            >
              <Sparkles size={14} />
              All Articles
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeCategory === 'all' ? 'bg-white/20' : 'bg-[#F1F5F9]'
              }`}>
                {allPosts.length}
              </span>
            </button>

            {(Object.keys(categoryLabels) as BlogCategory[]).map((category) => {
              const count = allPosts.filter(p => p.category === category).length;
              const colors = categoryColors[category];
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                    isActive
                      ? 'text-white shadow-[0_4px_12px_-2px_rgba(15,23,42,0.3)]'
                      : 'bg-white border border-[#E7ECF5] text-[#4B5874] hover:border-[#C9D8F3] hover:text-[#07122E]'
                  }`}
                  style={isActive ? { backgroundColor: colors.color } : {}}
                >
                  {categoryIcons[category]}
                  {categoryLabels[category]}
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20' : 'bg-[#F1F5F9]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FEATURED SECTION (only when no filter) ============ */}
      {showFeaturedSection && mainFeaturedPost && (
        <section className="py-10 md:py-16">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              <h2 className="text-[14px] font-extrabold text-[#07122E] uppercase tracking-wider">
                Featured Articles
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
              {/* Main Featured Post */}
              <FeaturedPostCard post={mainFeaturedPost} large />

              {/* Secondary Featured Post + Latest Grid */}
              <div className="space-y-4">
                {secondaryFeaturedPost && (
                  <FeaturedPostCard post={secondaryFeaturedPost} />
                )}

                {/* Quick article previews */}
                <div className="space-y-3">
                  {allPosts.slice(0, 3).filter(p => !p.featured).map(post => (
                    <CompactPostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ ARTICLES GRID ============ */}
      <section className="py-10 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3">
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight">
                {searchQuery
                  ? `Search Results`
                  : activeCategory === 'all'
                  ? 'Latest Articles'
                  : categoryLabels[activeCategory as BlogCategory]}
              </h2>
              <p className="text-[13px] md:text-[14px] text-[#4B5874] mt-1">
                {searchQuery
                  ? `Found ${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''}`
                  : `${gridPosts.length} article${gridPosts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {/* Grid or No Results */}
          {gridPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#ECEDF3]">
              <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-[#94A3B8]" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#07122E] mb-2">
                No articles found
              </h3>
              <p className="text-[14px] text-[#4B5874] mb-6">
                Try different keywords or browse another category
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E63FF] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {gridPosts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E63FF] via-[#4F46E5] to-[#6D35FF] px-8 py-14 md:px-16 md:py-20 text-center shadow-[0_20px_60px_-15px_rgba(109,53,255,0.5)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-[26px] md:text-[38px] font-extrabold text-white leading-tight tracking-tight mb-4">
                Ready to Try Our Tools?
              </h2>
              <p className="text-[15px] md:text-[17px] text-white/90 mb-8 max-w-xl mx-auto">
                Put what you learned into action. All PDF tools are 100% free with no signup required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1E63FF] text-[15px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                >
                  Explore All Tools
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

/* ============ POST CARD COMPONENTS ============ */

interface PostCardProps {
  post: BlogPost;
  index?: number;
}

function PostCard({ post, index = 0 }: PostCardProps) {
  const colors = categoryColors[post.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-white rounded-2xl border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12)] transition-all overflow-hidden h-full flex flex-col"
      >
        {/* Cover */}
        <div className={`relative h-48 overflow-hidden ${
          !post.coverImage ? `bg-gradient-to-br ${post.coverGradient} flex items-center justify-center` : ''
        }`}>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="text-[80px] group-hover:scale-110 transition-transform duration-300">
              {post.coverEmoji}
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-sm"
              style={{ color: colors.color }}
            >
              {categoryIcons[post.category]}
              {categoryLabels[post.category]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex-1 flex flex-col">
          <h3 className="text-[16px] md:text-[17px] font-extrabold text-[#07122E] leading-snug mb-2 group-hover:text-[#1E63FF] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-[13px] text-[#4B5874] leading-relaxed mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11.5px] text-[#8A93A3] pt-3 border-t border-[#ECEDF3]">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ============ FEATURED POST CARD ============ */

interface FeaturedPostCardProps {
  post: BlogPost;
  large?: boolean;
}

function FeaturedPostCard({ post, large }: FeaturedPostCardProps) {
  const colors = categoryColors[post.category];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block bg-white rounded-2xl border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12)] transition-all overflow-hidden ${
        large ? 'h-full' : ''
      }`}
    >
      {/* Cover */}
      <div className={`relative overflow-hidden ${
        large ? 'h-64 md:h-80' : 'h-48'
      } ${
        !post.coverImage ? `bg-gradient-to-br ${post.coverGradient} flex items-center justify-center` : ''
      }`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className={`group-hover:scale-110 transition-transform duration-300 ${
            large ? 'text-[120px]' : 'text-[80px]'
          }`}>
            {post.coverEmoji}
          </div>
        )}
        {/* Featured badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-[#F59E0B] text-white shadow-lg">
            <TrendingUp size={11} />
            Featured
          </span>
        </div>
        {/* Category */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-sm"
            style={{ color: colors.color }}
          >
            {categoryIcons[post.category]}
            {categoryLabels[post.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 md:p-6 ${large ? 'md:p-8' : ''}`}>
        <h3 className={`font-['Space_Grotesk',sans-serif] font-extrabold text-[#07122E] leading-tight mb-3 group-hover:text-[#1E63FF] transition-colors ${
          large ? 'text-[22px] md:text-[28px]' : 'text-[18px]'
        }`}>
          {post.title}
        </h3>
        <p className={`text-[#4B5874] leading-relaxed mb-4 ${
          large ? 'text-[15px]' : 'text-[13.5px]'
        }`}>
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[12px] text-[#8A93A3]">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ============ COMPACT POST CARD ============ */

interface CompactPostCardProps {
  post: BlogPost;
}

function CompactPostCard({ post }: CompactPostCardProps) {
  const colors = categoryColors[post.category];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_4px_16px_-4px_rgba(15,23,42,0.1)] transition-all"
    >
      {/* Small cover */}
      <div className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform ${
        !post.coverImage ? `bg-gradient-to-br ${post.coverGradient} flex items-center justify-center` : ''
      }`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-[32px]">{post.coverEmoji}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] font-extrabold uppercase tracking-wider"
            style={{ color: colors.color }}
          >
            {categoryLabels[post.category]}
          </span>
        </div>
        <h4 className="text-[13.5px] font-extrabold text-[#07122E] leading-snug group-hover:text-[#1E63FF] transition-colors line-clamp-2 mb-1">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-[#8A93A3]">
          <Clock size={10} />
          <span>{post.readTime} min read</span>
        </div>
      </div>

      <ArrowRight size={16} className="text-[#8A93A3] group-hover:text-[#1E63FF] group-hover:translate-x-1 transition-all flex-shrink-0" />
    </Link>
  );
}