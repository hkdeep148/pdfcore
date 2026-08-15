'use client';

export default function GenericToolLoading() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Top Navbar Skeleton */}
      <div className="border-b border-[#E7ECF5] px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#E7ECF5] animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#E7ECF5] rounded animate-pulse" />
            <div className="h-3 w-20 bg-[#E7ECF5] rounded animate-pulse" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 w-16 bg-[#E7ECF5] rounded animate-pulse" />
          ))}
        </div>
        <div className="h-10 w-32 bg-[#E7ECF5] rounded-lg animate-pulse" />
      </div>

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar Skeleton (Desktop) */}
        <aside className="hidden lg:block w-64 border-r border-[#E7ECF5] p-4 space-y-2 min-h-[calc(100vh-64px)]">
          <div className="h-4 w-20 bg-[#E7ECF5] rounded animate-pulse mb-4" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 bg-[#E7ECF5] rounded-lg animate-pulse"
            />
          ))}
        </aside>

        {/* Main Tool Area */}
        <main className="flex-1 p-4 md:p-8">
          {/* Upload Zone Skeleton */}
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-dashed border-[#E7ECF5] rounded-2xl p-12 md:p-20 flex flex-col items-center justify-center bg-[#F8FAFF] animate-pulse">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-[#E7ECF5] mb-6" />
              {/* Title */}
              <div className="h-6 w-64 bg-[#E7ECF5] rounded mb-3" />
              {/* Description */}
              <div className="h-4 w-80 bg-[#E7ECF5] rounded mb-6" />
              {/* Button */}
              <div className="h-12 w-40 bg-[#E7ECF5] rounded-lg" />
            </div>

            {/* Options Panel Skeleton */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-[#E7ECF5] rounded-xl p-4 animate-pulse"
                >
                  <div className="h-4 w-24 bg-[#E7ECF5] rounded mb-3" />
                  <div className="h-10 bg-[#E7ECF5] rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}