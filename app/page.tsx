import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import HomeSeoContent from './HomeSeoContent';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'PDF Core — Free PDF Tools Online | No Signup, No Upload, 100% Private',
  description:
    'Free online PDF tools that work 100% in your browser. Compress, merge, split, convert, sign, unlock PDFs. No signup, no upload, no watermark. Your files stay private.',
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
  ],
  alternates: {
    canonical: 'https://pdfcore.online',
  },
  openGraph: {
    title: 'PDF Core — Free PDF Tools | No Signup, No Upload, 100% Private',
    description:
      '12+ browser-based PDF tools. No file uploads, no signup, no watermarks. Compress, merge, convert, sign & more — completely free forever.',
    url: 'https://pdfcore.online',
    siteName: 'PDF Core',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'PDF Core — Free Private Browser-Based PDF Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Core — Free PDF Tools, No Signup Required',
    description:
      '12+ browser-based PDF tools. No uploads, no signup, no watermarks. 100% free & private.',
    images: ['/twitter-image.png'],
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PDF Core',
  url: 'https://pdfcore.online',
  description:
    'Free online PDF tools that work in your browser. Compress, merge, split, convert, sign PDFs without signup or watermark.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://pdfcore.online/tools?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PDF Core Tools',
  description: 'Complete list of free PDF and image tools',
  numberOfItems: 11,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Compress PDF',
      url: 'https://pdfcore.online/tools/compress-pdf',
      description: 'Reduce PDF file size without losing quality',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Merge PDF',
      url: 'https://pdfcore.online/tools/merge-pdf',
      description: 'Combine multiple PDF files into one',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Split PDF',
      url: 'https://pdfcore.online/tools/split-pdf',
      description: 'Extract pages or split PDF into multiple files',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Rotate PDF',
      url: 'https://pdfcore.online/tools/rotate-pdf',
      description: 'Rotate PDF pages permanently',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Organize PDF',
      url: 'https://pdfcore.online/tools/organize-pdf',
      description: 'Rearrange, delete, and reorder PDF pages',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Unlock PDF',
      url: 'https://pdfcore.online/tools/unlock-pdf',
      description: 'Remove password protection from PDFs',
    },
    {
      '@type': 'ListItem',
      position: 7,
      name: 'Sign PDF',
      url: 'https://pdfcore.online/tools/sign-pdf',
      description: 'Add digital signatures to PDF documents',
    },
    {
      '@type': 'ListItem',
      position: 8,
      name: 'Add Watermark',
      url: 'https://pdfcore.online/tools/add-watermark',
      description: 'Add text watermark to PDF pages',
    },
    {
      '@type': 'ListItem',
      position: 9,
      name: 'PDF to Image',
      url: 'https://pdfcore.online/tools/pdf-to-image',
      description: 'Convert PDF pages to JPG or PNG images',
    },
    {
      '@type': 'ListItem',
      position: 10,
      name: 'Image to PDF',
      url: 'https://pdfcore.online/tools/image-to-pdf',
      description: 'Convert JPG, PNG, WEBP images to PDF',
    },
    {
      '@type': 'ListItem',
      position: 11,
      name: 'Compress Image',
      url: 'https://pdfcore.online/tools/compress-image',
      description: 'Reduce image file size without losing quality',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are PDF Core tools really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, 100% free forever. All 12+ tools are completely free with no hidden costs, no premium tiers, no trials, and no daily usage limits. Use them as often as you want for personal or commercial purposes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to create an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No account needed. Unlike iLovePDF, Smallpdf, and Adobe, PDF Core requires no signup, no email, and no verification. Just open the site and start using any tool immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my files uploaded to your servers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All PDF Core tools run 100% in your browser using WebAssembly technology. Your files never leave your device — nothing is uploaded, stored, or transmitted to any server. This is the safest way to work with sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits. Unlike competitors that cap free users at 20-100MB, PDF Core has no restrictions because everything runs locally. Process PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you add watermarks to processed files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. Your files stay clean — we never add watermarks, branding, or logos. This makes PDF Core different from many "free" competitors that force you to pay to remove watermarks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do PDF Core tools work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! All tools work perfectly on iPhone, Android, iPad, and any modern mobile browser. The interface is fully touch-optimized for mobile use.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do the tools work offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After the first page load, PDF Core tools work even without an internet connection. Great for travelers, remote work, or privacy-conscious users who want to work offline.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is PDF Core different from iLovePDF or Smallpdf?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main differences: PDF Core is 100% browser-based (no uploads), has no signup requirements, no file size limits, no watermarks, no daily caps, and is completely free forever. iLovePDF and Smallpdf upload your files to servers, require accounts for full features, and add watermarks to free files.',
      },
    },
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PDF Core',
  url: 'https://pdfcore.online',
  logo: 'https://pdfcore.online/icon.png',
  description: 'Free online PDF and image tools that respect your privacy. All processing happens in your browser.',
  foundingDate: '2025',
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Interactive Homepage (Client Component) */}
      <HomeClient />

      {/* SEO Content Below */}
      <HomeSeoContent />
    </>
  );
}