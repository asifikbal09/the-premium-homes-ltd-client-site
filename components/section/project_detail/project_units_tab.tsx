"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bed,
  Bath,
  Columns,
  Compass,
  Maximize2,
  CheckCircle2,
} from "lucide-react";
import type { ProjectUnit } from "@/lib/projects";

interface ProjectUnitsTabProps {
  units: ProjectUnit[];
  projectName: string;
}

export function ProjectUnitsTab({ units, projectName }: ProjectUnitsTabProps) {
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  if (!units || units.length === 0) {
    return null;
  }

  const activeUnit = units[activeUnitIndex] || units[0];

  return (
    <div className="w-full bg-[#fbf9f5] border border-[#ede7dc] rounded-2xl sm:rounded-3xl p-5 sm:p-8">
      {/* Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#d0a65b] block">
            FLOOR PLANS & UNITS
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl text-[#044133] mt-1 font-medium">
            Available Floor Layouts
          </h3>
        </div>

        {/* Tab Buttons */}
        {units.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-full border border-[#e8e2d2] shadow-2xs">
            {units.map((unit, idx) => {
              const isSelected = idx === activeUnitIndex;
              return (
                <button
                  key={`${unit.id}-${idx}`}
                  type="button"
                  onClick={() => setActiveUnitIndex(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#044133] text-white shadow-xs"
                      : "text-gray-600 hover:text-[#044133]"
                  }`}
                >
                  {unit.unit_name || unit.name || `Unit ${idx + 1}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Grid: Details on Left, Floor Plan on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Specs column */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-xl sm:text-2xl font-medium text-[#14261f]">
                {activeUnit.unit_name || activeUnit.name || "Residence Layout"}
              </h4>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#044133]/10 text-[#044133] border border-[#044133]/20">
                <CheckCircle2 className="w-3 h-3 text-[#044133]" />
                {activeUnit.status || "Available"}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
              Thoughtfully laid out for optimal natural illumination, privacy,
              and expansive living proportions.
            </p>
          </div>

          {/* Unit Specs List */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Size */}
            <div className="bg-white border border-[#ede7dc] rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 font-medium">
                  Unit Size
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#14261f]">
                  {activeUnit.size ||
                    (activeUnit.sqft
                      ? `${activeUnit.sqft} sqft`
                      : "2,150 sqft")}
                </span>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="bg-white border border-[#ede7dc] rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
                <Bed className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 font-medium">
                  Bedrooms
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#14261f]">
                  {activeUnit.bedrooms
                    ? `${activeUnit.bedrooms} Beds`
                    : "3 Beds"}
                </span>
              </div>
            </div>

            {/* Bathrooms */}
            <div className="bg-white border border-[#ede7dc] rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
                <Bath className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 font-medium">
                  Bathrooms
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#14261f]">
                  {activeUnit.bathrooms
                    ? `${activeUnit.bathrooms} Baths`
                    : "3 Baths"}
                </span>
              </div>
            </div>

            {/* Balcony */}
            <div className="bg-white border border-[#ede7dc] rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
                <Columns className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 font-medium">
                  Balconies
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#14261f]">
                  {activeUnit.balcony
                    ? `${activeUnit.balcony} Balcony`
                    : "3 Balconies"}
                </span>
              </div>
            </div>

            {/* Facing (if available) */}
            {activeUnit.facing && (
              <div className="col-span-2 bg-white border border-[#ede7dc] rounded-xl p-3 sm:p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#044133]/5 text-[#044133] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-gray-400 font-medium">
                    Orientation
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-[#14261f]">
                    Facing {activeUnit.facing}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <a
              href="#contact"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#044133] text-white hover:bg-[#055b4b] text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
            >
              Inquire About {activeUnit.unit_name || "This Unit"}
            </a>
          </div>
        </div>

        {/* Floor Plan Visual Preview */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#ede7dc] p-3 shadow-inner flex items-center justify-center">
            {activeUnit.floor_plan_image ? (
              <Image
                src={activeUnit.floor_plan_image}
                alt={`${projectName} - ${activeUnit.unit_name || "Unit"} Floor Plan`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain p-2 hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Maximize2 className="w-10 h-10 mb-2 stroke-1 text-[#044133]/40" />
                <p className="text-xs uppercase tracking-wider font-medium">
                  Floor plan image available upon inquiry
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
