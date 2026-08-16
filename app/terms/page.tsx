import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'SpellPDF terms of service. Read the terms and conditions for using our free online PDF tools. Fair usage, no signup, transparent policies.',
  keywords: 'SpellPDF terms, terms of service, pdf tools terms, usage policy',
  alternates: {
    canonical: 'https://spellpdf.com/terms/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service',
    description: 'SpellPDF terms of service. Fair usage, no signup, transparent policies.',
    url: 'https://spellpdf.com/terms/',
    siteName: 'SpellPDF',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}