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
  metadataBase: new URL('https://spellpdf.com'),
  title: {
    default:
      'SpellPDF — Free PDF Tools Online | No Signup, No Upload, 100% Private',
    template: '%s | SpellPDF',
  },
  description:
    '🪄 11 free PDF tools that work 100% in your browser. Compress, merge, split, convert, sign PDFs. No signup, no upload, no watermarks — cast a spell on your PDFs.',
  keywords: [
    // Brand & Magic Keywords
    'SpellPDF', 'spell pdf', 'pdf magic', 'instant pdf tools', 'pdf spell',
    'magic pdf tools', 'pdf wizard', 'pdf tools instantly',
    
    // Core PDF tool keywords
    'free pdf tools', 'pdf tools online', 'pdf editor free', 'compress pdf free',
    'merge pdf online', 'split pdf free', 'pdf to jpg converter', 'image to pdf converter',
    'sign pdf online free', 'unlock pdf free', 'rotate pdf online', 'add watermark to pdf',
    'compress image online', 'organize pdf pages',
    
    // Long-tail keywords
    'compress pdf without losing quality', 'merge pdf files online free no signup',
    'split pdf into separate files free', 'pdf to jpg converter free no watermark',
    'image to pdf no watermark no signup', 'sign pdf online free without registration',
    'unlock pdf password free online', 'rotate pdf pages permanently free',
    'compress image without losing quality',
    
    // Privacy-focused keywords
    'pdf tools no upload', 'pdf tools browser based', 'pdf tools that dont upload files',
    'offline pdf editor', 'local pdf compressor', 'private pdf tools',
    'client side pdf processing',
    
    // Competitor comparison keywords
    'ilovepdf alternative', 'smallpdf alternative free',
    'adobe acrobat alternative free', 'pdf24 alternative',
    'compress pdf without adobe', 'merge pdf without signup', 'sign pdf without printing',
    'unlock pdf without software', 'pdf tools without watermark',
    'pdf tools without registration', 'pdf editor without subscription',
  ],
  authors: [{ name: 'SpellPDF', url: 'https://spellpdf.com' }],
  creator: 'SpellPDF',
  publisher: 'SpellPDF',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://spellpdf.com',
    siteName: 'SpellPDF',
    title: 'SpellPDF — PDF Tasks Done Like Magic ✨',
    description:
      '11 instant PDF tools that work in your browser. No uploads, no signup, no watermarks. Cast a spell on your PDFs — pure magic, 100% free & private.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'SpellPDF — PDF Magic in Your Browser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpellPDF — PDF Tasks Done Like Magic ✨',
    description:
      '11 browser-based PDF and image tools. No uploads, no signup, no watermarks. Cast a spell on your PDFs — 100% free & private.',
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
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-64x64.png',
        sizes: '64x64',
        type: 'image/png',
      },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://spellpdf.com',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#6366F1', // Indigo/Purple for magic branding
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SpellPDF',
  alternateName: 'Spell PDF',
  url: 'https://spellpdf.com',
  description:
    'Cast a spell on your PDFs. Free online PDF tools that work like magic — instant, private, and 100% in your browser.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://spellpdf.com/tools?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SpellPDF',
  url: 'https://spellpdf.com',
  logo: 'https://spellpdf.com/android-chrome-512x512.png',
  description:
    'SpellPDF offers free, instant, and private PDF and image tools that run entirely in your browser. Merge, split, compress, convert, and sign PDFs like magic — no uploads required.',
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