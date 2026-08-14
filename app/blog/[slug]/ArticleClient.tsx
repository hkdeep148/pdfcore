'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle2,
  Info,
  AlertCircle,
  Lightbulb,
  Shield,
  BookOpen,
  Wrench,
  Newspaper,
  ChevronRight,
  Hash,
} from 'lucide-react';
import LandingNavbar from '../../tools/_components/LandingNavbar';
import LandingFooter from '../../tools/_components/LandingFooter';
import {
  getPostBySlug,
  getRelatedPosts,
  categoryLabels,
  categoryColors,
  formatDate,
  type BlogCategory,
  type BlogPost,
} from '../_config/posts';
import { getArticleContent, type ArticleSection } from '../_config/articleContent';

const categoryIcons: Record<BlogCategory, React.ReactNode> = {
  guides: <BookOpen size={14} />,
  tips: <Lightbulb size={14} />,
  tutorials: <Wrench size={14} />,
  security: <Shield size={14} />,
  updates: <Newspaper size={14} />,
};

interface ArticleClientProps {
  slug: string;
}

export default function ArticleClient({ slug }: ArticleClientProps) {
  const post = getPostBySlug(slug);
  const content = getArticleContent(slug);
  const relatedPosts = getRelatedPosts(slug, 3);

  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    notFound();
  }

  const colors = categoryColors[post.category];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F1F5F9] z-[60]">
        <div
          className="h-full bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <LandingNavbar />

      {/* ============ BREADCRUMB ============ */}
      <div className="border-b border-[#ECEDF3] bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-4">
          <div className="grid lg:grid-cols-[260px_900px_260px] gap-8 lg:gap-10 justify-center">
            <div className="hidden lg:block"></div>
            <div className="w-full min-w-0">
              <nav className="flex items-center gap-2 text-[13px] text-[#4B5874]">
                <Link href="/" className="hover:text-[#1E63FF] transition-colors">
                  Home
                </Link>
                <ChevronRight size={14} className="text-[#C0C8D8]" />
                <Link href="/blog" className="hover:text-[#1E63FF] transition-colors">
                  Blog
                </Link>
                <ChevronRight size={14} className="text-[#C0C8D8]" />
                <span className="text-[#07122E] font-semibold truncate">
                  {post.title}
                </span>
              </nav>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      <article>
        {/* ============ HEADER + COVER IMAGE (Aligned with Body) ============ */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
          <div className="grid lg:grid-cols-[260px_900px_260px] gap-8 lg:gap-10 justify-center">
            {/* Left Column - Empty */}
            <div className="hidden lg:block"></div>

            {/* Center Column - Header + Cover Image */}
            <div className="w-full min-w-0">
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#4B5874] hover:text-[#1E63FF] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Blog
                </Link>
                <span className="text-[#C0C8D8]">•</span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold uppercase tracking-wider"
                  style={{ color: colors.color, backgroundColor: colors.bgColor }}
                >
                  {categoryIcons[post.category]}
                  {categoryLabels[post.category]}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] lg:text-[48px] font-extrabold text-[#07122E] leading-tight tracking-tight mb-5">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-[16px] md:text-[18px] text-[#4B5874] leading-relaxed mb-6">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#4B5874] pb-6 border-b border-[#ECEDF3]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E63FF] to-[#6D35FF] flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="font-semibold text-[#07122E]">{post.author}</span>
                </div>
                <span className="text-[#C0C8D8]">•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <span className="text-[#C0C8D8]">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              {/* Cover Image - Perfectly Aligned! */}
              {(post.coverImage || post.coverEmoji) && (
                <div className="mt-8">
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(15,23,42,0.3)] ${
                      !post.coverImage ? `bg-gradient-to-br ${post.coverGradient} flex items-center justify-center` : ''
                    }`}
                    style={{ aspectRatio: '1200 / 800' }}
                  >
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="text-[140px] md:text-[200px]">{post.coverEmoji}</div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Empty */}
            <div className="hidden lg:block"></div>
          </div>
        </div>

        {/* ============ ARTICLE BODY WITH TOC ============ */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-8 md:py-12">
          <div className="grid lg:grid-cols-[260px_900px_260px] gap-8 lg:gap-10 justify-center">
            {/* Left Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-[100px]">
                {content?.tableOfContents && (
                  <div className="bg-white border border-[#ECEDF3] rounded-2xl p-5">
                    <h3 className="text-[12px] font-extrabold text-[#07122E] mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <Hash size={13} className="text-[#1E63FF]" />
                      In This Article
                    </h3>
                    <ul className="space-y-2.5">
                      {content.tableOfContents.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="text-[13px] text-[#4B5874] hover:text-[#1E63FF] font-medium transition-colors block"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="w-full min-w-0">
              {/* Intro */}
              {content?.intro && (
                <p className="text-[17px] md:text-[18px] text-[#26324B] leading-relaxed font-medium mb-8 pb-8 border-b border-[#ECEDF3]">
                  {content.intro}
                </p>
              )}

              {/* Table of Contents (Mobile) */}
              {content?.tableOfContents && (
                <div className="lg:hidden mb-10 bg-[#F8FAFC] border border-[#ECEDF3] rounded-2xl p-5">
                  <h3 className="text-[13px] font-extrabold text-[#07122E] mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Hash size={14} className="text-[#1E63FF]" />
                    Table of Contents
                  </h3>
                  <ul className="space-y-2">
                    {content.tableOfContents.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-[13.5px] text-[#4B5874] hover:text-[#1E63FF] font-medium transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article Sections */}
              {content ? (
                <div className="prose-content">
                  {content.sections.map((section, index) => (
                    <SectionRenderer
                      key={index}
                      section={section}
                      tocItems={content.tableOfContents}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#F8FAFC] rounded-2xl border border-[#ECEDF3]">
                  <BookOpen className="w-16 h-16 text-[#94A3B8] mx-auto mb-4" />
                  <h3 className="text-[20px] font-extrabold text-[#07122E] mb-2">
                    Article Coming Soon
                  </h3>
                  <p className="text-[14px] text-[#4B5874] mb-6">
                    We&apos;re working on this article. Check back soon!
                  </p>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E63FF] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Blog
                  </Link>
                </div>
              )}

              {/* FAQs Section */}
              {content?.faqs && content.faqs.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#ECEDF3]">
                  <h2 className="font-['Space_Grotesk',sans-serif] text-[26px] md:text-[32px] font-extrabold text-[#07122E] mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {content.faqs.map((faq, index) => (
                      <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA to Related Tool */}
              {post.relatedTool && (
                <div className="mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E63FF] via-[#4F46E5] to-[#6D35FF] p-8 md:p-10 text-center shadow-[0_20px_60px_-15px_rgba(109,53,255,0.5)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                  <div className="relative">
                    <h3 className="font-['Space_Grotesk',sans-serif] text-[22px] md:text-[28px] font-extrabold text-white mb-3">
                      Ready to Try It Yourself?
                    </h3>
                    <p className="text-[14px] md:text-[15px] text-white/90 mb-6 max-w-md mx-auto">
                      Put what you learned into action. Our tool is 100% free with no signup required.
                    </p>
                    <Link
                      href={post.relatedTool}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1E63FF] text-[15px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                    >
                      Try the Tool Now
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-10 pt-8 border-t border-[#ECEDF3]">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-[13px] font-extrabold text-[#07122E] mb-2 uppercase tracking-wider">
                      Share this article
                    </p>
                    <p className="text-[12px] text-[#4B5874]">
                      Help others by sharing this guide
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={shareUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-white border border-[#E7ECF5] flex items-center justify-center text-[#4B5874] hover:border-[#000000] hover:text-[#000000] hover:bg-[#000000]/5 transition-all"
                      aria-label="Share on Twitter"
                    >
                      <TwitterIcon size={16} />
                    </a>
                    <a
                      href={shareUrls.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-white border border-[#E7ECF5] flex items-center justify-center text-[#4B5874] hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/5 transition-all"
                      aria-label="Share on Facebook"
                    >
                      <FacebookIcon size={16} />
                    </a>
                    <a
                      href={shareUrls.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-white border border-[#E7ECF5] flex items-center justify-center text-[#4B5874] hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 transition-all"
                      aria-label="Share on LinkedIn"
                    >
                      <LinkedinIcon size={16} />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-10 h-10 rounded-lg bg-white border border-[#E7ECF5] flex items-center justify-center text-[#4B5874] hover:border-[#1E63FF] hover:text-[#1E63FF] hover:bg-[#1E63FF]/5 transition-all relative"
                      aria-label="Copy link"
                    >
                      {copied ? <CheckCircle2 size={16} className="text-[#16A34A]" /> : <LinkIcon size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Empty spacer */}
            <aside className="hidden lg:block" aria-hidden="true"></aside>
          </div>
        </div>
      </article>

      {/* ============ RELATED ARTICLES ============ */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-[#F8FAFC]">
          <div className="max-w-[1200px] mx-auto px-5 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight">
                  Related Articles
                </h2>
                <p className="text-[14px] text-[#4B5874] mt-1">
                  More {categoryLabels[post.category].toLowerCase()} you might find helpful
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-bold text-[#1E63FF] hover:text-[#1D4ED8] transition-colors"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      <LandingFooter />
    </div>
  );
}

/* ============ SECTION RENDERER ============ */

interface SectionRendererProps {
  section: ArticleSection;
  tocItems?: { id: string; title: string }[];
}

function SectionRenderer({ section, tocItems }: SectionRendererProps) {
  switch (section.type) {
    case 'heading': {
      // Prefer explicit id from data; fallback to matching TOC by title
      const tocItem = tocItems?.find(item =>
        section.content?.toLowerCase().includes(item.title.toLowerCase())
      );
      const headingId = section.id || tocItem?.id;

      return (
        <h2
          id={headingId}
          className="font-['Space_Grotesk',sans-serif] text-[26px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight mt-10 mb-4 scroll-mt-24"
        >
          {section.content}
        </h2>
      );
    }

    case 'subheading':
      return (
        <h3 className="text-[19px] md:text-[22px] font-extrabold text-[#07122E] mt-8 mb-3">
          {section.content}
        </h3>
      );

    case 'paragraph':
      return (
        <p className="text-[15.5px] md:text-[16px] text-[#26324B] leading-relaxed mb-5">
          {section.content}
        </p>
      );

    case 'list':
      return (
        <ul className="space-y-2.5 mb-6 ml-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] md:text-[15.5px] text-[#26324B] leading-relaxed">
              <span className="text-[#1E63FF] font-extrabold flex-shrink-0 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'callout': {
      const variants = {
        info: { bg: 'from-[#EFF6FF] to-[#DBEAFE]', border: 'border-[#BFDBFE]', icon: Info, iconColor: 'text-[#1E63FF]', titleColor: 'text-[#1E40AF]', textColor: 'text-[#1E40AF]' },
        success: { bg: 'from-[#F0FDF4] to-[#DCFCE7]', border: 'border-[#86EFAC]', icon: CheckCircle2, iconColor: 'text-[#16A34A]', titleColor: 'text-[#166534]', textColor: 'text-[#166534]' },
        warning: { bg: 'from-[#FEF3C7] to-[#FDE68A]', border: 'border-[#FCD34D]', icon: AlertCircle, iconColor: 'text-[#D97706]', titleColor: 'text-[#92400E]', textColor: 'text-[#92400E]' },
        tip: { bg: 'from-[#F5F3FF] to-[#EDE9FE]', border: 'border-[#C4B5FD]', icon: Lightbulb, iconColor: 'text-[#7C3AED]', titleColor: 'text-[#5B21B6]', textColor: 'text-[#5B21B6]' },
      };
      const variant = variants[section.variant || 'info'];
      const Icon = variant.icon;

      return (
        <div className={`bg-gradient-to-br ${variant.bg} border ${variant.border} rounded-xl p-5 my-6 flex items-start gap-3`}>
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon size={16} className={variant.iconColor} />
          </div>
          <div className="flex-1">
            {section.title && (
              <p className={`text-[14px] font-extrabold mb-1 ${variant.titleColor}`}>
                {section.title}
              </p>
            )}
            <p className={`text-[13.5px] leading-relaxed ${variant.textColor}`}>
              {section.content}
            </p>
          </div>
        </div>
      );
    }

    case 'steps':
      return (
        <div className="my-6 space-y-4">
          {section.steps?.map((step, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-white border border-[#ECEDF3] rounded-xl hover:border-[#C9D8F3] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E63FF] to-[#6D35FF] flex items-center justify-center flex-shrink-0 text-white font-extrabold text-[14px] shadow-sm">
                {i + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] md:text-[16px] font-extrabold text-[#07122E] mb-1">
                  {step.title}
                </h4>
                <p className="text-[13.5px] md:text-[14px] text-[#4B5874] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'divider':
      return <hr className="border-[#ECEDF3] my-8" />;

    case 'quote':
      return (
        <blockquote className="border-l-4 border-[#1E63FF] pl-5 my-6 italic text-[16px] text-[#4B5874]">
          {section.content}
        </blockquote>
      );

    default:
      return null;
  }
}
/* ============ FAQ ITEM ============ */

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-xl border transition-all ${
      isOpen ? 'border-[#C9D8F3] shadow-[0_8px_20px_-6px_rgba(15,23,42,0.08)]' : 'border-[#ECEDF3] hover:border-[#C9D8F3]'
    }`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <h4 className="text-[15px] font-extrabold text-[#07122E] leading-snug flex-1">
          {question}
        </h4>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
          isOpen ? 'bg-[#EFF3FF] rotate-180' : 'bg-[#F8FAFC]'
        }`}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#1E63FF]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="pt-3 border-t border-[#ECEDF3]">
            <p className="text-[13.5px] text-[#4B5874] leading-relaxed pt-3">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ RELATED POST CARD ============ */

function RelatedPostCard({ post }: { post: BlogPost }) {
  const colors = categoryColors[post.category];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12)] transition-all overflow-hidden"
    >
      <div className={`relative h-40 overflow-hidden ${
        !post.coverImage ? `bg-gradient-to-br ${post.coverGradient} flex items-center justify-center` : ''
      }`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="text-[60px] group-hover:scale-110 transition-transform duration-300">
            {post.coverEmoji}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-wider"
            style={{ color: colors.color }}
          >
            {categoryIcons[post.category]}
            {categoryLabels[post.category]}
          </span>
        </div>
        <h3 className="text-[15px] font-extrabold text-[#07122E] leading-snug mb-2 group-hover:text-[#1E63FF] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-2 text-[11.5px] text-[#8A93A3]">
          <Clock size={11} />
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}

/* ============ SOCIAL MEDIA ICONS (Custom SVG) ============ */

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}