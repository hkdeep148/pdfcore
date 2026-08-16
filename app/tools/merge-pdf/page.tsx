import type { Metadata } from 'next';
import MergePdfClient from './MergePdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Merge PDF Files Online — Free, No Signup, Unlimited',
  description:
    'Merge multiple PDF files into one online. Free, no signup, no watermark. 100% browser-based — your files never leave your device. Unlimited files, any size.',
  keywords: [
    'merge pdf',
    'merge pdf online',
    'merge pdf free',
    'merge pdf files',
    'merge pdf files online free',
    'merge pdf files online free no signup',
    'combine pdf',
    'combine pdf files',
    'combine pdfs into one',
    'join pdf',
    'join pdf files',
    'pdf merger',
    'pdf merger free',
    'pdf combiner',
    'merge multiple pdfs',
    'merge pdf without adobe',
    'merge pdf no signup',
    'merge pdf no watermark',
    'merge pdf drag and drop',
    'merge pdf unlimited files',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to merge pdf files',
    'how to combine pdfs',
  ],
  alternates: {
    canonical: 'https://spellpdf.com/tools/merge-pdf',
  },
  openGraph: {
    title: 'Merge PDF Files Online — Free, No Signup, Unlimited | SpellPDF',
    description:
      'Combine multiple PDFs into one file instantly. Free, unlimited, no registration. Files stay private on your device.',
    url: 'https://spellpdf.com/tools/merge-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Merge PDF Files Free & Private — SpellPDF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merge PDF Files Online — Free, No Signup',
    description: 'Combine multiple PDFs into one instantly. Free & private.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Merge PDF — SpellPDF',
  url: 'https://spellpdf.com/tools/merge-pdf',
  description:
    'Free browser-based PDF merger. Combine multiple PDF files into one instantly. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Merge unlimited PDF files',
    'Drag & drop to reorder',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
    'Files never uploaded to server',
    'Works on mobile and desktop',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Merge PDF Files Online for Free',
  description:
    'Step-by-step guide to combine multiple PDFs into one file using SpellPDF.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your PDFs',
      text: 'Click the upload area and select multiple PDF files, or drag & drop them. All files are processed in your browser — nothing is uploaded to any server.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Reorder Pages',
      text: 'Drag and drop the PDF thumbnails to arrange them in your preferred order. You can also delete unwanted files before merging.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Merge & Download',
      text: 'Click Merge PDF and download your combined file instantly. The merged PDF preserves all original quality.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I merge PDF files for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply upload your PDF files to SpellPDF, drag them to reorder if needed, then click Merge PDF. Your combined file downloads instantly. It is 100% free with no signup, no watermarks, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many PDFs can I merge at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no limit. You can merge 2, 20, or even 200 PDFs at once. Since processing happens in your browser, the only limit is your device memory.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the merged PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All merging happens 100% locally on your device. Your PDFs and the resulting merged file never leave your browser — nothing is uploaded to any server.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does merging PDFs reduce quality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. SpellPDF preserves the original quality of all pages when merging. Text stays sharp, images stay clear, and formatting is maintained exactly as in the source files.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rearrange PDFs before merging?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Simply drag and drop the PDF thumbnails to change their order before merging. You can also remove any unwanted files. The final merged PDF will follow your chosen order.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit for merging?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits. Unlike iLovePDF (100MB free) or Smallpdf (5MB free), SpellPDF has no restrictions because everything runs in your browser. Merge 1GB+ files if your device supports it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I merge PDFs on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! SpellPDF works perfectly on iPhone, Android, iPad, and any modern mobile browser. The touch-optimized interface makes it easy to select, reorder, and merge PDFs on the go.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to install anything to merge PDFs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No installation needed. SpellPDF runs entirely in your browser — no downloads, no plugins, no apps. Just open the site and start merging immediately.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function MergePdfPage() {
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
      <MergePdfClient />
    </>
  );
}