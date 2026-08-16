import type { Metadata } from 'next';
import HomeClient from './HomeClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// (Title uses layout.tsx default — no duplication)
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  description:
    'Free online PDF tools — compress, merge, split, convert, sign PDFs in your browser. No signup, no upload, no watermarks. Pure PDF magic, 100% private.',
  keywords: [
    'free pdf tools',
    'pdf tools online',
    'pdf tools no signup',
    'pdf tools no upload',
    'pdf tools browser based',
    'pdf tools without watermark',
    'private pdf tools',
    'pdf editor online free',
    'pdf converter free',
    'pdf tools that dont upload files',
    'best free pdf tools',
    'pdf tools 2025',
    'all in one pdf tool',
    'pdf toolkit online',
    'compress pdf online',
    'merge pdf online',
    'split pdf online',
    'sign pdf online',
    'convert pdf online',
    'ilovepdf alternative',
    'smallpdf alternative',
    'adobe acrobat alternative free',
    'pdf24 alternative',
    'browser pdf editor',
    'local pdf editor',
    'offline pdf tools',
    'pdf tools without registration',
    'pdf tools no email',
    'unlimited pdf tools free',
    'pdf tools no size limit',
    'large pdf online free',
  ],
  alternates: {
    canonical: 'https://spellpdf.com',
  },
  openGraph: {
    title: 'SpellPDF — Free PDF Tools | No Signup, No Upload, 100% Private',
    description:
      '11 browser-based PDF and image tools. No file uploads, no signup, no watermarks. Compress, merge, convert, sign & more — completely free forever.',
    url: 'https://spellpdf.com',
    siteName: 'SpellPDF',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'SpellPDF — Free Private Browser-Based PDF Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpellPDF — Free PDF Tools, No Signup Required',
    description:
      '11 browser-based PDF and image tools. No uploads, no signup, no watermarks. 100% free & private.',
    images: ['/twitter-image.png'],
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — HOMEPAGE-SPECIFIC SCHEMAS
// (WebSite + Organization are in app/layout.tsx — don't duplicate here)
// ═══════════════════════════════════════════════════════════════

// WebApplication — describes the overall SpellPDF app
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SpellPDF',
  url: 'https://spellpdf.com',
  description:
    'Free online PDF tools that work 100% in your browser. Compress, merge, split, convert, sign PDFs without signup or watermark.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Compress PDF without losing quality',
    'Merge multiple PDFs',
    'Split PDF into pages',
    'Rotate PDF pages',
    'Organize and reorder pages',
    'Unlock password-protected PDFs',
    'Sign PDF documents',
    'Add watermarks to PDFs',
    'Convert PDF to JPG/PNG',
    'Convert images to PDF',
    'Compress images',
    'No file size limits',
    '100% browser-based (no uploads)',
    'No signup required',
    'No watermarks added',
  ],
};

// ItemList — lists all 11 tools for Google's discovery
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'SpellPDF Tools',
  description: 'Complete list of free PDF and image tools',
  numberOfItems: 11,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Compress PDF',
      url: 'https://spellpdf.com/tools/compress-pdf',
      description: 'Reduce PDF file size without losing quality',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Merge PDF',
      url: 'https://spellpdf.com/tools/merge-pdf',
      description: 'Combine multiple PDF files into one',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Split PDF',
      url: 'https://spellpdf.com/tools/split-pdf',
      description: 'Extract pages or split PDF into multiple files',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Rotate PDF',
      url: 'https://spellpdf.com/tools/rotate-pdf',
      description: 'Rotate PDF pages permanently',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Organize PDF',
      url: 'https://spellpdf.com/tools/organize-pdf',
      description: 'Rearrange, delete, and reorder PDF pages',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Unlock PDF',
      url: 'https://spellpdf.com/tools/unlock-pdf',
      description: 'Remove password protection from PDFs',
    },
    {
      '@type': 'ListItem',
      position: 7,
      name: 'Sign PDF',
      url: 'https://spellpdf.com/tools/sign-pdf',
      description: 'Add digital signatures to PDF documents',
    },
    {
      '@type': 'ListItem',
      position: 8,
      name: 'Add Watermark',
      url: 'https://spellpdf.com/tools/add-watermark',
      description: 'Add text watermark to PDF pages',
    },
    {
      '@type': 'ListItem',
      position: 9,
      name: 'PDF to Image',
      url: 'https://spellpdf.com/tools/pdf-to-image',
      description: 'Convert PDF pages to JPG or PNG images',
    },
    {
      '@type': 'ListItem',
      position: 10,
      name: 'Image to PDF',
      url: 'https://spellpdf.com/tools/image-to-pdf',
      description: 'Convert JPG, PNG, WEBP images to PDF',
    },
    {
      '@type': 'ListItem',
      position: 11,
      name: 'Compress Image',
      url: 'https://spellpdf.com/tools/compress-image',
      description: 'Reduce image file size without losing quality',
    },
  ],
};

// FAQPage — enables FAQ rich snippets in Google search results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are SpellPDF tools really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100% free forever. All our PDF and image tools are completely free with no hidden costs, no premium tiers, no trials, and no daily usage limits. Use them as often as you want for personal or commercial purposes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account needed. Unlike iLovePDF, Smallpdf, and Adobe, SpellPDF requires no signup, no email, and no verification. Just open the site and start using any tool immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my files uploaded to your servers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All SpellPDF tools run 100% in your browser using modern JavaScript and WebAssembly. Your files never leave your device — nothing is uploaded, stored, or transmitted to any server. This is the safest way to work with sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits from us. Unlike some competitors that impose file size caps on free users, SpellPDF has no restrictions because everything runs locally in your browser. Process PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you add watermarks to processed files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. Your files stay clean — we never add watermarks, branding, or logos. This makes SpellPDF different from many "free" competitors that force you to pay to remove watermarks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do SpellPDF tools work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All tools work on iPhone, Android, iPad, and any modern mobile browser. The interface is touch-optimized for mobile use.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do the tools work offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After the first page load, SpellPDF tools can work even without an internet connection since all processing happens in your browser. Great for travelers, remote work, or privacy-conscious users.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is SpellPDF different from iLovePDF or Smallpdf?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main differences: SpellPDF is 100% browser-based (no uploads), has no signup requirements, no file size limits imposed by us, no watermarks, no daily caps, and is completely free forever. iLovePDF and Smallpdf typically upload your files to servers, may require accounts for full features, and add watermarks to free files.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <>
      {/* Structured Data — Homepage-specific schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Interactive Homepage (Client Component) */}
      <HomeClient />
    </>
  );
}