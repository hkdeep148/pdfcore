'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  Heart,
  Globe,
  Sparkles,
  CheckCircle2,
  FileText,
  ArrowRight,
  Users,
  Download,
  Clock,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import SimpleFooter from '../tools/_components/SimpleFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden bg-gradient-to-br from-[#F8F9FB] via-[#F8F9FB] to-[#EEF0F8]">
      <LandingNavbar />

      {/* ============ HERO SECTION ============ */}
      <section className="pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-[0_2px_8px_-2px_rgba(99,102,241,0.15)] text-[#5B4EF5] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-5">
              <Heart size={13} />
              <span>Our Story</span>
            </div>

            <h1 className="text-[32px] leading-[1.1] sm:text-[44px] md:text-[58px] md:leading-tight font-extrabold tracking-tight text-[#07122E] max-w-4xl mx-auto">
              Making PDF Tools{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Free
              </span>
              <br />
              For Everyone
            </h1>

            <p className="mt-5 md:mt-6 text-[15px] md:text-[19px] text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              We believe powerful PDF tools shouldn&apos;t cost a fortune.
              That&apos;s why we built a complete PDF toolkit that&apos;s{' '}
              <span className="text-[#07122E] font-semibold">100% free, secure, and easy to use</span> — no signup required.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[15px] font-bold shadow-[0_12px_28px_-8px_rgba(109,53,255,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(109,53,255,0.6)] hover:scale-[1.02] transition-all"
              >
                Explore Free Tools
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatCard icon={<FileText size={24} />} value="10+" label="PDF Tools" color="#5B4EF5" bgColor="#EAF1FF" />
            <StatCard icon={<Users size={24} />} value="100%" label="Free Forever" color="#16A34A" bgColor="#DCFCE7" />
            <StatCard icon={<Lock size={24} />} value="100%" label="Secure & Private" color="#7C3AED" bgColor="#EDE9FE" />
            <StatCard icon={<Download size={24} />} value="No" label="Signup Required" color="#F97316" bgColor="#FFEDD5" />
          </div>
        </div>
      </section>

      {/* ============ MISSION SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="relative bg-white rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] border border-slate-100">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-[0_10px_30px_-8px_rgba(109,53,255,0.5)]">
                    <FileText className="w-10 h-10 text-white" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#07122E] mb-3">Free Forever</h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                    Every tool, every feature — completely free with no hidden costs, no premium tiers, no watermarks.
                  </p>
                  <div className="space-y-2.5">
                    {['No credit card required', 'No account signup', 'No file size limits*', 'Unlimited conversions'].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-[13.5px] text-slate-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-[#5B4EF5] text-[11px] font-bold uppercase tracking-wider mb-4">
                <Sparkles size={12} />
                <span>Our Mission</span>
              </div>
              <h2 className="text-[28px] md:text-[38px] font-extrabold text-[#07122E] tracking-tight leading-tight mb-5">
                Powerful PDF Tools,{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Zero Cost</span>
              </h2>
              <p className="text-[15px] md:text-[16px] text-slate-600 leading-relaxed mb-4">
                We noticed that most PDF tools online are either expensive, filled with ads, or lock essential features behind paywalls. We thought that&apos;s just not fair.
              </p>
              <p className="text-[15px] md:text-[16px] text-slate-600 leading-relaxed mb-6">
                So we built <span className="font-semibold text-[#07122E]">PDF Core</span> — a complete PDF toolkit that gives everyone free access to professional-grade PDF tools. Whether you&apos;re a student, freelancer, or business owner, our tools are here to help.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-[14px] font-extrabold text-[#07122E] mb-1">Lightning Fast</h4>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">Files processed instantly in your browser</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-[14px] font-extrabold text-[#07122E] mb-1">Ultra Secure</h4>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">Your files never leave your device</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ VALUES SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-[#5B4EF5] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Heart size={12} />
              <span>What We Stand For</span>
            </div>
            <h2 className="text-[28px] md:text-[38px] font-extrabold text-[#07122E] tracking-tight">Our Core Values</h2>
            <p className="mt-3 text-[14px] md:text-[16px] text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            <ValueCard icon={<Lock size={28} />} title="Privacy First" description="Your files are processed entirely in your browser. We never upload, store, or access your documents on our servers." color="#7C3AED" bgColor="#EDE9FE" />
            <ValueCard icon={<Heart size={28} />} title="Always Free" description="No premium tiers, no hidden costs, no watermarks. Every tool is completely free for everyone, forever." color="#EF4444" bgColor="#FEE2E2" />
            <ValueCard icon={<Zap size={28} />} title="Speed & Simplicity" description="Clean, intuitive tools that just work. No learning curve, no complicated settings — just fast results." color="#F59E0B" bgColor="#FEF3C7" />
            <ValueCard icon={<Globe size={28} />} title="Accessible to All" description="Works on any device — mobile, tablet, or desktop. No downloads, no installations, no signup required." color="#0EA5E9" bgColor="#E0F2FE" />
            <ValueCard icon={<Shield size={28} />} title="Trust & Transparency" description="We're upfront about how our tools work. No dark patterns, no data collection, no misleading claims." color="#16A34A" bgColor="#DCFCE7" />
            <ValueCard icon={<Sparkles size={28} />} title="Constant Innovation" description="We're always adding new tools and improving existing ones based on what our users actually need." color="#EC4899" bgColor="#FCE7F3" />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-[#5B4EF5] text-[11px] font-bold uppercase tracking-wider mb-3">
              <Clock size={12} />
              <span>How It Works</span>
            </div>
            <h2 className="text-[28px] md:text-[38px] font-extrabold text-[#07122E] tracking-tight">Simple. Fast. Free.</h2>
            <p className="mt-3 text-[14px] md:text-[16px] text-slate-600 max-w-2xl mx-auto">
              Get started in seconds — no account needed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <StepCard step="01" title="Choose a Tool" description="Pick from 10+ PDF tools — merge, split, compress, convert, rotate, and more." />
            <StepCard step="02" title="Upload Your File" description="Drag & drop your PDF or images. Everything happens in your browser — no upload to servers." />
            <StepCard step="03" title="Download Result" description="Get your processed file instantly. No watermarks, no limits, no signup required." />
          </div>
        </div>
      </section>

      {/* ============ WHY US SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-[28px] md:text-[38px] font-extrabold text-[#07122E] tracking-tight">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PDF Core</span>?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {[
              { title: '100% Free Forever', desc: 'No premium plans or hidden fees' },
              { title: 'No Signup Required', desc: 'Start using tools instantly' },
              { title: 'Privacy Focused', desc: 'Files processed locally when possible' },
              { title: 'No Watermarks', desc: 'Clean output every single time' },
              { title: 'Works Everywhere', desc: 'Any device, any browser, no downloads' },
              { title: 'Lightning Fast', desc: 'Optimized for speed and performance' },
              { title: 'Regular Updates', desc: 'New tools and improvements every month' },
              { title: 'No Ads Interruptions', desc: 'Clean, distraction-free interface' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-[0_8px_20px_-6px_rgba(15,23,42,0.08)] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-[15px] font-extrabold text-[#07122E] mb-1">{item.title}</h4>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1000px] mx-auto px-5 md:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 px-8 py-14 md:px-16 md:py-20 text-center shadow-[0_20px_60px_-15px_rgba(109,53,255,0.5)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-[28px] md:text-[42px] font-extrabold text-white leading-tight tracking-tight mb-4">
                Ready to Try Our Free Tools?
              </h2>
              <p className="text-[15px] md:text-[18px] text-white/90 mb-8 max-w-xl mx-auto">
                Join thousands of users who trust PDF Core for their daily PDF needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 text-[15px] font-bold shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all"
                >
                  Explore All Tools
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white text-[15px] font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Back to Home
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

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

function StatCard({ icon, value, label, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 text-center hover:shadow-[0_8px_20px_-6px_rgba(15,23,42,0.08)] transition-all">
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <div className="text-[22px] md:text-[28px] font-extrabold text-[#07122E] mb-1">{value}</div>
      <div className="text-[12px] md:text-[13px] font-semibold text-slate-600">{label}</div>
    </div>
  );
}

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

function ValueCard({ icon, title, description, color, bgColor }: ValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 md:p-7 border border-slate-100 hover:border-indigo-200 hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.12)] transition-all"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h3 className="text-[18px] font-extrabold text-[#07122E] mb-2">{title}</h3>
      <p className="text-[14px] text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="relative bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.1)] transition-all">
      <div className="text-[48px] font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 leading-none">
        {step}
      </div>
      <h3 className="text-[20px] font-extrabold text-[#07122E] mb-2">{title}</h3>
      <p className="text-[14px] text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}