import type { Metadata } from 'next';
import SignPdfClient from './SignPdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Sign PDF Online — Free E-Signature, No Signup Required',
  description:
    'Add digital signatures to PDF documents online. Draw, type, or upload your signature. Free, no signup, no watermark. 100% browser-based.',
  keywords: [
    'sign pdf',
    'sign pdf online',
    'sign pdf free',
    'sign pdf online free',
    'sign pdf online free no signup',
    'sign pdf without printing',
    'sign pdf without adobe',
    'sign pdf no signup',
    'sign pdf no watermark',
    'add signature to pdf',
    'add signature to pdf online',
    'add signature to pdf free',
    'e-sign pdf',
    'esign pdf online',
    'esign pdf free',
    'electronic signature pdf',
    'digital signature pdf',
    'digital signature online free',
    'pdf signature tool',
    'pdf signer',
    'pdf signer free',
    'draw signature online',
    'type signature online',
    'upload signature to pdf',
    'sign pdf mobile',
    'sign pdf iphone',
    'sign pdf android',
    'sign document online',
    'docusign alternative free',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to sign a pdf',
    'how to add signature to pdf',
    'how to esign a pdf',
  ],
  alternates: {
    canonical: 'https://pdfcore.online/tools/sign-pdf',
  },
  openGraph: {
    title: 'Sign PDF Online — Free E-Signature, No Signup | PDF Core',
    description:
      'Add digital signatures to PDFs. Draw, type, or upload. Free, private, 100% browser-based.',
    url: 'https://pdfcore.online/tools/sign-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Sign PDF Free & Private — PDF Core',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign PDF Online — Free E-Signature',
    description: 'Add signatures to PDFs instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sign PDF — PDF Core',
  url: 'https://pdfcore.online/tools/sign-pdf',
  description:
    'Free browser-based PDF signature tool. Draw, type, or upload signatures and add them to PDF documents. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Draw signature with mouse or touch',
    'Type signature in cursive fonts',
    'Upload signature image',
    'Place signature anywhere on any page',
    'Resize and reposition signatures',
    'Multiple ink colors (blue, black, red)',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Sign a PDF Document Online',
  description:
    'Step-by-step guide to add your signature to PDF documents using PDF Core.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your PDF',
      text: 'Click the upload area or drag & drop your PDF document. The file is processed in your browser — nothing is uploaded to any server.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Create Your Signature',
      text: 'Draw your signature with mouse or finger, type it in a cursive font, or upload an existing signature image. Choose your ink color.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Place & Save',
      text: 'Click on the PDF to place your signature, drag to reposition, resize as needed. Add multiple signatures if required, then download the signed PDF.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I sign a PDF for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your PDF to PDF Core, create your signature (draw, type, or upload), then click on the PDF where you want to place it. Download your signed PDF instantly. Completely free with no signup, no watermarks, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ways can I create a signature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Three ways: (1) Draw — use your mouse, trackpad, or finger to sign naturally. (2) Type — enter your name and choose from beautiful cursive fonts. (3) Upload — use a photo of your existing signature or a scanned image.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a digital signature legally valid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple electronic signatures like the ones PDF Core creates are legally recognized in most countries (US ESIGN Act, EU eIDAS) for many document types. For high-security legal documents requiring digital certificates (like real estate transactions or court filings), consider dedicated e-signature services with authentication features.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add multiple signatures to one PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Add as many signatures as needed — on the same page or across different pages. Perfect for contracts requiring signatures in multiple places, or documents needing initials plus a full signature.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I resize and reposition my signature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. After placing your signature, drag it to reposition or use the corner handles to resize. You can move it to any position on any page until you get it just right.',
      },
    },
    {
      '@type': 'Question',
      name: 'What signature colors are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Choose from realistic pen colors: dark blue (default, like a fountain pen), blue (ballpoint), royal blue, black, or red. All designed to look like natural ink on paper.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the signed PDFs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All signing happens 100% locally on your device. Your PDF, your signature, and the signed result never leave your browser — nothing is uploaded to any server. This is the safest way to sign confidential documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my signature safe from being copied?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your signature is only stored temporarily in your browser session while you use the tool. Once you close the page, all signature data is cleared. Since files are never uploaded, no one can access your signature but you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I sign PDFs on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PDF Core works on iPhone, Android, iPad, and any modern mobile browser. Signing with your finger on a touchscreen feels natural and produces great results.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from DocuSign?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DocuSign is a full e-signature platform with authentication, audit trails, and multi-party workflows (great for legal contracts). PDF Core is a simple, private signing tool for when you just need to add a signature to your own PDF — free, instant, and browser-based with no signup.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function SignPdfPage() {
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
      <SignPdfClient />
    </>
  );
}