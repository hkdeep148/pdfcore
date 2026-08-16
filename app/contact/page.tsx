import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch With Our Team',
  description: 'Have questions, feedback, or need support? Contact SpellPDF team. We respond within 24 hours. Report bugs, request features, or ask anything.',
  keywords: 'contact SpellPDF, SpellPDF support, pdf tools help, SpellPDF email',
  alternates: {
    canonical: 'https://spellpdf.com/contact/',
  },
  openGraph: {
    title: 'Contact Us - Get in Touch With Our Team',
    description: 'Have questions, feedback, or need support? Contact SpellPDF team. We respond within 24 hours.',
    url: 'https://spellpdf.com/contact/',
    siteName: 'SpellPDF',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get in Touch With Our Team',
    description: 'Have questions, feedback, or need support? Contact SpellPDF team.',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}