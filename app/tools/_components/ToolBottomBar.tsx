'use client';

import { ReactNode } from 'react';

export interface ToolAction {
  icon: ReactNode;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface ToolBottomBarProps {
  actions: ToolAction[];
}

export default function ToolBottomBar({ actions }: ToolBottomBarProps) {
  return (
    <div className="flex items-center justify-around gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className={`flex items-center gap-3 text-left transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 group ${
            action.danger ? 'text-[#EF4444]' : 'text-[#26324B]'
          }`}
        >
          {/* Icon in outlined box */}
          <div className={`w-10 h-10 rounded-lg border bg-white flex items-center justify-center flex-shrink-0 transition-colors ${
            action.danger 
              ? 'border-[#FEE2E2] group-hover:border-[#FCA5A5]' 
              : 'border-[#E2E2EE] group-hover:border-[#C9D8F3]'
          }`}>
            <span className={`w-5 h-5 ${action.danger ? 'text-[#EF4444]' : 'text-[#26324B]'}`}>
              {action.icon}
            </span>
          </div>

          {/* Label + shortcut */}
          <div className="flex flex-col">
            <span className={`text-[13.5px] font-bold leading-tight ${
              action.danger ? 'text-[#EF4444]' : 'text-[#07122E]'
            }`}>
              {action.label}
            </span>
            {action.shortcut && (
              <span className="text-[11.5px] text-[#9AA2B1] font-medium leading-tight mt-0.5">
                {action.shortcut}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}