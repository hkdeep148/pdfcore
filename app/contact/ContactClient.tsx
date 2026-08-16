'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  MessageCircle,
  Send,
  User,
  Type,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  HelpCircle,
  Zap,
  Bug,
  Lightbulb,
  Handshake,
  ArrowRight,
  Globe,
} from 'lucide-react';
import LandingNavbar from '../tools/_components/LandingNavbar';
import SimpleFooter from '../tools/_components/SimpleFooter';

// ============ FORM TYPES ============

type ContactReason =
  | 'general'
  | 'support'
  | 'feedback'
  | 'bug'
  | 'feature'
  | 'partnership';

interface ContactReasonOption {
  value: ContactReason;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
}

const contactReasons: ContactReasonOption[] = [
  {
    value: 'general',
    label: 'General Inquiry',
    icon: <HelpCircle size={18} />,
    description: 'Ask a general question',
    color: '#1E63FF',
    bgColor: '#DBEAFE',
  },
  {
    value: 'support',
    label: 'Technical Support',
    icon: <Zap size={18} />,
    description: 'Get help with a tool',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
  },
  {
    value: 'feedback',
    label: 'Feedback',
    icon: <MessageCircle size={18} />,
    description: 'Share your thoughts',
    color: '#16A34A',
    bgColor: '#DCFCE7',
  },
  {
    value: 'bug',
    label: 'Report a Bug',
    icon: <Bug size={18} />,
    description: 'Something not working?',
    color: '#DC2626',
    bgColor: '#FEE2E2',
  },
  {
    value: 'feature',
    label: 'Feature Request',
    icon: <Lightbulb size={18} />,
    description: 'Suggest an improvement',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    icon: <Handshake size={18} />,
    description: 'Business inquiries',
    color: '#EC4899',
    bgColor: '#FCE7F3',
  },
];

export default function ContactPage() {
  const [selectedReason, setSelectedReason] = useState<ContactReason>('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // For static export, we'll use mailto: as a fallback
      // You can replace this with an actual API endpoint or form service
      const subject = `[${contactReasons.find(r => r.value === selectedReason)?.label}] ${formData.subject}`;
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
      const mailtoLink = `mailto:support@spellpdf.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open email client
      window.location.href = mailtoLink;

      // Simulate success after short delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedReason('general');

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const selectedReasonData = contactReasons.find(r => r.value === selectedReason);

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <LandingNavbar />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3FF] via-white to-[#EFF6FF] opacity-70 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6366F1] opacity-[0.08] blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF1FF] text-[#1E63FF] text-[11px] md:text-[12px] font-bold uppercase tracking-wider mb-5">
              <Mail size={13} />
              <span>Get in Touch</span>
            </div>

            <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] leading-[1.1] sm:text-[44px] md:text-[54px] md:leading-tight font-extrabold tracking-tight text-[#07122E] mb-4">
              We&apos;d Love to{' '}
              <span className="bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>

            <p className="text-[15px] md:text-[17px] text-[#4B5874] font-medium max-w-2xl mx-auto leading-relaxed">
              Have a question, suggestion, or need help? Send us a message and we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ CONTACT INFO CARDS ============ */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            <InfoCard
              icon={<Mail size={22} />}
              title="Email Us"
              description="support@spellpdf.com"
              subtitle="We respond within 24 hours"
              color="#1E63FF"
              bgColor="#DBEAFE"
              href="mailto:support@spellpdf.com"
            />
            <InfoCard
              icon={<Clock size={22} />}
              title="Response Time"
              description="24 Hours"
              subtitle="Monday to Friday"
              color="#16A34A"
              bgColor="#DCFCE7"
            />
            <InfoCard
              icon={<Globe size={22} />}
              title="Global Support"
              description="Available Worldwide"
              subtitle="English support"
              color="#7C3AED"
              bgColor="#EDE9FE"
            />
          </div>
        </div>
      </section>

      {/* ============ MAIN FORM SECTION ============ */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 md:gap-12">
            {/* LEFT: What to Expect */}
              <div className="mb-6">
              <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC] rounded-2xl p-5 md:p-6">
                <h3 className="text-[15px] font-extrabold text-[#166534] mb-3 flex items-center gap-2">
                  <Lightbulb size={16} />
                  Before You Contact Us
                </h3>
                <p className="text-[13px] text-[#166534] mb-4 leading-relaxed">
                  You might find your answer faster in our FAQ or Help Center.
                </p>
                <div className="space-y-2">
                  <Link
                    href="/faq"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-[#16A34A]" />
                      <span className="text-[13px] font-bold text-[#07122E]">
                        Check our FAQ
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-[#8A93A3] group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    href="/security"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield size={16} className="text-[#16A34A]" />
                      <span className="text-[13px] font-bold text-[#07122E]">
                        Learn about security
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-[#8A93A3] group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div>
              <div className="bg-white border border-[#ECEDF3] rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_-10px_rgba(15,23,42,0.08)]">
                {/* Success Message */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-[#DCFCE7] to-[#BBF7D0] border border-[#86EFAC] rounded-xl flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-extrabold text-[#166534] mb-1">
                        Message sent successfully!
                      </p>
                      <p className="text-[12.5px] text-[#166534]">
                        Your email client should have opened. We&apos;ll respond within 24-48 hours.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13.5px] font-extrabold text-red-800 mb-1">
                        Something went wrong
                      </p>
                      <p className="text-[12.5px] text-red-700">
                        Please try again or email us directly at support@spellpdf.com
                      </p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Reason Selection */}
                  <div>
                    <label className="block text-[13px] font-bold text-[#07122E] mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {contactReasons.map((reason) => (
                        <button
                          key={reason.value}
                          type="button"
                          onClick={() => setSelectedReason(reason.value)}
                          className={`flex flex-col items-start gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                            selectedReason === reason.value
                              ? 'border-[#1E63FF] bg-[#EFF3FF]'
                              : 'border-[#E7ECF5] bg-white hover:border-[#C9D8F3]'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: selectedReason === reason.value ? reason.bgColor : '#F8FAFC',
                              color: selectedReason === reason.value ? reason.color : '#4B5874',
                            }}
                          >
                            {reason.icon}
                          </div>
                          <div>
                            <div className={`text-[12.5px] font-extrabold leading-tight ${
                              selectedReason === reason.value ? 'text-[#07122E]' : 'text-[#26324B]'
                            }`}>
                              {reason.label}
                            </div>
                            <div className="text-[10.5px] text-[#8A93A3] mt-0.5 leading-tight">
                              {reason.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Field */}
                  <FormField
                    label="Your Name"
                    icon={<User size={16} />}
                    error={errors.name}
                    required
                  >
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="John Doe"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border bg-white text-[14px] text-[#07122E] placeholder-[#8A93A3] focus:outline-none focus:ring-4 transition-all ${
                        errors.name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#E7ECF5] focus:border-[#1E63FF] focus:ring-[#1E63FF]/10'
                      }`}
                    />
                  </FormField>

                  {/* Email Field */}
                  <FormField
                    label="Email Address"
                    icon={<Mail size={16} />}
                    error={errors.email}
                    required
                  >
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border bg-white text-[14px] text-[#07122E] placeholder-[#8A93A3] focus:outline-none focus:ring-4 transition-all ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#E7ECF5] focus:border-[#1E63FF] focus:ring-[#1E63FF]/10'
                      }`}
                    />
                  </FormField>

                  {/* Subject Field */}
                  <FormField
                    label="Subject"
                    icon={<Type size={16} />}
                    error={errors.subject}
                    required
                  >
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Brief description of your inquiry"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border bg-white text-[14px] text-[#07122E] placeholder-[#8A93A3] focus:outline-none focus:ring-4 transition-all ${
                        errors.subject
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#E7ECF5] focus:border-[#1E63FF] focus:ring-[#1E63FF]/10'
                      }`}
                    />
                  </FormField>

                  {/* Message Field */}
                  <FormField
                    label="Your Message"
                    icon={<FileText size={16} />}
                    error={errors.message}
                    required
                  >
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border bg-white text-[14px] text-[#07122E] placeholder-[#8A93A3] focus:outline-none focus:ring-4 transition-all resize-none ${
                        errors.message
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                          : 'border-[#E7ECF5] focus:border-[#1E63FF] focus:ring-[#1E63FF]/10'
                      }`}
                    />
                    <div className="flex justify-end mt-1.5">
                      <span className="text-[11px] text-[#8A93A3]">
                        {formData.message.length} / 1000 characters
                      </span>
                    </div>
                  </FormField>

                  {/* Privacy Note */}
                  <div className="flex items-start gap-2.5 p-3 bg-[#F8FAFC] rounded-lg border border-[#ECEDF3]">
                    <Shield size={14} className="text-[#1E63FF] flex-shrink-0 mt-0.5" />
                    <p className="text-[11.5px] text-[#4B5874] leading-relaxed">
                      Your information is kept private and only used to respond to your inquiry. See our{' '}
                      <Link href="/privacy" className="text-[#1E63FF] font-semibold hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      for details.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[14.5px] font-bold shadow-[0_10px_24px_-6px_rgba(109,53,255,0.5)] hover:shadow-[0_14px_28px_-6px_rgba(109,53,255,0.6)] hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11.5px] text-[#8A93A3]">
                    By submitting, you agree to our{' '}
                    <Link href="/terms" className="text-[#1E63FF] font-semibold hover:underline">
                      Terms of Service
                    </Link>
                  </p>
                </form>
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

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  subtitle: string;
  color: string;
  bgColor: string;
  href?: string;
}

function InfoCard({ icon, title, description, subtitle, color, bgColor, href }: InfoCardProps) {
  const content = (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_8px_20px_-6px_rgba(15,23,42,0.08)] transition-all h-full">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <h3 className="text-[15px] font-extrabold text-[#07122E] mb-1">{title}</h3>
      <p className="text-[16px] font-bold text-[#26324B] mb-1">{description}</p>
      <p className="text-[12.5px] text-[#8A93A3]">{subtitle}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

interface ExpectationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ExpectationItem({ icon, title, description }: ExpectationItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center flex-shrink-0 text-[#1E63FF]">
        {icon}
      </div>
      <div>
        <h4 className="text-[14px] font-extrabold text-[#07122E] mb-0.5">{title}</h4>
        <p className="text-[12.5px] text-[#4B5874] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, icon, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-[#07122E] mb-2">
        {label}
        {required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-3.5 text-[#8A93A3] pointer-events-none z-10">
          {icon}
        </div>
        {children}
      </div>
      {error && (
        <p className="text-[12px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

interface AlternativeContactProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href: string;
  color: string;
  bgColor: string;
}

function AlternativeContact({ icon, title, description, action, href, color, bgColor }: AlternativeContactProps) {
  return (
    <a
      href={href}
      className="group bg-white rounded-2xl p-6 border border-[#ECEDF3] hover:border-[#C9D8F3] hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.1)] transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: bgColor, color: color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-extrabold text-[#07122E] mb-1">{title}</h3>
          <p className="text-[13px] text-[#4B5874] mb-2 leading-relaxed">{description}</p>
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#1E63FF]">
            <span>{action}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </a>
  );
}