import Link from 'next/link';
import {
  Shield, Zap, FileText, Download, Upload, MoveVertical,
  CheckCircle, HelpCircle, ArrowRight, Combine
} from 'lucide-react';

export default function MergePdfContent() {
  return (
    <article className="hidden md:block bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ═══════════ HERO / INTRO ═══════════ */}
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#07122E] mb-4 leading-tight">
            Merge PDF Files Online — Free, No Signup, Unlimited
          </h1>
          <p className="text-lg text-[#4B5563] leading-relaxed">
            Combine multiple PDF files into one document in seconds. PDF Core runs
            entirely in your browser — no uploads, no signup, no watermarks, and no
            limits. Merge 2, 20, or 200 PDFs at once, drag & drop to reorder,
            and download your combined file instantly.
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
            How to Merge PDF Files in 3 Simple Steps
          </h2>
          <p className="text-[#4B5563] mb-8">
            Merging PDFs with PDF Core takes less than a minute. No account needed,
            no software to install. Here&apos;s exactly how it works:
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Upload,
                title: 'Upload Your PDFs',
                desc: 'Drag & drop multiple PDF files into the upload area above, or click to browse and select them. You can add as many PDFs as you want — there is no limit. Your files stay on your device the entire time.',
              },
              {
                icon: MoveVertical,
                title: 'Reorder Your Files',
                desc: 'Drag and drop the PDF thumbnails to arrange them in your preferred order. The first PDF will appear first in the merged document, and so on. You can also remove any files you don\'t want to include.',
              },
              {
                icon: Combine,
                title: 'Merge & Download',
                desc: 'Click the Merge PDF button. The tool combines your files instantly and downloads the merged PDF to your device. Original quality is preserved throughout.',
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
            Why PDF Core is the Best Free PDF Merger
          </h2>
          <p className="text-[#4B5563] mb-6">
            Most online PDF mergers (iLovePDF, Smallpdf, Adobe Acrobat Online) require
            you to upload your files to their servers, add watermarks, or limit you to a
            few merges per day. PDF Core does things differently:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Files Never Leave Your Device',
                desc: 'All merging happens in your browser using WebAssembly. Your PDFs are never uploaded to any server. Perfect for confidential documents like contracts, invoices, and personal records.',
              },
              {
                title: 'Unlimited File Count',
                desc: 'Merge 2 PDFs or 200 PDFs — there is no limit on how many files you can combine at once. Unlike competitors that cap you at 5-20 files, PDF Core has no restrictions.',
              },
              {
                title: 'No File Size Limits',
                desc: 'Combine PDFs of any size. No 100MB cap, no 5MB free tier. Merge 1GB+ files if your device supports it.',
              },
              {
                title: 'Drag & Drop Reordering',
                desc: 'Visual thumbnails make it easy to arrange your PDFs. Just drag and drop to change the order. See exactly what your merged document will look like.',
              },
              {
                title: 'No Watermarks Added',
                desc: 'Your merged PDF is 100% clean — no branding, no logos, no watermarks. Just a clean combined file, exactly how you want it.',
              },
              {
                title: 'Preserves Original Quality',
                desc: 'Text stays sharp, images stay clear, formatting is preserved. No compression or quality loss during merging — your PDFs are combined byte-for-byte.',
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

        {/* ═══════════ USE CASES ═══════════ */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-[#07122E] mb-6">
            Common Use Cases for Merging PDFs
          </h2>
          <p className="text-[#4B5563] mb-6">
            PDF merging is one of the most common document tasks. Here are the most
            popular reasons people use PDF Core to combine files:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Combining Scanned Documents',
                desc: 'Scan pages one at a time, then merge them into a single organized PDF for easy sharing.',
              },
              {
                title: 'Merging Invoices & Receipts',
                desc: 'Combine monthly or annual financial documents into one file for accounting or tax purposes.',
              },
              {
                title: 'Creating Reports & Portfolios',
                desc: 'Merge multiple PDF sections (cover, TOC, chapters, appendix) into a single professional document.',
              },
              {
                title: 'Assembling Legal Documents',
                desc: 'Combine contracts, addendums, and signatures into a single organized case file.',
              },
              {
                title: 'Combining eBooks & Notes',
                desc: 'Merge study materials, notes, and reference documents into one comprehensive reading file.',
              },
              {
                title: 'Book & Manuscript Compilation',
                desc: 'Combine multiple chapters or sections written separately into a final complete manuscript.',
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
                q: 'How do I merge PDF files for free?',
                a: 'Simply upload your PDF files to PDF Core, drag them to reorder if needed, then click Merge PDF. Your combined file downloads instantly. It is 100% free with no signup, no watermarks, and no file size limits.',
              },
              {
                q: 'How many PDFs can I merge at once?',
                a: 'There is no limit. You can merge 2, 20, or even 200 PDFs at once. Since processing happens in your browser, the only limit is your device memory.',
              },
              {
                q: 'Do you store the merged PDF?',
                a: 'Never. All merging happens 100% locally on your device. Your PDFs and the resulting merged file never leave your browser — nothing is uploaded to any server. This makes PDF Core the safest option for sensitive documents.',
              },
              {
                q: 'Does merging PDFs reduce quality?',
                a: 'No. PDF Core preserves the original quality of all pages when merging. Text stays sharp, images stay clear, and formatting is maintained exactly as in the source files.',
              },
              {
                q: 'Can I rearrange PDFs before merging?',
                a: 'Yes! Simply drag and drop the PDF thumbnails to change their order before merging. You can also remove any unwanted files. The final merged PDF will follow your chosen order.',
              },
              {
                q: 'Is there a file size limit for merging?',
                a: 'No file size limits. Unlike iLovePDF (100MB free) or Smallpdf (5MB free), PDF Core has no restrictions because everything runs in your browser. Merge 1GB+ files if your device supports it.',
              },
              {
                q: 'Can I merge PDFs on my phone?',
                a: 'Yes! PDF Core works perfectly on iPhone, Android, iPad, and any modern mobile browser. The touch-optimized interface makes it easy to select, reorder, and merge PDFs on the go.',
              },
              {
                q: 'Do I need to install anything to merge PDFs?',
                a: 'No installation needed. PDF Core runs entirely in your browser — no downloads, no plugins, no apps. Just open the site and start merging immediately.',
              },
              {
                q: 'Can I merge password-protected PDFs?',
                a: 'You need to unlock password-protected PDFs first before merging. Use our free Unlock PDF tool to remove the password, then merge as normal.',
              },
              {
                q: 'How is this different from iLovePDF or Smallpdf?',
                a: 'The main difference: PDF Core processes files 100% in your browser, so your PDFs never leave your device. iLovePDF and Smallpdf upload your files to their servers. We also have no file limits, no signup, and no daily caps.',
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
            After merging, you might need to compress, split, or organize your combined PDF.
            All our tools are free, private, and work in your browser:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: '/tools/compress-pdf',
                title: 'Compress PDF',
                desc: 'Reduce the size of your merged PDF for easier sharing.',
              },
              {
                href: '/tools/split-pdf',
                title: 'Split PDF',
                desc: 'Extract specific pages or divide a large PDF back into smaller ones.',
              },
              {
                href: '/tools/organize-pdf',
                title: 'Organize PDF',
                desc: 'Rearrange, rotate, or delete individual PDF pages visually.',
              },
              {
                href: '/tools/rotate-pdf',
                title: 'Rotate PDF',
                desc: 'Rotate PDF pages permanently. Perfect for fixing sideways scans.',
              },
              {
                href: '/tools/unlock-pdf',
                title: 'Unlock PDF',
                desc: 'Remove password protection before merging locked PDFs.',
              },
              {
                href: '/tools/image-to-pdf',
                title: 'Image to PDF',
                desc: 'Convert JPG or PNG images to PDF, then merge them together.',
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
            Ready to Merge Your PDFs?
          </h2>
          <p className="text-white/90 mb-4">
            Scroll up and drop your PDF files into the tool. It&apos;s that simple.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4F46E5] rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Merge PDFs Now
            <ArrowRight size={18} />
          </a>
        </section>

      </div>
    </article>
  );
}