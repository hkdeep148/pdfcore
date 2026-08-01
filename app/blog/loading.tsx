'use client';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Hero Skeleton */}
      <section className="pt-12 md:pt-20 pb-12 md:pb-16 bg-gradient-to-br from-[#F5F3FF] via-white to-[#EFF6FF]">
        <div className="max-w-[900px] mx-auto px-5 md:px-8 text-center">
          {/* Badge skeleton */}
          <div className="inline-block h-6 w-32 bg-[#E7ECF5] rounded-full animate-pulse mb-5" />

          {/* Title skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-12 md:h-16 bg-[#E7ECF5] rounded-lg animate-pulse mx-auto max-w-2xl" />
            <div className="h-8 md:h-10 bg-[#E7ECF5] rounded-lg animate-pulse mx-auto max-w-xl" />
          </div>

          {/* Description skeleton */}
          <div className="h-5 bg-[#E7ECF5] rounded animate-pulse mx-auto max-w-2xl mb-2" />
          <div className="h-5 bg-[#E7ECF5] rounded animate-pulse mx-auto max-w-lg mb-8" />

          {/* Search bar skeleton */}
          <div className="max-w-2xl mx-auto h-14 bg-[#E7ECF5] rounded-xl animate-pulse" />
        </div>
      </section>

      {/* Filters Skeleton */}
      <section className="py-6 md:py-8 border-y border-[#ECEDF3]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 h-10 w-24 bg-[#E7ECF5] rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid Skeleton */}
      <section className="py-10 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8">
          {/* Section title skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-[#E7ECF5] rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-[#E7ECF5] rounded animate-pulse" />
          </div>

          {/* Article cards skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#ECEDF3] overflow-hidden animate-pulse"
              >
                {/* Cover image skeleton */}
                <div className="h-48 bg-[#E7ECF5]" />

                {/* Content skeleton */}
                <div className="p-5 md:p-6 space-y-3">
                  <div className="h-5 bg-[#E7ECF5] rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-[#E7ECF5] rounded" />
                    <div className="h-3 bg-[#E7ECF5] rounded w-5/6" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <div className="h-3 bg-[#E7ECF5] rounded w-20" />
                    <div className="h-3 bg-[#E7ECF5] rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}