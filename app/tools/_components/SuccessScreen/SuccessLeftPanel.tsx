'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import type { ToolBadge, SummaryCard, SecurityNote } from '../../_config/successScreenConfigs';

interface Props {
  toolBadge: ToolBadge;
  title: string;
  subtitle: string;
  variant?: 'success' | 'warning';
  summary: SummaryCard;
  security?: SecurityNote;
  reductionPercent?: number; // ⭐ NEW
}

export default function SuccessLeftPanel({
  toolBadge,
  title,
  subtitle,
  variant = 'success',
  summary,
  security,
  reductionPercent = 0,
}: Props) {
  const isWarning = variant === 'warning';

  return (
    <div className="flex flex-col h-full">
      {/* ═══════════ TOOL BADGE ═══════════ */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(99,102,241,0.4)]"
          style={{ background: toolBadge.bgColor, color: '#FFFFFF' }}
        >
          {toolBadge.icon}
        </div>
        <span className="text-[15px] font-bold text-slate-900">
          {toolBadge.name}
        </span>
      </div>

      {/* ═══════════ ICON + TITLE ═══════════ */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative">
          {/* Sparkles (only for success) */}
          {!isWarning && (
            <>
              <Sparkle color="#A78BFA" delay={0.3} top="-8px" left="-32px" />
              <Sparkle color="#F59E0B" delay={0.5} top="-16px" left="-16px" size={4} />
              <Sparkle color="#10B981" delay={0.7} top="-24px" left="16px" />
              <Sparkle color="#EF4444" delay={0.4} top="-8px" right="-32px" />
              <Sparkle color="#F59E0B" delay={0.6} top="-20px" right="-8px" size={4} />
              <Sparkle color="#8B5CF6" delay={0.2} top="16px" left="-40px" size={4} />
              <Sparkle color="#EC4899" delay={0.8} top="24px" right="-40px" size={4} />
              <Sparkle color="#0EA5E9" delay={0.5} top="48px" left="-24px" />
              <Sparkle color="#10B981" delay={0.9} top="48px" right="-24px" />
            </>
          )}

{/* ⭐ Icon: Warning / Progress Ring / Checkmark based on state */}
{isWarning ? (
  // ⚠️ Warning icon (for "Already Optimized" state)
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
    className="relative w-24 h-24 rounded-full flex items-center justify-center"
    style={{
      background: '#FEF3C7',
      boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.3)',
    }}
  >
    <AlertCircle size={44} style={{ color: '#F59E0B' }} strokeWidth={2.5} />
  </motion.div>
) : reductionPercent > 0 ? (
  // 📊 Animated progress ring (for Compress PDF / Compress Image with % saved)
  <CircularProgressIcon percent={reductionPercent} />
) : (
  // ✅ Green checkmark (for tools without percentages - Image to PDF, Merge, Split, etc.)
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
    className="relative w-24 h-24 rounded-full flex items-center justify-center"
    style={{
      background: '#D1FAE5',
      boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.3)',
    }}
  >
    <motion.svg
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      width="44"
      height="44"
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

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[24px] font-bold text-slate-900 mt-5"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[13px] text-slate-500 mt-1.5 max-w-[320px] leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* ═══════════ SUMMARY CARD ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg border border-slate-100 p-5 mb-4"
      >
        <h3 className="text-[14px] font-bold text-slate-900 mb-4">
          {summary.title}
        </h3>
        <div className="divide-y divide-slate-100">
          {summary.rows.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + idx * 0.05 }}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                  style={{ background: row.iconBg, color: row.iconColor }}
                >
                  {row.icon}
                </div>
                <span className="text-[13px] text-slate-600">{row.label}</span>
              </div>
              <span
                className="text-[13px] font-semibold tabular-nums text-right max-w-[60%] truncate"
                style={{ color: row.valueColor || '#111827' }}
              >
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════ SECURITY BANNER ═══════════ */}
      {security && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-lg p-4 flex items-start gap-3"
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
          }}
        >
          <div className="shrink-0 mt-0.5">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ background: '#D1FAE5' }}
            >
              <Shield size={15} style={{ color: '#10B981' }} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <div className="text-[13px] font-bold text-emerald-800">
              {security.title}
            </div>
            <div className="text-[11.5px] text-emerald-700 mt-1 leading-relaxed">
              {security.message}
            </div>
          </div>
        </motion.div>
      )}
    </div>
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
  size = 6,
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
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // ⭐ SYNC CONSTANTS — both animations use these exact values
  const ANIMATION_DURATION_MS = 1400;
  const ANIMATION_DELAY_MS = 400; // Wait for scale-in animation

  // ⭐ Compute offset based on target (not animated value)
  const targetOffset = circumference - (percent / 100) * circumference;

  // ⭐ Animate the counter WITH DELAY to sync with ring
  useEffect(() => {
    // Wait for the delay before starting counter
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      let rafId: number;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
        // Ease out cubic — SAME easing as ring animation
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
      <svg
        width={size}
        height={size}
        className="-rotate-90 absolute inset-0"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* ⭐ Animated progress arc — SAME timing as counter */}
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
            duration: ANIMATION_DURATION_MS / 1000, // Convert ms to seconds
            ease: [0.33, 1, 0.68, 1], // ⭐ Cubic bezier equivalent of "ease-out cubic"
            delay: ANIMATION_DELAY_MS / 1000,
          }}
        />
      </svg>

      {/* Center text: percentage + SAVED label */}
      <div className="relative flex flex-col items-center justify-center leading-none">
        <span className="text-[22px] font-bold text-slate-900 tabular-nums">
          {animatedPercent}%
        </span>
        <span className="text-[9px] font-bold text-slate-500 tracking-widest mt-0.5">
          SAVED
        </span>
      </div>
    </motion.div>
  );
}