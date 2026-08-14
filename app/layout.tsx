import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Inter, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import CookieBanner from './tools/_components/CookieBanner';
import { PendingFileProvider } from './_context/PendingFileContext';
import { ToastProvider } from './tools/_components/ToastProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans-3',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pdfcore.online'),
  title: {
    default:
      'PDF Core — Free PDF Tools Online | No Signup, No Upload, 100% Private',
    template: '%s | PDF Core — Free & Private PDF Tools',
  },
  description:
    'Free online PDF and image tools that work 100% in your browser. Compress, merge, split, convert, sign PDFs. Unlock protected PDFs. Compress and convert images. No signup, no upload, no watermark. Your files never leave your device.',
  keywords: [
    'free pdf tools', 'pdf tools online', 'pdf editor free', 'compress pdf free',
    'merge pdf online', 'split pdf free', 'pdf to jpg converter', 'image to pdf converter',
    'sign pdf online free', 'unlock pdf free', 'rotate pdf online', 'add watermark to pdf',
    'compress image online', 'organize pdf pages',
    'compress pdf without losing quality', 'merge pdf files online free no signup',
    'split pdf into separate files free', 'pdf to jpg converter free no watermark',
    'image to pdf no watermark no signup', 'sign pdf online free without registration',
    'unlock pdf password free online', 'rotate pdf pages permanently free',
    'compress image without losing quality',
    'pdf tools no upload', 'pdf tools browser based', 'pdf tools that dont upload files',
    'offline pdf editor', 'local pdf compressor', 'private pdf tools',
    'client side pdf processing',
    'ilovepdf alternative', 'smallpdf alternative free',
    'adobe acrobat alternative free', 'pdf24 alternative',
    'compress pdf without adobe', 'merge pdf without signup', 'sign pdf without printing',
    'unlock pdf without software', 'pdf tools without watermark',
    'pdf tools without registration', 'pdf editor without subscription',
  ],
  authors: [{ name: 'PDF Core', url: 'https://pdfcore.online' }],
  creator: 'PDF Core',
  publisher: 'PDF Core',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfcore.online',
    siteName: 'PDF Core',
    title: 'PDF Core — Free PDF Tools | No Signup, No Upload, 100% Private',
    description:
      '11 PDF and image tools that work 100% in your browser. No file uploads, no signup, no watermarks. Compress, merge, convert, sign & more — completely free.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'PDF Core — Free Private Browser-Based PDF Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Core — Free PDF Tools, No Signup Required',
    description:
      '11 browser-based PDF and image tools. No uploads, no signup, no watermarks. 100% free & private.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://pdfcore.online',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#4F46E5',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PDF Core',
  url: 'https://pdfcore.online',
  description:
    'Free online PDF tools that respect your privacy. All processing happens in your browser.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://pdfcore.online/tools?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PDF Core',
  url: 'https://pdfcore.online',
  logo: 'https://pdfcore.online/icon.png',
  description:
    'Free online PDF and image tools that respect your privacy. All processing happens in your browser.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${sourceSans3.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <PendingFileProvider>
          <ToastProvider>
            {children}
            <CookieBanner />
          </ToastProvider>
        </PendingFileProvider>
      </body>
    </html>
  );
}