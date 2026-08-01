'use client';

/* ============ SHIMMER EFFECT SKELETON ============ */
// Add this to your globals.css first (see below)

interface SkeletonCardProps {
  variant?: 'default' | 'tool' | 'list';
}

export default function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  // Default: Card with image (like blog post)
  if (variant === 'default') {
    return (
      <div className="bg-white rounded-2xl border border-[#ECEDF3] overflow-hidden">
        <div className="h-48 skeleton-shimmer" />
        <div className="p-5 md:p-6 space-y-3">
          <div className="h-5 skeleton-shimmer rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 skeleton-shimmer rounded" />
            <div className="h-3 skeleton-shimmer rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // Tool card: Matches your mobile tool list
  if (variant === 'tool') {
    return (
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/90">
        <div className="w-14 h-14 rounded-2xl skeleton-shimmer shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton-shimmer rounded w-2/3" />
          <div className="h-3 skeleton-shimmer rounded w-full" />
        </div>
        <div className="w-4 h-4 skeleton-shimmer rounded shrink-0" />
      </div>
    );
  }

  // List item: Simple horizontal
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 skeleton-shimmer rounded w-1/2" />
        <div className="h-2 skeleton-shimmer rounded w-3/4" />
      </div>
    </div>
  );
}