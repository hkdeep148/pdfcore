import type { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Common questions about SpellPDF tools. Learn about file security, privacy, supported formats, size limits, and how our free PDF tools work.',
  keywords: 'SpellPDF faq, pdf tools questions, pdf faq, free pdf tools help',
  alternates: {
    canonical: 'https://spellpdf.com/faq/',
  },
  openGraph: {
    title: 'FAQ - Frequently Asked Questions',
    description: 'Common questions about SpellPDF tools. Learn about file security, privacy, and how our free PDF tools work.',
    url: 'https://spellpdf.com/faq/',
    siteName: 'SpellPDF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - Frequently Asked Questions',
    description: 'Common questions about SpellPDF tools and how they work.',
  },
};

export default function FaqPage() {
  return <FaqClient />;
}