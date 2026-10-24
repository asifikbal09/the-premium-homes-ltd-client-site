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

interface ProgressSpecsGridProps {
  location?: string;
  landArea?: string;
  totalShare?: string | number;
  buildingType?: string;
  buildingFace?: string;
  frontRoad?: string;
  passengerLift?: number | string;
  expectedHandover?: string;
  suiteSizes?: string;
  unitPerFloor?: number | string;
  developer?: string;
}

export function ProgressSpecsGrid({
  location,
  landArea,
  totalShare,
  buildingType,
  buildingFace,
  frontRoad,
  passengerLift,
  expectedHandover,
  suiteSizes,
  unitPerFloor,
  developer = "The Premium Homes Ltd.",
}: ProgressSpecsGridProps) {
  const specItems: SpecItem[] = [];

  if (location) {
    specItems.push({ icon: MapPin, label: "LOCATION", value: String(location) });
  }
  if (landArea) {
    specItems.push({ icon: Scan, label: "LAND AREA", value: String(landArea) });
  }
  if (totalShare !== undefined && totalShare !== null && String(totalShare) !== "") {
    specItems.push({ icon: Building2, label: "TOTAL UNITS / SHARE", value: String(totalShare) });
  }
  if (buildingType) {
    specItems.push({ icon: Building, label: "BUILDING TYPE", value: String(buildingType) });
  }
  if (buildingFace) {
    specItems.push({ icon: Layers, label: "BUILDING FACE", value: String(buildingFace) });
  }
  if (frontRoad) {
    specItems.push({ icon: Car, label: "FRONT ROAD", value: String(frontRoad) });
  }
  if (passengerLift !== undefined && passengerLift !== null && String(passengerLift) !== "") {
    specItems.push({ icon: Building2, label: "PASSENGER LIFT", value: String(passengerLift) });
  }
  if (unitPerFloor !== undefined && unitPerFloor !== null && String(unitPerFloor) !== "") {
    specItems.push({ icon: Layers, label: "UNIT PER FLOOR", value: String(unitPerFloor) });
  }
  if (suiteSizes) {
    specItems.push({ icon: Scan, label: "SUITE SIZES", value: String(suiteSizes) });
  }
  if (expectedHandover) {
    specItems.push({ icon: Calendar, label: "EXPECTED HANDOVER", value: String(expectedHandover) });
  }
  if (developer) {
    specItems.push({ icon: ShieldCheck, label: "DEVELOPER", value: String(developer) });
  }

  if (specItems.length === 0) return null;

  return (
    <section
      aria-label="Project Key Specifications"
      className="w-full bg-[#f6f5f0] py-10 sm:py-12 border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {specItems.map((item) => {
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
