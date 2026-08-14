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

// Auto-detect blog posts from posts.ts by parsing slugs and publishedAt dates
function getBlogPosts() {
  const postsFile = path.join(__dirname, '../app/blog/_config/posts.ts');

  if (!fs.existsSync(postsFile)) {
    console.log('⚠️  posts.ts not found');
    return [];
  }

  const content = fs.readFileSync(postsFile, 'utf-8');

  // Extract all blog post objects using regex
  // Matches: slug: 'value' or slug: "value"
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const dateRegex = /publishedAt:\s*['"]([^'"]+)['"]/g;

  const slugs = [];
  const dates = [];

  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  while ((match = dateRegex.exec(content)) !== null) {
    dates.push(match[1]);
  }

  // Pair each slug with its publishedAt date
  return slugs.map((slug, index) => ({
    loc: `/blog/${slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: dates[index] || null,
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
  const blogPages = getBlogPosts();
  const allPages = deduplicateUrls([...staticPages, ...blogPages]);
  const defaultLastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(({ loc, priority, changefreq, lastmod }) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(BASE_URL + loc)}</loc>\n`;
    xml += `    <lastmod>${lastmod || defaultLastmod}</lastmod>\n`;
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
    blogPages.forEach(p => console.log(`   ✓ ${p.loc} (${p.lastmod})`));
  }

  console.log(`\n📁 Output: public/sitemap.xml\n`);
}

generateSitemap();