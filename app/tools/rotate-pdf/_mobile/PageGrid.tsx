'use client';

import { useRotatePdfContext } from '../_context/RotatePdfContext';

export default function PageGrid() {
  const { pages, selectedIds, toggleSelect, rotatePage, removePage } = useRotatePdfContext();

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-3">
      <div className="grid grid-cols-2 gap-3">
        {pages.map((page, index) => {
          const isSelected = selectedIds.has(page.id);
          return (
            <div
              key={page.id}
              onClick={() => toggleSelect(page.id)}
              className={`relative bg-white rounded-xl border-2 p-2 transition-all ${
                isSelected ? 'border-[#2563EB] shadow-md' : 'border-[#E8E8F0]'
              }`}
            >
              {/* Checkbox */}
              <div className={`absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded border-2 flex items-center justify-center ${
                isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#D1D5DB]'
              }`}>
                {isSelected && (
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center"
                aria-label="Remove"
              >
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Rotation badge */}
              {page.rotation !== 0 && (
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-[#F59E0B] text-white text-[9px] font-bold">
                  {page.rotation}°
                </div>
              )}

              {/* Preview */}
              <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded-lg overflow-hidden flex items-center justify-center mt-6">
                <img
                  src={page.preview}
                  alt={`Page ${index + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-300"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                  draggable={false}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="text-[10px] font-semibold text-[#5B6472]">
                  {index + 1}
                </span>
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); rotatePage(page.id, 'left'); }}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#5B6472] active:bg-[#EFF3FF]"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); rotatePage(page.id, 'right'); }}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#5B6472] active:bg-[#EFF3FF]"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}