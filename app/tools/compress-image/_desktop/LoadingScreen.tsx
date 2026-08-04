'use client';

interface LoadingScreenProps {
  fadeOut: boolean;
}

export default function LoadingScreen({ fadeOut }: LoadingScreenProps) {
  return (
    <div
      className={`hidden lg:flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">

          {/* Stacked File Cards Animation */}
          <div className="relative w-32 h-32">

            {/* Card 3 (back) */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200 shadow-lg animate-stack-3" />

            {/* Card 2 (middle) */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 border border-indigo-200 shadow-lg animate-stack-2" />

            {/* Card 1 (front) */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5DF6] shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] flex items-center justify-center animate-stack-1">
              <svg
                viewBox="0 0 24 24"
                className="w-14 h-14 text-white"
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
            <h2 className="text-[22px] font-extrabold text-[#07122E] mb-2 tracking-tight">
              Preparing your images
            </h2>
            <p className="text-[14px] text-[#6B7280] font-medium">
              Reading files and setting things up...
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-64 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] rounded-full animate-progress-slide" />
          </div>

        </div>
      </div>
    </div>
  );
}