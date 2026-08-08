'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Clock } from 'lucide-react';

export default function ComingSoonClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-indigo-100 mb-6 relative"
        >
          <FileText size={48} className="text-indigo-600" strokeWidth={2} />
          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
            <Clock size={18} strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Create PDF
        </h1>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Coming Soon
        </div>

        {/* Description */}
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          We're working hard on bringing you a powerful PDF creator.
          <br />
          In the meantime, explore our other free tools below.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tools/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Browse All Tools
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-slate-500 mt-10">
          Want to be notified when this launches?{' '}
          <Link
            href="/contact/"
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
          >
            Contact us
          </Link>
        </p>
      </motion.div>
    </div>
  );
}