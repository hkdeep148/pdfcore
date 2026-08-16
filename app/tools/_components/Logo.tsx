'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  textColor = 'text-[#07122E]' 
}: LogoProps) {
  // Size configurations
  const sizes = {
    sm: {
      wrapper: 'w-8 h-8',
      radius: 'rounded-lg',
      icon: 'w-4 h-4',
      dot: 'w-2.5 h-2.5',
      text: 'text-[15px]',
      gap: 'gap-2',
    },
    md: {
      wrapper: 'w-10 h-10',
      radius: 'rounded-xl',
      icon: 'w-5 h-5',
      dot: 'w-3 h-3',
      text: 'text-[18px]',
      gap: 'gap-2.5',
    },
    lg: {
      wrapper: 'w-14 h-14',
      radius: 'rounded-2xl',
      icon: 'w-7 h-7',
      dot: 'w-4 h-4',
      text: 'text-[24px]',
      gap: 'gap-3',
    },
  };

  const s = sizes[size];

  return (
    <div className={`inline-flex items-center ${s.gap} group`}>
      <div className={`relative ${s.wrapper} group-active:scale-95 transition-transform`}>
        {/* Main logo background */}
        <div className={`${s.wrapper} ${s.radius} bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(99,102,241,0.5)]`}>
          <svg 
            viewBox="0 0 24 24" 
            className={`${s.icon} text-white`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        {/* Glowing "core" dot */}
        <div className={`absolute -bottom-0.5 -right-0.5 ${s.dot} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full ring-2 ring-white shadow-[0_0_8px_rgba(251,146,60,0.6)]`} />
      </div>
      
      {showText && (
        <span className={`${s.text} font-bold ${textColor} tracking-tight`}>
          SpellPDF
        </span>
      )}
    </div>
  );
}