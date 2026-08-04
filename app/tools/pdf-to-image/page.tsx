import type { Metadata } from 'next';
import PdfToImageClient from './PdfToImageClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'PDF to JPG Converter — Free, High Quality, No Watermark',
  description:
    'Convert PDF pages to JPG or PNG images. High resolution, no watermark, unlimited pages. 100% browser-based — your PDFs never leave your device. Free forever.',
  keywords: [
    'pdf to jpg',
    'pdf to jpg converter',
    'pdf to jpg free',
    'pdf to jpg online',
    'pdf to jpg high quality',
    'pdf to jpg no watermark',
    'pdf to jpg converter online free',
    'pdf to png',
    'pdf to png converter',
    'pdf to png online',
    'pdf to image',
    'pdf to image converter',
    'pdf to image converter free',
    'pdf to image high quality',
    'pdf to picture',
    'convert pdf to image',
    'convert pdf to jpg',
    'convert pdf to png',
    'convert pdf to picture',
    'convert pdf pages to images',
    'pdf to jpeg',
    'pdf page to image',
    'extract images from pdf',
    'pdf screenshot tool',
    'render pdf as image',
    'pdf to jpg iphone',
    'pdf to jpg android',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to convert pdf to jpg',
    'how to convert pdf to image',
    'how to convert pdf to high resolution image',
  ],
  alternates: {
    canonical: 'https://pdfcore.online/tools/pdf-to-image',
  },
  openGraph: {
    title: 'PDF to JPG Converter — Free, High Quality, No Watermark | PDF Core',
    description:
      'Convert PDF pages to JPG or PNG images. High resolution, unlimited pages, 100% browser-based. Free forever.',
    url: 'https://pdfcore.online/tools/pdf-to-image',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'PDF to JPG Converter Free — PDF Core',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to JPG Converter — Free, High Quality',
    description: 'Convert PDF pages to JPG or PNG instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF to Image Converter — PDF Core',
  url: 'https://pdfcore.online/tools/pdf-to-image',
  description:
    'Free browser-based PDF to image converter. Convert PDF pages to JPG or PNG. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Convert PDF to JPG or PNG',
    'Multiple resolution options (Low to Ultra)',
    'Select specific pages to convert',
    'Batch download as ZIP',
    'Preview before downloading',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '412',
    bestRating: '5',
    worstRating: '1',
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert PDF to JPG or PNG for Free',
  description:
    'Step-by-step guide to convert PDF pages into JPG or PNG image files using PDF Core.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your PDF',
      text: 'Click the upload area or drag & drop your PDF file. Files are processed in your browser — nothing is uploaded to any server.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose Format & Quality',
      text: 'Select output format (JPG or PNG) and resolution (Low, Medium, High, or Ultra). Choose which pages to convert or select all.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Images',
      text: 'Click Convert and download individual images or all pages as a ZIP file. High quality preserved with no watermarks.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert a PDF to JPG for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF to PDF Core, choose JPG format and your preferred quality, then click Convert. You can download individual images or all pages at once as a ZIP file. Completely free with no watermarks and no signup required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between JPG and PNG output?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JPG is best for photos and text documents — smaller file size with excellent quality. PNG is best for images with transparency, sharp graphics, and screenshots — larger files but pixel-perfect quality. Choose JPG for most use cases.',
      },
    },
    {
      '@type': 'Question',
      name: 'What resolution options are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PDF Core offers four resolution levels: Low (fast, small files), Medium (balanced), High (recommended for most uses), and Ultra (maximum quality, larger files). Higher resolution means sharper images but bigger file sizes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert only specific pages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Select individual pages by clicking their thumbnails, or use the Select All / Deselect All buttons. Only the selected pages will be converted, saving time for large PDFs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does PDF Core add watermarks to converted images?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. Your converted JPG or PNG images are 100% clean with no watermarks, no branding, and no logos. This is different from many "free" competitors that stamp their name on your files.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many pages can I convert at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no page limit. Convert 5 pages or 500 pages — PDF Core handles them all. When you have multiple pages, they can be downloaded individually or bundled as a single ZIP file.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the PDFs I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All conversion happens 100% locally in your browser. Your PDF and the resulting images never leave your device — nothing is uploaded to any server. This is the safest way to convert sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert PDF to image on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. Convert PDFs to images directly on your phone without uploading to any server.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum PDF file size I can convert?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits. Unlike iLovePDF or Smallpdf which cap free users at 100MB, PDF Core has no restrictions because everything runs in your browser. Convert PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I extract images embedded in a PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PDF Core converts entire PDF pages to images (whole page as one image). To extract specific embedded images within a PDF, you would need a different type of tool. This converter renders each PDF page as a JPG or PNG.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function PdfToImagePage() {
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
      <PdfToImageClient />
    </>
  );
}