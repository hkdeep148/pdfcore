import { MetadataRoute } from 'next';

// 👇 Required for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/blog/',       // 🚫 Blog hidden until content is SEO-ready
          '/tools/create-pdf/',  // 🚫 Coming-soon page shouldn't be indexed
        ],
      },
    ],
    sitemap: 'https://pdfcore.online/sitemap.xml',
  };
}