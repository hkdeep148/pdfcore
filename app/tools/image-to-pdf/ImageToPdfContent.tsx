import Link from 'next/link';
import {
  Shield, Zap, FileText, Upload, Settings, Download,
  CheckCircle, HelpCircle, ArrowRight, Image as ImageIcon,
  Layers, RotateCw
} from 'lucide-react';

export default function ImageToPdfContent() {
  return (
    <article className="hidden md:block bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ═══════════ HERO / INTRO ═══════════ */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#07122E] mb-4 leading-tight">
            Image to PDF Converter — Free, No Watermark, No Signup
          </h1>
          <p className="text-lg text-[#4B5563] leading-relaxed">
            Convert JPG, PNG, and WEBP images to PDF in seconds. Choose from
            <strong> A4, A3, Letter, Legal</strong> page sizes with Portrait or Landscape
            orientation. PDF Core runs 100% in your browser — no uploads, no signup,
            no watermarks, and no limits on how many images you convert.
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
            How to Convert Images to PDF in 3 Simple Steps
          </h2>
          <p className="text-[#4B5563] mb-8">
            Converting JPG, PNG, or WEBP images to PDF with PDF Core takes less than a
            minute. No installation needed, no signup required:
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Upload,
                title: 'Upload Your Images',
                desc: 'Drag & drop your images into the upload area, or click to browse. You can select JPG, PNG, or WEBP files — mix and match as needed. Add as many as you want, there is no limit.',
              },
              {
                icon: Settings,
                title: 'Customize Your PDF',
                desc: 'Choose your page size (A4, A3, A5, Letter, or Legal) and orientation (Portrait or Landscape). Drag images to reorder them, rotate individual photos, or set custom sizes for specific pages.',
              },
              {
                icon: Download,
                title: 'Create & Download PDF',
                desc: 'Click Create PDF and your combined document downloads instantly. Each image becomes a separate page, with high quality preserved and no watermarks added.',
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
            Why PDF Core is the Best Image to PDF Converter
          </h2>
          <p className="text-[#4B5563] mb-6">
            Most online image-to-PDF converters (iLovePDF, Smallpdf, JPG2PDF) upload your
            photos to their servers, add watermarks, or limit you to just a few images per
            day. PDF Core does things differently:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Files Never Leave Your Device',
                desc: 'All conversion happens in your browser. Your personal photos are never uploaded to any server. Perfect for sensitive images like ID scans, receipts, and personal documents.',
              },
              {
                title: 'Unlimited Images',
                desc: 'Convert 5 images or 500 images at once. No file count restrictions — combine as many photos as your device can handle into a single PDF.',
              },
              {
                title: 'Multiple Page Sizes',
                desc: 'Choose from A4, A3, A5, Letter, or Legal. You can even set different sizes for individual images — perfect for mixing photos and documents.',
              },
              {
                title: 'Per-Image Customization',
                desc: 'Rotate each image individually, change orientation per page, and set custom sizes. Full control over your final PDF layout.',
              },
              {
                title: 'No Watermarks Ever',
                desc: 'Your PDF is 100% clean — no branding, no logos, no watermarks added. Unlike many "free" competitors that stamp their name on your files.',
              },
              {
                title: 'Preserves Image Quality',
                desc: 'High-quality conversion with smart compression. Your photos look sharp in the PDF while keeping file size manageable.',
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

        {/* ═══════════ SUPPORTED FORMATS ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Supported Image Formats
          </h2>
          <p className="text-[#4B5563] mb-6">
            PDF Core supports the most popular image formats. You can even mix different
            formats in a single PDF:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                format: 'JPG / JPEG',
                desc: 'The most common photo format. Perfect for camera photos, scanned documents, and web images.',
              },
              {
                format: 'PNG',
                desc: 'Best for screenshots, graphics, and images with transparency. Preserves sharp details.',
              },
              {
                format: 'WEBP',
                desc: 'Modern format with excellent compression. Common for web-sourced images.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#ECEDF3]"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center mb-3">
                  <ImageIcon size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-[#07122E] mb-2">
                  {item.format}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ PAGE SIZE OPTIONS ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Choose the Perfect Page Size
          </h2>
          <p className="text-[#4B5563] mb-6">
            Different documents need different page sizes. PDF Core supports all popular
            paper standards:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border border-[#ECEDF3] rounded-2xl overflow-hidden">
              <thead className="bg-[#F5F3FF]">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Size
                  </th>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Dimensions
                  </th>
                  <th className="text-left px-5 py-3 text-sm font-bold text-[#07122E]">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEDF3]">
                {[
                  { size: 'A4', dim: '210 × 297 mm', use: 'Standard documents, reports, letters (worldwide)' },
                  { size: 'A3', dim: '297 × 420 mm', use: 'Posters, large diagrams, presentations' },
                  { size: 'A5', dim: '148 × 210 mm', use: 'Notebooks, small booklets, flyers' },
                  { size: 'Letter', dim: '8.5 × 11 in', use: 'US standard for documents, invoices' },
                  { size: 'Legal', dim: '8.5 × 14 in', use: 'US legal documents, contracts, forms' },
                ].map((row) => (
                  <tr key={row.size}>
                    <td className="px-5 py-4 font-bold text-[#07122E]">{row.size}</td>
                    <td className="px-5 py-4 text-sm text-[#4B5563]">{row.dim}</td>
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
            Common Use Cases for Image to PDF Conversion
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Scanning Documents with Phone',
                desc: 'Take photos of paper documents with your phone camera, then convert to PDF for easy sharing and archiving.',
              },
              {
                title: 'Creating Photo Albums',
                desc: 'Combine multiple photos into a single PDF for family albums, travel memories, or portfolios.',
              },
              {
                title: 'Submitting Applications',
                desc: 'Convert ID scans, certificates, and supporting documents to PDF for job applications or visa forms.',
              },
              {
                title: 'Sharing Screenshots',
                desc: 'Combine multiple screenshots into one PDF for bug reports, tutorials, or documentation.',
              },
              {
                title: 'Digitizing Receipts',
                desc: 'Photo your receipts and convert to PDF for expense reports, taxes, or business records.',
              },
              {
                title: 'Creating Presentation Handouts',
                desc: 'Convert slide images or design mockups into PDF handouts for meetings and presentations.',
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
                q: 'How do I convert an image to PDF for free?',
                a: 'Upload your images (JPG, PNG, or WEBP) to PDF Core, choose your page size and orientation, then click Create PDF. Your file downloads instantly with no watermark, no signup, and no file size limits.',
              },
              {
                q: 'Which image formats are supported?',
                a: 'PDF Core supports JPG, JPEG, PNG, and WEBP formats. You can mix different formats in a single PDF — for example, combining JPG photos with PNG screenshots.',
              },
              {
                q: 'Can I convert multiple images to a single PDF?',
                a: 'Yes! Upload as many images as you want and PDF Core will combine them into one PDF. You can drag and drop to reorder them, and each image becomes a separate page in the final PDF.',
              },
              {
                q: 'Does PDF Core add watermarks to converted PDFs?',
                a: 'Never. Your converted PDFs are 100% clean with no watermarks, no branding, and no logos. This is different from many "free" competitors that add watermarks unless you pay.',
              },
              {
                q: 'Can I choose different page sizes?',
                a: 'Yes. Choose from A4, A3, A5, Letter, or Legal. You can also mix sizes — set A4 for most pages and Letter for specific ones. Portrait and Landscape orientations are both supported.',
              },
              {
                q: 'Do you store the images I upload?',
                a: 'Never. All conversion happens 100% locally in your browser. Your images and the resulting PDF never leave your device — nothing is uploaded to any server. This is the most private way to convert images.',
              },
              {
                q: 'Can I convert HEIC (iPhone photos) to PDF?',
                a: 'Currently PDF Core supports JPG, PNG, and WEBP. For HEIC files, first convert them to JPG (iPhone can do this in Photos app) and then upload to PDF Core.',
              },
              {
                q: 'Can I rotate images before creating the PDF?',
                a: 'Yes! You can rotate each image individually 90 degrees at a time. Perfect for fixing sideways photos or portrait/landscape orientation issues before creating your PDF.',
              },
              {
                q: 'Is there a file size or quantity limit?',
                a: 'No limits. Convert 5 images or 500 images — PDF Core has no restrictions because processing happens in your browser. The only limit is your device memory.',
              },
              {
                q: 'Can I convert images to PDF on my phone?',
                a: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. Take photos and convert them to PDF directly on your phone without uploading anywhere.',
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
            After creating your PDF from images, you might want to compress it, combine it
            with other PDFs, or do the reverse. All our tools are free and private:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: '/tools/pdf-to-image',
                title: 'PDF to Image',
                desc: 'Do the reverse — convert PDF pages back to JPG or PNG images.',
              },
              {
                href: '/tools/compress-image',
                title: 'Compress Image',
                desc: 'Reduce image size before converting to save PDF space.',
              },
              {
                href: '/tools/compress-pdf',
                title: 'Compress PDF',
                desc: 'Shrink your created PDF file size for easier sharing.',
              },
              {
                href: '/tools/merge-pdf',
                title: 'Merge PDF',
                desc: 'Combine your image PDF with other PDFs into one file.',
              },
              {
                href: '/tools/organize-pdf',
                title: 'Organize PDF',
                desc: 'Rearrange or delete pages after creating your PDF.',
              },
              {
                href: '/tools/rotate-pdf',
                title: 'Rotate PDF',
                desc: 'Rotate individual pages of your created PDF.',
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
            Ready to Convert Images to PDF?
          </h2>
          <p className="text-white/90 mb-4">
            Scroll up and drop your images into the tool. Free, private, and instant.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4F46E5] rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Convert Images to PDF Now
            <ArrowRight size={18} />
          </a>
        </section>

      </div>
    </article>
  );
}