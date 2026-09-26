"use client";

import React from "react";
import Image from "next/image";

interface FloorPlanSpec {
  label: string;
  value: string;
}

const FLOOR_PLAN_SPECS: FloorPlanSpec[] = [
  { label: "Building Type", value: "B+G+8" },
  { label: "Total Share", value: "16" },
  { label: "Unit Per Floor", value: "2" },
  { label: "Front Road", value: "25" },
  { label: "Passenger Lift", value: "1" },
  { label: "Electricity Backup", value: "Yes" },
  { label: "Car Parking", value: "Yes" },
];

export function ProgressFloorPlan() {
  return (
    <section
      aria-label="Spacious Floor Plans Section"
      className="w-full bg-[#ffffff] py-16 sm:py-20 md:py-24 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#083327] tracking-tight mb-8 sm:mb-12">
          Spacious Floor Plans
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Floor Plan Architecture Diagram */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl overflow-hidden bg-[#f4f5f6] p-4 sm:p-6 flex items-center justify-center border border-black/5 shadow-2xs group">
              <div className="relative w-full h-full">
                <Image
                  src="/image/progress/floor_plan.png"
                  alt="TPH Green Valley Spacious Floor Plans"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Column: Specification Details Table Card */}
          <div className="lg:col-span-6 flex">
            <div className="w-full border border-[#d0a65b]/40 rounded-2xl bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xs">
              <div className="divide-y divide-[#d0a65b]/25 flex-1 flex flex-col justify-between">
                {FLOOR_PLAN_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-3.5 sm:py-4 first:pt-0 last:pb-0"
                  >
                    <span className="font-heading text-base sm:text-lg md:text-xl font-normal text-[#083327]">
                      {spec.label}
                    </span>
                    <span className="font-heading text-base sm:text-lg md:text-xl font-normal text-[#083327] text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
