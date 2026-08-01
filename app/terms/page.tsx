'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Zap,
  Ban,
  Copyright,
  Mail,
  ArrowRight,
  Calendar,
  Globe,
  Gavel,
  UserCheck,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import LandingFooter from '../tools/_components/LandingFooter';

const LAST_UPDATED = 'January 2025';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <LandingNavbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-12 md:pb-16 bg-gradient-to-br from-[#F5F3FF] via-white to-[#EFF6FF]">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6366F1] opacity-[0.08] blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-5">
              <Scale size={13} />
              <span>Legal</span>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] sm:text-[40px] md:text-[52px] md:leading-tight font-extrabold tracking-tight text-[#07122E] mb-4">
              Terms of Service
            </h1>

            <p className="text-[15px] md:text-[17px] text-[#4B5874] font-medium max-w-2xl mx-auto leading-relaxed mb-6">
              Please read these terms carefully before using PDF Core. By using our Service, you agree to these terms.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E7ECF5] text-[13px] text-[#4B5874]">
              <Calendar size={14} className="text-[#1E63FF]" />
              <span>Last updated: <strong className="text-[#07122E]">{LAST_UPDATED}</strong></span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ QUICK SUMMARY ============ */}
      <section className="py-12 md:py-16">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* What You Can Do */}
            <div className="bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] border border-[#86EFAC] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                </div>
                <h2 className="text-[18px] font-extrabold text-[#166534] m-0">
                  What You Can Do
                </h2>
              </div>
              <ul className="space-y-2">
                {[
                  'Use all tools completely free',
                  'Process unlimited files',
                  'Use for personal or business',
                  'No account or signup needed',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-[13.5px] text-[#166534] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What You Can't Do */}
            <div className="bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] border border-[#FCA5A5] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                </div>
                <h2 className="text-[18px] font-extrabold text-[#991B1B] m-0">
                  What You Can&apos;t Do
                </h2>
              </div>
              <ul className="space-y-2">
                {[
                  'Process illegal content',
                  'Attempt to hack the service',
                  'Resell our tools as your own',
                  'Abuse or overload our servers',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle size={15} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                    <span className="text-[13.5px] text-[#991B1B] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          {/* Table of Contents */}
          <div className="mb-10 md:mb-14 bg-[#F8FAFC] border border-[#ECEDF3] rounded-2xl p-6">
            <h3 className="text-[15px] font-extrabold text-[#07122E] mb-4 flex items-center gap-2">
              <FileText size={16} className="text-[#1E63FF]" />
              Table of Contents
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { id: 'acceptance', label: '1. Acceptance of Terms' },
                { id: 'description', label: '2. Service Description' },
                { id: 'eligibility', label: '3. Eligibility' },
                { id: 'use', label: '4. Acceptable Use' },
                { id: 'prohibited', label: '5. Prohibited Activities' },
                { id: 'ip', label: '6. Intellectual Property' },
                { id: 'user-content', label: '7. Your Content' },
                { id: 'disclaimers', label: '8. Disclaimers' },
                { id: 'liability', label: '9. Limitation of Liability' },
                { id: 'indemnification', label: '10. Indemnification' },
                { id: 'termination', label: '11. Termination' },
                { id: 'third-party', label: '12. Third-Party Services' },
                { id: 'governing', label: '13. Governing Law' },
                { id: 'changes', label: '14. Changes to Terms' },
                { id: 'contact', label: '15. Contact Us' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-[13.5px] text-[#4B5874] hover:text-[#1E63FF] font-medium transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-10 md:space-y-14">
            {/* 1. Acceptance */}
            <Section id="acceptance" icon={<UserCheck size={24} />} title="1. Acceptance of Terms">
              <p>
                Welcome to <strong>PDF Core</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, PDF tools, and related services (collectively, the &quot;Service&quot;).
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms and our{' '}
                <Link href="/privacy" className="text-[#1E63FF] font-semibold hover:underline">
                  Privacy Policy
                </Link>. If you do not agree to these Terms, please do not use our Service.
              </p>
              <div className="bg-[#EFF6FF] border-l-4 border-[#1E63FF] p-4 rounded-r-lg mt-4">
                <p className="text-[14px] text-[#1E40AF] font-medium m-0">
                  <strong>Important:</strong> These Terms constitute a legally binding agreement between you and PDF Core. Please read them carefully.
                </p>
              </div>
            </Section>

            {/* 2. Description */}
            <Section id="description" icon={<FileText size={24} />} title="2. Service Description">
              <p>
                PDF Core provides a suite of free, browser-based tools for working with PDF files and images, including:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { name: 'Merge PDF', desc: 'Combine multiple PDFs' },
                  { name: 'Split PDF', desc: 'Split PDF into pages' },
                  { name: 'Compress PDF', desc: 'Reduce file size' },
                  { name: 'PDF to Image', desc: 'Extract as images' },
                  { name: 'Image to PDF', desc: 'Convert to PDF' },
                  { name: 'Rotate PDF', desc: 'Rotate pages' },
                  { name: 'Organize PDF', desc: 'Reorder pages' },
                  { name: 'Add Watermark', desc: 'Add text watermarks' },
                  { name: 'Unlock PDF', desc: 'Remove passwords' },
                  { name: 'Protect PDF', desc: 'Add passwords' },
                ].map((tool) => (
                  <div key={tool.name} className="flex items-start gap-2 p-3 bg-[#F8FAFC] rounded-lg">
                    <CheckCircle2 size={16} className="text-[#1E63FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[13.5px] font-bold text-[#07122E]">{tool.name}</div>
                      <div className="text-[12px] text-[#4B5874]">{tool.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4">
                All tools operate <strong>entirely within your browser</strong> — your files are never uploaded to our servers.
              </p>
            </Section>

            {/* 3. Eligibility */}
            <Section id="eligibility" icon={<UserCheck size={24} />} title="3. Eligibility">
              <p>
                To use PDF Core, you must:
              </p>
              <ul className="space-y-2 mt-4">
                <li>Be at least <strong>13 years of age</strong> (or the minimum age in your jurisdiction)</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using the Service under applicable laws</li>
                <li>Use the Service in compliance with these Terms and all applicable laws</li>
              </ul>
              <p className="mt-4">
                If you&apos;re using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </Section>

            {/* 4. Acceptable Use */}
            <Section id="use" icon={<CheckCircle2 size={24} />} title="4. Acceptable Use">
              <p>
                You may use PDF Core for any lawful purpose, including but not limited to:
              </p>
              <ul className="space-y-2 mt-4">
                <li><strong>Personal Use:</strong> Managing personal documents, receipts, photos, etc.</li>
                <li><strong>Business Use:</strong> Processing business documents, contracts, reports</li>
                <li><strong>Educational Use:</strong> Working with study materials, assignments, research</li>
                <li><strong>Professional Use:</strong> Handling client documents, legal papers, presentations</li>
              </ul>
              <p className="mt-4">
                All our tools are free with no restrictions on personal or commercial use.
              </p>
            </Section>

            {/* 5. Prohibited Activities */}
            <Section id="prohibited" icon={<Ban size={24} />} title="5. Prohibited Activities">
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  <p className="text-[14.5px] text-[#991B1B] font-semibold m-0">
                    You agree NOT to use PDF Core for any of the following purposes:
                  </p>
                </div>
              </div>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Illegal Activities
              </h3>
              <ul className="space-y-2">
                <li>Processing content that is illegal in your jurisdiction</li>
                <li>Distributing copyrighted material without permission</li>
                <li>Creating fraudulent or counterfeit documents</li>
                <li>Circumventing digital rights management (DRM) protections</li>
                <li>Any activity that violates local, state, national, or international laws</li>
              </ul>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Harmful Actions
              </h3>
              <ul className="space-y-2">
                <li>Attempting to hack, disrupt, or compromise the Service</li>
                <li>Using automated tools (bots, scrapers) to abuse the Service</li>
                <li>Overloading our infrastructure with excessive requests</li>
                <li>Introducing malware, viruses, or malicious code</li>
                <li>Attempting to reverse engineer or copy our code</li>
              </ul>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Commercial Restrictions
              </h3>
              <ul className="space-y-2">
                <li>Reselling our tools as your own service</li>
                <li>Rebranding or white-labeling without authorization</li>
                <li>Creating a competing service using our code</li>
                <li>Using our brand, logo, or trademarks without permission</li>
              </ul>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Harmful Content
              </h3>
              <ul className="space-y-2">
                <li>Processing content that promotes violence or hate speech</li>
                <li>Creating documents intended to defraud others</li>
                <li>Processing child exploitation material (immediate ban + reported)</li>
                <li>Any content that violates human rights or dignity</li>
              </ul>
            </Section>

            {/* 6. Intellectual Property */}
            <Section id="ip" icon={<Copyright size={24} />} title="6. Intellectual Property Rights">
              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-2 mb-3">
                Our Rights
              </h3>
              <p>
                The Service, including but not limited to its design, code, features, logos, and branding, is owned by PDF Core and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service for its intended purposes, subject to these Terms.
              </p>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Open Source Components
              </h3>
              <p>
                PDF Core uses various open-source libraries and components (like PDF.js, pdf-lib, Next.js, Framer Motion, and Lucide Icons), each governed by their respective licenses. We respect and comply with all applicable open-source licenses.
              </p>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Trademark Notice
              </h3>
              <p>
                &quot;PDF Core&quot; and our logo are trademarks. You may not use them without our prior written permission, except for factual reference (e.g., &quot;I use PDF Core&quot;).
              </p>
            </Section>

            {/* 7. User Content */}
            <Section id="user-content" icon={<Shield size={24} />} title="7. Your Content">
              <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <p className="text-[14.5px] text-[#166534] font-semibold m-0">
                    <strong>You retain full ownership</strong> of any files you process using PDF Core. We claim no rights whatsoever to your content.
                  </p>
                </div>
              </div>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                No File Storage
              </h3>
              <p>
                Because PDF Core processes files entirely in your browser:
              </p>
              <ul className="space-y-2">
                <li>We never see, access, or store your files</li>
                <li>We don&apos;t make copies of your content</li>
                <li>We can&apos;t and don&apos;t claim any license to your files</li>
                <li>Your data is 100% yours to control</li>
              </ul>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Your Responsibility
              </h3>
              <p>
                You are solely responsible for:
              </p>
              <ul className="space-y-2">
                <li>Ensuring you have the right to process any content you upload</li>
                <li>The legality and content of files you work with</li>
                <li>Maintaining your own backups of important files</li>
                <li>Any consequences resulting from your use of the Service</li>
              </ul>
            </Section>

            {/* 8. Disclaimers */}
            <Section id="disclaimers" icon={<AlertTriangle size={24} />} title="8. Disclaimers">
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-5 mb-4">
                <p className="text-[14px] text-[#92400E] font-semibold m-0 uppercase tracking-wide">
                  Please read this section carefully
                </p>
              </div>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                &quot;As Is&quot; Basis
              </h3>
              <p>
                THE SERVICE IS PROVIDED <strong>&quot;AS IS&quot;</strong> AND <strong>&quot;AS AVAILABLE&quot;</strong> WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="space-y-2">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties of non-infringement</li>
                <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy or reliability of results</li>
              </ul>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                No Guarantees
              </h3>
              <p>
                We do not guarantee that:
              </p>
              <ul className="space-y-2">
                <li>The Service will meet your specific requirements</li>
                <li>Processed files will be free of errors or defects</li>
                <li>The Service will be available at all times</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>
              <p className="mt-4">
                <strong>Always maintain backups</strong> of your original files before processing them with any tool.
              </p>
            </Section>

            {/* 9. Liability */}
            <Section id="liability" icon={<Scale size={24} />} title="9. Limitation of Liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, PDF CORE SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="space-y-2 mt-4">
                <li><strong>Indirect Damages:</strong> Any indirect, incidental, special, consequential, or punitive damages</li>
                <li><strong>Data Loss:</strong> Loss of data, files, or content resulting from use of the Service</li>
                <li><strong>Business Losses:</strong> Loss of profits, revenue, business opportunities, or goodwill</li>
                <li><strong>Service Interruption:</strong> Downtime, delays, or interruptions in the Service</li>
                <li><strong>Third-Party Actions:</strong> Actions or omissions of any third-party services or content</li>
              </ul>
              <p className="mt-4">
                Since PDF Core is a <strong>free service</strong>, our total liability to you for any claim arising from or related to the Service shall not exceed <strong>the amount you paid us in the past 12 months (which is $0)</strong>.
              </p>
              <p>
                Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above may not apply to you.
              </p>
            </Section>

            {/* 10. Indemnification */}
            <Section id="indemnification" icon={<Gavel size={24} />} title="10. Indemnification">
              <p>
                You agree to indemnify, defend, and hold harmless PDF Core, its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="space-y-2 mt-4">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights (including intellectual property or privacy rights)</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Any content or files you process using the Service</li>
              </ul>
            </Section>

            {/* 11. Termination */}
            <Section id="termination" icon={<Ban size={24} />} title="11. Termination">
              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-2 mb-3">
                Your Right to Stop Using
              </h3>
              <p>
                You may stop using PDF Core at any time — simply close your browser tab. Since we don&apos;t require accounts, there&apos;s nothing to cancel or delete.
              </p>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Our Right to Terminate Access
              </h3>
              <p>
                We reserve the right to:
              </p>
              <ul className="space-y-2">
                <li>Restrict or block access to users who violate these Terms</li>
                <li>Modify or discontinue any part of the Service without notice</li>
                <li>Refuse service to anyone for any lawful reason</li>
                <li>Terminate the Service entirely at our discretion</li>
              </ul>
              <p className="mt-4">
                Since PDF Core is a free service, we make no commitment to maintain it indefinitely, though we&apos;ll do our best to keep it running.
              </p>
            </Section>

            {/* 12. Third-Party */}
            <Section id="third-party" icon={<Globe size={24} />} title="12. Third-Party Services">
              <p>
                PDF Core may link to or integrate with third-party services, websites, or resources. We are not responsible for:
              </p>
              <ul className="space-y-2 mt-4">
                <li>The content, accuracy, or opinions of third-party websites</li>
                <li>The privacy practices of third-party services</li>
                <li>Any transactions or agreements with third parties</li>
                <li>Damages or losses caused by third-party services</li>
              </ul>
              <p className="mt-4">
                Your interactions with any third-party service are solely between you and that third party.
              </p>
            </Section>

            {/* 13. Governing Law */}
            <Section id="governing" icon={<Gavel size={24} />} title="13. Governing Law & Disputes">
              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-2 mb-3">
                Governing Law
              </h3>
              <p>
                These Terms shall be governed by and construed in accordance with the laws applicable in the jurisdiction where PDF Core operates, without regard to conflict of law principles.
              </p>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Dispute Resolution
              </h3>
              <p>
                Before pursuing formal legal action, we encourage you to contact us to resolve any disputes informally. Most issues can be resolved through open communication.
              </p>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Severability
              </h3>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions shall continue in full force and effect.
              </p>
            </Section>

            {/* 14. Changes */}
            <Section id="changes" icon={<Zap size={24} />} title="14. Changes to These Terms">
              <p>
                We reserve the right to modify these Terms at any time. When we make changes:
              </p>
              <ul className="space-y-2 mt-4">
                <li>The &quot;Last Updated&quot; date at the top will be revised</li>
                <li>Significant changes will be highlighted on our homepage</li>
                <li>Your continued use of the Service after changes constitutes acceptance</li>
                <li>Major changes may require you to actively re-accept the Terms</li>
              </ul>
              <p className="mt-4">
                We recommend reviewing these Terms periodically to stay informed of any updates.
              </p>
            </Section>

            {/* 15. Contact */}
            <Section id="contact" icon={<Mail size={24} />} title="15. Contact Us">
              <p>
                If you have questions, concerns, or feedback about these Terms of Service, please contact us:
              </p>

              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] rounded-xl p-5 mt-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-[#1E63FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-[#07122E] m-0 mb-1">
                      Legal Inquiries
                    </p>
                    <p className="text-[13.5px] text-[#4B5874] m-0">
                      Email: <a href="mailto:legal@pdfcore.com" className="text-[#1E63FF] hover:underline font-semibold">legal@pdfcore.com</a>
                    </p>
                    <p className="text-[13.5px] text-[#4B5874] m-0 mt-1">
                      We aim to respond to all inquiries within 5 business days.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6">
                For privacy-related questions, please see our{' '}
                <Link href="/privacy" className="text-[#1E63FF] font-semibold hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </Section>
          </div>
        </div>
      </section>

      {/* ============ ACKNOWLEDGMENT SECTION ============ */}
      <section className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#ECEDF3] text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-[#1E63FF]" />
            </div>
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#07122E] mb-2">
              By Using PDF Core
            </h3>
            <p className="text-[14px] text-[#4B5874] max-w-xl mx-auto">
              You acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our{' '}
              <Link href="/privacy" className="text-[#1E63FF] font-semibold hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-20">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="text-center bg-gradient-to-br from-[#1E63FF] via-[#4F46E5] to-[#6D35FF] rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(109,53,255,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-white tracking-tight mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-[14px] md:text-[16px] text-white/90 mb-6 max-w-lg mx-auto">
                Explore our free PDF tools and start managing your documents today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#1E63FF] text-[15px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                >
                  Explore All Tools
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white text-[15px] font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

/* ============ SUB COMPONENTS ============ */

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ id, icon, title, children }: SectionProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center flex-shrink-0 text-[#1E63FF]">
          {icon}
        </div>
        <h2 className="font-['Space_Grotesk',sans-serif] text-[22px] md:text-[28px] font-extrabold text-[#07122E] tracking-tight">
          {title}
        </h2>
      </div>
      <div className="text-[15px] md:text-[15.5px] text-[#4B5874] leading-relaxed space-y-4 pl-0 md:pl-14 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:list-inside [&_ol]:space-y-2 [&_strong]:text-[#07122E] [&_strong]:font-semibold [&_h3]:text-[#07122E] [&_a]:text-[#1E63FF] [&_a]:font-semibold [&_a:hover]:underline">
        {children}
      </div>
    </motion.div>
  );
}