import type { Metadata } from 'next';
import { CompressImageProvider } from './_context/CompressImageContext';
import CompressImageClient from './CompressImageClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Compress Images Online — Free, No Signup, No Watermark',
  description:
    'Compress JPG, PNG, WEBP images online without losing quality. Free, no signup, no watermark. 100% browser-based — your images never leave your device.',
  keywords: [
    'compress image',
    'compress image online',
    'compress image free',
    'compress image online free',
    'compress image without losing quality',
    'compress image no signup',
    'compress image no watermark',
    'compress jpg',
    'compress jpg online',
    'compress jpg free',
    'compress png',
    'compress png online',
    'compress png free',
    'compress webp',
    'reduce image size',
    'reduce image size online',
    'reduce photo size',
    'shrink image online',
    'shrink photo size',
    'image compressor',
    'image compressor free',
    'image compressor online',
    'photo compressor',
    'batch compress images',
    'compress multiple images',
    'compress image for web',
    'compress image for email',
    'compress image iphone',
    'compress image android',
    'tinypng alternative',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to compress image',
    'how to reduce image file size',
    'how to compress photo without losing quality',
  ],
  alternates: {
    canonical: 'https://spellpdf.com/tools/compress-image',
  },
  openGraph: {
    title: 'Compress Images Online — Free, No Signup, No Watermark | SpellPDF',
    description:
      'Reduce JPG, PNG, WEBP image sizes without quality loss. Free, unlimited, 100% browser-based. Your images stay private.',
    url: 'https://spellpdf.com/tools/compress-image',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Compress Images Free & Private — SpellPDF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compress Images Online — Free, No Watermark',
    description: 'Reduce JPG, PNG, WEBP sizes instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compress Images — SpellPDF',
  url: 'https://spellpdf.com/tools/compress-image',
  description:
    'Free browser-based image compressor. Reduce JPG, PNG, WEBP file sizes without losing quality. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Compress JPG, PNG, WEBP images',
    'Multiple quality levels',
    'Batch compression (multiple images)',
    'Compare before/after side-by-side',
    'Download all as ZIP',
    'Preserve original format or convert',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Compress Images Without Losing Quality',
  description:
    'Step-by-step guide to compress JPG, PNG, and WEBP images using SpellPDF.',
  totalTime: 'PT30S',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your Images',
      text: 'Click the upload area or drag & drop your JPG, PNG, or WEBP images. Multiple images can be uploaded at once. All processing happens in your browser.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose Compression Level',
      text: 'Select your desired quality level. Higher compression means smaller files with slight quality loss. Preview before/after to see the difference.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Compressed Images',
      text: 'Click Compress and download individual images or all files as a ZIP. Compressed images are ready to upload, email, or share instantly.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I compress images for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your JPG, PNG, or WEBP images to SpellPDF, choose a compression level, then click Compress. Your smaller images download instantly. Completely free with no signup, no watermarks, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which image formats are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SpellPDF supports JPG (JPEG), PNG, and WEBP formats. You can compress multiple formats in one session and even convert between formats during compression.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much can I reduce image file size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typical compression ranges from 40% to 80% file size reduction depending on the image and quality level chosen. A 5MB JPG often becomes 500KB-1MB with excellent visual quality maintained.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will compressing reduce image quality?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Slightly, but usually not noticeably. Our smart compression preserves visual quality while dramatically reducing file size. You can preview the before/after comparison before downloading to make sure you are happy with the result.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compress multiple images at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Upload as many images as you want and compress them all in one batch. Download individually or bundle them into a single ZIP file for convenience.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the images I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All compression happens 100% locally in your browser. Your images never leave your device — nothing is uploaded to any server. This is the safest way to compress sensitive photos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits from us. Unlike some competitors that cap free users, SpellPDF has no restrictions because everything runs in your browser. Compress images of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compare before and after?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! SpellPDF shows a side-by-side comparison of your original and compressed image, along with file size savings percentage. This helps you decide the best quality level before downloading.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compress images on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! SpellPDF works perfectly on iPhone, Android, iPad, and any modern mobile browser. Compress photos directly on your phone without uploading them anywhere.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from TinyPNG or similar tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The main difference: SpellPDF processes images 100% in your browser, so your photos never leave your device. Many popular compressors upload your files to their servers for processing. We also have no daily limits, no file count limits, and no signup requirements.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CompressImagePage() {
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
      <CompressImageProvider>
        <CompressImageClient />
      </CompressImageProvider>
    </>
  );
}