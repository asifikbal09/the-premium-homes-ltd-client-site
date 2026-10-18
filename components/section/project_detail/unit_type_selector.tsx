"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Home, Bath, Columns, Eye, X } from "lucide-react";
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
            name: "3 Bedrooms",
            unit_name: "3 Bedrooms",
            size: "1600 SQFT",
            sqft: 1600,
            bedrooms: 3,
            bathrooms: 3,
            balcony: 3,
            price: "80lac - 2cr BDT",
            status: "Available",
            floor_plan_image: "/image/projects/projectsHero.png",
          },
          {
            id: 2,
            name: "3 Bedrooms",
            unit_name: "3 Bedrooms",
            size: "1600 SQFT",
            sqft: 1600,
            bedrooms: 3,
            bathrooms: 3,
            balcony: 3,
            price: "80lac - 2cr BDT",
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
            UNIT TYPES
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-2 tracking-tight">
            Choose Unit Type
          </h2>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {displayUnits.map((unit, idx) => {
            const formattedSqft =
              unit.sqft ? `${unit.sqft} SQFT` : (unit.size?.toUpperCase() || "1600 SQFT");
            const beds = unit.bedrooms || 3;
            const baths = unit.bathrooms || 3;
            const balconies = unit.balcony || 3;
            const priceText = unit.price || "80lac - 2cr BDT";
            const imgSrc =
              unit.floor_plan_image ||
              (idx % 2 === 0
                ? "/image/projects/projectsHero.png"
                : "/image/prediction/predictionCard.png");

            return (
              <div
                key={unit.id || idx}
                className="bg-white border border-[#ede7dc] p-4 sm:p-5 flex flex-col justify-between rounded-none shadow-xs"
              >
                <div>
                  {/* Card Visual / Render */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#f4efe8] rounded-none">
                    <Image
                      src={imgSrc}
                      alt={`${projectName} - ${beds} Bedrooms`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center rounded-none transition-transform duration-700 hover:scale-102"
                    />
                  </div>

                  {/* Title, Static Description & Price */}
                  <div className="pt-5 pb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-2xl sm:text-3xl font-medium text-[#044133]">
                        {beds} Bedrooms
                      </h3>
                      <p className="text-xs text-gray-500 font-light mt-1.5 max-w-sm">
                        Canal Bay is a waterfront address in Lusail—designed for modern living
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-gray-400 font-light block">
                        Starting from
                      </span>
                      <span className="text-sm sm:text-base font-normal text-[#14261f] block mt-0.5">
                        {priceText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specs Row & Contact Now Button */}
                <div className="border-t border-[#ede7dc] pt-4 mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 sm:gap-6 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-gray-700">
                        {formattedSqft}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-gray-700">
                        {baths} BATHROOM
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Columns className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                      <span className="text-[11px] sm:text-xs font-medium uppercase tracking-wide text-gray-700">
                        {balconies} BALCONY
                      </span>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065e49] text-[#d0a65b] text-xs font-normal tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    CONTACT NOW
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor Plan Modal (available if needed) */}
      {selectedUnitForModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedUnitForModal(null)}
        >
          <div
            className="relative bg-white max-w-4xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden"
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
                      : "1,600 sqft")}
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

            <div className="relative w-full aspect-[4/3] max-h-[500px] bg-[#fbf9f5] overflow-hidden border border-[#ede7dc]">
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
