import type { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Common questions about PDF Core tools. Learn about file security, privacy, supported formats, size limits, and how our free PDF tools work.',
  keywords: 'pdf core faq, pdf tools questions, pdf faq, free pdf tools help',
  alternates: {
    canonical: 'https://pdfcore.online/faq/',
  },
  openGraph: {
    title: 'FAQ - Frequently Asked Questions',
    description: 'Common questions about PDF Core tools. Learn about file security, privacy, and how our free PDF tools work.',
    url: 'https://pdfcore.online/faq/',
    siteName: 'PDF Core',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - Frequently Asked Questions',
    description: 'Common questions about PDF Core tools and how they work.',
  },
};

export default function FaqPage() {
  return <FaqClient />;
}