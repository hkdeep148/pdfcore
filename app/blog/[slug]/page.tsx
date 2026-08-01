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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Check if post exists
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    notFound();
  }

  return <ArticleClient slug={slug} />;
}