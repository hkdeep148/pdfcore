'use client';

import { LucideIcon } from 'lucide-react';

export interface ToolbarAction {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Button label shown below icon */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional danger styling (red) */
  danger?: boolean;
}

interface MobileBottomToolbarProps {
  /** Array of toolbar actions (typically 3-5 items) */
  actions: ToolbarAction[];
}

export default function MobileBottomToolbar({ actions }: MobileBottomToolbarProps) {
  const gridCols =
    actions.length === 3
      ? 'grid-cols-3'
      : actions.length === 4
      ? 'grid-cols-4'
      : actions.length === 5
      ? 'grid-cols-5'
      : 'grid-cols-4';

  return (
    <div className="bg-white border-t border-[#E5E5E5] shrink-0">
      <div className={`grid ${gridCols} py-3 px-2`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex flex-col items-center justify-center gap-1.5 py-1 active:opacity-60 transition-opacity disabled:opacity-30"
            >
              <div className={action.danger ? 'text-[#EF4444]' : 'text-[#222222]'}>
                <Icon className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <span
                className={`text-[12px] font-medium ${
                  action.danger ? 'text-[#EF4444]' : 'text-[#222222]'
                }`}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}