"use client";

import React from "react";
import {
  MapPin,
  Scan,
  Building2,
  Building,
  Car,
  Layers,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface SpecItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const SPEC_ITEMS: SpecItem[] = [
  {
    icon: MapPin,
    label: "LOCATION",
    value: "Bashundhara R/A, Dhaka",
  },
  {
    icon: Scan,
    label: "LAND AREA",
    value: "5.25 katha",
  },
  {
    icon: Building2,
    label: "TOTAL UNIT",
    value: "256",
  },
  {
    icon: Building,
    label: "TOTAL FLOORS",
    value: "G+10",
  },
  {
    icon: Car,
    label: "PARKING",
    value: "2 Levels",
  },
  {
    icon: Layers,
    label: "UNIT TYPE",
    value: "3 & 4 Bed, Penthouse",
  },
  {
    icon: ShieldCheck,
    label: "DEVELOPER",
    value: "The Premium Homes Ltd.",
  },
  {
    icon: Calendar,
    label: "EXPECTED HANDOVER",
    value: "Dec 2027",
  },
];

export function ProgressSpecsGrid() {
  return (
    <section
      aria-label="Project Key Specifications"
      className="w-full bg-[#f6f5f0] py-10 sm:py-12 border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {SPEC_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-black/5 hover:border-[#083327]/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#083327]/5 flex items-center justify-center text-[#083327]">
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  </div>

                  <span className="block text-[10px] sm:text-[11px] font-medium tracking-[0.14em] uppercase text-[#73827b] mt-3 sm:mt-4 font-sans">
                    {item.label}
                  </span>
                </div>

                <span className="block text-xs sm:text-sm md:text-[15px] font-semibold text-[#083327] mt-1 font-sans leading-snug">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
