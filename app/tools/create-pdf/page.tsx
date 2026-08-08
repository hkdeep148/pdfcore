import type { Metadata } from 'next';
import ComingSoonClient from './ComingSoonClient';

// ═══════════════════════════════════════════════════════════════
// METADATA — Basic (this is a coming-soon page, no SEO push)
// ═══════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'Create PDF — Coming Soon | PDF Core',
  description:
    'The Create PDF tool is coming soon. In the meantime, explore our other free PDF tools — no signup, no watermarks, 100% browser-based.',
  robots: {
    index: false,        // Tell search engines NOT to index this page
    follow: true,        // But do follow links from it
  },
  alternates: {
    canonical: 'https://pdfcore.online/tools/create-pdf',
  },
};

// ═══════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CreatePdfPage() {
  return <ComingSoonClient />;
}