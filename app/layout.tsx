import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from './tools/_components/CookieBanner';
import { PendingFileProvider } from './_context/PendingFileContext';  // ⭐ ADD

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF Core - Free Online PDF Toolkit",
  description: "Free PDF Core that run in your browser. Merge, split, compress, convert, rotate, and edit PDFs without uploading files to any server.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* ⭐ Wrap with PendingFileProvider */}
        <PendingFileProvider>
          {children}
          <CookieBanner />
        </PendingFileProvider>
      </body>
    </html>
  );
}