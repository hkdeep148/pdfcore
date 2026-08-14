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

// Folders to skip when scanning blog directory
const EXCLUDED_FOLDERS = ['[slug]', 'components', 'utils', 'lib', '_components'];

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

      // Must be a directory
      if (!fs.statSync(fullPath).isDirectory()) return false;

      // Skip excluded folders
      if (EXCLUDED_FOLDERS.includes(folder)) return false;

      // Skip folders starting with _ or . (Next.js private folders)
      if (folder.startsWith('_') || folder.startsWith('.')) return false;

      // Must contain page.tsx or page.jsx or page.mdx
      const hasPage =
        fs.existsSync(path.join(fullPath, 'page.tsx')) ||
        fs.existsSync(path.join(fullPath, 'page.jsx')) ||
        fs.existsSync(path.join(fullPath, 'page.mdx'));

      return hasPage;
    })
    .map(slug => ({
      loc: `/blog/${slug}/`,
      priority: '0.7',
      changefreq: 'monthly',
    }));
}

// Remove duplicates by URL
function deduplicateUrls(pages) {
  const seen = new Set();
  return pages.filter(page => {
    if (seen.has(page.loc)) return false;
    seen.add(page.loc);
    return true;
  });
}

// Escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Build sitemap XML
function generateSitemap() {
  const blogPages = getBlogSlugs();
  const allPages = deduplicateUrls([...staticPages, ...blogPages]);
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(({ loc, priority, changefreq }) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(BASE_URL + loc)}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>\n';

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📊 Total URLs: ${allPages.length}`);
  console.log(`📝 Blog posts detected: ${blogPages.length}`);
  console.log('═══════════════════════════════════════');

  if (blogPages.length > 0) {
    console.log('\n📄 Blog Posts:');
    blogPages.forEach(p => console.log(`   ✓ ${p.loc}`));
  }

  console.log(`\n📁 Output: public/sitemap.xml`);
  console.log('');
}

generateSitemap();