import Link from 'next/link';
import {
  Shield, Zap, FileText, Upload, Settings, Download,
  CheckCircle, HelpCircle, ArrowRight, Lock, Globe,
  DollarSign, Infinity as InfinityIcon, Sparkles, Users
} from 'lucide-react';

export default function HomeSeoContent() {
  return (
    <article className="hidden md:block bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* ═══════════ WHY CHOOSE US ═══════════ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#07122E] mb-4">
              Why Choose PDF Core?
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              The only PDF toolkit that respects your privacy, has zero limits,
              and stays free forever — no strings attached.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: '100% Private',
                desc: 'Your files never leave your device. All processing happens locally in your browser using WebAssembly. Perfect for confidential documents.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                icon: DollarSign,
                title: 'Free Forever',
                desc: 'No trials, no premium tiers, no hidden fees. Every tool is completely free with no daily limits — for personal and commercial use.',
                color: 'from-indigo-500 to-purple-600',
              },
              {
                icon: InfinityIcon,
                title: 'No Limits',
                desc: 'No file size caps, no daily usage limits, no number of files restrictions. Process as much as your device can handle.',
                color: 'from-amber-500 to-orange-600',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'Since files stay on your device, there is no upload/download time. Get results in seconds, even for large files.',
                color: 'from-rose-500 to-pink-600',
              },
              {
                icon: CheckCircle,
                title: 'No Signup',
                desc: 'No email, no account, no verification. Open the site and use any tool immediately. Zero friction, zero data collection.',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: FileText,
                title: 'No Watermarks',
                desc: 'Your processed files stay 100% clean. We never add branding, logos, or watermarks — unlike many "free" competitors.',
                color: 'from-violet-500 to-purple-600',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-[0_12px_30px_-8px_rgba(99,102,241,0.15)] transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon size={22} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#07122E] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#07122E] mb-4">
              How PDF Core Works
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Three simple steps. No account. No upload. Just results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '1',
                icon: Upload,
                title: 'Choose Your Tool',
                desc: 'Pick from 12+ PDF and image tools. Compress, merge, split, convert, sign, and more — all in one place.',
              },
              {
                num: '2',
                icon: Settings,
                title: 'Upload & Customize',
                desc: 'Drag & drop your file. Adjust settings if needed. Everything happens in your browser — files never leave your device.',
              },
              {
                num: '3',
                icon: Download,
                title: 'Download Instantly',
                desc: 'Get your processed file in seconds. High quality preserved, no watermarks added, ready to use immediately.',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent -translate-x-8 z-0" />
                )}

                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {step.num}
                    </div>
                    <step.icon size={24} className="text-[#4F46E5]" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-[#07122E] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ COMPARISON ═══════════ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#07122E] mb-4">
              PDF Core vs. Other PDF Tools
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              See why users are switching from iLovePDF, Smallpdf, and Adobe.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-[#07122E]">
                    Feature
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-[#4F46E5]">
                    PDF Core
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-600">
                    iLovePDF
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-600">
                    Smallpdf
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-bold text-slate-600">
                    Adobe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  { feature: 'Files stay on device', pdfcore: '✅', ilove: '❌', small: '❌', adobe: '❌' },
                  { feature: 'No signup required', pdfcore: '✅', ilove: '⚠️', small: '⚠️', adobe: '❌' },
                  { feature: 'Unlimited file size', pdfcore: '✅', ilove: '❌ 100MB', small: '❌ 5MB', adobe: '❌' },
                  { feature: 'No watermarks', pdfcore: '✅', ilove: '⚠️', small: '❌', adobe: '⚠️' },
                  { feature: 'No daily limits', pdfcore: '✅', ilove: '❌', small: '❌ 2/day', adobe: '❌' },
                  { feature: 'Free forever', pdfcore: '✅', ilove: '⚠️', small: '⚠️', adobe: '❌' },
                  { feature: 'Works offline', pdfcore: '✅', ilove: '❌', small: '❌', adobe: '❌' },
                  { feature: 'Fast (no upload wait)', pdfcore: '✅', ilove: '❌', small: '❌', adobe: '❌' },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-6 py-4 text-sm font-semibold text-[#07122E]">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-center text-lg">
                      <span className="font-bold text-emerald-600">{row.pdfcore}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {row.ilove}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {row.small}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {row.adobe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════ TOOL CATEGORIES ═══════════ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#07122E] mb-4">
              Complete PDF Toolkit
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Everything you need to work with PDFs — organized by category.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'Convert',
                desc: 'Transform files between formats',
                tools: [
                  { href: '/tools/pdf-to-image', name: 'PDF to Image' },
                  { href: '/tools/image-to-pdf', name: 'Image to PDF' },
                ],
              },
              {
                category: 'Optimize',
                desc: 'Reduce file sizes without quality loss',
                tools: [
                  { href: '/tools/compress-pdf', name: 'Compress PDF' },
                  { href: '/tools/compress-image', name: 'Compress Image' },
                ],
              },
              {
                category: 'Organize',
                desc: 'Combine and split PDF files',
                tools: [
                  { href: '/tools/merge-pdf', name: 'Merge PDF' },
                  { href: '/tools/split-pdf', name: 'Split PDF' },
                  { href: '/tools/organize-pdf', name: 'Organize PDF' },
                ],
              },
              {
                category: 'Edit',
                desc: 'Modify PDF pages and content',
                tools: [
                  { href: '/tools/rotate-pdf', name: 'Rotate PDF' },
                  { href: '/tools/add-watermark', name: 'Add Watermark' },
                ],
              },
              {
                category: 'Sign',
                desc: 'Digital signatures for documents',
                tools: [
                  { href: '/tools/sign-pdf', name: 'Sign PDF' },
                ],
              },
              {
                category: 'Security',
                desc: 'Password and encryption tools',
                tools: [
                  { href: '/tools/unlock-pdf', name: 'Unlock PDF' },
                ],
              },
            ].map((cat) => (
              <div
                key={cat.category}
                className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-bold text-[#07122E] mb-1">
                  {cat.category}
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">{cat.desc}</p>
                <ul className="space-y-2">
                  {cat.tools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="group flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[#07122E] hover:text-[#4F46E5] font-semibold text-sm transition-all"
                      >
                        {tool.name}
                        <ArrowRight
                          size={14}
                          className="text-[#4F46E5] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#07122E] mb-4 flex items-center justify-center gap-2">
              <HelpCircle size={32} className="text-[#4F46E5]" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              Everything you need to know about PDF Core.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Are PDF Core tools really free?',
                a: 'Yes, 100% free forever. All 12+ tools are completely free with no hidden costs, no premium tiers, no trials, and no daily usage limits. Use them as often as you want for personal or commercial purposes.',
              },
              {
                q: 'Do I need to create an account?',
                a: 'No account needed. Unlike iLovePDF, Smallpdf, and Adobe, PDF Core requires no signup, no email, and no verification. Just open the site and start using any tool immediately.',
              },
              {
                q: 'Are my files uploaded to your servers?',
                a: 'Never. All PDF Core tools run 100% in your browser using WebAssembly technology. Your files never leave your device — nothing is uploaded, stored, or transmitted to any server. This is the safest way to work with sensitive documents.',
              },
              {
                q: 'Is there a file size limit?',
                a: 'No file size limits. Unlike competitors that cap free users at 20-100MB, PDF Core has no restrictions because everything runs locally. Process PDFs of any size your device can handle.',
              },
              {
                q: 'Do you add watermarks to processed files?',
                a: 'Never. Your files stay clean — we never add watermarks, branding, or logos. This makes PDF Core different from many "free" competitors that force you to pay to remove watermarks.',
              },
              {
                q: 'Do PDF Core tools work on mobile?',
                a: 'Yes! All tools work perfectly on iPhone, Android, iPad, and any modern mobile browser. The interface is fully touch-optimized for mobile use.',
              },
              {
                q: 'Do the tools work offline?',
                a: 'After the first page load, PDF Core tools work even without an internet connection. Great for travelers, remote work, or privacy-conscious users who want to work offline.',
              },
              {
                q: 'How is PDF Core different from iLovePDF or Smallpdf?',
                a: 'The main differences: PDF Core is 100% browser-based (no uploads), has no signup requirements, no file size limits, no watermarks, no daily caps, and is completely free forever. iLovePDF and Smallpdf upload your files to servers, require accounts for full features, and add watermarks to free files.',
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all"
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

        {/* ═══════════ CTA ═══════════ */}
        <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative">
            <Sparkles size={32} className="mx-auto mb-3 text-yellow-300" />
            <h2 className="text-3xl font-extrabold mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 mb-6 text-lg max-w-xl mx-auto">
              Choose any tool above and start working with your PDFs in seconds.
              No signup. No upload. No watermarks. Just results.
            </p>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4F46E5] rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
            >
              Explore All Tools
              <ArrowRight size={20} />
            </a>
          </div>
        </section>

      </div>
    </article>
  );
}