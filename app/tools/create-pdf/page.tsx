import type { Metadata } from 'next';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = {
  title: 'Create PDF — Coming Soon | SpellPDF',
  description:
    'The Create PDF tool is coming soon. In the meantime, explore our other free PDF tools — no signup, no watermarks, 100% browser-based.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CreatePdfPage() {
  return <ComingSoonClient />;
}