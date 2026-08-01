'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'purple';
  label?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  label 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-4',
  };

  const colors = {
    blue: 'border-[#6366F1]/20 border-t-[#6366F1]',
    white: 'border-white/30 border-t-white',
    purple: 'border-[#8B5CF6]/20 border-t-[#8B5CF6]',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div 
        className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}
      />
      {label && (
        <span className="text-[13px] font-medium text-[#4B5874]">
          {label}
        </span>
      )}
    </div>
  );
}