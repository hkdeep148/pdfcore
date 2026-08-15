// app/blog/_content/index.ts
import type { ArticleContent } from '../_types';

// Import all articles here
import howToMergePdfFiles from './how-to-merge-pdf-files';
import compressPdfWithoutLosingQuality from './compress-pdf-without-losing-quality';

// Central registry - add new articles here as you create them
export const articleContents: Record<string, ArticleContent> = {
  'how-to-merge-pdf-files': howToMergePdfFiles,
  'compress-pdf-without-losing-quality': compressPdfWithoutLosingQuality,
};

// Helper function to get article content by slug
export function getArticleContent(slug: string): ArticleContent | undefined {
  return articleContents[slug];
}

// Helper to check if an article exists (useful for validation)
export function articleExists(slug: string): boolean {
  return slug in articleContents;
}

// Re-export types for convenience
export type { ArticleContent, ArticleSection } from '../_types';