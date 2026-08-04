import { Metadata } from 'next';
import { CompressImageProvider } from './_context/CompressImageContext';
import CompressImageClient from './CompressImageClient';

export const metadata: Metadata = {
  title: 'Compress Images – PDFCore',
  description:
    'Reduce image file size while keeping quality. Compress JPG, PNG, and WEBP images instantly in your browser. No uploads, 100% private.',
};

export default function CompressImagePage() {
  return (
    <CompressImageProvider>
      <CompressImageClient />
    </CompressImageProvider>
  );
}