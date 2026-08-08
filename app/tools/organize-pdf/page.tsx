import type { Metadata } from 'next';
import OrganizePdfClient from './OrganizePdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Organize PDF Pages Online — Free Drag & Drop Reorder',
  description:
    'Reorder, delete, and organize PDF pages online with drag and drop. Free, no signup, no watermark. 100% browser-based — your files never leave your device.',
  keywords: [
    'organize pdf',
    'organize pdf pages',
    'organize pdf online',
    'organize pdf free',
    'reorder pdf pages',
    'reorder pdf pages online',
    'rearrange pdf pages',
    'rearrange pdf pages online',
    'move pdf pages',
    'delete pdf pages',
    'delete pdf pages online',
    'remove pdf pages',
    'pdf page organizer',
    'pdf page manager',
    'drag and drop pdf pages',
    'sort pdf pages',
    'shuffle pdf pages',
    'edit pdf page order',
    'change pdf page order',
    'organize pdf no signup',
    'organize pdf no watermark',
    'organize pdf without adobe',
    'organize pdf mobile',
    'organize pdf iphone',
    'organize pdf android',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to organize pdf pages',
    'how to reorder pdf pages',
    'how to delete pages from pdf',
  ],
  alternates: {
    canonical: 'https://pdfcore.online/tools/organize-pdf',
  },
  openGraph: {
    title: 'Organize PDF Pages Online — Free Drag & Drop | PDF Core',
    description:
      'Reorder, delete, and rotate PDF pages with drag and drop. Free, private, 100% browser-based.',
    url: 'https://pdfcore.online/tools/organize-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Organize PDF Pages Free — PDF Core',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organize PDF Pages — Free Drag & Drop',
    description: 'Reorder and delete PDF pages instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Organize PDF — PDF Core',
  url: 'https://pdfcore.online/tools/organize-pdf',
  description:
    'Free browser-based PDF page organizer. Reorder, delete, and rotate PDF pages with drag and drop. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Drag and drop to reorder pages',
    'Delete unwanted pages',
    'Rotate individual pages',
    'Combine multiple PDFs',
    'Visual page thumbnails',
    'Preview before saving',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Organize and Reorder PDF Pages',
  description:
    'Step-by-step guide to reorder, delete, and rotate PDF pages using PDF Core.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your PDFs',
      text: 'Click the upload area or drag & drop one or more PDF files. All pages will appear as visual thumbnails. Files are processed in your browser — nothing is uploaded.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Organize Pages',
      text: 'Drag and drop page thumbnails to reorder them. Click delete on unwanted pages, or rotate individual pages as needed. Preview updates in real-time.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Save Organized PDF',
      text: 'Click Save and download your reorganized PDF. All page changes are applied to the new file while preserving original quality.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I organize PDF pages for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF to PDF Core, then drag and drop page thumbnails to reorder them. You can also delete unwanted pages and rotate individual pages. Click Save to download your reorganized PDF. Completely free with no signup or watermarks.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I combine multiple PDFs and reorder them?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Upload multiple PDF files at once. All their pages appear as thumbnails that you can freely rearrange, mix, and reorder into a single organized PDF.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I delete specific pages from a PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Click the delete button on any page thumbnail to remove it from the final PDF. The original PDF file is never modified — only the new saved PDF excludes the deleted pages.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rotate individual pages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Rotate any page independently 90° at a time. Perfect for fixing mixed-orientation documents where some pages are portrait and others are landscape.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the drag and drop work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply click and hold any page thumbnail, then drag it to the new position. Other pages automatically shift to make room. Works with both mouse (desktop) and touch (mobile).',
      },
    },
    {
      '@type': 'Question',
      name: 'Does organizing affect PDF quality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. PDF Core preserves the exact original quality when reorganizing pages. Text stays sharp, images stay clear, and formatting is identical. Only page order and orientation change.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the PDFs I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All processing happens 100% locally on your device. Your original PDFs and the reorganized result never leave your browser — nothing is uploaded to any server. This is the safest way to work with sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a page or file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No limits from us. Unlike some competitors that cap free users, PDF Core has no restrictions because everything runs in your browser. Organize PDFs of any size with any number of pages your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I organize PDF pages on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PDF Core works on iPhone, Android, iPad, and any modern mobile browser. Touch and drag gestures make it easy to organize pages on your phone or tablet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I preview changes before saving?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! The page thumbnails update in real-time as you make changes. You can see exactly how your final PDF will look — reorder as many times as you want before clicking Save.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function OrganizePdfPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Tool Interface (Client Component) */}
      <OrganizePdfClient />
    </>
  );
}