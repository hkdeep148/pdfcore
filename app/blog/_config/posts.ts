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
  slug: 'compress-pdf-without-losing-quality',
  title: 'How to Compress Large PDF Files Without Losing Quality',
  excerpt: 'Learn how to compress large PDF files without losing quality. Free, no Adobe, no watermark — step-by-step methods for email, WhatsApp, Mac, Windows & mobile.',
  category: 'guides',
  tags: ['compress', 'pdf', 'quality', 'tutorial'],
  coverImage: '/blog/compress-pdf-quality.jpg',
  coverEmoji: '🗜️',
  coverGradient: 'from-[#10B981] to-[#059669]',
  author: 'PDF Core Team',
  publishedAt: '2026-01-15',
  readTime: 12,
  featured: true,
  relatedTool: '/tools/compress-pdf',
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