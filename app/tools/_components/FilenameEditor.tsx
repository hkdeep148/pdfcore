'use client';

import { useState } from 'react';

interface FilenameEditorProps {
  value: string;
  onChange: (value: string) => void;
  extension?: string;
  label?: string;
}

export default function FilenameEditor({
  value,
  onChange,
  extension = 'pdf',
  label = 'File name',
}: FilenameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mb-4">
      <label className="text-[12.5px] font-semibold text-[#26324B] mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#E2E2EE] bg-white">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditing(false);
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
            className="flex-1 min-w-0 text-[13px] font-medium text-[#26324B] outline-none bg-transparent"
          />
        ) : (
          <span className="flex-1 min-w-0 text-[13px] font-medium text-[#26324B] truncate">
            {value}.{extension}
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-[#8A93A3] hover:text-[#2563EB] transition-colors flex-shrink-0"
          aria-label="Edit filename"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}