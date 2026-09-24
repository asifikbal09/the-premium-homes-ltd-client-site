"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bed, Bath, Columns, Ruler, Eye, X } from "lucide-react";
import type { ProjectUnit } from "@/lib/projects";

interface UnitTypeSelectorProps {
  units: ProjectUnit[];
  projectName: string;
}

export function UnitTypeSelector({
  units,
  projectName,
}: UnitTypeSelectorProps) {
  const [selectedUnitForModal, setSelectedUnitForModal] =
    useState<ProjectUnit | null>(null);

  // If no units are returned by API, create representative sample units
  const displayUnits: ProjectUnit[] =
    units && units.length > 0
      ? units
      : [
          {
            id: 1,
            name: "Unit A - 3 Bedroom Luxury",
            unit_name: "Unit A",
            size: "2,150 sqft",
            sqft: 2150,
            bedrooms: 3,
            bathrooms: 3,
            balcony: 3,
            status: "Available",
            floor_plan_image: "/image/projects/projectsHero.png",
          },
          {
            id: 2,
            name: "Unit B - 4 Bedroom Penthouse",
            unit_name: "Unit B",
            size: "2,705 sqft",
            sqft: 2705,
            bedrooms: 4,
            bathrooms: 4,
            balcony: 4,
            status: "Available",
            floor_plan_image: "/image/projects/projectsHero.png",
          },
        ];

  return (
    <section
      aria-label="Choose Unit Type"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 lg:py-24 border-y border-[#ede7dc]"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            FLOOR PLANS & SUITES
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-1.5 tracking-tight">
            Choose Unit Type
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-2">
            Each residence is thoughtfully engineered for expansive natural
            light, ventilation, and premium spatial layout.
          </p>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayUnits.map((unit, idx) => {
            const formattedSqft =
              unit.size || (unit.sqft ? `${unit.sqft} sqft` : "2,150 sqft");
            const beds = unit.bedrooms || 3;
            const baths = unit.bathrooms || 3;
            const balconies = unit.balcony || 3;
            const imgSrc =
              unit.floor_plan_image ||
              (idx % 2 === 0
                ? "/image/projects/projectsHero.png"
                : "/image/prediction/predictionCard.png");

            return (
              <div
                key={unit.id || idx}
                className="group bg-white rounded-3xl overflow-hidden border border-[#ede7dc] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Visual / Render */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#f4efe8]">
                    <Image
                      src={imgSrc}
                      alt={`${projectName} - ${unit.unit_name || unit.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#044133] text-white shadow-sm">
                        {unit.status || "Available"}
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <h3 className="font-heading text-xl sm:text-2xl font-medium text-[#14261f]">
                      {unit.unit_name ||
                        unit.name ||
                        `Unit ${String.fromCharCode(65 + idx)}`}
                    </h3>
                    <p className="text-xs text-gray-500 font-light mt-1">
                      {unit.facing
                        ? `Facing ${unit.facing}`
                        : "Optimized spatial floor plan"}
                    </p>

                    {/* Specs Row */}
                    <div className="border-t border-[#ede7dc] mt-5 pt-4 grid grid-cols-4 gap-2 text-center text-gray-600">
                      {/* Bed */}
                      <div className="flex flex-col items-center">
                        <Bed className="w-4 h-4 text-[#044133]" />
                        <span className="text-[11px] font-semibold text-[#14261f] mt-1">
                          {beds}
                        </span>
                        <span className="text-[9px] uppercase text-gray-400">
                          Beds
                        </span>
                      </div>

                      {/* Bath */}
                      <div className="flex flex-col items-center">
                        <Bath className="w-4 h-4 text-[#044133]" />
                        <span className="text-[11px] font-semibold text-[#14261f] mt-1">
                          {baths}
                        </span>
                        <span className="text-[9px] uppercase text-gray-400">
                          Baths
                        </span>
                      </div>

                      {/* Balcony */}
                      <div className="flex flex-col items-center">
                        <Columns className="w-4 h-4 text-[#044133]" />
                        <span className="text-[11px] font-semibold text-[#14261f] mt-1">
                          {balconies}
                        </span>
                        <span className="text-[9px] uppercase text-gray-400">
                          Balcony
                        </span>
                      </div>

                      {/* Sqft */}
                      <div className="flex flex-col items-center">
                        <Ruler className="w-4 h-4 text-[#044133]" />
                        <span className="text-[11px] font-semibold text-[#14261f] mt-1 truncate max-w-[60px]">
                          {formattedSqft.replace(/sqft/i, "")}
                        </span>
                        <span className="text-[9px] uppercase text-gray-400">
                          Sqft
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Button */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedUnitForModal(unit)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[#044133]/30 text-[#044133] hover:bg-[#044133] hover:text-white transition-all text-xs font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Floor Plan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor Plan Modal */}
      {selectedUnitForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedUnitForModal(null)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ede7dc] pb-4 mb-4">
              <div>
                <h4 className="font-heading text-2xl text-[#044133] font-medium">
                  {selectedUnitForModal.unit_name || selectedUnitForModal.name}{" "}
                  Floor Plan
                </h4>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  {selectedUnitForModal.size ||
                    (selectedUnitForModal.sqft
                      ? `${selectedUnitForModal.sqft} sqft`
                      : "2,150 sqft")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUnitForModal(null)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] max-h-[500px] bg-[#fbf9f5] rounded-2xl overflow-hidden border border-[#ede7dc]">
              <Image
                src={
                  selectedUnitForModal.floor_plan_image ||
                  "/image/projects/projectsHero.png"
                }
                alt={`${projectName} - Floor Plan`}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-contain p-4"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
