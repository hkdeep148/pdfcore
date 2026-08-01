'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Wrench,
  BookOpen,
  ArrowRight,
  FileText,
  Sparkles,
  TrendingUp,
  CornerDownLeft,
} from 'lucide-react';
import { tools } from '../_config/tools';
import { blogPosts } from '../../blog/_config/posts';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Filter tools
  const filteredTools = query
    ? tools.filter(
        (tool) =>
          tool.label.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase())
      )
    : tools.slice(0, 5);

  // Filter blog posts
  const filteredPosts = query
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const hasResults = filteredTools.length > 0 || filteredPosts.length > 0;
  const totalResults = filteredTools.length + filteredPosts.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-[#07122E]/60 backdrop-blur-md"
          />

          {/* Search Modal Wrapper */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center px-4 pt-4 md:pt-[12vh]">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
             className="w-full max-w-[640px] bg-white rounded-2xl shadow-[0_24px_80px_-20px_rgba(15,23,42,0.4)] overflow-hidden"
            >
              {/* Search Input */}
              <div className="relative flex items-center px-4 md:px-6 border-b border-[#F1F5F9]">
                <Search className="w-5 h-5 text-[#94A3B8] flex-shrink-0" strokeWidth={2.5} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools, articles, or type a command..."
                  className="flex-1 h-16 md:h-18 px-4 text-[16px] md:text-[17px] text-[#0F172A] placeholder-[#94A3B8] outline-none bg-transparent font-medium"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="w-8 h-8 rounded-md hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <kbd className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
                    ESC
                  </kbd>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!hasResults && query && (
                  <div className="py-16 text-center px-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
                      <Search className="w-8 h-8 text-[#94A3B8]" strokeWidth={2} />
                    </div>
                    <p className="text-[15px] font-semibold text-[#0F172A] mb-1.5">
                      No results found
                    </p>
                    <p className="text-[13px] text-[#64748B]">
                      No matches for &quot;<span className="text-[#0F172A] font-medium">{query}</span>&quot;
                    </p>
                  </div>
                )}

                {!query && (
                  <div className="py-2">
                    {/* Popular Tools */}
                    <div className="px-2">
                      <div className="flex items-center gap-2 px-4 py-2">
                        <TrendingUp size={12} className="text-[#94A3B8]" strokeWidth={2.5} />
                        <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                          Popular Tools
                        </p>
                      </div>
                      {filteredTools.map((tool, index) => (
                        <ResultItem
                          key={tool.href}
                          href={tool.href}
                          icon={tool.icon}
                          title={tool.label}
                          description={tool.description}
                          color={tool.color}
                          bgColor={tool.bgColor}
                          onClose={onClose}
                          type="tool"
                          index={index}
                        />
                      ))}
                    </div>

                    <div className="h-px bg-[#F1F5F9] my-2 mx-4" />

                    {/* Quick Links */}
                    <div className="px-2">
                      <div className="flex items-center gap-2 px-4 py-2">
                        <Sparkles size={12} className="text-[#94A3B8]" strokeWidth={2.5} />
                        <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                          Quick Links
                        </p>
                      </div>
                      <QuickLink
                        href="/tools"
                        icon={<Wrench size={16} />}
                        label="Browse All Tools"
                        onClose={onClose}
                      />
                      <QuickLink
                        href="/blog"
                        icon={<BookOpen size={16} />}
                        label="Read Blog Articles"
                        onClose={onClose}
                      />
                      <QuickLink
                        href="/faq"
                        icon={<FileText size={16} />}
                        label="View FAQ"
                        onClose={onClose}
                      />
                    </div>
                  </div>
                )}

                {query && filteredTools.length > 0 && (
                  <div className="px-2 pt-2">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <Wrench size={12} className="text-[#94A3B8]" strokeWidth={2.5} />
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                        Tools
                      </p>
                      <span className="ml-auto text-[10px] font-semibold text-[#94A3B8]">
                        {filteredTools.length}
                      </span>
                    </div>
                    {filteredTools.map((tool, index) => (
                      <ResultItem
                        key={tool.href}
                        href={tool.href}
                        icon={tool.icon}
                        title={tool.label}
                        description={tool.description}
                        color={tool.color}
                        bgColor={tool.bgColor}
                        onClose={onClose}
                        type="tool"
                        index={index}
                      />
                    ))}
                  </div>
                )}

                {query && filteredPosts.length > 0 && (
                  <div className="px-2 pt-2 pb-2">
                    {filteredTools.length > 0 && <div className="h-px bg-[#F1F5F9] my-2 mx-4" />}
                    <div className="flex items-center gap-2 px-4 py-2">
                      <BookOpen size={12} className="text-[#94A3B8]" strokeWidth={2.5} />
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                        Blog Articles
                      </p>
                      <span className="ml-auto text-[10px] font-semibold text-[#94A3B8]">
                        {filteredPosts.length}
                      </span>
                    </div>
                    {filteredPosts.map((post, index) => (
                      <ResultItem
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        icon={<BookOpen size={18} />}
                        title={post.title}
                        description={post.excerpt}
                        color="#7C3AED"
                        bgColor="#EDE9FE"
                        onClose={onClose}
                        type="blog"
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 md:px-6 py-3 border-t border-[#F1F5F9] bg-[#FAFBFC] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded bg-white border border-[#E2E8F0] text-[10px] font-semibold text-[#475569]">
                      ↵
                    </kbd>
                    <span className="text-[11px] text-[#64748B]">to select</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-[#E2E8F0] text-[10px] font-semibold text-[#475569]">
                        ↑
                      </kbd>
                      <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-[#E2E8F0] text-[10px] font-semibold text-[#475569]">
                        ↓
                      </kbd>
                    </div>
                    <span className="text-[11px] text-[#64748B]">to navigate</span>
                  </div>
                </div>
                {query && (
                  <span className="text-[11px] text-[#64748B]">
                    <span className="font-bold text-[#0F172A]">{totalResults}</span>{' '}
                    {totalResults === 1 ? 'result' : 'results'}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============ RESULT ITEM COMPONENT ============ */

interface ResultItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  onClose: () => void;
  type: 'tool' | 'blog';
  index: number;
}

function ResultItem({
  href,
  icon,
  title,
  description,
  color,
  bgColor,
  onClose,
  type,
  index,
}: ResultItemProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F8FAFC] transition-colors mx-2"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColor, color: color }}
      >
        <div className="scale-[0.65]">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-[#0F172A] truncate">
            {title}
          </p>
        </div>
        <p className="text-[12.5px] text-[#64748B] truncate mt-0.5">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
          {type === 'tool' ? 'Tool' : 'Article'}
        </span>
        <CornerDownLeft
          size={14}
          className="text-[#CBD5E1] group-hover:text-[#6366F1] transition-colors opacity-0 group-hover:opacity-100"
          strokeWidth={2.5}
        />
      </div>
    </Link>
  );
}

/* ============ QUICK LINK COMPONENT ============ */

interface QuickLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClose: () => void;
}

function QuickLink({ href, icon, label, onClose }: QuickLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F8FAFC] transition-colors mx-2"
    >
      <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B] group-hover:bg-[#EFF3FF] group-hover:text-[#6366F1] transition-colors">
        {icon}
      </div>
      <span className="flex-1 text-[14px] font-semibold text-[#0F172A]">
        {label}
      </span>
      <ArrowRight
        size={14}
        className="text-[#CBD5E1] group-hover:text-[#6366F1] group-hover:translate-x-0.5 transition-all"
        strokeWidth={2.5}
      />
    </Link>
  );
}