import { MetadataRoute } from 'next';

// 👇 Required for static export
export const dynamic = 'force-static';

const BASE_URL = 'https://pdfcore.online';

const TOOLS = [
  'compress-pdf',
  'merge-pdf',
  'split-pdf',
  'rotate-pdf',
  'organize-pdf',
  'unlock-pdf',
  'sign-pdf',
  'add-watermark',
  'pdf-to-image',
  'image-to-pdf',
  'compress-image',
];

const PAGES = ['about', 'contact', 'faq', 'privacy', 'security', 'terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...TOOLS.map((tool) => ({
      url: `${BASE_URL}/tools/${tool}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...PAGES.map((page) => ({
      url: `${BASE_URL}/${page}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}