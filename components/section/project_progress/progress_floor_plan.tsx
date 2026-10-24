"use client";

import React from "react";
import Image from "next/image";

interface FloorPlanSpec {
  label: string;
  value: string;
}

interface ProgressFloorPlanProps {
  buildingType?: string;
  totalShare?: string | number;
  unitPerFloor?: number | string;
  frontRoad?: string;
  passengerLift?: number | string;
  cargoLift?: number | string;
  carParking?: number | string;
  electricityBackup?: number | string;
  suiteSizes?: string;
  hotelOperation?: string;
  delivery?: string;
  image?: string;
  projectName?: string;
}

export function ProgressFloorPlan({
  buildingType,
  totalShare,
  unitPerFloor,
  frontRoad,
  passengerLift,
  cargoLift,
  carParking,
  electricityBackup,
  suiteSizes,
  hotelOperation,
  delivery,
  image,
  projectName = "Project",
}: ProgressFloorPlanProps) {
  const specs: FloorPlanSpec[] = [];

  if (buildingType) specs.push({ label: "Building Type", value: String(buildingType) });
  if (totalShare !== undefined && totalShare !== null && String(totalShare) !== "") {
    specs.push({ label: "Total Share", value: String(totalShare) });
  }
  if (unitPerFloor !== undefined && unitPerFloor !== null && String(unitPerFloor) !== "") {
    specs.push({ label: "Unit Per Floor", value: String(unitPerFloor) });
  }
  if (suiteSizes) specs.push({ label: "Suite / Unit Sizes", value: String(suiteSizes) });
  if (frontRoad) specs.push({ label: "Front Road", value: String(frontRoad) });
  if (passengerLift !== undefined && passengerLift !== null && String(passengerLift) !== "") {
    specs.push({ label: "Passenger Lift", value: String(passengerLift) });
  }
  if (cargoLift !== undefined && cargoLift !== null && Number(cargoLift) > 0) {
    specs.push({ label: "Cargo Lift", value: String(cargoLift) });
  }
  if (electricityBackup !== undefined && electricityBackup !== null && String(electricityBackup) !== "") {
    specs.push({
      label: "Electricity Backup",
      value: Number(electricityBackup) === 1 || String(electricityBackup).toLowerCase() === "yes" ? "100% Full Backup" : String(electricityBackup),
    });
  }
  if (carParking !== undefined && carParking !== null && String(carParking) !== "") {
    specs.push({
      label: "Car Parking",
      value: Number(carParking) === 1 || String(carParking).toLowerCase() === "yes" ? "Designated Parking" : String(carParking),
    });
  }
  if (hotelOperation) specs.push({ label: "Hospitality / Operation", value: String(hotelOperation) });
  if (delivery) specs.push({ label: "Delivery Standard", value: String(delivery) });

  if (specs.length === 0) return null;

  return (
    <section
      aria-label="Spacious Floor Plans Section"
      className="w-full bg-[#ffffff] py-16 sm:py-20 md:py-24 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#083327] tracking-tight mb-8 sm:mb-12">
          Architecture & Unit Specifications
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Floor Plan Architecture Diagram */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl overflow-hidden bg-[#f4f5f6] p-4 sm:p-6 flex items-center justify-center border border-black/5 shadow-2xs group">
              <div className="relative w-full h-full">
                <Image
                  src={image || "/image/progress/floor_plan.png"}
                  alt={`${projectName} Architecture Specs & Floor Plans`}
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
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-3.5 sm:py-4 first:pt-0 last:pb-0"
                  >
                    <span className="font-heading text-base sm:text-lg md:text-xl font-normal text-[#083327]">
                      {spec.label}
                    </span>
                    <span className="font-heading text-base sm:text-lg md:text-xl font-normal text-[#083327] text-right max-w-[55%]">
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
