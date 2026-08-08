import type { Metadata } from 'next';
import UnlockPdfClient from './UnlockPdfClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — SEO OPTIMIZED
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Unlock PDF Online — Remove Password Free, No Signup',
  description:
    'Remove password protection from PDF files online. Free, no signup, no watermark. 100% browser-based — your files never leave your device. Unlock PDFs safely.',
  keywords: [
    'unlock pdf',
    'unlock pdf online',
    'unlock pdf free',
    'unlock pdf online free',
    'unlock pdf without password',
    'unlock pdf no signup',
    'unlock pdf no watermark',
    'remove pdf password',
    'remove password from pdf',
    'remove password from pdf online',
    'remove password from pdf free',
    'decrypt pdf',
    'decrypt pdf online',
    'pdf password remover',
    'pdf unlocker',
    'pdf unlocker free',
    'open password protected pdf',
    'crack pdf password',
    'unlock pdf without adobe',
    'unlock encrypted pdf',
    'unlock secured pdf',
    'strip pdf password',
    'unlock pdf mobile',
    'unlock pdf iphone',
    'unlock pdf android',
    'ilovepdf alternative',
    'smallpdf alternative',
    'how to unlock pdf',
    'how to remove password from pdf',
    'how to unlock password protected pdf',
  ],
  alternates: {
    canonical: 'https://pdfcore.online/tools/unlock-pdf',
  },
  openGraph: {
    title: 'Unlock PDF Online — Remove Password Free, No Signup | PDF Core',
    description:
      'Remove password protection from your PDFs. Free, safe, 100% browser-based. Your files never leave your device.',
    url: 'https://pdfcore.online/tools/unlock-pdf',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Unlock PDF Free & Private — PDF Core',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlock PDF Online — Free & Private',
    description: 'Remove password protection from PDFs instantly. 100% browser-based.',
  },
};

// ═══════════════════════════════════════════════════════════════
// STRUCTURED DATA — JSON-LD Schemas
// ═══════════════════════════════════════════════════════════════
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Unlock PDF — PDF Core',
  url: 'https://pdfcore.online/tools/unlock-pdf',
  description:
    'Free browser-based PDF unlocker. Remove password protection from your own PDFs. No signup, no watermark, no upload.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Remove PDF password protection',
    'Unlock multiple PDFs at once',
    'Preserve original quality',
    'Instant unlock (no waiting)',
    'Passwords never stored',
    'No file size limit',
    'No signup required',
    'No watermarks added',
    '100% browser-based processing',
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Unlock a Password-Protected PDF',
  description:
    'Step-by-step guide to remove password protection from your PDF files using PDF Core.',
  totalTime: 'PT1M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Your Locked PDF',
      text: 'Click the upload area or drag & drop your password-protected PDF. The file is processed in your browser — nothing is uploaded to any server.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Enter the Password',
      text: 'Enter the password you set for the PDF. The password stays on your device — it is never sent to any server or stored anywhere.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Download Unlocked PDF',
      text: 'Click Unlock and download your password-free PDF. You can now open it in any PDF viewer without entering a password.',
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I unlock a PDF for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload your password-protected PDF to PDF Core, enter the password, then click Unlock. Your password-free PDF downloads instantly. Completely free with no signup, no watermarks, and no file size limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to know the password?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. PDF Core requires you to enter the correct password to unlock a PDF. This tool is designed for removing password protection from YOUR OWN PDFs — files you have legitimate access to. It is not a password-cracking tool.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to enter my PDF password?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely safe. All processing happens 100% locally in your browser. Your password and PDF never leave your device — nothing is uploaded to any server, stored, or transmitted. Your password is only used momentarily to unlock the file, then discarded.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can PDF Core crack passwords I don\'t know?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, and we would not want to. PDF Core is designed to help you remove passwords from YOUR OWN files. If you forgot the password to your own PDF, try password recovery software specifically designed for that purpose. Using this tool on files that are not yours may be illegal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens to the unlocked PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You get a new PDF file with the password protection removed. The original locked PDF is unchanged. The new file can be opened by any PDF viewer without needing a password, and can be shared, printed, or edited freely.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I unlock multiple PDFs at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Upload multiple locked PDFs, enter their passwords, and unlock them all at once. Each PDF can have a different password.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you store the PDFs I upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Never. All unlocking happens 100% locally on your device. Your original PDF, the password you enter, and the unlocked result all stay in your browser — nothing is uploaded to any server. This is the safest way to unlock sensitive documents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a file size limit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No file size limits from us. Unlike some competitors that cap free users, PDF Core has no restrictions because everything runs in your browser. Unlock PDFs of any size your device can handle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I unlock PDFs on my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. Unlock PDFs directly on your phone with your passwords staying private.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this legal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, when used for YOUR OWN files. Removing passwords from PDFs you own or have permission to access is completely legal in most jurisdictions. However, unlocking files you do not have authorization for may violate copyright or privacy laws. Only use this tool on your own PDFs or files you are authorized to unlock.',
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function UnlockPdfPage() {
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
      <UnlockPdfClient />
    </>
  );
}