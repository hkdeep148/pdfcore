'use client';

import { usePdfToImageContext } from '../_context/PdfToImageContext';

export default function PageGrid() {
  const { pages, selectedIds, toggleSelect, removePage, downloadOne, isProcessing } = usePdfToImageContext();

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
              <div className={`absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded border-2 flex items-center justify-center ${
                isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#D1D5DB]'
              }`}>
                {isSelected && (
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

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

              <div className="w-full aspect-[1/1.414] bg-[#F5F5FA] rounded-lg overflow-hidden flex items-center justify-center mt-6">
                <img
                  src={page.preview}
                  alt={`Page ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </div>

              <div className="mt-2">
                <p className="text-[10px] font-semibold text-[#5B6472] mb-1.5 text-center">
                  Page {page.pageIndex + 1}
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); downloadOne(page.id); }}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#10B981] text-white text-[10px] font-semibold disabled:opacity-40 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}