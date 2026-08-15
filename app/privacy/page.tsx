import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PDF Core privacy policy. Learn how we protect your data. Files processed in your browser, never uploaded to servers. 100% private PDF processing.',
  keywords: 'pdf core privacy, pdf privacy policy, secure pdf tools, private pdf processing',
  alternates: {
    canonical: 'https://pdfcore.online/privacy/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy',
    description: 'PDF Core privacy policy. Files processed in your browser, never uploaded to servers.',
    url: 'https://pdfcore.online/privacy/',
    siteName: 'PDF Core',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}