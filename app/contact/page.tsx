import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact PDF Core - Get in Touch With Our Team',
  description: 'Have questions, feedback, or need support? Contact PDF Core team. We respond within 24 hours. Report bugs, request features, or ask anything.',
  keywords: 'contact pdf core, pdf core support, pdf tools help, pdf core email',
  alternates: {
    canonical: 'https://pdfcore.online/contact/',
  },
  openGraph: {
    title: 'Contact PDF Core - Get in Touch',
    description: 'Have questions, feedback, or need support? Contact PDF Core team. We respond within 24 hours.',
    url: 'https://pdfcore.online/contact/',
    siteName: 'PDF Core',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact PDF Core - Get in Touch',
    description: 'Have questions, feedback, or need support? Contact PDF Core team.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}