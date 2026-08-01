'use client';

export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero Skeleton */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 md:pb-10 text-center">
        {/* Badge */}
        <div className="inline-block h-6 w-32 bg-[#E7ECF5] rounded-full animate-pulse mb-4" />

        {/* Title */}
        <div className="space-y-3 mb-4">
          <div className="h-12 md:h-14 bg-[#E7ECF5] rounded-lg animate-pulse mx-auto max-w-2xl" />
        </div>

        {/* Description */}
        <div className="h-5 bg-[#E7ECF5] rounded animate-pulse mx-auto max-w-lg mb-8" />

        {/* Search bar */}
        <div className="max-w-xl mx-auto h-14 bg-[#E7ECF5] rounded-xl animate-pulse" />
      </section>

      {/* Filters */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-6 md:pb-8">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-24 bg-[#E7ECF5] rounded-full animate-pulse" />
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-8 pb-14 md:pb-20">
        <div className="text-center mb-6">
          <div className="h-4 w-32 bg-[#E7ECF5] rounded animate-pulse mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#DDE5F0] rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 animate-pulse"
            >
              <div className="w-14 h-14 md:w-[60px] md:h-[60px] rounded-xl bg-[#E7ECF5] flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#E7ECF5] rounded" />
                <div className="h-3 bg-[#E7ECF5] rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}