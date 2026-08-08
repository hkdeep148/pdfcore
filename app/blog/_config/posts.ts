export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** SEO-optimized meta description (150-160 chars). Falls back to excerpt if not provided. */
  metaDescription?: string;
  /** SEO-optimized page title. Falls back to `title` if not provided. */
  metaTitle?: string;
  category: BlogCategory;
  tags: string[];
  coverImage?: string;
  coverEmoji: string;
  coverGradient: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured?: boolean;
  relatedTool?: string;
}

export type BlogCategory =
  | 'guides'
  | 'tips'
  | 'tutorials'
  | 'security'
  | 'updates';

export const categoryLabels: Record<BlogCategory, string> = {
  guides: 'Guides',
  tips: 'Tips & Tricks',
  tutorials: 'Tutorials',
  security: 'Security',
  updates: 'Updates',
};

export const categoryColors: Record<BlogCategory, { color: string; bgColor: string }> = {
  guides: { color: '#1E63FF', bgColor: '#DBEAFE' },
  tips: { color: '#F59E0B', bgColor: '#FEF3C7' },
  tutorials: { color: '#7C3AED', bgColor: '#EDE9FE' },
  security: { color: '#16A34A', bgColor: '#DCFCE7' },
  updates: { color: '#EC4899', bgColor: '#FCE7F3' },
};

// ============ BLOG POSTS ============

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files: Complete Guide for 2025',
    excerpt: 'Learn the easiest ways to combine multiple PDF files into one document. Free methods, tips for maintaining quality, and step-by-step instructions.',
    category: 'guides',
    tags: ['merge', 'pdf', 'guide', 'combine'],
    coverImage: '/blog/merge-pdf.jpg',
    coverEmoji: '📄',
    coverGradient: 'from-[#1E63FF] to-[#6D35FF]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-15',
    readTime: 6,
    featured: true,
    relatedTool: '/tools/merge-pdf',
  },
  {
    slug: 'how-to-compress-pdf',
    coverImage: '/blog/compress-pdf.jpg',
    title: 'How to Compress PDF Files Without Losing Quality',
    excerpt: 'Reduce PDF file size by up to 80% while maintaining readability. Discover the best compression techniques and when to use each level.',
    category: 'guides',
    tags: ['compress', 'file-size', 'optimize'],
    coverEmoji: '🗜️',
    coverGradient: 'from-[#F43F5E] to-[#DB2777]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-14',
    readTime: 5,
    featured: true,
    relatedTool: '/tools/compress-pdf',
  },
  {
    slug: 'convert-pdf-to-image',
    title: 'How to Convert PDF to JPG or PNG Images',
    excerpt: 'Extract high-quality images from any PDF document. Perfect for presentations, social media, or when you need visual snapshots.',
    category: 'tutorials',
    tags: ['convert', 'image', 'jpg', 'png'],
    coverEmoji: '🖼️',
    coverGradient: 'from-[#16A34A] to-[#059669]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-13',
    readTime: 4,
    relatedTool: '/tools/pdf-to-image',
  },
  {
    slug: 'convert-images-to-pdf',
    title: 'How to Convert Images to PDF (JPG, PNG, WebP)',
    excerpt: 'Turn your photos and screenshots into professional PDF documents. Combine multiple images into a single PDF with custom layouts.',
    category: 'tutorials',
    tags: ['convert', 'images', 'jpg', 'png'],
    coverEmoji: '📸',
    coverGradient: 'from-[#8B3DFF] to-[#7C3AED]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-12',
    readTime: 5,
    relatedTool: '/tools/image-to-pdf',
  },
  {
    slug: 'split-pdf-guide',
    title: 'How to Split a PDF into Multiple Files',
    excerpt: 'Divide large PDFs into smaller, manageable documents. Extract specific pages or split by page ranges quickly.',
    category: 'guides',
    tags: ['split', 'pages', 'divide'],
    coverEmoji: '✂️',
    coverGradient: 'from-[#F97316] to-[#EA580C]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-11',
    readTime: 4,
    relatedTool: '/tools/split-pdf',
  },
  {
    slug: 'remove-password-pdf',
    title: 'How to Remove Password from PDF Files Safely',
    excerpt: 'Legally unlock password-protected PDFs you own. Step-by-step guide to remove restrictions from your own documents.',
    category: 'security',
    tags: ['unlock', 'password', 'security'],
    coverEmoji: '🔓',
    coverGradient: 'from-[#DB2777] to-[#BE185D]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-09',
    readTime: 5,
    relatedTool: '/tools/unlock-pdf',
  },
  {
    slug: 'rotate-pdf-pages',
    title: 'How to Rotate PDF Pages Permanently',
    excerpt: 'Fix upside-down or sideways PDF pages once and for all. Rotate single pages or entire documents in seconds.',
    category: 'tutorials',
    tags: ['rotate', 'pages', 'orientation'],
    coverEmoji: '🔄',
    coverGradient: 'from-[#F59E0B] to-[#D97706]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-08',
    readTime: 3,
    relatedTool: '/tools/rotate-pdf',
  },
  {
    slug: 'add-watermark-pdf',
    title: 'How to Add Watermark to PDF Files',
    excerpt: 'Protect your PDF documents with custom text or image watermarks. Perfect for drafts, confidential documents, or branding.',
    category: 'tutorials',
    tags: ['watermark', 'branding', 'protect'],
    coverEmoji: '💧',
    coverGradient: 'from-[#0EA5A4] to-[#0D9488]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-07',
    readTime: 4,
    relatedTool: '/tools/add-watermark',
  },
  {
    slug: 'organize-pdf-pages',
    title: 'How to Reorder and Organize PDF Pages',
    excerpt: 'Rearrange, delete, or reorder pages in your PDF documents. Drag and drop interface makes it simple.',
    category: 'guides',
    tags: ['organize', 'reorder', 'pages'],
    coverEmoji: '📑',
    coverGradient: 'from-[#7C3AED] to-[#6D28D9]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-06',
    readTime: 4,
    relatedTool: '/tools/organize-pdf',
  },
  {
    slug: 'pdf-security-tips',
    title: '10 PDF Security Tips You Should Know',
    excerpt: 'Essential security practices to protect your sensitive PDF documents. Learn how professionals handle confidential PDFs.',
    category: 'tips',
    tags: ['security', 'tips', 'privacy'],
    coverEmoji: '🛡️',
    coverGradient: 'from-[#16A34A] to-[#15803D]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-05',
    readTime: 6,
  },
  {
    slug: 'pdf-vs-word',
    title: 'PDF vs Word: Which Format Should You Use?',
    excerpt: 'A detailed comparison of PDF and Word documents. When to use each format for maximum compatibility and professionalism.',
    category: 'tips',
    tags: ['comparison', 'formats', 'word'],
    coverEmoji: '📊',
    coverGradient: 'from-[#EC4899] to-[#DB2777]',
    author: 'PDF Core Team',
    publishedAt: '2025-01-04',
    readTime: 5,
  },
];

// ============ HELPER FUNCTIONS ============

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  return blogPosts
    .filter(post => post.slug !== currentSlug && post.category === currentPost.category)
    .slice(0, limit);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}