'use client';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#ECEDF3] overflow-hidden animate-pulse">
      <div className="h-48 bg-[#E7ECF5]" />
      <div className="p-5 md:p-6 space-y-3">
        <div className="h-5 bg-[#E7ECF5] rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-[#E7ECF5] rounded" />
          <div className="h-3 bg-[#E7ECF5] rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}