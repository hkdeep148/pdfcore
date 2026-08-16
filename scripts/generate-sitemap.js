const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://spellpdf.com';

// ============ TOOLS CONFIG ============
// High-priority popular tools
const popularTools = [
  { slug: 'merge-pdf', updated: '2026-06-01' },
  { slug: 'compress-pdf', updated: '2026-06-01' },
  { slug: 'split-pdf', updated: '2026-06-01' },
  { slug: 'pdf-to-image', updated: '2026-06-01' },
  { slug: 'image-to-pdf', updated: '2026-06-01' },
];

// Standard priority tools
const standardTools = [
  { slug: 'rotate-pdf', updated: '2026-05-15' },
  { slug: 'organize-pdf', updated: '2026-05-15' },
  { slug: 'unlock-pdf', updated: '2026-05-15' },
  { slug: 'sign-pdf', updated: '2026-05-15' },
  { slug: 'add-watermark', updated: '2026-05-15' },
  { slug: 'compress-image', updated: '2026-05-15' },
];

// Note: 'create-pdf' is intentionally excluded (coming soon)

// ============ STATIC PAGES ============
const staticPages = [
  // Main sections
  { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-08-15' },
  { loc: '/tools/', priority: '0.9', changefreq: 'weekly', lastmod: '2026-08-15' },
  { loc: '/blog/', priority: '0.8', changefreq: 'weekly', lastmod: '2026-08-15' },

  // Popular tools (priority 0.9)
  ...popularTools.map(tool => ({
    loc: `/tools/${tool.slug}/`,
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: tool.updated,
  })),

  // Standard tools (priority 0.8)
  ...standardTools.map(tool => ({
    loc: `/tools/${tool.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: tool.updated,
  })),

  // Trust pages
  { loc: '/about/', priority: '0.5', changefreq: 'yearly', lastmod: '2026-01-01' },
  { loc: '/contact/', priority: '0.5', changefreq: 'yearly', lastmod: '2026-01-01' },
  { loc: '/faq/', priority: '0.6', changefreq: 'monthly', lastmod: '2026-03-01' },
  { loc: '/security/', priority: '0.6', changefreq: 'yearly', lastmod: '2026-01-01' },

  // Legal (low priority)
  { loc: '/privacy/', priority: '0.3', changefreq: 'yearly', lastmod: '2026-01-01' },
  { loc: '/terms/', priority: '0.3', changefreq: 'yearly', lastmod: '2026-01-01' },
];

// ============ AUTO-DETECT BLOG POSTS ============
function getBlogPosts() {
  const postsFile = path.join(__dirname, '../app/blog/_config/posts.ts');

  if (!fs.existsSync(postsFile)) {
    console.log('⚠️  posts.ts not found');
    return [];
  }

  const content = fs.readFileSync(postsFile, 'utf-8');

  // Extract data using regex
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const titleRegex = /title:\s*['"]([^'"]+)['"]/g;
  const publishedAtRegex = /publishedAt:\s*['"]([^'"]+)['"]/g;
  const updatedAtRegex = /updatedAt:\s*['"]([^'"]+)['"]/g;
  const coverImageRegex = /coverImage:\s*['"]([^'"]+)['"]/g;

  const slugs = [];
  const titles = [];
  const publishedDates = [];
  const updatedDates = [];
  const coverImages = [];

  let match;
  while ((match = slugRegex.exec(content)) !== null) slugs.push(match[1]);
  while ((match = titleRegex.exec(content)) !== null) titles.push(match[1]);
  while ((match = publishedAtRegex.exec(content)) !== null) publishedDates.push(match[1]);
  while ((match = updatedAtRegex.exec(content)) !== null) updatedDates.push(match[1]);
  while ((match = coverImageRegex.exec(content)) !== null) coverImages.push(match[1]);

  return slugs.map((slug, index) => ({
    loc: `/blog/${slug}/`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: updatedDates[index] || publishedDates[index] || null,
    // Image sitemap data
    imageLoc: coverImages[index] ? `${BASE_URL}${coverImages[index]}` : null,
    imageTitle: titles[index] || null,
  }));
}

// ============ HELPERS ============
function deduplicateUrls(pages) {
  const seen = new Set();
  return pages.filter(page => {
    if (seen.has(page.loc)) return false;
    seen.add(page.loc);
    return true;
  });
}

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

// ============ GENERATE SITEMAP ============
function generateSitemap() {
  const blogPages = getBlogPosts();
  const allPages = deduplicateUrls([...staticPages, ...blogPages]);
  const hasImages = blogPages.some(p => p.imageLoc);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  if (hasImages) {
    xml += '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  }
  xml += '>\n';

  allPages.forEach(page => {
    const { loc, priority, changefreq, lastmod, imageLoc, imageTitle } = page;

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(BASE_URL + loc)}</loc>\n`;
    if (lastmod) {
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;

    // Add image data for blog posts
    if (imageLoc && imageTitle) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(imageLoc)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(imageTitle)}</image:title>\n`;
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  });

  xml += '</urlset>\n';

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);

  // ============ LOGGING ============
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Sitemap generated successfully!`);
  console.log('═══════════════════════════════════════════════');
  console.log(`📊 Total URLs:         ${allPages.length}`);
  console.log(`🏠 Static pages:       ${staticPages.length}`);
  console.log(`📄 Blog posts:         ${blogPages.length}`);
  console.log(`🖼️  With images:        ${blogPages.filter(p => p.imageLoc).length}`);
  console.log(`🚫 Excluded:           create-pdf (coming soon)`);
  console.log('═══════════════════════════════════════════════');

  if (blogPages.length > 0) {
    console.log('\n📝 Blog Posts Detected:');
    blogPages.forEach(p => {
      const imageStatus = p.imageLoc ? '🖼️' : '  ';
      console.log(`   ${imageStatus} ${p.loc}`);
      console.log(`      Last modified: ${p.lastmod || '(none)'}`);
    });
  }

  console.log(`\n📁 Output: public/sitemap.xml\n`);
}

generateSitemap();