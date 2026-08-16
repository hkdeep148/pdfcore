import type { Metadata } from 'next';
import ImageToPdfClient from './ImageToPdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Image to PDF Converter — Free, No Watermark, No Signup',
  description:
    'Convert JPG, PNG, WEBP images to PDF instantly. Choose A4, Letter, or custom sizes. No watermark ever, unlimited files, 100% browser-based. Free forever.',
  keywords: [
    'image to pdf',
    'image to pdf converter',
    'image to pdf converter free',
    'image to pdf no watermark',
    'image to pdf no signup',
    'jpg to pdf',
    'jpg to pdf converter',
    'jpg to pdf free',
    'jpg to pdf online',
    'jpg to pdf no watermark',
    'png to pdf',
    'png to pdf converter',
    'png to pdf online',
    'photo to pdf',
    'photo to pdf converter',
    'picture to pdf',
    'convert image to pdf',
    'convert jpg to pdf',
    'convert png to pdf',
    'multiple images to pdf',
    'photos to pdf',
    'convert pictures to pdf iphone',
    'convert photos to pdf android',
    'scan to pdf',
    'webp to pdf',
    'heic to pdf',
    'image to pdf a4',
    'image to pdf landscape',
    'image to pdf custom size',
    'bulk image to pdf',
    'combine images into pdf',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to convert jpg to pdf',
    'how to convert image to pdf free',
  ],
  alternates: {
    canonical: 'https://spellpdf.com/tools/image-to-pdf',
  },
  openGraph: {
    title: 'Image to PDF Converter — Free, No Watermark, No Signup | SpellPDF',
    description:
      'Convert JPG, PNG, WEBP images to PDF instantly. Unlimited files, no watermark, 100% browser-based. Free forever.',
    url: 'https://spellpdf.com/tools/image-to-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Image to PDF Converter Free — SpellPDF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to PDF — Free, No Watermark, No Signup',
    description: 'Convert JPG, PNG, WEBP to PDF instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Image to PDF Converter — SpellPDF',
  url: 'https://spellpdf.com/tools/image-to-pdf',
  description:
    'Free browser-based image to PDF converter. Convert JPG, PNG, WEBP to PDF. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Convert JPG, PNG, WEBP to PDF',
    'Multiple page sizes (A4, A3, Letter, Legal)',
    'Portrait or Landscape orientation',
    'Per-image size customization',
    'Reorder images before conversion',
    'Rotate individual images',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert Images to PDF for Free',
  description:
    'Step-by-step guide to convert JPG, PNG, or WEBP images into a single PDF file using SpellPDF.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your Images',
      text: 'Click the upload area or drag & drop your JPG, PNG, or WEBP images. Multiple images can be added at once. Files are processed in your browser — nothing is uploaded to any server.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Customize Your PDF',
      text: 'Choose page size (A4, Letter, etc.), orientation (Portrait or Landscape), and rearrange images by drag & drop. You can set custom sizes for individual images if needed.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Create & Download PDF',
      text: 'Click Create PDF and download your combined document instantly. High quality preserved, no watermarks added.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert an image to PDF for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your images (JPG, PNG, or WEBP) to SpellPDF, choose your page size and orientation, then click Create PDF. Your file downloads instantly with no watermark, no signup, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which image formats are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SpellPDF supports JPG, JPEG, PNG, and WEBP formats. You can mix different formats in a single PDF — for example, combining JPG photos with PNG screenshots.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert multiple images to a single PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Upload as many images as you want and SpellPDF will combine them into one PDF. You can drag and drop to reorder them, and each image becomes a separate page in the final PDF.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SpellPDF add watermarks to converted PDFs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. Your converted PDFs are 100% clean with no watermarks, no branding, and no logos. This is different from many "free" competitors that add watermarks unless you pay.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I choose different page sizes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Choose from A4, A3, A5, Letter, or Legal. You can also mix sizes — set A4 for most pages and Letter for specific ones. Portrait and Landscape orientations are both supported.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the images I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All conversion happens 100% locally in your browser. Your images and the resulting PDF never leave your device — nothing is uploaded to any server. This is the most private way to convert images.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert HEIC (iPhone photos) to PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently SpellPDF supports JPG, PNG, and WEBP. For HEIC files, first convert them to JPG (iPhone can do this in Photos app) and then upload to SpellPDF.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rotate images before creating the PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can rotate each image individually 90 degrees at a time. Perfect for fixing sideways photos or portrait/landscape orientation issues before creating your PDF.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size or quantity limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No limits. Convert 5 images or 500 images — SpellPDF has no restrictions because processing happens in your browser. The only limit is your device memory.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I convert images to PDF on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! SpellPDF works perfectly on iPhone, Android, iPad, and any modern mobile browser. Take photos and convert them to PDF directly on your phone without uploading anywhere.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function ImageToPdfPage() {
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
      <ImageToPdfClient />
    </>
  );
}