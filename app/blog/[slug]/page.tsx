import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '../_config/posts';
import ArticleClient from './ArticleClient';

// Generate static params for all blog articles
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each blog post (with noindex for now)
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Article not found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    robots: {
      index: false,     // 🚫 Hide from search engines (blog under development)
      follow: true,     // ✅ But do follow links
    },
    alternates: {
      canonical: `https://pdfcore.online/blog/${post.slug}/`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Check if post exists
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  return <ArticleClient slug={slug} />;
}