import type { Metadata } from 'next';
import AddWatermarkClient from './AddWatermarkClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Add Watermark to PDF Online — Free, No Signup',
  description:
    'Add text watermarks to PDF documents online. Customize font, size, color, position, and opacity. Free, no signup, no watermark from us. 100% browser-based.',
  keywords: [
    'add watermark to pdf',
    'add watermark to pdf online',
    'add watermark to pdf free',
    'add watermark to pdf online free',
    'watermark pdf',
    'watermark pdf online',
    'watermark pdf free',
    'watermark pdf online free',
    'text watermark pdf',
    'add text watermark to pdf',
    'pdf watermark tool',
    'pdf watermark generator',
    'stamp pdf online',
    'add draft watermark pdf',
    'add confidential watermark pdf',
    'add copyright watermark pdf',
    'watermark pdf pages',
    'watermark all pdf pages',
    'watermark specific pages pdf',
    'diagonal watermark pdf',
    'watermark pdf no signup',
    'watermark pdf no upload',
    'watermark pdf without adobe',
    'protect pdf watermark',
    'brand pdf watermark',
    'watermark pdf mobile',
    'watermark pdf iphone',
    'watermark pdf android',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to add watermark to pdf',
    'how to watermark a pdf',
    'how to add draft to pdf',
    'how to add confidential to pdf',
  ],
  alternates: {
    canonical: 'https://spellpdf.com/tools/add-watermark',
  },
  openGraph: {
    title: 'Add Watermark to PDF Online — Free, No Signup | SpellPDF',
    description:
      'Add custom text watermarks to PDFs. Choose font, size, color, position, and opacity. Free, private, 100% browser-based.',
    url: 'https://spellpdf.com/tools/add-watermark',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Add Watermark to PDF Free — SpellPDF',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add Watermark to PDF — Free & Private',
    description: 'Add text watermarks to PDFs instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Add Watermark to PDF — SpellPDF',
  url: 'https://spellpdf.com/tools/add-watermark',
  description:
    'Free browser-based PDF watermark tool. Add custom text watermarks to your PDFs with full control over appearance. No signup, no watermark from us, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Add custom text watermarks',
    'Multiple font sizes (small to extra-large)',
    'Custom colors',
    'Adjustable opacity',
    '9 position options (center, corners, edges)',
    'Rotation angle control',
    'Apply to all pages or specific pages',
    'No file size limit',
    'No signup required',
    'No watermarks added by SpellPDF',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Add a Watermark to PDF Documents',
  description:
    'Step-by-step guide to add custom text watermarks to PDF files using SpellPDF.',
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
      name: 'Customize Your Watermark',
      text: 'Enter your watermark text (e.g., CONFIDENTIAL, DRAFT, your name), then customize font size, color, opacity, position, and rotation. Choose to apply to all pages or specific ones.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Watermarked PDF',
      text: 'Click Add Watermark and download your protected PDF instantly. Your custom watermark is embedded on the selected pages.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I add a watermark to a PDF for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF to SpellPDF, enter your watermark text, customize the appearance (font, color, position, opacity), then click Add Watermark. Your watermarked PDF downloads instantly. Completely free with no signup and no SpellPDF watermark added.',
      },
    },
    {
      '@type': 'Question',
      name: 'What watermarks can I add?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can add any custom text watermark like DRAFT, CONFIDENTIAL, COPYRIGHT, your name, company name, or date. Full customization of font size (small to extra-large), color, opacity, position, and rotation angle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I choose where the watermark appears?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Choose from 9 positions: top-left, top-center, top-right, middle-left, middle-center, middle-right, bottom-left, bottom-center, or bottom-right. Perfect for placing watermarks exactly where you need them.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I make the watermark transparent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Adjust the opacity from 0% (invisible) to 100% (fully solid). Common settings are 20-30% for subtle background watermarks that don\'t interfere with reading, or 60-80% for visible protection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I rotate the watermark?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Rotate the watermark to any angle. Popular options are 45° (diagonal, classic for confidential documents), 90° (vertical), or 0° (horizontal). Great for creating watermarks that span across the entire page.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I watermark specific pages only?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Choose to apply the watermark to all pages, or specify individual pages (e.g., 1, 3, 5-8). Perfect for adding watermarks only to certain sections of a document.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SpellPDF add its own watermark?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, never. Only YOUR chosen watermark appears on the PDF. We do not add any SpellPDF branding, logos, or promotional watermarks. Your document only shows what you specified.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the watermarked PDFs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All processing happens 100% locally on your device. Your original PDF and the watermarked result never leave your browser — nothing is uploaded to any server. This is the safest way to watermark sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits from us. Unlike some competitors that cap free users, SpellPDF has no restrictions because everything runs in your browser. Watermark PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add watermarks on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! SpellPDF works on iPhone, Android, iPad, and any modern mobile browser. Add watermarks to your PDFs directly on your phone with touch-friendly controls.',
      },
    },
    {
      '@type': 'Question',
      name: 'What common watermarks do people add?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Popular text watermarks include: DRAFT (for work-in-progress documents), CONFIDENTIAL (for sensitive information), COPYRIGHT © YourName (for creative work), SAMPLE (for demo documents), DO NOT COPY (for restricted materials), and PAID/APPROVED (for signed documents).',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AddWatermarkPage() {
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
      <AddWatermarkClient />
    </>
  );
}