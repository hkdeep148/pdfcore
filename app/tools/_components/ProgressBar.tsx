'use client';

interface ProgressBarProps {
  /** 0 to 100 */
  progress: number;
  /** Show/hide the bar */
  show: boolean;
  /** Message to display */
  message?: string;
  /** Color variant */
  variant?: 'blue' | 'green';
}

export default function ProgressBar({
  progress,
  show,
  message = 'Processing...',
  variant = 'blue',
}: ProgressBarProps) {
  if (!show) return null;

  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-[#1E40AF]',
      bar: 'bg-[#2563EB]',
      spinner: 'border-[#2563EB]/30 border-t-[#2563EB]',
      barBg: 'bg-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-[#166534]',
      bar: 'bg-[#10B981]',
      spinner: 'border-[#10B981]/30 border-t-[#10B981]',
      barBg: 'bg-green-100',
    },
  }[variant];

  return (
    <div className={`mb-4 px-4 py-3 ${colors.bg} border ${colors.border} rounded-xl flex-shrink-0`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-4 h-4 rounded-full border-2 ${colors.spinner} animate-spin`} />
        <span className={`text-[13px] ${colors.text} font-semibold`}>{message}</span>
        <span className={`ml-auto text-[12px] ${colors.text} font-bold`}>{Math.round(progress)}%</span>
      </div>
      <div className={`w-full h-1.5 ${colors.barBg} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colors.bar} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}