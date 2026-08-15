import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog - Free PDF Tools & Guides',
  description: 'Read guides, tutorials, and tips about PDF tools. Learn how to merge, compress, split, and manage PDFs like a pro — all for free.',
  keywords: 'pdf blog, pdf guides, pdf tutorials, pdf tips, free pdf tools, compress pdf, merge pdf',
  robots: {
    index: true,        // ✅ Allow search engines to index
    follow: true,       // ✅ Follow links
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://pdfcore.online/blog/',
  },
  openGraph: {
    title: 'Blog - Free PDF Tools & Guides',
    description: 'Read guides, tutorials, and tips about PDF tools. Learn how to merge, compress, split, and manage PDFs like a pro.',
    url: 'https://pdfcore.online/blog/',
    siteName: 'PDF Core',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Free PDF Tools & Guides',
    description: 'Read guides, tutorials, and tips about PDF tools.',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}