import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us - Our Mission for Free PDF Tools',
  description: 'Learn about PDF Core - our mission to provide free, privacy-first PDF tools that work entirely in your browser. No signup, no ads, no watermarks.',
  keywords: 'about pdf core, free pdf tools, privacy pdf tools, pdf core mission',
  alternates: {
    canonical: 'https://pdfcore.online/about/',
  },
  openGraph: {
    title: 'About PDF Core - Our Mission for Free PDF Tools',
    description: 'Learn about PDF Core - our mission to provide free, privacy-first PDF tools that work entirely in your browser.',
    url: 'https://pdfcore.online/about/',
    siteName: 'PDF Core',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PDF Core - Our Mission for Free PDF Tools',
    description: 'Learn about PDF Core - our mission to provide free, privacy-first PDF tools that work entirely in your browser.',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}