import type { Metadata } from 'next';
import SplitPdfClient from './SplitPdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Split PDF Online — Free, No Signup, Unlimited',
  description:
    'Split PDF files into multiple documents online. Extract pages, split by range, or split by size. Free, no signup, no watermark. 100% browser-based.',
  keywords: [
    'split pdf',
    'split pdf online',
    'split pdf free',
    'split pdf online free',
    'split pdf online free no signup',
    'split pdf files',
    'split pdf into pages',
    'split pdf into multiple files',
    'split pdf by pages',
    'split pdf by range',
    'split pdf by size',
    'extract pages from pdf',
    'extract pdf pages',
    'separate pdf pages',
    'divide pdf',
    'divide pdf into pages',
    'pdf splitter',
    'pdf splitter free',
    'pdf page extractor',
    'split large pdf',
    'split pdf without adobe',
    'split pdf no signup',
    'split pdf no watermark',
    'split pdf mobile',
    'split pdf iphone',
    'split pdf android',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to split pdf',
    'how to split pdf into multiple files',
    'how to extract pages from pdf',
  ],
  alternates: {
    canonical: 'https://pdfcore.online/tools/split-pdf',
  },
  openGraph: {
    title: 'Split PDF Online — Free, No Signup, Unlimited | PDF Core',
    description:
      'Split large PDFs into smaller files. Extract pages, split by range or size. Free, no signup, 100% browser-based.',
    url: 'https://pdfcore.online/tools/split-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Split PDF Free & Private — PDF Core',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Split PDF Online — Free, No Signup',
    description: 'Split PDFs into smaller files instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Split PDF — PDF Core',
  url: 'https://pdfcore.online/tools/split-pdf',
  description:
    'Free browser-based PDF splitter. Divide PDFs into multiple files, extract pages, or split by size. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Split PDF by page ranges',
    'Split PDF by file size',
    'Extract individual pages',
    'Extract specific pages (e.g., 1, 3, 5-8)',
    'Download as separate PDFs or ZIP',
    'Preview pages before splitting',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Split a PDF into Multiple Files',
  description:
    'Step-by-step guide to split a PDF into smaller files using PDF Core.',
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
      name: 'Choose Split Method',
      text: 'Select how to split: by page range (e.g., 1-5, 6-10), by extracting specific pages, or by target file size (e.g., 5MB per file).',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Split & Download',
      text: 'Click Split and download individual PDFs or all files as a ZIP. Each new PDF preserves the original quality.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I split a PDF for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF to PDF Core, choose how to split it (by page range, specific pages, or file size), then click Split. Your split PDFs download instantly. Completely free with no signup, no watermarks, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the different ways to split a PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PDF Core offers three split methods: (1) Split by range — extract specific page ranges like 1-5, 6-10. (2) Extract pages — pick individual pages like 1, 3, 7. (3) Split by size — automatically split PDFs into files under a target size like 5MB.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I extract specific pages from a PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Use the extract mode to pick individual pages by number (e.g., 1, 3, 5-8). Only the selected pages will be extracted into a new PDF, perfect for grabbing specific pages from long documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does splitting reduce PDF quality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. PDF Core preserves the exact original quality when splitting. Text stays sharp, images stay clear, and formatting is identical to the source PDF. Splitting only divides the file — it does not re-encode content.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many files will I get after splitting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'That depends on your split method: by range creates one file per range you specify, extract pages combines all selected pages into one file, and split by size creates as many files as needed to stay under the target size.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits from us. Unlike some competitors that cap free users, PDF Core has no restrictions because everything runs in your browser. Split PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the split PDFs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All splitting happens 100% locally on your device. Your original PDF and the resulting split files never leave your browser — nothing is uploaded to any server.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I download all split files at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. When splitting produces multiple files, you can download them individually or bundle them all into a single ZIP file for convenient download.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I split PDFs on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. Split PDFs directly on your phone without uploading to any server.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I need pages in a specific order?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For splitting, pages stay in their original order. If you need to reorder pages, use our Organize PDF tool first, then split. Or for extracting, specify pages in the order you want them (e.g., 3, 1, 5).',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SplitPdfPage() {
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
      <SplitPdfClient />
    </>
  );
}