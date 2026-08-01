'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cookie,
  Shield,
  Settings,
  X,
  Check,
  BarChart3,
  Wrench,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

// ============ TYPES ============

interface CookiePreferences {
  necessary: boolean;   // Always true, can't be disabled
  functional: boolean;  // For preferences, settings
  analytics: boolean;   // For usage analytics
}

const STORAGE_KEY = 'pdfcore_cookie_preferences';
const CONSENT_KEY = 'pdfcore_cookie_consent';

// Helper to get preferences from localStorage
function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Helper to save preferences
function savePreferences(prefs: CookiePreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    localStorage.setItem(CONSENT_KEY, 'true');
  } catch (err) {
    console.error('Failed to save cookie preferences:', err);
  }
}

// Check if user has given consent
function hasConsented(): boolean {
  if (typeof window === 'undefined') return true; // Don't show during SSR
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  } catch {
    return false;
  }
}

// ============ MAIN COMPONENT ============

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
  });

  // Check consent on mount
  useEffect(() => {
    // Small delay to prevent flash on page load
    const timer = setTimeout(() => {
      if (!hasConsented()) {
        setIsVisible(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Accept all cookies
  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
    };
    savePreferences(allAccepted);
    setIsVisible(false);
  };

  // Accept only necessary cookies
  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
    };
    savePreferences(onlyNecessary);
    setIsVisible(false);
  };

  // Save custom preferences
  const handleSavePreferences = () => {
    savePreferences(preferences);
    setIsVisible(false);
  };

  // Toggle a preference
  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] pointer-events-none"
        >
          {/* Backdrop (only when settings open) */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
              onClick={() => setShowSettings(false)}
            />
          )}

          {/* Cookie Banner or Settings Modal */}
          {!showSettings ? (
            // ============ COMPACT BANNER ============
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 pointer-events-auto"
            >
              <div className="max-w-[1200px] mx-auto">
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] border border-[#ECEDF3] overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                      {/* Icon */}
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                          <Cookie className="w-6 h-6 text-[#1E63FF]" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#07122E] mb-1 leading-tight">
                            We value your privacy
                          </h3>
                          <p className="text-[12.5px] md:text-[13px] text-[#4B5874] leading-relaxed">
                            We use cookies to improve your experience. Your files are always processed locally.{' '}
                            <Link
                              href="/privacy"
                              className="text-[#1E63FF] font-semibold hover:underline"
                            >
                              Learn more
                            </Link>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowSettings(true)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-[#E7ECF5] text-[#26324B] text-[12.5px] font-bold hover:border-[#C9D8F3] hover:text-[#1E63FF] transition-colors"
                        >
                          <Settings size={14} />
                          Customize
                        </button>
                        <button
                          type="button"
                          onClick={handleRejectAll}
                          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-white border border-[#E7ECF5] text-[#26324B] text-[12.5px] font-bold hover:border-[#C9D8F3] hover:text-[#1E63FF] transition-colors"
                        >
                          Reject All
                        </button>
                        <button
                          type="button"
                          onClick={handleAcceptAll}
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[12.5px] font-bold shadow-[0_6px_16px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5)] hover:scale-[1.02] transition-all"
                        >
                          <Check size={14} />
                          Accept All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // ============ SETTINGS MODAL ============
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] pointer-events-auto max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#ECEDF3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EFF3FF] to-[#DBEAFE] flex items-center justify-center">
                      <Cookie className="w-5 h-5 text-[#1E63FF]" />
                    </div>
                    <div>
                      <h2 className="text-[17px] font-extrabold text-[#07122E]">
                        Cookie Preferences
                      </h2>
                      <p className="text-[12px] text-[#8A93A3]">
                        Manage your cookie settings
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="w-9 h-9 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Close"
                  >
                    <X size={18} className="text-[#4B5874]" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 md:p-6">
                  {/* Info box */}
                  <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC] rounded-xl p-4 mb-5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Shield className="w-4 h-4 text-[#16A34A]" />
                    </div>
                    <div>
                      <p className="text-[12.5px] font-extrabold text-[#166534] mb-1">
                        Your files are always private
                      </p>
                      <p className="text-[11.5px] text-[#166534] leading-relaxed">
                        All PDF processing happens in your browser. Cookies only affect website preferences, not your file security.
                      </p>
                    </div>
                  </div>

                  {/* Cookie Categories */}
                  <div className="space-y-3">
                    {/* Necessary Cookies */}
                    <CookieCategory
                      icon={<Sparkles size={18} />}
                      title="Necessary"
                      description="Essential cookies for the website to function properly. These cannot be disabled."
                      enabled={preferences.necessary}
                      required={true}
                      color="#1E63FF"
                      bgColor="#DBEAFE"
                    />

                    {/* Functional Cookies */}
                    <CookieCategory
                      icon={<Wrench size={18} />}
                      title="Functional"
                      description="Remember your preferences and settings for a better experience."
                      enabled={preferences.functional}
                      onToggle={() => togglePreference('functional')}
                      color="#7C3AED"
                      bgColor="#EDE9FE"
                    />

                    {/* Analytics Cookies */}
                    <CookieCategory
                      icon={<BarChart3 size={18} />}
                      title="Analytics"
                      description="Anonymous usage statistics to help us improve our tools. No personal data is collected."
                      enabled={preferences.analytics}
                      onToggle={() => togglePreference('analytics')}
                      color="#16A34A"
                      bgColor="#DCFCE7"
                    />
                  </div>

                  {/* Learn more link */}
                  <div className="mt-5 pt-5 border-t border-[#ECEDF3] text-center">
                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#1E63FF] hover:underline"
                    >
                      Read our full Privacy Policy
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 md:p-6 border-t border-[#ECEDF3] bg-[#F8FAFC]">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <button
                      type="button"
                      onClick={handleRejectAll}
                      className="flex-1 px-4 py-3 rounded-lg bg-white border border-[#E7ECF5] text-[#26324B] text-[13px] font-bold hover:border-[#C9D8F3] transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="flex-1 px-4 py-3 rounded-lg bg-white border-2 border-[#1E63FF] text-[#1E63FF] text-[13px] font-bold hover:bg-[#EFF3FF] transition-colors"
                    >
                      Save Preferences
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white text-[13px] font-bold shadow-[0_6px_16px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5)] transition-all"
                    >
                      <Check size={14} />
                      Accept All
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============ COOKIE CATEGORY COMPONENT ============ */

interface CookieCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  required?: boolean;
  onToggle?: () => void;
  color: string;
  bgColor: string;
}

function CookieCategory({
  icon,
  title,
  description,
  enabled,
  required,
  onToggle,
  color,
  bgColor,
}: CookieCategoryProps) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${
      enabled ? 'border-[#C9D8F3] bg-[#F8FAFF]' : 'border-[#ECEDF3] bg-white'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: bgColor, color: color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[14px] font-extrabold text-[#07122E]">{title}</h3>
              {required && (
                <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#4B5874] text-[10px] font-bold uppercase tracking-wider">
                  Required
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#4B5874] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={onToggle}
          disabled={required}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
            enabled ? 'bg-[#1E63FF]' : 'bg-[#CBD5E1]'
          } ${required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label={`Toggle ${title} cookies`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
              enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

/* ============ EXPORT HELPER FUNCTIONS ============ */

// Use this in other components to check cookie preferences
export function useCookiePreferences(): CookiePreferences {
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    const stored = getStoredPreferences();
    if (stored) setPrefs(stored);
  }, []);

  return prefs;
}

// Function to show settings again (for footer link)
export function openCookieSettings() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pdfcore_cookie_consent');
  window.location.reload();
}