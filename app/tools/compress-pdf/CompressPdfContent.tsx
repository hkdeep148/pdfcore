import Link from 'next/link';
import {
  Shield, Zap, FileText, Download, Upload, Settings,
  CheckCircle, HelpCircle, ArrowRight
} from 'lucide-react';

export default function CompressPdfContent() {
  return (
    <article className="hidden md:block bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ═══════════ HERO / INTRO ═══════════ */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#07122E] mb-4 leading-tight">
            Compress PDF Without Losing Quality — Free & Private
          </h1>
          <p className="text-lg text-[#4B5563] leading-relaxed">
            Reduce PDF file size by up to <strong>90%</strong> without visible quality loss.
            PDF Core runs entirely in your browser — your files are never uploaded, never
            stored, and never seen by anyone but you. Free forever, no signup required,
            no watermarks added.
          </p>
        </header>

        {/* ═══════════ USP BADGES ═══════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: Shield, label: '100% Private' },
            { icon: Zap, label: 'No Upload' },
            { icon: CheckCircle, label: 'No Signup' },
            { icon: FileText, label: 'No Watermark' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F5F3FF] border border-[#E0E7FF]"
            >
              <Icon size={18} className="text-[#4F46E5]" strokeWidth={2.5} />
              <span className="text-sm font-bold text-[#07122E]">{label}</span>
            </div>
          ))}
        </div>

        {/* ═══════════ HOW TO USE ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            How to Compress a PDF in 3 Simple Steps
          </h2>
          <p className="text-[#4B5563] mb-8">
            Compressing a PDF with PDF Core takes less than a minute. Here&apos;s exactly
            how it works:
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Upload,
                title: 'Upload Your PDF',
                desc: 'Drag & drop your PDF file into the upload area above, or click to browse. You can also add multiple PDFs at once for batch compression. Files stay on your device — nothing is uploaded.',
              },
              {
                icon: Settings,
                title: 'Choose Compression Level',
                desc: 'Select from three quality presets: Screen (maximum compression, ideal for emails), eBook (balanced quality and size), or Print (best quality, minimal compression). See the estimated size before compressing.',
              },
              {
                icon: Download,
                title: 'Download Compressed PDF',
                desc: 'Click Compress and download your smaller PDF instantly. You&apos;ll see the file size reduction percentage and can preview the result before downloading.',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center text-white font-black">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#07122E] mb-2 flex items-center gap-2">
                    <step.icon size={20} className="text-[#4F46E5]" />
                    {step.title}
                  </h3>
                  <p className="text-[#4B5563] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ WHY CHOOSE US ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Why PDF Core is the Best Free PDF Compressor
          </h2>
          <p className="text-[#4B5563] mb-6">
            Most online PDF compressors (like iLovePDF, Smallpdf, and Adobe Acrobat Online)
            require you to upload your files to their servers. This creates privacy concerns
            and slower performance. PDF Core does things differently:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Files Never Leave Your Device',
                desc: 'All compression happens in your browser using WebAssembly. Your PDFs are never uploaded to any server. Perfect for sensitive documents like contracts, tax returns, and medical records.',
              },
              {
                title: 'No File Size Limits',
                desc: 'Compress PDFs of any size — 500MB, 1GB, or larger. Unlike competitors that cap you at 20-50MB, PDF Core uses your device&apos;s capacity.',
              },
              {
                title: 'No Registration Required',
                desc: 'No email, no account, no verification. Just open the site and start compressing immediately. No usage limits either.',
              },
              {
                title: 'No Watermarks Added',
                desc: 'Your compressed PDF is 100% clean. We never add branding, logos, or watermarks to your files — unlike many "free" competitors.',
              },
              {
                title: 'Works Offline',
                desc: 'After the first page load, PDF Core works even without internet. Great for travelers, remote workers, and privacy-conscious users.',
              },
              {
                title: 'Free Forever',
                desc: 'No trials, no premium tiers, no hidden costs. All features are free for personal and commercial use.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#ECEDF3]"
              >
                <h3 className="text-lg font-bold text-[#07122E] mb-2 flex items-start gap-2">
                  <CheckCircle
                    size={20}
                    className="text-emerald-500 mt-0.5 shrink-0"
                    strokeWidth={2.5}
                  />
                  {item.title}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ QUALITY LEVELS ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Understanding PDF Compression Quality Levels
          </h2>
          <p className="text-[#4B5563] mb-6">
            PDF Core offers three compression presets, each optimized for different use cases.
            Here&apos;s what each level does and when to use it:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-[#ECEDF3] rounded-2xl overflow-hidden">
              <thead className="bg-[#F5F3FF]">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Quality Level
                  </th>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Compression
                  </th>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEDF3]">
                <tr>
                  <td className="px-5 py-4 font-bold text-[#07122E]">Screen</td>
                  <td className="px-5 py-4 text-sm text-[#4B5563]">80-90% reduction</td>
                  <td className="px-5 py-4 text-sm text-[#4B5563]">
                    Email attachments, web sharing, mobile viewing
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-bold text-[#07122E]">eBook</td>
                  <td className="px-5 py-4 text-sm text-[#4B5563]">50-70% reduction</td>
                  <td className="px-5 py-4 text-sm text-[#4B5563]">
                    Digital reading, presentations, general use
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-bold text-[#07122E]">Print</td>
                  <td className="px-5 py-4 text-sm text-[#4B5563]">20-40% reduction</td>
                  <td className="px-5 py-4 text-sm text-[#4B5563]">
                    Printing, archival, high-quality documents
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6 flex items-center gap-2">
            <HelpCircle size={28} className="text-[#4F46E5]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Does compressing a PDF reduce its quality?',
                a: 'Our smart compression reduces file size by up to 90% while preserving visible quality. For most documents, the difference is not noticeable. You can choose from three quality levels based on your needs: Screen (maximum compression), eBook (balanced), or Print (best quality).',
              },
              {
                q: 'Is there a file size limit?',
                a: 'No. Unlike other tools that limit you to 20MB or 100MB, PDF Core has no file size restrictions because everything runs in your browser. You can compress PDFs as large as your device can handle.',
              },
              {
                q: 'Do you store my PDF files?',
                a: 'Never. All processing happens 100% locally on your device using your browser. Your files are never uploaded to any server, never stored, and never seen by us or any third party. This is the safest way to compress sensitive documents like contracts, tax returns, and medical records.',
              },
              {
                q: 'Is PDF Core free to use?',
                a: 'Yes, completely free with no hidden costs. No signup required, no email needed, no watermarks added, and no limits on how many PDFs you can compress. Free forever for personal and commercial use.',
              },
              {
                q: 'How much can I reduce my PDF file size?',
                a: 'Typical compression ranges from 40% to 90% file size reduction depending on the PDF content. Image-heavy PDFs compress the most. A 10MB PDF often becomes 1-2MB with Screen quality while maintaining excellent readability.',
              },
              {
                q: 'Can I compress multiple PDFs at once?',
                a: 'Yes. Upload multiple PDFs and compress them all at once. Since processing happens in your browser, batch compression is fast and doesn\'t require uploading files to any server.',
              },
              {
                q: 'Does compressing PDF work on mobile?',
                a: 'Yes! PDF Core works on iPhone, Android, iPad, and any modern mobile browser. The interface is fully optimized for touch, and compression happens directly on your phone without uploading.',
              },
              {
                q: 'How is this different from iLovePDF or Smallpdf?',
                a: 'The main difference: PDF Core processes files 100% in your browser, so your PDFs never leave your device. iLovePDF and Smallpdf upload your files to their servers. We also have no file size limits, no signup requirements, and no daily usage caps.',
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-2xl bg-[#F8FAFC] border border-[#ECEDF3] cursor-pointer"
              >
                <summary className="flex items-center justify-between font-bold text-[#07122E] text-lg">
                  <span>{item.q}</span>
                  <span className="text-[#4F46E5] text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[#4B5563] leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═══════════ RELATED TOOLS ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            More Free PDF Tools
          </h2>
          <p className="text-[#4B5563] mb-6">
            After compressing, you might need to organize, merge, or convert your PDFs.
            All our tools are free, private, and work in your browser:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: '/tools/merge-pdf',
                title: 'Merge PDF',
                desc: 'Combine multiple PDFs into one file. Perfect after compressing.',
              },
              {
                href: '/tools/split-pdf',
                title: 'Split PDF',
                desc: 'Extract specific pages or split a large PDF into smaller ones.',
              },
              {
                href: '/tools/organize-pdf',
                title: 'Organize PDF',
                desc: 'Rearrange, rotate, or delete PDF pages visually.',
              },
              {
                href: '/tools/rotate-pdf',
                title: 'Rotate PDF',
                desc: 'Rotate PDF pages permanently. Fix sideways scans.',
              },
              {
                href: '/tools/pdf-to-image',
                title: 'PDF to Image',
                desc: 'Convert PDF pages to JPG or PNG images.',
              },
              {
                href: '/tools/compress-image',
                title: 'Compress Image',
                desc: 'Reduce image file size before converting to PDF.',
              },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group p-5 rounded-2xl bg-white border border-[#ECEDF3] hover:border-[#4F46E5] hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-[#07122E] mb-2 flex items-center justify-between">
                  {tool.title}
                  <ArrowRight
                    size={18}
                    className="text-[#4F46E5] group-hover:translate-x-1 transition-transform"
                  />
                </h3>
                <p className="text-sm text-[#4B5563]">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════ CLOSING CTA ═══════════ */}
        <section className="text-center py-8 px-6 rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] text-white">
          <h2 className="text-2xl font-extrabold mb-2">
            Ready to Compress Your PDF?
          </h2>
          <p className="text-white/90 mb-4">
            Scroll up and drag your PDF into the tool. It&apos;s that simple.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4F46E5] rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Compress PDF Now
            <ArrowRight size={18} />
          </a>
        </section>

      </div>
    </article>
  );
}