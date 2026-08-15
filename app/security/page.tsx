import type { Metadata } from 'next';
import SecurityClient from './SecurityClient';

export const metadata: Metadata = {
  title: 'Security - How We Protect Your Files | PDF Core',
  description: 'Learn how PDF Core keeps your files 100% secure. All processing happens in your browser. Zero server uploads. Enterprise-grade encryption and privacy.',
  keywords: 'pdf security, secure pdf tools, private pdf processing, browser-based pdf security',
  alternates: {
    canonical: 'https://pdfcore.online/security/',
  },
  openGraph: {
    title: 'Security - How We Protect Your Files | PDF Core',
    description: 'All processing happens in your browser. Zero server uploads. Enterprise-grade privacy.',
    url: 'https://pdfcore.online/security/',
    siteName: 'PDF Core',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security - How PDF Core Protects Your Files',
    description: 'Zero server uploads. All processing in your browser. Enterprise-grade privacy.',
  },
};

export default function SecurityPage() {
  return <SecurityClient />;
}