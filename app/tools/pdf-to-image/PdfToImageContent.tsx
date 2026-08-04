import Link from 'next/link';
import {
  Shield, Zap, FileText, Upload, Settings, Download,
  CheckCircle, HelpCircle, ArrowRight, Image as ImageIcon,
  FileImage
} from 'lucide-react';

export default function PdfToImageContent() {
  return (
    <article className="hidden md:block bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ═══════════ HERO / INTRO ═══════════ */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#07122E] mb-4 leading-tight">
            PDF to JPG Converter — Free, High Quality, No Watermark
          </h1>
          <p className="text-lg text-[#4B5563] leading-relaxed">
            Convert PDF pages to <strong>JPG or PNG images</strong> in seconds. Choose from
            multiple resolution options — from web-quality to ultra-high-resolution.
            PDF Core runs 100% in your browser: no uploads, no signup, no watermarks,
            and no page limits.
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
            How to Convert PDF to JPG in 3 Simple Steps
          </h2>
          <p className="text-[#4B5563] mb-8">
            Converting a PDF to JPG or PNG images with PDF Core takes less than a minute.
            No software to install, no account needed:
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Upload,
                title: 'Upload Your PDF',
                desc: 'Drag & drop your PDF into the upload area above, or click to browse. Any PDF file works — text documents, scanned pages, presentations, or graphic-heavy files. Your PDF stays on your device.',
              },
              {
                icon: Settings,
                title: 'Choose Format & Quality',
                desc: 'Select JPG for photos and general use, or PNG for sharp graphics and screenshots. Pick your resolution: Low (small files), Medium, High (recommended), or Ultra (maximum quality). Select specific pages or convert all.',
              },
              {
                icon: Download,
                title: 'Download Images',
                desc: 'Click Convert and download individual images or all pages bundled as a ZIP file. High quality preserved, no watermarks added, ready to use immediately.',
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
            Why PDF Core is the Best PDF to Image Converter
          </h2>
          <p className="text-[#4B5563] mb-6">
            Most online PDF to image converters (iLovePDF, Smallpdf, PDF2JPG) upload your
            files to their servers, limit resolution to force upgrades, or add watermarks
            to free conversions. PDF Core does things differently:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Files Never Leave Your Device',
                desc: 'All conversion happens in your browser using WebAssembly. Your PDFs are never uploaded to any server — perfect for confidential documents like contracts, medical records, and financial statements.',
              },
              {
                title: 'True High Resolution',
                desc: 'Convert at up to 300 DPI (Ultra quality) — the same resolution as professional printing. Competitors often limit free users to 96 DPI (web quality only).',
              },
              {
                title: 'No Page Limits',
                desc: 'Convert 1 page or 1,000 pages at once. No restrictions because processing happens locally. Perfect for large books, reports, or presentations.',
              },
              {
                title: 'JPG or PNG Output',
                desc: 'Choose the format that fits your needs. JPG for smaller files and photos, PNG for lossless quality and screenshots. Both formats fully supported.',
              },
              {
                title: 'Selective Page Conversion',
                desc: 'Convert only the pages you need. Preview thumbnails and select specific pages, or convert them all at once. Saves time on large PDFs.',
              },
              {
                title: 'Batch Download as ZIP',
                desc: 'When converting multiple pages, download them all at once as a single ZIP file. Or grab individual images — your choice.',
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

        {/* ═══════════ FORMAT COMPARISON ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            JPG vs PNG — Which Should You Choose?
          </h2>
          <p className="text-[#4B5563] mb-6">
            Both JPG and PNG have strengths for different use cases. Here&apos;s how to
            choose:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-[#E0E7FF]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center mb-3">
                <FileImage size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-[#07122E] mb-2">
                Choose JPG for:
              </h3>
              <ul className="space-y-2 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Photo-heavy PDFs (magazines, brochures)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Text documents where file size matters
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Email attachments and web sharing
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Social media uploads
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Smaller file sizes preferred
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3">
                <ImageIcon size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-[#07122E] mb-2">
                Choose PNG for:
              </h3>
              <ul className="space-y-2 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Screenshots and screen captures
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Sharp text and diagrams
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Graphics with transparency
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Lossless quality required
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Design work and printing
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════ RESOLUTION LEVELS ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Understanding Resolution Options
          </h2>
          <p className="text-[#4B5563] mb-6">
            Higher resolution means sharper images but larger file sizes. Choose based on
            your intended use:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-[#ECEDF3] rounded-2xl overflow-hidden">
              <thead className="bg-[#F5F3FF]">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Quality
                  </th>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Resolution
                  </th>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEDF3]">
                {[
                  { q: 'Low', r: '~96 DPI', use: 'Quick preview, small files, thumbnails' },
                  { q: 'Medium', r: '~150 DPI', use: 'Web sharing, email, general use' },
                  { q: 'High', r: '~200 DPI', use: 'Recommended — good print quality, sharp on-screen' },
                  { q: 'Ultra', r: '~300 DPI', use: 'Professional printing, archival, magnification' },
                ].map((row) => (
                  <tr key={row.q}>
                    <td className="px-5 py-4 font-bold text-[#07122E]">{row.q}</td>
                    <td className="px-5 py-4 text-sm text-[#4B5563]">{row.r}</td>
                    <td className="px-5 py-4 text-sm text-[#4B5563]">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════ USE CASES ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Common Use Cases for PDF to Image Conversion
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Sharing on Social Media',
                desc: 'Convert PDF slides to JPG for Instagram, Facebook, or Twitter posts. Perfect for sharing infographics or documents visually.',
              },
              {
                title: 'Web Publishing',
                desc: 'Embed PDF content as images on websites or blogs. Faster loading than PDF viewers and better mobile compatibility.',
              },
              {
                title: 'Presentations',
                desc: 'Extract PDF pages as images to include in PowerPoint or Google Slides presentations.',
              },
              {
                title: 'Print Previews',
                desc: 'Convert to high-resolution images for professional printing or checking layout details.',
              },
              {
                title: 'Design & Layout Work',
                desc: 'Extract PDF pages as images to use in graphic design software like Photoshop, Figma, or Canva.',
              },
              {
                title: 'Educational Materials',
                desc: 'Convert textbook pages or study materials to images for easier sharing with students or study groups.',
              },
              {
                title: 'Digital Archives',
                desc: 'Convert historical PDF documents to images for long-term preservation and easier viewing.',
              },
              {
                title: 'Mobile Viewing',
                desc: 'Convert to JPG for easier viewing on phones without needing a PDF reader app.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#ECEDF3]"
              >
                <h3 className="text-lg font-bold text-[#07122E] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
                q: 'How do I convert a PDF to JPG for free?',
                a: 'Upload your PDF to PDF Core, choose JPG format and your preferred quality, then click Convert. You can download individual images or all pages at once as a ZIP file. Completely free with no watermarks and no signup required.',
              },
              {
                q: 'What is the difference between JPG and PNG output?',
                a: 'JPG is best for photos and text documents — smaller file size with excellent quality. PNG is best for images with transparency, sharp graphics, and screenshots — larger files but pixel-perfect quality. Choose JPG for most use cases.',
              },
              {
                q: 'What resolution options are available?',
                a: 'PDF Core offers four resolution levels: Low (fast, small files), Medium (balanced), High (recommended for most uses), and Ultra (maximum quality, larger files). Higher resolution means sharper images but bigger file sizes.',
              },
              {
                q: 'Can I convert only specific pages?',
                a: 'Yes! Select individual pages by clicking their thumbnails, or use the Select All / Deselect All buttons. Only the selected pages will be converted, saving time for large PDFs.',
              },
              {
                q: 'Does PDF Core add watermarks to converted images?',
                a: 'Never. Your converted JPG or PNG images are 100% clean with no watermarks, no branding, and no logos. This is different from many "free" competitors that stamp their name on your files.',
              },
              {
                q: 'How many pages can I convert at once?',
                a: 'There is no page limit. Convert 5 pages or 500 pages — PDF Core handles them all. When you have multiple pages, they can be downloaded individually or bundled as a single ZIP file.',
              },
              {
                q: 'Do you store the PDFs I upload?',
                a: 'Never. All conversion happens 100% locally in your browser. Your PDF and the resulting images never leave your device — nothing is uploaded to any server. This is the safest way to convert sensitive documents.',
              },
              {
                q: 'Can I convert PDF to image on my phone?',
                a: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. Convert PDFs to images directly on your phone without uploading to any server.',
              },
              {
                q: 'What is the maximum PDF file size I can convert?',
                a: 'No file size limits. Unlike iLovePDF or Smallpdf which cap free users at 100MB, PDF Core has no restrictions because everything runs in your browser. Convert PDFs of any size your device can handle.',
              },
              {
                q: 'Can I extract images embedded in a PDF?',
                a: 'PDF Core converts entire PDF pages to images (whole page as one image). To extract specific embedded images within a PDF, you would need a different type of tool. This converter renders each PDF page as a JPG or PNG.',
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
            After converting your PDF to images, you might want to compress them, or do the
            reverse. All our tools are free and private:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: '/tools/image-to-pdf',
                title: 'Image to PDF',
                desc: 'Do the reverse — convert JPG or PNG images back to PDF.',
              },
              {
                href: '/tools/compress-image',
                title: 'Compress Image',
                desc: 'Reduce the file size of your converted JPG or PNG images.',
              },
              {
                href: '/tools/compress-pdf',
                title: 'Compress PDF',
                desc: 'Shrink your PDF before converting to speed up processing.',
              },
              {
                href: '/tools/split-pdf',
                title: 'Split PDF',
                desc: 'Extract specific PDF pages before converting to images.',
              },
              {
                href: '/tools/rotate-pdf',
                title: 'Rotate PDF',
                desc: 'Fix page orientation before converting to images.',
              },
              {
                href: '/tools/organize-pdf',
                title: 'Organize PDF',
                desc: 'Rearrange or delete pages before converting.',
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
            Ready to Convert PDF to Images?
          </h2>
          <p className="text-white/90 mb-4">
            Scroll up and drop your PDF into the tool. Free, private, and instant.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4F46E5] rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Convert PDF to JPG Now
            <ArrowRight size={18} />
          </a>
        </section>

      </div>
    </article>
  );
}