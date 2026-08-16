'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Server,
  Eye,
  Wifi,
  WifiOff,
  CheckCircle2,
  XCircle,
  FileText,
  Cpu,
  Cloud,
  Download,
  Zap,
  Globe,
  Database,
  Fingerprint,
  UserX,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import SimpleFooter from '../tools/_components/SimpleFooter';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <LandingNavbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDF4] via-white to-[#EFF6FF] opacity-70 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#10B981] opacity-[0.06] blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-[1000px] mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DCFCE7] border border-transparent text-[#16A34A] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-5">
              <ShieldCheck size={13} />
              <span>Security & Privacy</span>
            </div>

            {/* Heading */}
            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] sm:text-[44px] md:text-[58px] md:leading-tight font-extrabold tracking-tight text-[#07122E] max-w-4xl mx-auto">
              Your Files Never Leave{' '}
              <span className="bg-gradient-to-r from-[#10B981] to-[#059669] bg-clip-text text-transparent">
                Your Device
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 md:mt-6 text-[15px] md:text-[19px] text-[#4B5874] font-medium max-w-2xl mx-auto leading-relaxed">
              SpellPDF is built with a <span className="text-[#07122E] font-semibold">privacy-first architecture</span>.
              All file processing happens in your browser — nothing is uploaded, stored, or seen by us.
            </p>

            {/* Trust badges */}
            <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <TrustBadge icon={<Lock size={14} />} label="100% Client-Side" />
              <TrustBadge icon={<UserX size={14} />} label="No Signup Required" />
              <TrustBadge icon={<Database size={14} />} label="Zero Data Storage" />
              <TrustBadge icon={<WifiOff size={14} />} label="Works Offline*" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CORE PROMISE ============ */}
      <section className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            <PromiseCard
              icon={<Shield size={28} />}
              title="No Uploads"
              description="Your files are never sent to our servers. They stay on your device the entire time."
              color="#16A34A"
              bgColor="#DCFCE7"
            />
            <PromiseCard
              icon={<Eye size={28} />}
              title="No Tracking"
              description="We don't watch what you do. No behavioral tracking, no marketing pixels, no profiling."
              color="#1E63FF"
              bgColor="#DBEAFE"
            />
            <PromiseCard
              icon={<Database size={28} />}
              title="No Storage"
              description="We have no database of your files or activity. There's literally nothing to leak."
              color="#7C3AED"
              bgColor="#EDE9FE"
            />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Cpu size={12} />
              <span>How It Works</span>
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-[#07122E] tracking-tight">
              Client-Side Processing Explained
            </h2>
            <p className="mt-3 text-[14px] md:text-[16px] text-[#4B5874] max-w-2xl mx-auto">
              Here&apos;s exactly what happens when you use our tools
            </p>
          </div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-12">
            {/* Traditional Way */}
            <div className="bg-white border-2 border-[#FEE2E2] rounded-2xl p-6 md:p-7">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                    Other PDF Tools
                  </div>
                  <div className="text-[16px] font-extrabold text-[#07122E]">Traditional Way</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  'Upload file to their server',
                  'File sits on their server',
                  'Server processes the file',
                  'Downloaded processed file',
                  'File may be stored for hours/days',
                  'Third parties may see your data',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FEE2E2] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#DC2626] mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-[13.5px] text-[#4B5874] font-medium">{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#FEE2E2] flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#DC2626]" />
                <span className="text-[12.5px] font-semibold text-[#DC2626]">
                  Your files leave your device
                </span>
              </div>
            </div>

            {/* SpellPDF Way */}
            <div className="bg-gradient-to-br from-[#F0FDF4] to-white border-2 border-[#BBF7D0] rounded-2xl p-6 md:p-7 relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-wider">
                Our Way
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">
                    SpellPDF
                  </div>
                  <div className="text-[16px] font-extrabold text-[#07122E]">Privacy-First Way</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  'Select file from your device',
                  'File loads into browser memory',
                  'Browser processes it locally',
                  'Download the result',
                  'Close tab = data cleared',
                  'No one ever sees your file',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#16A34A] mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-[13.5px] text-[#4B5874] font-medium">{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#BBF7D0] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#16A34A]" />
                <span className="text-[12.5px] font-semibold text-[#16A34A]">
                  Your files stay on your device
                </span>
              </div>
            </div>
          </div>

          {/* Visual Flow */}
          <div className="bg-white border border-[#ECEDF3] rounded-2xl p-6 md:p-10 shadow-[0_8px_30px_-10px_rgba(15,23,42,0.08)]">
            <h3 className="text-[18px] md:text-[20px] font-extrabold text-[#07122E] mb-8 text-center">
              The Technical Flow
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-2 items-center">
  <FlowStep
    icon={<FileText size={24} />}
    title="1. Select File"
    description="You choose a file from your device"
    color="#1E63FF"
    bgColor="#DBEAFE"
  />
  <FlowArrow />
  <FlowStep
    icon={<Cpu size={24} />}
    title="2. Browser Processing"
    description="JavaScript processes it in your browser"
    color="#7C3AED"
    bgColor="#EDE9FE"
  />
  <FlowArrow />
  <FlowStep
    icon={<Download size={24} />}
    title="3. Download Result"
    description="You get the processed file instantly"
    color="#16A34A"
    bgColor="#DCFCE7"
  />
</div>

            <div className="mt-8 pt-6 border-t border-[#ECEDF3] flex items-center justify-center gap-2 text-center">
              <WifiOff className="w-5 h-5 text-[#16A34A]" />
              <span className="text-[13.5px] font-semibold text-[#07122E]">
                No file transmission to our servers at any point
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECURITY FEATURES ============ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={12} />
              <span>Security Features</span>
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-[#07122E] tracking-tight">
              Built With Security in Mind
            </h2>
            <p className="mt-3 text-[14px] md:text-[16px] text-[#4B5874] max-w-2xl mx-auto">
              Multiple layers of protection to keep your data safe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Lock size={26} />}
              title="HTTPS Encryption"
              description="All connections to our site are secured with modern TLS/SSL encryption to prevent man-in-the-middle attacks."
              color="#1E63FF"
              bgColor="#DBEAFE"
            />
            <FeatureCard
              icon={<Cpu size={26} />}
              title="Local Processing"
              description="Files are processed by JavaScript running in your browser, never on external servers."
              color="#7C3AED"
              bgColor="#EDE9FE"
            />
            <FeatureCard
              icon={<Database size={26} />}
              title="No Database"
              description="We don't maintain a database of users or files. There's simply nothing to breach or steal."
              color="#EC4899"
              bgColor="#FCE7F3"
            />
            <FeatureCard
              icon={<Fingerprint size={26} />}
              title="No User Tracking"
              description="No cookies for tracking, no fingerprinting, no behavioral analysis of your usage."
              color="#F59E0B"
              bgColor="#FEF3C7"
            />
            <FeatureCard
              icon={<Rocket size={26} />}
              title="Modern Standards"
              description="Built with the latest web security standards, CSP headers, and secure coding practices."
              color="#10B981"
              bgColor="#D1FAE5"
            />
            <FeatureCard
              icon={<Server size={26} />}
              title="Static Deployment"
              description="Our site is served as static files with no server-side processing of user data."
              color="#0EA5E9"
              bgColor="#E0F2FE"
            />
          </div>
        </div>
      </section>

      {/* ============ TECHNICAL DETAILS ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Cpu size={12} />
              <span>Technical Details</span>
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-[#07122E] tracking-tight">
              For the Technically Curious
            </h2>
            <p className="mt-3 text-[14px] md:text-[16px] text-[#4B5874] max-w-2xl mx-auto">
              A closer look at the technology powering our privacy-first approach
            </p>
          </div>

          <div className="space-y-4">
            <TechDetail
              icon={<FileText size={22} />}
              title="How PDFs Are Processed"
              description="We use PDF.js (by Mozilla) to render PDFs and pdf-lib to modify them. Both libraries run entirely in your browser's JavaScript engine. Your PDF files are loaded into browser memory (RAM), processed locally, and the result is offered as a download. Nothing is transmitted."
            />
            <TechDetail
              icon={<Zap size={22} />}
              title="Why It's Fast"
              description="Modern browsers have incredibly powerful JavaScript engines. By processing files locally, we skip the roundtrip of uploading to a server, waiting for processing, and downloading. Your file doesn't have to travel across the internet — everything happens instantly on your device."
            />
            <TechDetail
              icon={<WifiOff size={22} />}
              title="Works Even Offline*"
              description="Once you've loaded a tool page, it can continue working even if your internet disconnects. The processing happens locally, so an internet connection isn't required after the initial page load. (*The page itself needs to load first, but processing is offline-capable.)"
            />
            <TechDetail
              icon={<Database size={22} />}
              title="Memory Management"
              description="Files are loaded into browser memory temporarily. When you close the tab, browsers automatically free up this memory. No traces of your file remain on your device or ours. Modern browsers also isolate memory between tabs for additional security."
            />
            <TechDetail
              icon={<KeyRound size={22} />}
              title="Password-Protected PDFs"
              description="When you use tools like Unlock PDF or Protect PDF, passwords are processed locally in your browser. We never see your passwords or the unlocked content. Everything happens on your device with your keys."
            />
            <TechDetail
              icon={<Globe size={22} />}
              title="Open Source Libraries"
              description="We use well-established, open-source libraries: PDF.js (Mozilla), pdf-lib, JSZip, and others. These have been audited by the community and are used by millions of applications worldwide. Their security is battle-tested."
            />
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DON'T DO ============ */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#DC2626] text-[11px] font-bold uppercase tracking-wider mb-3">
              <UserX size={12} />
              <span>What We Don&apos;t Do</span>
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-[#07122E] tracking-tight">
              Things We Refuse to Do
            </h2>
            <p className="mt-3 text-[14px] md:text-[16px] text-[#4B5874] max-w-2xl mx-auto">
              Because your privacy is non-negotiable
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {[
              { title: 'Upload your files to our servers', reason: 'They stay on your device' },
              { title: 'Store any of your documents', reason: 'We have no file storage system' },
              { title: 'Create user accounts', reason: 'No signup ever required' },
              { title: 'Track you across websites', reason: 'No tracking scripts used' },
              { title: 'Sell your data', reason: 'We don\'t have data to sell' },
              { title: 'Show intrusive ads', reason: 'No ad networks integrated' },
              { title: 'Use behavioral profiling', reason: 'We don\'t profile users' },
              { title: 'Share data with third parties', reason: 'Nothing to share' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-[#ECEDF3]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-extrabold text-[#07122E] mb-1 line-through decoration-[#DC2626] decoration-2">
                    {item.title}
                  </h4>
                  <p className="text-[13px] text-[#4B5874] leading-relaxed">
                    <span className="text-[#16A34A] font-semibold">✓</span> {item.reason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Shield size={12} />
              <span>Common Questions</span>
            </div>
            <h2 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-[#07122E] tracking-tight">
              Security FAQ
            </h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="How do I know my files are really not uploaded?"
              answer="You can verify this yourself! Open your browser's Developer Tools (F12) → Network tab. Then use any of our tools. You'll see that no file upload requests are made to our servers. All processing happens locally in your browser."
            />
            <FAQItem
              question="What if I'm processing confidential documents?"
              answer="SpellPDF is safe for confidential documents like contracts, tax returns, medical records, legal papers, and business documents. Since files never leave your device, they remain as confidential as they were on your computer."
            />
            <FAQItem
              question="Can hackers steal my files from your servers?"
              answer="No — because your files are never on our servers to begin with. There's no database to hack, no file storage to breach, no user accounts to compromise. It's the most secure architecture possible."
            />
            <FAQItem
              question="Does this work with password-protected PDFs?"
              answer="Yes! When you use tools like Unlock PDF, the password is processed entirely in your browser. We never see the password or the unlocked content. Everything happens on your device."
            />
            <FAQItem
              question="What about very large files?"
              answer="Since processing happens in your browser, the file size limit depends on your device's memory (RAM). Most modern devices can handle PDFs up to 100MB+ without issues. Larger files may take longer to process but will still work."
            />
            <FAQItem
              question="Do you comply with GDPR, HIPAA, or other regulations?"
              answer="Because we don't collect, process, or store personal data or files, most privacy regulations don't apply to us in the traditional sense. Users maintain full control over their data at all times, which aligns with the principles of GDPR, CCPA, and similar laws."
            />
          </div>
        </div>
      </section>

      {/* ============ VERIFY YOURSELF ============ */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC] rounded-2xl p-8 md:p-12">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Eye className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-[24px] md:text-[32px] font-extrabold text-[#07122E] tracking-tight mb-3">
                Don&apos;t Take Our Word For It — Verify Yourself!
              </h2>
              <p className="text-[14px] md:text-[16px] text-[#166534] max-w-2xl mx-auto">
                You can prove our privacy claims in 30 seconds
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <VerifyStep
                number="1"
                title="Open DevTools"
                description="Press F12 or Right-click → Inspect on any tool page"
              />
              <VerifyStep
                number="2"
                title="Go to Network Tab"
                description="Click the 'Network' tab in developer tools"
              />
              <VerifyStep
                number="3"
                title="Use Any Tool"
                description="Upload a file and see — no upload requests to our servers"
              />
            </div>

            <p className="text-center mt-8 text-[13px] text-[#166534] font-semibold">
              Complete transparency. Your privacy is provable.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] px-8 py-14 md:px-16 md:py-20 text-center shadow-[0_20px_60px_-15px_rgba(16,185,129,0.5)]">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-[28px] md:text-[42px] font-extrabold text-white leading-tight tracking-tight mb-4">
                Experience Truly Private PDF Tools
              </h2>
              <p className="text-[15px] md:text-[18px] text-white/90 mb-8 max-w-xl mx-auto">
                Join thousands who trust SpellPDF with their confidential documents.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#059669] text-[15px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                >
                  Try Our Tools
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white text-[15px] font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Read Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimpleFooter />
    </div>
  );
}

/* ============ SUB COMPONENTS ============ */

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E7ECF5] shadow-sm text-[12.5px] font-bold text-[#07122E]">
      <span className="text-[#16A34A]">{icon}</span>
      {label}
    </div>
  );
}

interface PromiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function PromiseCard({ icon, title, description, color, bgColor }: PromiseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-[#ECEDF3] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12)] transition-all"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h3 className="text-[17px] font-extrabold text-[#07122E] mb-2">{title}</h3>
      <p className="text-[13.5px] text-[#4B5874] leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface FlowStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function FlowStep({ icon, title, description, color, bgColor }: FlowStepProps) {
  return (
    <div className="flex flex-col items-center text-center px-2">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h4 className="text-[14px] font-extrabold text-[#07122E] mb-1">{title}</h4>
      <p className="text-[12px] text-[#4B5874] leading-relaxed">{description}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden md:flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#C0C8D8]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function FeatureCard({ icon, title, description, color, bgColor }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.1)] transition-all"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h3 className="text-[16px] font-extrabold text-[#07122E] mb-2">{title}</h3>
      <p className="text-[13.5px] text-[#4B5874] leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface TechDetailProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TechDetail({ icon, title, description }: TechDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-5 md:p-6 border border-[#ECEDF3] hover:border-[#C9D8F3] transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center flex-shrink-0 text-[#1E63FF]">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-extrabold text-[#07122E] mb-1.5">{title}</h3>
          <p className="text-[13.5px] text-[#4B5874] leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-5 md:p-6 border border-[#ECEDF3]"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#EAF1FF] flex items-center justify-center flex-shrink-0 text-[#1E63FF] font-extrabold text-[13px]">
          Q
        </div>
        <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#07122E] leading-snug flex-1">
          {question}
        </h3>
      </div>
      <div className="flex items-start gap-3 pl-10">
        <p className="text-[13.5px] md:text-[14px] text-[#4B5874] leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  );
}

interface VerifyStepProps {
  number: string;
  title: string;
  description: string;
}

function VerifyStep({ number, title, description }: VerifyStepProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#BBF7D0]">
      <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white text-[16px] font-extrabold flex items-center justify-center mb-3">
        {number}
      </div>
      <h4 className="text-[14px] font-extrabold text-[#07122E] mb-1">{title}</h4>
      <p className="text-[12.5px] text-[#4B5874] leading-relaxed">{description}</p>
    </div>
  );
}