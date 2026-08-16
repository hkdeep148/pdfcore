import type { Metadata } from 'next';
import CompressPdfClient from './CompressPdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Compress PDF Without Losing Quality — Free & Private',
  description:
    'Compress PDF files online without losing quality. No signup, no watermark, no file size limit. 100% browser-based — your files never leave your device.',
  keywords: [
    'compress pdf',
    'compress pdf online',
    'compress pdf free',
    'compress pdf without losing quality',
    'reduce pdf file size',
    'shrink pdf online',
    'pdf compressor free',
    'compress pdf no signup',
    'compress pdf no watermark',
    'compress pdf without adobe',
    'make pdf smaller',
    'compress pdf for email',
    'compress pdf to 1mb',
    'compress pdf browser based',
    'compress pdf offline',
    'private pdf compressor',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to compress pdf without losing quality',
  ],
  alternates: {
    canonical: 'https://spellpdf.com/tools/compress-pdf',
  },
  openGraph: {
    title: 'Compress PDF Without Losing Quality — Free & Private | SpellPDF',
    description:
      'Reduce PDF file size instantly without quality loss. No signup, no watermark, 100% browser-based. Free forever.',
    url: 'https://spellpdf.com/tools/compress-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Compress PDF Free & Private — SpellPDF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress PDF Without Losing Quality — Free & Private',
    description:
      'Reduce PDF file size instantly. No signup, no watermark, 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compress PDF — SpellPDF',
  url: 'https://spellpdf.com/tools/compress-pdf',
  description:
    'Free browser-based PDF compressor. Reduce PDF file size without losing quality. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Compress PDF without quality loss',
    'No file size limit',
    'No signup required',
    'No watermarks',
    '100% browser-based processing',
    'Files never uploaded to server',
    'Works on mobile and desktop',
    'Multiple quality presets',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Compress a PDF Without Losing Quality',
  description:
    'Step-by-step guide to reduce PDF file size while preserving quality using SpellPDF.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your PDF',
      text: 'Click the upload area or drag & drop your PDF file. The file is processed in your browser — nothing is uploaded to any server.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose Compression Level',
      text: 'Select from Screen (highest compression), eBook (balanced), or Print (best quality) quality presets.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Compressed PDF',
      text: 'Click Compress and download your smaller PDF instantly. The original file is never modified.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does compressing a PDF reduce its quality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our smart compression reduces file size by up to 90% while preserving visible quality. For most documents, the difference is not noticeable to the human eye. You can choose from three quality levels: Screen (maximum compression), eBook (balanced), or Print (best quality).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Unlike other tools that limit you to 20MB or 100MB, SpellPDF has no file size restrictions because everything runs in your browser. You can compress PDFs as large as your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store my PDF files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All processing happens 100% locally on your device using your browser. Your files are never uploaded to any server, never stored, and never seen by us or any third party. This is the safest way to compress sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SpellPDF free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free with no hidden costs. No signup required, no email needed, no watermarks added, and no limits on how many PDFs you can compress. Free forever.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much can I reduce my PDF file size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typical compression ranges from 40% to 90% file size reduction depending on the PDF content. Image-heavy PDFs compress the most. A 10MB PDF often becomes 1-2MB with Screen quality, while maintaining excellent readability.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compress multiple PDFs at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Upload multiple PDFs and compress them all at once. Since processing happens in your browser, batch compression is fast and doesn\'t require uploading files to a server.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compressing PDF work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! SpellPDF works on iPhone, Android, iPad, and any modern mobile browser. The interface is fully optimized for touch, and compression happens directly on your phone without uploading.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from iLovePDF or Smallpdf?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main difference: SpellPDF processes files 100% in your browser, so your PDFs never leave your device. iLovePDF and Smallpdf upload your files to their servers. We also have no file size limits, no signup requirements, and no daily usage caps.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CompressPdfPage() {
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
      <CompressPdfClient />
    </>
  );
}