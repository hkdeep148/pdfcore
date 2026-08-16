import type { Metadata } from 'next';
import SecurityClient from './SecurityClient';

export const metadata: Metadata = {
  title: 'Security - How We Protect Your Files',
  description: 'Learn how SpellPDF keeps your files 100% secure. All processing happens in your browser. Zero server uploads. Enterprise-grade encryption and privacy.',
  keywords: 'pdf security, secure pdf tools, private pdf processing, browser-based pdf security',
  alternates: {
    canonical: 'https://spellpdf.com/security/',
  },
  openGraph: {
    title: 'Security - How We Protect Your Files',
    description: 'All processing happens in your browser. Zero server uploads. Enterprise-grade privacy.',
    url: 'https://spellpdf.com/security/',
    siteName: 'SpellPDF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security - How We Protect Your Files',
    description: 'Zero server uploads. All processing in your browser. Enterprise-grade privacy.',
  },
};

export default function SecurityPage() {
  return <SecurityClient />;
}