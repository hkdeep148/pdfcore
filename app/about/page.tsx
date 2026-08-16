import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us - Our Mission for Free PDF Tools',
  description: 'Learn about SpellPDF - our mission to provide free, privacy-first PDF tools that work entirely in your browser. No signup, no ads, no watermarks.',
  keywords: 'about SpellPDF, free pdf tools, privacy pdf tools, SpellPDF mission',
  alternates: {
    canonical: 'https://spellpdf.com/about/',
  },
  openGraph: {
    title: 'About SpellPDF - Our Mission for Free PDF Tools',
    description: 'Learn about SpellPDF - our mission to provide free, privacy-first PDF tools that work entirely in your browser.',
    url: 'https://spellpdf.com/about/',
    siteName: 'SpellPDF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SpellPDF - Our Mission for Free PDF Tools',
    description: 'Learn about SpellPDF - our mission to provide free, privacy-first PDF tools that work entirely in your browser.',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}