import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service | PDF Core',
  description: 'PDF Core terms of service. Read the terms and conditions for using our free online PDF tools. Fair usage, no signup, transparent policies.',
  keywords: 'pdf core terms, terms of service, pdf tools terms, usage policy',
  alternates: {
    canonical: 'https://pdfcore.online/terms/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service | PDF Core',
    description: 'PDF Core terms of service. Fair usage, no signup, transparent policies.',
    url: 'https://pdfcore.online/terms/',
    siteName: 'PDF Core',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}