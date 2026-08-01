'use client';

export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-[#ECEDF3] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-4">
          <div className="h-4 w-64 bg-[#E7ECF5] rounded animate-pulse" />
        </div>
      </div>

      {/* Article Header Skeleton */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8">
        <div className="max-w-[900px] mx-auto">
          {/* Category badge */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-4 w-20 bg-[#E7ECF5] rounded animate-pulse" />
            <div className="h-6 w-24 bg-[#E7ECF5] rounded-full animate-pulse" />
          </div>

          {/* Title */}
          <div className="space-y-3 mb-5">
            <div className="h-12 md:h-14 bg-[#E7ECF5] rounded-lg animate-pulse" />
            <div className="h-12 md:h-14 bg-[#E7ECF5] rounded-lg animate-pulse w-4/5" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2 mb-6">
            <div className="h-5 bg-[#E7ECF5] rounded animate-pulse" />
            <div className="h-5 bg-[#E7ECF5] rounded animate-pulse w-5/6" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#ECEDF3]">
            <div className="w-8 h-8 rounded-full bg-[#E7ECF5] animate-pulse" />
            <div className="h-4 w-32 bg-[#E7ECF5] rounded animate-pulse" />
            <div className="h-4 w-24 bg-[#E7ECF5] rounded animate-pulse" />
          </div>

          {/* Cover image skeleton */}
          <div className="mt-8 rounded-2xl bg-[#E7ECF5] animate-pulse" style={{ aspectRatio: '1200 / 800' }} />
        </div>
      </div>

      {/* Article Body Skeleton */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="max-w-[900px] mx-auto">
          <div className="space-y-4">
            {/* Paragraph skeletons */}
            {[1, 2, 3, 4].map((section) => (
              <div key={section} className="space-y-3 pb-6">
                <div className="h-8 w-2/3 bg-[#E7ECF5] rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-[#E7ECF5] rounded animate-pulse" />
                  <div className="h-4 bg-[#E7ECF5] rounded animate-pulse" />
                  <div className="h-4 bg-[#E7ECF5] rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-[#E7ECF5] rounded animate-pulse w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}