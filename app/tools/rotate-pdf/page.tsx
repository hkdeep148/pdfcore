import type { Metadata } from 'next';
import RotatePdfClient from './RotatePdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Rotate PDF Pages Online — Free, Permanent, No Signup',
  description:
    'Rotate PDF pages permanently online. Rotate single pages or all pages 90°, 180°, 270°. Free, no signup, no watermark. 100% browser-based.',
  keywords: [
    'rotate pdf',
    'rotate pdf online',
    'rotate pdf free',
    'rotate pdf online free',
    'rotate pdf pages',
    'rotate pdf pages permanently',
    'rotate pdf 90 degrees',
    'rotate pdf 180 degrees',
    'rotate pdf single page',
    'rotate pdf all pages',
    'rotate pdf and save',
    'fix pdf orientation',
    'flip pdf pages',
    'turn pdf pages',
    'rotate pdf no signup',
    'rotate pdf no watermark',
    'rotate pdf without adobe',
    'pdf rotator free',
    'pdf page rotator',
    'rotate pdf iphone',
    'rotate pdf android',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to rotate pdf',
    'how to rotate pdf pages permanently',
    'how to rotate a single page in pdf',
  ],
  alternates: {
    canonical: 'https://pdfcore.online/tools/rotate-pdf',
  },
  openGraph: {
    title: 'Rotate PDF Pages Online — Free, Permanent, No Signup | PDF Core',
    description:
      'Rotate PDF pages 90°, 180°, or 270°. Rotate single pages or all at once. Free, permanent, 100% browser-based.',
    url: 'https://pdfcore.online/tools/rotate-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Rotate PDF Free & Private — PDF Core',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate PDF Pages Online — Free, Permanent',
    description: 'Fix PDF orientation instantly. Rotate single or all pages. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Rotate PDF — PDF Core',
  url: 'https://pdfcore.online/tools/rotate-pdf',
  description:
    'Free browser-based PDF rotator. Rotate PDF pages permanently, 90° at a time. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Rotate single or multiple pages',
    'Rotate 90°, 180°, or 270°',
    'Rotate all pages at once',
    'Preview before saving',
    'Permanent rotation (not just view)',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Rotate PDF Pages Permanently',
  description:
    'Step-by-step guide to rotate PDF pages 90°, 180°, or 270° using PDF Core.',
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
      name: 'Rotate Pages',
      text: 'Click the rotate button on individual pages, or use Rotate All to rotate every page. Each click rotates 90° clockwise.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Rotated PDF',
      text: 'Click Save and download your rotated PDF. The rotation is permanent and preserved when opening in any PDF viewer.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I rotate PDF pages for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF to PDF Core, click the rotate button on individual pages or use Rotate All, then click Save. Your rotated PDF downloads instantly. Completely free with no signup, no watermarks, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the rotation permanent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Unlike viewing rotation (which only changes how you see the PDF temporarily), PDF Core permanently rotates the pages in the file itself. When you open the saved PDF in any viewer, the pages will be in the new orientation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rotate individual pages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can rotate each page independently — perfect for fixing mixed-orientation documents. Some pages can be portrait while others are landscape.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rotate all pages at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use the Rotate All button to rotate every page 90° at the same time. Perfect for PDFs where all pages are sideways or upside down.',
      },
    },
    {
      '@type': 'Question',
      name: 'What rotation angles are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can rotate 90°, 180°, or 270° in either direction. Each click on the rotate button adds 90° of rotation, so multiple clicks let you reach any orientation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does rotation reduce PDF quality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Rotating pages does not affect the file quality. Text stays sharp, images stay clear, and formatting is preserved. Only the orientation changes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the PDFs I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All rotation happens 100% locally on your device. Your PDF and the rotated result never leave your browser — nothing is uploaded to any server. This is the safest way to work with sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits from us. Unlike some competitors that cap free users, PDF Core has no restrictions because everything runs in your browser. Rotate PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rotate PDFs on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. Rotate PDFs directly on your phone with touch-friendly controls.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I preview the rotation before saving?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You see a live preview of each page as you rotate it. Only when you click Save does PDF Core create the new rotated file. This lets you experiment freely before committing.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function RotatePdfPage() {
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
      <RotatePdfClient />
    </>
  );
}