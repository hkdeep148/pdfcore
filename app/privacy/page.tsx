import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SpellPDF privacy policy. Learn how we protect your data. Files processed in your browser, never uploaded to servers. 100% private PDF processing.',
  keywords: 'SpellPDF privacy, pdf privacy policy, secure pdf tools, private pdf processing',
  alternates: {
    canonical: 'https://spellpdf.com/privacy/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy',
    description: 'SpellPDF privacy policy. Files processed in your browser, never uploaded to servers.',
    url: 'https://spellpdf.com/privacy/',
    siteName: 'SpellPDF',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}