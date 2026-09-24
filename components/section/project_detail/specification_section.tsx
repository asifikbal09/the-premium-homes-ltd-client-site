"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ProjectDetail } from "@/lib/projects";

interface SpecificationSectionProps {
  project: ProjectDetail;
}

export function SpecificationSection({ project }: SpecificationSectionProps) {
  const [activeFloor, setActiveFloor] = useState<string>("Typical Floor");

  // Get blueprint / floor plan image from units or project images
  const blueprintImage =
    project.units?.[0]?.floor_plan_image ||
    project.images?.[1] ||
    project.image ||
    "/image/projects/projectsHero.png";

  const specsList = [
    {
      label: "BUILDING TYPE",
      value: project.building_type || "G+9 Stories",
    },
    {
      label: "PLOT SIZE",
      value: project.plot_size ? `${project.plot_size} Katha` : "5 Katha",
    },
    {
      label: "UNIT PER FLOOR",
      value: project.unit_per_floor
        ? `${project.unit_per_floor} Unit`
        : "1 Unit",
    },
    {
      label: "FRONT ROAD",
      value: project.front_road
        ? `${project.front_road} Feet Wide`
        : "25 Feet Wide",
    },
    {
      label: "PASSENGER LIFT",
      value: project.passenger_lift
        ? `${project.passenger_lift} Passenger Lift`
        : "1 Passenger Lift",
    },
    {
      label: "POWER BACKUP",
      value: project.electricity_backup
        ? "100% Generator Backup"
        : "Full Standby Generator",
    },
    {
      label: "CAR PARKING",
      value: project.car_parking
        ? "Reserved Basement Parking"
        : "Designated Parking",
    },
  ];

  return (
    <section
      aria-label="Technical Specification"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-14 border-b border-[#ede7dc] pb-5">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
              ENGINEERING & STRUCTURE
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#044133] mt-1 tracking-tight">
              Specification
            </h2>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center gap-1.5 p-1 bg-[#fbf9f5] border border-[#ede7dc] rounded-full">
            <button
              type="button"
              onClick={() => setActiveFloor("Typical Floor")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeFloor === "Typical Floor"
                  ? "bg-[#044133] text-white shadow-xs"
                  : "text-gray-500 hover:text-[#044133]"
              }`}
            >
              Typical Floor
            </button>
            <button
              type="button"
              onClick={() => setActiveFloor("Ground Floor")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeFloor === "Ground Floor"
                  ? "bg-[#044133] text-white shadow-xs"
                  : "text-gray-500 hover:text-[#044133]"
              }`}
            >
              Ground Plan
            </button>
          </div>
        </div>

        {/* 2 Columns: Blueprint on Left, Table on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Architectural Drawing / Blueprint */}
          <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#fbf9f5] border border-[#ede7dc] p-4 flex items-center justify-center shadow-inner">
            <Image
              src={blueprintImage}
              alt={`${project.name} Architectural Blueprint`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4 hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Column: Spec Key-Value List */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="divide-y divide-[#ede7dc]">
              {specsList.map((item, idx) => (
                <div
                  key={idx}
                  className="py-4 sm:py-4.5 flex items-center justify-between text-xs sm:text-sm"
                >
                  <span className="font-semibold tracking-[0.14em] uppercase text-gray-500 text-[11px] sm:text-xs">
                    {item.label}
                  </span>
                  <span className="font-medium text-[#14261f] text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
