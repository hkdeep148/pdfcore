'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  FileText,
  Shield,
  Zap,
  Settings,
  CreditCard,
  Wrench,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Mail,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import LandingFooter from '../tools/_components/LandingFooter';

// ============ FAQ DATA ============

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    label: 'General',
    icon: <HelpCircle size={20} />,
    color: '#1E63FF',
    bgColor: '#DBEAFE',
    items: [
      {
        q: 'What is PDF Core?',
        a: 'PDF Core is a free, browser-based collection of PDF tools. You can merge, split, compress, convert, rotate, watermark, and organize PDF files — all without uploading anything to our servers. Everything runs directly in your web browser.',
      },
      {
        q: 'Is PDF Core really free?',
        a: 'Yes, 100% free forever. All our tools are completely free with no hidden costs, no premium tiers, no watermarks, no trial periods, and no credit card required. We believe powerful PDF tools should be accessible to everyone.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No! PDF Core requires zero signup. Just visit the tool you need, upload your file, and get your result. No email, no password, no registration.',
      },
      {
        q: 'How is PDF Core different from other PDF tools?',
        a: 'Three key differences: (1) It\'s completely free with no premium features, (2) Files are processed entirely in your browser — nothing is uploaded to our servers, and (3) No account or signup is required.',
      },
      {
        q: 'How can PDF Core be free? What\'s the catch?',
        a: 'There\'s no catch. We built PDF Core because we believe PDF tools shouldn\'t be locked behind paywalls. Since our tools run in your browser, we have very low server costs to maintain.',
      },
    ],
  },
  {
    id: 'security',
    label: 'Security & Privacy',
    icon: <Shield size={20} />,
    color: '#16A34A',
    bgColor: '#DCFCE7',
    items: [
      {
        q: 'Are my files safe?',
        a: 'Absolutely. Your files never leave your device. All processing happens in your browser using JavaScript. We can\'t see, access, or store your files at any point.',
      },
      {
        q: 'Do you store my uploaded files?',
        a: 'No. We don\'t store any files because we never receive them in the first place. Your files stay on your device throughout the entire process.',
      },
      {
        q: 'Can I use PDF Core for confidential documents?',
        a: 'Yes, PDF Core is perfect for confidential documents like contracts, medical records, tax returns, or legal papers. Since files are processed locally, they remain as confidential as they are on your computer.',
      },
      {
        q: 'How can I verify that files aren\'t uploaded?',
        a: 'Easy! Open your browser\'s Developer Tools (press F12) and go to the Network tab. Then use any of our tools. You\'ll see that no file upload requests are made to our servers — everything happens locally.',
      },
      {
         q: 'Do you use cookies or tracking?',
         a: 'We use minimal cookies with full transparency. When you first visit, you\'ll see a cookie banner where you can choose: (1) Necessary cookies (always active for site functionality), (2) Functional cookies (for preferences - optional), or (3) Analytics cookies (anonymous usage stats - optional). We never use advertising cookies, tracking pixels, or behavioral profiling. You have full control.',
      },
      {
        q: 'How do I manage my cookie preferences?',
        a: 'When you first visit PDF Core, a cookie banner appears at the bottom of the page. You can: (1) Click "Accept All" to enable all cookies, (2) Click "Reject All" for only necessary cookies, or (3) Click "Customize" to pick which categories to enable. To change your preferences later, clear your browser\'s local storage for our site, and the banner will appear again.',
      },
      {
        q: 'Is my data shared with third parties?',
        a: 'No. Since we don\'t collect your data, there\'s nothing to share. Your files and personal information stay private.',
      },
    ],
  },
  {
    id: 'tools',
    label: 'Using Tools',
    icon: <Wrench size={20} />,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    items: [
      {
        q: 'What PDF tools do you offer?',
        a: 'We offer 10+ tools: Merge PDF, Split PDF, Compress PDF, PDF to Image, Image to PDF, Rotate PDF, Organize PDF, Add Watermark, Unlock PDF, and Protect PDF. More tools are added regularly.',
      },
      {
        q: 'How do I use a PDF tool?',
        a: 'It\'s simple: (1) Visit the tool page, (2) Upload your file by clicking "Choose File" or dragging it in, (3) Adjust any settings you want, (4) Download the result. That\'s it!',
      },
      {
        q: 'What file formats do you support?',
        a: 'For PDF tools, we support standard PDF files. For image tools, we support JPG, PNG, and WebP. HEIC and other formats are automatically converted when needed.',
      },
      {
        q: 'How do I merge multiple PDFs?',
        a: 'Go to our Merge PDF tool, upload the PDFs you want to combine (you can drag & drop multiple files), reorder them if needed, then click "Merge PDF". Your combined PDF will download automatically.',
      },
      {
        q: 'Can I split a PDF into individual pages?',
        a: 'Yes! Use our Split PDF tool. Upload your PDF, select which pages you want to extract (individual pages or ranges), and download the result.',
      },
      {
        q: 'How do I compress a PDF?',
        a: 'Use our Compress PDF tool. Upload your file, choose a compression level (Low, Medium, or High), and download the smaller version. You can adjust quality to balance file size vs. quality.',
      },
    ],
  },
  {
    id: 'files',
    label: 'File Handling',
    icon: <FileText size={20} />,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    items: [
      {
        q: 'What\'s the maximum file size I can process?',
        a: 'There\'s no strict limit set by us. Since processing happens in your browser, the limit depends on your device\'s memory (RAM). Most devices can handle files up to 100MB+ without issues.',
      },
      {
        q: 'Can I process multiple files at once?',
        a: 'Yes! Tools like Merge PDF, Compress PDF, and Image to PDF support batch processing. Just upload multiple files and process them together.',
      },
      {
        q: 'What happens to my files after processing?',
        a: 'Once you close the browser tab, everything is cleared from your device\'s memory. Your original files remain untouched wherever you saved them.',
      },
      {
        q: 'Can I work with password-protected PDFs?',
        a: 'Yes! Use our Unlock PDF tool for password-protected files. The password is processed locally in your browser — we never see it.',
      },
      {
        q: 'Are there any watermarks on processed files?',
        a: 'Never! We don\'t add any watermarks, branding, or labels to your processed files. What you download is exactly what our tool produced.',
      },
      {
        q: 'Can I use PDF Core offline?',
        a: 'Once a tool page is loaded, most tools can continue working even without an internet connection. The initial page load requires internet, but processing happens locally.',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical',
    icon: <Settings size={20} />,
    color: '#EC4899',
    bgColor: '#FCE7F3',
    items: [
      {
        q: 'What browsers are supported?',
        a: 'PDF Core works on all modern browsers: Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version for the best experience.',
      },
      {
        q: 'Does it work on mobile devices?',
        a: 'Yes! PDF Core is fully responsive and works great on smartphones and tablets. Both iOS and Android are supported.',
      },
      {
        q: 'Why is the tool loading slowly?',
        a: 'The first time you visit a tool, it needs to load the processing libraries. This is a one-time load that\'s cached for future visits. If issues persist, try clearing your browser cache.',
      },
      {
        q: 'The tool isn\'t working. What should I do?',
        a: 'Try these steps: (1) Refresh the page, (2) Check your internet connection, (3) Try a different browser, (4) Clear your browser cache, (5) Make sure your file isn\'t corrupted. If issues continue, contact us.',
      },
      {
        q: 'What technology powers PDF Core?',
        a: 'We use open-source JavaScript libraries: PDF.js (Mozilla) for rendering, pdf-lib for modifications, JSZip for archives, and Next.js for the website. Everything runs in your browser.',
      },
      {
        q: 'Can I use PDF Core in my organization?',
        a: 'Yes! PDF Core is free for personal, educational, and business use. No licenses needed. Just visit the site and start using the tools.',
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Plans',
    icon: <CreditCard size={20} />,
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    items: [
      {
        q: 'Is there a paid version?',
        a: 'No, there\'s no paid version. All features are free for everyone, forever. There are no premium tiers, no pro features, and no hidden costs.',
      },
      {
        q: 'Are there any limits on free usage?',
        a: 'You can use our tools as many times as you want. There\'s no daily limit, no monthly quota, and no usage caps.',
      },
      {
        q: 'Do you offer a business or enterprise plan?',
        a: 'Since everything is free, there\'s no business plan needed. Companies of all sizes can use PDF Core for free without any restrictions.',
      },
      {
        q: 'Do you accept donations?',
        a: 'While we don\'t currently accept donations, your support through sharing PDF Core with others is greatly appreciated!',
      },
      {
        q: 'Will PDF Core become paid in the future?',
        a: 'Our commitment is to keep PDF Core free. We built this service because we believe PDF tools should be accessible to everyone.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemKey: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) {
        next.delete(itemKey);
      } else {
        next.add(itemKey);
      }
      return next;
    });
  };

  // Filter FAQs based on search + category
  const filteredCategories = faqCategories
    .map((category) => {
      if (activeCategory && category.id !== activeCategory) return null;

      const filteredItems = category.items.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          item.q.toLowerCase().includes(query) ||
          item.a.toLowerCase().includes(query)
        );
      });

      if (filteredItems.length === 0) return null;

      return { ...category, items: filteredItems };
    })
    .filter(Boolean) as FAQCategory[];

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

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
              <HelpCircle size={13} />
              <span>Help Center</span>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] sm:text-[44px] md:text-[54px] md:leading-tight font-extrabold tracking-tight text-[#07122E] mb-4">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
                Questions
              </span>
            </h1>

            <p className="text-[15px] md:text-[17px] text-[#4B5874] font-medium max-w-2xl mx-auto leading-relaxed mb-8">
              Everything you need to know about PDF Core. Can&apos;t find what you&apos;re looking for?{' '}
              <a href="#contact" className="text-[#1E63FF] font-semibold hover:underline">
                Get in touch
              </a>.
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
                  placeholder="Search for answers..."
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

              {searchQuery && (
                <p className="text-[13px] text-[#4B5874] mt-3">
                  Found <strong className="text-[#07122E]">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                </p>
              )}
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
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                activeCategory === null
                  ? 'bg-[#07122E] text-white shadow-[0_4px_12px_-2px_rgba(15,23,42,0.3)]'
                  : 'bg-white border border-[#E7ECF5] text-[#4B5874] hover:border-[#C9D8F3] hover:text-[#07122E]'
              }`}
            >
              <Sparkles size={14} />
              All Questions
            </button>

            {faqCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                  activeCategory === category.id
                    ? 'text-white shadow-[0_4px_12px_-2px_rgba(15,23,42,0.3)]'
                    : 'bg-white border border-[#E7ECF5] text-[#4B5874] hover:border-[#C9D8F3] hover:text-[#07122E]'
                }`}
                style={
                  activeCategory === category.id
                    ? { backgroundColor: category.color }
                    : {}
                }
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ CONTENT ============ */}
      <section className="py-12 md:py-20">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          {filteredCategories.length === 0 ? (
            /* No Results */
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-5">
                <Search className="w-10 h-10 text-[#94A3B8]" />
              </div>
              <h3 className="text-[20px] font-extrabold text-[#07122E] mb-2">
                No results found
              </h3>
              <p className="text-[14px] text-[#4B5874] mb-6">
                Try different keywords or browse by category
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(null);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E63FF] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredCategories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: catIndex * 0.05 }}
                className="mb-10 md:mb-14"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: category.bgColor, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="font-['Space_Grotesk',sans-serif] text-[22px] md:text-[26px] font-extrabold text-[#07122E] tracking-tight">
                      {category.label}
                    </h2>
                    <p className="text-[12.5px] text-[#8A93A3] font-medium">
                      {category.items.length} question{category.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Questions */}
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => {
                    const itemKey = `${category.id}-${itemIndex}`;
                    const isOpen = openItems.has(itemKey);

                    return (
                      <div
                        key={itemKey}
                        className={`bg-white rounded-xl border transition-all ${
                          isOpen
                            ? 'border-[#C9D8F3] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.1)]'
                            : 'border-[#ECEDF3] hover:border-[#C9D8F3]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                        >
                          <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#07122E] leading-snug flex-1">
                            {item.q}
                          </h3>
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                              isOpen ? 'bg-[#EFF3FF]' : 'bg-[#F8FAFC]'
                            }`}
                          >
                            <ChevronDown
                              size={18}
                              className={`text-[#1E63FF] transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 md:px-6 pb-5 md:pb-6">
                                <div className="pt-2 border-t border-[#ECEDF3]">
                                  <p className="text-[14px] md:text-[14.5px] text-[#4B5874] leading-relaxed pt-4">
                                    {item.a}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* ============ POPULAR ACTIONS ============ */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Zap size={12} />
              <span>Quick Actions</span>
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight">
              Popular Actions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            <QuickAction
              href="/tools"
              icon={<Wrench size={22} />}
              title="Try Our Tools"
              description="Explore all 10+ free PDF tools"
              color="#1E63FF"
              bgColor="#DBEAFE"
            />
            <QuickAction
              href="/security"
              icon={<Shield size={22} />}
              title="Learn About Security"
              description="How we keep your files private"
              color="#16A34A"
              bgColor="#DCFCE7"
            />
            <QuickAction
              href="/about"
              icon={<HelpCircle size={22} />}
              title="Learn More"
              description="About our mission and story"
              color="#7C3AED"
              bgColor="#EDE9FE"
            />
          </div>
        </div>
      </section>

      {/* ============ STILL HAVE QUESTIONS ============ */}
      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E63FF] via-[#4F46E5] to-[#6D35FF] px-8 py-14 md:px-16 md:py-20 text-center shadow-[0_20px_60px_-15px_rgba(109,53,255,0.5)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-[26px] md:text-[38px] font-extrabold text-white leading-tight tracking-tight mb-4">
                Still Have Questions?
              </h2>
              <p className="text-[15px] md:text-[17px] text-white/90 mb-8 max-w-xl mx-auto">
                Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
                Reach out and we&apos;ll get back to you as soon as possible.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="mailto:support@pdfcore.com"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#1E63FF] text-[15px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                >
                  <Mail size={18} />
                  Contact Support
                </a>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white text-[15px] font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Explore Tools
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />

      {/* Hide scrollbar for category filters */}
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

/* ============ SUB COMPONENTS ============ */

interface QuickActionProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function QuickAction({ href, icon, title, description, color, bgColor }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-6 border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12)] transition-all"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h3 className="text-[16px] font-extrabold text-[#07122E] mb-1 group-hover:text-[#1E63FF] transition-colors">
        {title}
      </h3>
      <p className="text-[13px] text-[#4B5874] leading-relaxed">{description}</p>
    </Link>
  );
}