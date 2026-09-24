import React from "react";

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-white text-[#1f2723] animate-pulse">
      {/* 1. Hero Skeleton */}
      <div className="relative w-full min-h-[580px] sm:min-h-[680px] bg-[#071d18] flex flex-col justify-between p-6 sm:p-12">
        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between">
          <div className="h-8 w-36 bg-white/10 rounded-lg" />
          <div className="flex gap-3">
            <div className="h-9 w-28 bg-white/10 rounded-full" />
            <div className="h-9 w-24 bg-white/10 rounded-full" />
          </div>
        </div>

        <div className="max-w-[1440px] w-full mx-auto space-y-4 pb-8">
          <div className="h-4 w-32 bg-[#d0a65b]/20 rounded-md" />
          <div className="h-14 sm:h-20 w-80 sm:w-120 bg-white/15 rounded-2xl" />
          <div className="h-5 w-48 bg-white/10 rounded-md" />
        </div>
      </div>

      {/* 2. Project Overview Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-16 sm:py-20 space-y-12">
        <div className="flex justify-between items-center border-b border-[#ede7dc] pb-5">
          <div className="h-10 w-64 bg-[#ede7dc] rounded-lg" />
          <div className="h-6 w-48 bg-[#ede7dc] rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-5 aspect-[4/5] rounded-3xl bg-[#f4efe8] border border-[#ede7dc]" />
          <div className="lg:col-span-7 space-y-5">
            <div className="h-4 w-28 bg-[#ede7dc] rounded" />
            <div className="h-8 w-72 bg-[#ede7dc] rounded-lg" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#ede7dc] rounded" />
              <div className="h-4 w-11/12 bg-[#ede7dc] rounded" />
              <div className="h-4 w-4/5 bg-[#ede7dc] rounded" />
            </div>
            <div className="flex gap-4 pt-3">
              <div className="h-12 w-44 bg-[#ede7dc] rounded-full" />
              <div className="h-12 w-36 bg-[#ede7dc] rounded-full" />
            </div>
          </div>
        </div>

        {/* 4 Metrics Bar */}
        <div className="border-y border-[#ede7dc] py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ede7dc]" />
              <div className="space-y-1">
                <div className="h-3 w-16 bg-[#ede7dc] rounded" />
                <div className="h-4 w-24 bg-[#ede7dc] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Choose Unit Type Skeleton */}
      <div className="bg-[#fbf9f5] py-16 sm:py-20 border-y border-[#ede7dc]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 space-y-10">
          <div className="text-center max-w-sm mx-auto space-y-2">
            <div className="h-3 w-28 bg-[#ede7dc] rounded mx-auto" />
            <div className="h-8 w-60 bg-[#ede7dc] rounded-lg mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-[#ede7dc] p-0 space-y-4"
              >
                <div className="aspect-[16/10] bg-[#f4efe8]" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-36 bg-[#ede7dc] rounded" />
                  <div className="h-3 w-24 bg-[#ede7dc] rounded" />
                  <div className="border-t border-[#ede7dc] pt-4 grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-8 bg-[#ede7dc] rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Specification Skeleton */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-16 sm:py-20 space-y-10">
        <div className="h-10 w-52 bg-[#ede7dc] rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-6 aspect-[4/3] rounded-3xl bg-[#f4efe8] border border-[#ede7dc]" />
          <div className="lg:col-span-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between py-3 border-b border-[#ede7dc]"
              >
                <div className="h-4 w-32 bg-[#ede7dc] rounded" />
                <div className="h-4 w-28 bg-[#ede7dc] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
