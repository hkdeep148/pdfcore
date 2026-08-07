'use client';

import type { CompressPdfItem } from '../../_types';
import { Check, X, Download, AlertCircle } from 'lucide-react';

interface PdfCardProps {
  item: CompressPdfItem;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function PdfCard({ item, onRemove, onDownload }: PdfCardProps) {
  const isDone = item.status === 'done';
  const isCompressing = item.status === 'compressing';
  const isError = item.status === 'error';
  const isPending = item.status === 'pending';
  const hasSaved = isDone && (item.savedPercent ?? 0) > 0;

  return (
    <div className="select-none w-full">
      <div className="relative bg-white rounded-xl p-3 border border-slate-200 hover:border-slate-300 transition-all">

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={isCompressing}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border border-slate-200 
                     flex items-center justify-center 
                     hover:bg-slate-50 hover:border-slate-300 transition-all z-10
                     disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Remove PDF"
        >
          <X size={12} className="text-slate-500" strokeWidth={2.5} />
        </button>

        {/* Status indicator (top-left) */}
        {isDone && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center z-10">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
        {isCompressing && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center z-10">
            <div className="w-2 h-2 rounded-full border border-white/30 border-t-white animate-spin" />
          </div>
        )}
        {isError && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center z-10">
            <AlertCircle size={11} className="text-white" strokeWidth={2.5} />
          </div>
        )}

        {/* PDF Preview Area */}
        <div
          className="relative w-full mx-auto rounded-lg overflow-hidden bg-slate-50 flex flex-col items-center justify-center"
          style={{ aspectRatio: '1/1.414' }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-12 h-12 ${isDone ? 'text-emerald-500' : isCompressing ? 'text-slate-900' : isError ? 'text-rose-500' : 'text-slate-400'} transition-colors`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>

          {/* Compression progress */}
          {isCompressing && (
            <div className="absolute inset-x-3 bottom-3">
              <div className="flex justify-between text-[10px] font-semibold text-slate-600 mb-1">
                <span>Compressing</span>
                <span>{item.progress ?? 0}%</span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 transition-all duration-300 ease-out"
                  style={{ width: `${item.progress ?? 0}%` }}
                />
              </div>
            </div>
          )}

          {/* Savings badge */}
          {isDone && hasSaved && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center py-1 rounded-md bg-emerald-500 text-white text-[10.5px] font-bold">
              -{item.savedPercent}% smaller
            </div>
          )}
          {isDone && !hasSaved && (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center py-1 rounded-md bg-slate-100 text-slate-600 text-[10.5px] font-semibold">
              Already optimized
            </div>
          )}
        </div>

        {/* File info */}
        <div className="mt-3">
          <p className="text-[12.5px] font-semibold text-slate-900 truncate mb-1" title={item.name}>
            {item.name}
          </p>

          {/* Size display */}
          {isDone && item.compressedSizeMB ? (
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 line-through">{item.originalSizeMB}</span>
              <span className="text-slate-300">→</span>
              <span className="font-semibold text-emerald-600">{item.compressedSizeMB}</span>
            </div>
          ) : isError ? (
            <div className="text-[11px] text-rose-600 truncate">
              {item.errorMessage || 'Compression failed'}
            </div>
          ) : (
            <div className="text-[11px] text-slate-500">
              {item.originalSizeMB}
            </div>
          )}
        </div>

        {/* Action button */}
        {isDone && (
          <button
            type="button"
            onClick={() => onDownload(item.id)}
            className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-900 text-white text-[11.5px] font-semibold hover:bg-slate-800 transition-colors"
          >
            <Download size={12} strokeWidth={2.5} />
            Download
          </button>
        )}

        {isPending && (
          <div className="mt-3 text-center text-[11px] text-slate-400 font-medium py-2">
            Ready to compress
          </div>
        )}
      </div>
    </div>
  );
}