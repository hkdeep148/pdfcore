'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Server,
  FileText,
  Cookie,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Globe,
  Calendar,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import SimpleFooter from '../tools/_components/SimpleFooter';

const LAST_UPDATED = 'January 2025';

export default function PrivacyPolicyPage() {
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
              <Shield size={13} />
              <span>Legal</span>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] sm:text-[40px] md:text-[52px] md:leading-tight font-extrabold tracking-tight text-[#07122E] mb-4">
              Privacy Policy
            </h1>

            <p className="text-[15px] md:text-[17px] text-[#4B5874] font-medium max-w-2xl mx-auto leading-relaxed mb-6">
              Your privacy is our top priority. This page explains how SpellPDF handles your data — spoiler: we don&apos;t collect it.
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
          <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Lock className="w-6 h-6 text-[#1E63FF]" />
              </div>
              <div className="flex-1">
                <h2 className="text-[18px] md:text-[20px] font-extrabold text-[#07122E] mb-3">
                  Privacy at a Glance
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'We do NOT collect your files',
                    'We do NOT require signup',
                    'We do NOT store any documents',
                    'We do NOT sell your data',
                    'All processing happens in your browser',
                    'No tracking cookies used',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                      <span className="text-[13.5px] text-[#26324B] font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                { id: 'introduction', label: '1. Introduction' },
                { id: 'information', label: '2. Information We Collect' },
                { id: 'files', label: '3. How We Handle Your Files' },
                { id: 'cookies', label: '4. Cookies & Tracking' },
                { id: 'third-party', label: '5. Third-Party Services' },
                { id: 'security', label: '6. Data Security' },
                { id: 'children', label: '7. Children\'s Privacy' },
                { id: 'international', label: '8. International Users' },
                { id: 'rights', label: '9. Your Rights' },
                { id: 'changes', label: '10. Changes to This Policy' },
                { id: 'contact', label: '11. Contact Us' },
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
            {/* 1. Introduction */}
            <Section id="introduction" icon={<Eye size={24} />} title="1. Introduction">
              <p>
                Welcome to <strong>SpellPDF</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and being transparent about our practices.
              </p>
              <p>
                This Privacy Policy explains how SpellPDF handles information when you use our website and PDF tools (the &quot;Service&quot;). By using our Service, you agree to the practices described in this policy.
              </p>
              <div className="bg-[#EFF6FF] border-l-4 border-[#1E63FF] p-4 rounded-r-lg mt-4">
                <p className="text-[14px] text-[#1E40AF] font-medium m-0">
                  <strong>Key Point:</strong> SpellPDF is designed with privacy at its core. Your files are processed entirely within your web browser and are never uploaded to our servers.
                </p>
              </div>
            </Section>

            {/* 2. Information We Collect */}
            <Section id="information" icon={<FileText size={24} />} title="2. Information We Collect">
              <p>
                We&apos;ve designed SpellPDF to collect as little information as possible. Here&apos;s what we do and don&apos;t collect:
              </p>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Information We Do NOT Collect
              </h3>
              <ul className="space-y-2">
                <li><strong>Personal Information:</strong> We do not collect names, email addresses, phone numbers, or any other personal identifiers.</li>
                <li><strong>User Accounts:</strong> Our Service does not require registration or user accounts.</li>
                <li><strong>Your Files:</strong> PDF, image, and other files you process are never uploaded to our servers.</li>
                <li><strong>File Content:</strong> We cannot see, read, or access the content of any documents you work with.</li>
                <li><strong>Payment Information:</strong> All our tools are free, so we never process payments or store financial data.</li>
              </ul>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                Information Automatically Collected
              </h3>
              <p>
                Like most websites, our web server may automatically log basic technical information when you visit, including:
              </p>
              <ul className="space-y-2">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Approximate location (country/region only, from IP address)</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
              <p>
                This information is used solely for maintaining service quality, security, and improving user experience. It cannot be used to identify you personally.
              </p>
            </Section>

            {/* 3. How We Handle Your Files */}
            <Section id="files" icon={<Lock size={24} />} title="3. How We Handle Your Files">
              <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <p className="text-[14.5px] text-[#166534] font-semibold m-0">
                    <strong>100% Client-Side Processing:</strong> All PDF and image processing happens directly in your web browser using JavaScript. Your files never leave your device.
                  </p>
                </div>
              </div>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                How It Works
              </h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li>You select or drag-and-drop a file into our tool</li>
                <li>The file is loaded into your browser&apos;s memory (RAM)</li>
                <li>Our JavaScript code processes the file locally on your device</li>
                <li>The processed file is made available for download</li>
                <li>When you close the tab, all data is automatically cleared</li>
              </ol>

              <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
                What This Means for You
              </h3>
              <ul className="space-y-2">
                <li>We <strong>never see, access, or store</strong> your documents</li>
                <li>Your files are <strong>not transmitted</strong> over the internet to our servers</li>
                <li>Even our system administrators <strong>cannot access</strong> your files</li>
                <li>Files work even if your <strong>internet disconnects</strong> during processing</li>
                <li>Your <strong>confidential documents remain confidential</strong></li>
              </ul>
            </Section>

            {/* 4. Cookies & Tracking */}
            <Section id="cookies" icon={<Cookie size={24} />} title="4. Cookies & Tracking">
  <p>
    SpellPDF uses cookies and local storage to enhance your experience. You have full control over which cookies you accept through our cookie preferences panel.
  </p>

  <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
    Types of Cookies We Use
  </h3>
  
  <div className="space-y-3">
    <div className="bg-[#F8FAFC] border border-[#ECEDF3] rounded-lg p-4">
      <p className="font-bold text-[#07122E] mb-1">🔒 Necessary Cookies (Always Active)</p>
      <p className="text-[13.5px]">Essential for the website to function properly. These enable basic features like security, network management, and accessibility. They cannot be disabled.</p>
    </div>
    
    <div className="bg-[#F8FAFC] border border-[#ECEDF3] rounded-lg p-4">
      <p className="font-bold text-[#07122E] mb-1">⚙️ Functional Cookies (Optional)</p>
      <p className="text-[13.5px]">Remember your preferences and settings (like tool configurations, layout preferences, or theme choices) to provide a personalized experience.</p>
    </div>
    
    <div className="bg-[#F8FAFC] border border-[#ECEDF3] rounded-lg p-4">
      <p className="font-bold text-[#07122E] mb-1">📊 Analytics Cookies (Optional)</p>
      <p className="text-[13.5px]">Help us understand how visitors use our website through anonymous, aggregated statistics. No personal information or file content is collected.</p>
    </div>
  </div>

  <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
    Managing Your Cookie Preferences
  </h3>
  <p>
    When you first visit SpellPDF, you&apos;ll see a cookie consent banner where you can:
  </p>
  <ul className="space-y-2">
    <li><strong>Accept All:</strong> Enable all cookies including functional and analytics</li>
    <li><strong>Reject All:</strong> Only necessary cookies will be active</li>
    <li><strong>Customize:</strong> Choose which categories to enable</li>
  </ul>
  <p className="mt-4">
    You can change your preferences at any time by clearing your browser&apos;s local storage for this site, which will show the cookie banner again.
  </p>

  <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
    What We Don&apos;t Use
  </h3>
  <ul className="space-y-2">
    <li>❌ Third-party advertising cookies</li>
    <li>❌ Cross-site tracking pixels</li>
    <li>❌ Behavioral profiling</li>
    <li>❌ Marketing or retargeting cookies</li>
    <li>❌ Social media tracking</li>
  </ul>

  <h3 className="text-[16px] font-extrabold text-[#07122E] mt-6 mb-3">
    Analytics Details
  </h3>
  <p>
    If you enable analytics cookies, we may use privacy-respecting analytics tools that:
  </p>
  <ul className="space-y-2">
    <li>Do not collect personal information</li>
    <li>Do not track users across websites</li>
    <li>Only provide anonymous, aggregate statistics</li>
    <li>Never see your file contents or personal data</li>
  </ul>
</Section>

            {/* 5. Third-Party Services */}
            <Section id="third-party" icon={<Globe size={24} />} title="5. Third-Party Services">
              <p>
                SpellPDF uses several open-source libraries and services to provide our tools:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <ThirdPartyCard
                  name="PDF.js"
                  purpose="Rendering PDF previews in browser"
                  provider="Mozilla"
                />
                <ThirdPartyCard
                  name="pdf-lib"
                  purpose="Creating and modifying PDFs"
                  provider="Open Source"
                />
                <ThirdPartyCard
                  name="Next.js"
                  purpose="Website framework"
                  provider="Vercel"
                />
                <ThirdPartyCard
                  name="Framer Motion"
                  purpose="Animation library"
                  provider="Framer"
                />
              </div>

              <p className="mt-4">
                These are <strong>client-side libraries</strong> that run in your browser. They do not send your data to any third parties. Our website may be hosted on standard web infrastructure that may collect basic server logs for security purposes.
              </p>
            </Section>

            {/* 6. Data Security */}
            <Section id="security" icon={<Shield size={24} />} title="6. Data Security">
              <p>
                Since we don&apos;t collect or store your personal data or files, there&apos;s minimal risk of data breaches. However, we still take security seriously:
              </p>

              <ul className="space-y-2 mt-4">
                <li><strong>HTTPS Encryption:</strong> Our website uses SSL/TLS encryption to secure the connection between your browser and our servers.</li>
                <li><strong>Client-Side Processing:</strong> Your files never travel over the internet to be processed.</li>
                <li><strong>No Database:</strong> We don&apos;t have a user database that could be compromised.</li>
                <li><strong>Modern Web Standards:</strong> We follow current web security best practices.</li>
                <li><strong>Regular Updates:</strong> We keep our dependencies and libraries updated to patch security vulnerabilities.</li>
              </ul>
            </Section>

            {/* 7. Children's Privacy */}
            <Section id="children" icon={<AlertCircle size={24} />} title="7. Children's Privacy">
              <p>
                SpellPDF is suitable for users of all ages. Since we don&apos;t collect any personal information, we don&apos;t need to worry about age verification or parental consent requirements under laws like COPPA (Children&apos;s Online Privacy Protection Act) or GDPR-K.
              </p>
              <p>
                That said, we recommend that children under 13 use our Service with parental supervision, as with any online service.
              </p>
            </Section>

            {/* 8. International Users */}
            <Section id="international" icon={<Globe size={24} />} title="8. International Users">
              <p>
                SpellPDF is accessible worldwide. Since we don&apos;t collect personal data:
              </p>
              <ul className="space-y-2 mt-4">
                <li>We comply with <strong>GDPR</strong> (Europe) by design — no data collection means no data processing concerns.</li>
                <li>We comply with <strong>CCPA</strong> (California) — no personal information to sell or disclose.</li>
                <li>We comply with <strong>PIPEDA</strong> (Canada), <strong>LGPD</strong> (Brazil), and similar laws globally.</li>
                <li>Your files stay in your country because they never leave your device.</li>
              </ul>
            </Section>

            {/* 9. Your Rights */}
            <Section id="rights" icon={<CheckCircle2 size={24} />} title="9. Your Rights">
              <p>
                While we don&apos;t collect personal data that would trigger most privacy laws, you always have the following rights:
              </p>

              <ul className="space-y-2 mt-4">
                <li><strong>Right to Know:</strong> This policy explains what we do and don&apos;t collect.</li>
                <li><strong>Right to Access:</strong> Since we don&apos;t store your data, there&apos;s nothing to access.</li>
                <li><strong>Right to Delete:</strong> Simply closing your browser tab deletes any temporary data.</li>
                <li><strong>Right to Portability:</strong> Your files remain on your device, fully portable.</li>
                <li><strong>Right to Opt-Out:</strong> You can stop using our Service at any time.</li>
              </ul>
            </Section>

            {/* 10. Changes */}
            <Section id="changes" icon={<FileText size={24} />} title="10. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. When we do:
              </p>
              <ul className="space-y-2 mt-4">
                <li>The &quot;Last Updated&quot; date at the top of this page will change</li>
                <li>Significant changes will be highlighted on our homepage</li>
                <li>Your continued use of the Service after changes indicates acceptance</li>
              </ul>
              <p className="mt-4">
                We encourage you to review this policy periodically to stay informed about how we protect your privacy.
              </p>
            </Section>

            {/* 11. Contact */}
            <Section id="contact" icon={<Mail size={24} />} title="11. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please feel free to reach out:
              </p>

              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] rounded-xl p-5 mt-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-[#1E63FF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-[#07122E] m-0 mb-1">
                      Get in Touch
                    </p>
                    <p className="text-[13.5px] text-[#4B5874] m-0">
                      Email: <a href="mailto:privacy@spellpdf.com" className="text-[#1E63FF] hover:underline font-semibold">privacy@spellpdf.com</a>
                    </p>
                    <p className="text-[13.5px] text-[#4B5874] m-0 mt-1">
                      We typically respond within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="text-center bg-white rounded-3xl p-8 md:p-12 border border-[#ECEDF3] shadow-[0_8px_30px_-10px_rgba(15,23,42,0.1)]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E63FF] to-[#6D35FF] flex items-center justify-center mx-auto mb-5 shadow-[0_10px_30px_-8px_rgba(109,53,255,0.5)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight mb-3">
              Ready to Use Privacy-First PDF Tools?
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#4B5874] mb-6 max-w-lg mx-auto">
              Experience PDF tools that respect your privacy. No signup, no tracking, no data collection.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[15px] font-bold shadow-[0_12px_28px_-8px_rgba(109,53,255,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(109,53,255,0.6)] hover:scale-[1.02] transition-all"
            >
              Explore Free Tools
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <SimpleFooter />
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

interface ThirdPartyCardProps {
  name: string;
  purpose: string;
  provider: string;
}

function ThirdPartyCard({ name, purpose, provider }: ThirdPartyCardProps) {
  return (
    <div className="bg-white border border-[#ECEDF3] rounded-xl p-4 hover:border-[#C9D8F3] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Server className="w-4 h-4 text-[#1E63FF]" />
        <h4 className="text-[14px] font-extrabold text-[#07122E] m-0">{name}</h4>
      </div>
      <p className="text-[13px] text-[#4B5874] m-0 mb-1">{purpose}</p>
      <p className="text-[11.5px] text-[#8A93A3] m-0 font-semibold">Provider: {provider}</p>
    </div>
  );
}