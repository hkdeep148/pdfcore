import { ReactNode } from 'react';

interface PanelSectionProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable section wrapper for right-panel options.
 * Provides consistent label + content spacing.
 */
export default function PanelSection({
  label,
  children,
  className = '',
}: PanelSectionProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="text-[12.5px] font-semibold text-[#26324B] mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}