'use client';

interface MobileLoadingScreenProps {
  fadeOut: boolean;
  title?: string;
  subtitle?: string;
}

export default function MobileLoadingScreen({
  fadeOut,
  title = 'Preparing your files',
  subtitle = 'Setting things up...',
}: MobileLoadingScreenProps) {
  return (
    <div
      className={`flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex flex-col items-center gap-6">

          {/* Stacked File Cards */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200 shadow-md animate-stack-3" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-200 shadow-md animate-stack-2" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] shadow-[0_15px_40px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center animate-stack-1">
              <svg
                viewBox="0 0 24 24"
                className="w-11 h-11 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="text-center">
            <h2 className="text-[18px] font-extrabold text-[#07122E] mb-1.5 tracking-tight">
              {title}
            </h2>
            <p className="text-[12.5px] text-[#6B7280] font-medium">
              {subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] rounded-full animate-progress-slide" />
          </div>

        </div>
      </div>
    </div>
  );
}