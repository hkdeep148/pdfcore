'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Download, Shield, Check } from 'lucide-react';

interface DesktopSuccessModalProps {
  /** Show/hide the modal */
  isOpen: boolean;
  /** Called when modal is dismissed */
  onClose: () => void;
  /** Called when "Start Over" button is clicked */
  onStartOver?: () => void;

  /** Main heading — "Images Compressed!" */
  title: string;
  /** Subtitle — "5 images ready to download" */
  subtitle: string;

  /** Optional stats to show (like size reduction) */
  stats?: {
    label: string;      // "Original"
    value: string;      // "4.8 MB"
    accent?: boolean;   // Highlight in indigo
  }[];

  /** Optional savings badge — "-50%" (used for animated ring) */
  savingsBadge?: string;

  /** Custom label for start over button */
  startOverLabel?: string;
  /** Custom label for done button */
  doneLabel?: string;

  /** Optional: show security banner */
  showSecurityBanner?: boolean;
}

export default function DesktopSuccessModal({
  isOpen,
  onClose,
  onStartOver,
  title,
  subtitle,
  stats,
  savingsBadge,
  startOverLabel = 'Start Over',
  doneLabel = 'Done',
  showSecurityBanner = true,
}: DesktopSuccessModalProps) {
  // Extract percentage from savingsBadge (e.g., "-50%" → 50)
  const percentMatch = savingsBadge?.match(/(\d+)/);
  const reductionPercent = percentMatch ? parseInt(percentMatch[1], 10) : 0;
  const hasRing = reductionPercent > 0;

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ═══════════ BACKDROP ═══════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* ═══════════ MODAL ═══════════ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_25px_80px_-15px_rgba(15,23,42,0.3)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors z-10"
                aria-label="Close"
              >
                <X size={16} strokeWidth={2.5} />
              </button>

              {/* ═══════════ SUCCESS ICON WITH SPARKLES ═══════════ */}
              <div className="pt-10 pb-4 flex flex-col items-center">
                <div className="relative">
                  {/* Sparkles */}
                  <Sparkle color="#A78BFA" delay={0.3} top="-6px" left="-28px" />
                  <Sparkle color="#F59E0B" delay={0.5} top="-14px" left="-10px" size={4} />
                  <Sparkle color="#10B981" delay={0.7} top="-22px" left="14px" />
                  <Sparkle color="#EF4444" delay={0.4} top="-6px" right="-28px" />
                  <Sparkle color="#F59E0B" delay={0.6} top="-18px" right="-6px" size={4} />
                  <Sparkle color="#8B5CF6" delay={0.2} top="14px" left="-36px" size={4} />
                  <Sparkle color="#EC4899" delay={0.8} top="22px" right="-36px" size={4} />
                  <Sparkle color="#0EA5E9" delay={0.5} top="42px" left="-20px" />
                  <Sparkle color="#10B981" delay={0.9} top="42px" right="-20px" />

                  {/* Animated Ring OR Green Check */}
                  {hasRing ? (
                    <CircularProgressIcon percent={reductionPercent} />
                  ) : (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                      className="relative w-20 h-20 rounded-full flex items-center justify-center"
                      style={{
                        background: '#D1FAE5',
                        boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        width="38"
                        height="38"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ═══════════ TEXT ═══════════ */}
              <div className="px-8 text-center mb-6">
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[22px] font-bold text-slate-900 mb-1.5 tracking-tight"
                >
                  {title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[13px] text-slate-500 leading-relaxed"
                >
                  {subtitle}
                </motion.p>
              </div>

              {/* ═══════════ STATS CARD ═══════════ */}
              {stats && stats.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mx-6 mb-4 bg-white rounded-xl border border-slate-100 p-4"
                >
                  <div className="divide-y divide-slate-100">
                    {stats.map((stat, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                      >
                        <span className="text-[13px] text-slate-600 font-medium">
                          {stat.label}
                        </span>
                        <span
                          className={`text-[13.5px] font-bold tabular-nums ${
                            stat.accent ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                    {savingsBadge && (
                      <div className="flex items-center justify-between py-2.5">
                        <span className="text-[13px] text-slate-600 font-medium">
                          You saved
                        </span>
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-md text-white"
                          style={{ background: '#10B981' }}
                        >
                          {savingsBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══════════ SECURITY BANNER ═══════════ */}
              {showSecurityBanner && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mx-6 mb-6 rounded-xl p-3.5 flex items-start gap-2.5"
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <div className="shrink-0 mt-0.5">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ background: '#D1FAE5' }}
                    >
                      <Shield size={13} style={{ color: '#10B981' }} strokeWidth={2.2} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[12.5px] font-bold text-emerald-800">
                      Files processed locally
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                      Your images never leave your browser.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════ ACTION BUTTONS ═══════════ */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="px-6 pb-6 flex items-center gap-3"
              >
                {onStartOver && (
                  <button
                    onClick={() => {
                      onStartOver();
                      onClose();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-[13px] transition-all"
                  >
                    <RotateCcw size={14} strokeWidth={2.5} />
                    {startOverLabel}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-[13px] shadow-md hover:shadow-lg transition-all"
                >
                  <Check size={14} strokeWidth={2.5} />
                  {doneLabel}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════
// SPARKLE (decorative floating dots)
// ═══════════════════════════════════════════════════════════════
function Sparkle({
  color,
  delay,
  top,
  left,
  right,
  size = 5,
}: {
  color: string;
  delay: number;
  top: string;
  left?: string;
  right?: string;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 1, 0.6], scale: [0, 1.2, 1, 1] }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      className="absolute rounded-sm rotate-45"
      style={{
        top,
        left,
        right,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// CIRCULAR PROGRESS ICON (animated ring + counter)
// ═══════════════════════════════════════════════════════════════
function CircularProgressIcon({ percent }: { percent: number }) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const ANIMATION_DURATION_MS = 1400;
  const ANIMATION_DELAY_MS = 400;

  const targetOffset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      let rafId: number;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedPercent(Math.round(eased * percent));

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }, ANIMATION_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [percent]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* SVG Ring */}
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{
            duration: ANIMATION_DURATION_MS / 1000,
            ease: [0.33, 1, 0.68, 1],
            delay: ANIMATION_DELAY_MS / 1000,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="relative flex flex-col items-center justify-center leading-none">
        <span className="text-[19px] font-bold text-slate-900 tabular-nums">
          {animatedPercent}%
        </span>
        <span className="text-[8px] font-bold text-slate-500 tracking-widest mt-0.5">
          SAVED
        </span>
      </div>
    </motion.div>
  );
}