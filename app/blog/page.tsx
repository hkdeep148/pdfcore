import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog — PDF Core',
  description: 'PDF tips, tutorials, and guides.',
  robots: {
    index: false,       // 🚫 Hide from search engines (blog under development)
    follow: true,       // ✅ But do follow links (helps other pages)
  },
  alternates: {
    canonical: 'https://pdfcore.online/blog/',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}