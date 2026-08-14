const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://pdfcore.online';

// Static pages
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/tools/', priority: '0.9', changefreq: 'weekly' },
  { loc: '/blog/', priority: '0.8', changefreq: 'daily' },
  { loc: '/tools/compress-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/merge-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/split-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/rotate-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/organize-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/unlock-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/sign-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/add-watermark/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/pdf-to-image/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/image-to-pdf/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/tools/compress-image/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/about/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/contact/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/faq/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/privacy/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/security/', priority: '0.5', changefreq: 'monthly' },
  { loc: '/terms/', priority: '0.5', changefreq: 'monthly' },
];

// Auto-detect blog posts from folder names
function getBlogSlugs() {
  const blogDir = path.join(__dirname, '../app/blog');
  
  if (!fs.existsSync(blogDir)) {
    console.log('⚠️  No blog directory found');
    return [];
  }

  return fs.readdirSync(blogDir)
    .filter(folder => {
      const fullPath = path.join(blogDir, folder);
      // Only include folders that have a page.tsx (skip [slug] dynamic route)
      return (
        fs.statSync(fullPath).isDirectory() &&
        folder !== '[slug]' &&
        fs.existsSync(path.join(fullPath, 'page.tsx'))
      );
    })
    .map(slug => ({
      loc: `/blog/${slug}/`,
      priority: '0.7',
      changefreq: 'monthly',
    }));
}

// Build sitemap XML
function generateSitemap() {
  const blogPages = getBlogSlugs();
  const allPages = [...staticPages, ...blogPages];
  const lastmod = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(({ loc, priority, changefreq }) => {
    xml += `<url>\n`;
    xml += `  <loc>${BASE_URL}${loc}</loc>\n`;
    xml += `  <lastmod>${lastmod}</lastmod>\n`;
    xml += `  <changefreq>${changefreq}</changefreq>\n`;
    xml += `  <priority>${priority}</priority>\n`;
    xml += `</url>\n`;
  });

  xml += '</urlset>';

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ Sitemap generated with ${allPages.length} URLs`);
  console.log(`📝 Blog posts found: ${blogPages.length}`);
  blogPages.forEach(p => console.log(`   - ${p.loc}`));
}

generateSitemap();