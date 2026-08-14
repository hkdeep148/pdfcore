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

// Generate metadata for each blog post
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
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    robots: {
      index: true,      // ✅ Allow search engines to index
      follow: true,     // ✅ Follow links
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: `https://pdfcore.online/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: `https://pdfcore.online/blog/${post.slug}/`,
      siteName: 'PDF Core',
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage
        ? [
            {
              url: `https://pdfcore.online${post.coverImage}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.coverImage ? [`https://pdfcore.online${post.coverImage}`] : undefined,
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