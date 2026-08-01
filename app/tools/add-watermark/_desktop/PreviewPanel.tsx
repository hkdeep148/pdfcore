'use client';

import { useAddWatermarkContext } from '../_context/AddWatermarkContext';
import PageGrid from '../../_components/PageGrid';
import WatermarkPageCard from './WatermarkPageCard';

export default function PreviewPanel() {
  const { file, settings } = useAddWatermarkContext();

  if (!file) return null;

  const pages = file.allPagePreviews && file.allPagePreviews.length > 0
    ? file.allPagePreviews
    : [file.firstPagePreview];

  // Determine which pages will have watermark
  const willBeWatermarked = (pageIndex: number): boolean => {
    if (settings.applyToAllPages) return true;
    
    const pageStr = settings.specificPages || '';
    const parts = pageStr.split(',').map(s => s.trim()).filter(Boolean);
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && pageIndex + 1 >= start && pageIndex + 1 <= end) {
          return true;
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p === pageIndex + 1) return true;
      }
    }
    return false;
  };

  // ⭐ Transform pages into items with unique IDs (required by PageGrid)
  const items = pages.map((preview, index) => ({
    id: `page-${index}`,
    preview,
    pageIndex: index,
  }));

  const watermarkedCount = pages.filter((_, i) => willBeWatermarked(i)).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* File info header */}
      <div className="mb-4 px-4 py-3 bg-white rounded-xl border border-[#ECEDF3] flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-12 rounded-lg bg-[#FEE9E9] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#07122E] truncate">{file.name}</p>
          <p className="text-[11px] text-[#8A93A3]">
            {pages.length} {pages.length === 1 ? 'page' : 'pages'} • {file.sizeMB}
          </p>
        </div>
        
        {/* Watermark count badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[11.5px] font-bold text-[#166534]">Live Preview</span>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#8A93A3]">With watermark</p>
            <p className="text-[15px] font-bold text-[#4F46E5]">{watermarkedCount} / {pages.length}</p>
          </div>
        </div>
      </div>

      {/* ⭐ Grid using PageGrid component */}
      <PageGrid
        items={items}
        minCardSize={175}
        disableDrag
      >
        {(item) => (
          <WatermarkPageCard
            key={item.id}
            id={item.id}
            preview={item.preview}
            pageIndex={item.pageIndex}
            hasWatermark={willBeWatermarked(item.pageIndex)}
            settings={settings}
            pageWidth={file.pageWidth}
            pageHeight={file.pageHeight}
          />
        )}
      </PageGrid>
    </div>
  );
}