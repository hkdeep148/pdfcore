'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface ProcessingScreenProps {
  /** Main title, e.g., "Compressing your PDF" */
  title: string;
  /** Subtitle for single file */
  subtitle?: string;
  /** Custom subtitle for multiple files */
  subtitleMultiple?: string;
  /** Number of files being processed */
  fileCount?: number;
  /** Custom icon SVG (defaults to PDF compress icon) */
  icon?: React.ReactNode;
  /** Gradient colors for the ring/icon */
  gradientFrom?: string;
  gradientTo?: string;
  /** Bottom security info text */
  infoText?: string;
  /** Duration for progress bar animation (in seconds) */
  progressDuration?: number;
}

export default function DesktopProcessingScreen({
  title,
  subtitle = 'Please wait...',
  subtitleMultiple,
  fileCount = 1,
  icon,
  gradientFrom = '#6366F1',
  gradientTo = '#8B5CF6',
  infoText = 'Your files are processed securely in your browser',
  progressDuration = 1.8,
}: ProcessingScreenProps) {
  const displaySubtitle =
    fileCount > 1 ? subtitleMultiple || `Processing ${fileCount} files...` : subtitle;

  // Animated percentage counter
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const duration = progressDuration * 1000;
    const start = Date.now();
    let raf = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setPercent(Math.round(eased * 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressDuration]);

return (
  /*
   * REMOVED: <LandingNavbar /> — was duplicating the navbar already
   * rendered by tools/layout.tsx (caused 2 stacked navbars).
   *
   * REMOVED: min-h-screen — the outer tools/layout.tsx already
   * provides min-h-screen. A second min-h-screen here would make
   * the total page = navbar (72px) + 100vh, forcing an unnecessary
   * scrollbar and empty space below the fold.
   *
   * min-h-[calc(100vh-72px)] fills the viewport minus the navbar
   * height so the loading card stays vertically centered without
   * causing any overflow.
   */
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-[#F8F9FB] via-[#F8F9FB] to-[#EEF0F8] flex flex-col"
  >
    <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_32px_rgba(15,23,42,0.06)] px-20 py-14 max-w-[560px] w-full text-center"
        >
          {/* ═════════ ANIMATED ICON WITH RING & SPARKLES ═════════ */}
          <div className="relative w-40 h-40 mx-auto mb-10">
            {/* Circular Progress Ring */}
            <svg
              className="absolute inset-0 -rotate-90"
              width="160"
              height="160"
              viewBox="0 0 160 160"
            >
              {/* Background track (light gray) */}
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="6"
              />
              {/* Animated progress arc */}
              <motion.circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="url(#processGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 72}
                initial={{ strokeDashoffset: 2 * Math.PI * 72 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: progressDuration, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={gradientFrom} />
                  <stop offset="100%" stopColor={gradientTo} />
                </linearGradient>
              </defs>
            </svg>

            {/* White circle background for icon */}
            <div className="absolute inset-6 rounded-full bg-white shadow-[0_2px_16px_rgba(99,102,241,0.15)] flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 0.92, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ color: gradientFrom }}
              >
                {icon || <DefaultPdfCompressIcon />}
              </motion.div>
            </div>

            {/* ═════════ DECORATIVE SPARKLES (diamonds) ═════════ */}
            {/* Top-left green */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="absolute top-6 -left-4 w-3 h-3 bg-emerald-400 rotate-45 rounded-sm"
            />
            {/* Top-right green */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              className="absolute top-4 -right-2 w-3 h-3 bg-emerald-400 rotate-45 rounded-sm"
            />
            {/* Middle-right yellow */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="absolute top-16 -right-6 w-3 h-3 bg-amber-400 rotate-45 rounded-sm"
            />
            {/* Bottom-left cyan */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
              className="absolute bottom-4 -left-2 w-3 h-3 bg-cyan-400 rotate-45 rounded-sm"
            />
            {/* Bottom-center cyan */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.0 }}
              className="absolute -bottom-2 left-20 w-3 h-3 bg-cyan-400 rotate-45 rounded-sm"
            />
            {/* Middle-left green (smaller) */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
              className="absolute top-24 -left-6 w-2.5 h-2.5 bg-emerald-300 rotate-45 rounded-sm"
            />
          </div>

          {/* ═════════ TITLE ═════════ */}
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[28px] font-bold text-slate-900 tracking-tight"
          >
            {title}
          </motion.h2>

          {/* ═════════ SUBTITLE ═════════ */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[15px] text-slate-500 mt-3"
          >
            {displaySubtitle}
          </motion.p>

          {/* ═════════ ANIMATED DOTS ═════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: gradientFrom }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* ═════════ PROGRESS BAR + PERCENTAGE ═════════ */}
          <div className="flex items-center gap-4 mt-7">
            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: progressDuration, ease: 'easeInOut' }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </div>
            <span
              className="text-[16px] font-bold tabular-nums min-w-[52px] text-right"
              style={{ color: gradientFrom }}
            >
              {percent}%
            </span>
          </div>

          {/* ═════════ SECURITY NOTE (green lock) ═════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-7"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[13px] text-slate-600 font-medium">
              {infoText}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT PDF COMPRESS ICON (page with inward arrows)
// ═══════════════════════════════════════════════════════════════
function DefaultPdfCompressIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* PDF page outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {/* Inward compress arrows in center */}
      <line x1="9" y1="13" x2="11" y2="15" />
      <line x1="11" y1="13" x2="9" y2="15" />
      <line x1="15" y1="13" x2="13" y2="15" />
      <line x1="13" y1="13" x2="15" y2="15" />
      {/* Vertical center line */}
      <line x1="12" y1="12" x2="12" y2="17" strokeWidth="1.5" />
    </svg>
  );
}