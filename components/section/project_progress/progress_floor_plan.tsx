"use client";

import Image from "next/image";
import React from "react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { cn, fluid } from "@/lib/utils";

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

const DEFAULT_FLOOR_PLAN_SPECS: FloorPlanSpec[] = [
  { label: "Building Type", value: "B+G+8" },
  { label: "Total Share", value: "16" },
  { label: "Unit Per Floor", value: "2" },
  { label: "Front Road", value: "25" },
  { label: "Passenger Lift", value: "1" },
  { label: "Electricity Backup", value: "Yes" },
  { label: "Car Parking", value: "Yes" },
];

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
  const hasDynamicProps = Boolean(
    buildingType ||
      totalShare !== undefined ||
      unitPerFloor !== undefined ||
      frontRoad ||
      passengerLift !== undefined ||
      cargoLift !== undefined ||
      carParking !== undefined ||
      electricityBackup !== undefined ||
      suiteSizes ||
      hotelOperation ||
      delivery,
  );

  const specs: FloorPlanSpec[] = React.useMemo(() => {
    if (!hasDynamicProps) return DEFAULT_FLOOR_PLAN_SPECS;

    const list: FloorPlanSpec[] = [];

    if (buildingType) {
      list.push({ label: "Building Type", value: String(buildingType) });
    }
    if (
      totalShare !== undefined &&
      totalShare !== null &&
      String(totalShare) !== ""
    ) {
      list.push({ label: "Total Share", value: String(totalShare) });
    }
    if (
      unitPerFloor !== undefined &&
      unitPerFloor !== null &&
      String(unitPerFloor) !== ""
    ) {
      list.push({ label: "Unit Per Floor", value: String(unitPerFloor) });
    }
    if (frontRoad) {
      list.push({ label: "Front Road", value: String(frontRoad) });
    }
    if (
      passengerLift !== undefined &&
      passengerLift !== null &&
      String(passengerLift) !== ""
    ) {
      list.push({ label: "Passenger Lift", value: String(passengerLift) });
    }
    if (
      electricityBackup !== undefined &&
      electricityBackup !== null &&
      String(electricityBackup) !== ""
    ) {
      list.push({
        label: "Electricity Backup",
        value:
          Number(electricityBackup) === 1 ||
          String(electricityBackup).toLowerCase() === "yes"
            ? "Yes"
            : Number(electricityBackup) === 0
              ? "No"
              : String(electricityBackup),
      });
    }
    if (
      carParking !== undefined &&
      carParking !== null &&
      String(carParking) !== ""
    ) {
      list.push({
        label: "Car Parking",
        value:
          Number(carParking) === 1 ||
          String(carParking).toLowerCase() === "yes"
            ? "Yes"
            : Number(carParking) === 0
              ? "No"
              : String(carParking),
      });
    }
    if (suiteSizes && list.length < 7) {
      list.push({ label: "Suite Sizes", value: String(suiteSizes) });
    }
    if (cargoLift !== undefined && Number(cargoLift) > 0 && list.length < 7) {
      list.push({ label: "Cargo Lift", value: String(cargoLift) });
    }
    if (hotelOperation && list.length < 7) {
      list.push({ label: "Hospitality", value: String(hotelOperation) });
    }
    if (delivery && list.length < 7) {
      list.push({ label: "Delivery", value: String(delivery) });
    }

    return list;
  }, [
    hasDynamicProps,
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
  ]);

  if (specs.length === 0) return null;

  const resolvedImage = image || "/image/progress/FloorPlan.png";

  return (
    <section
      aria-label="Spacious Floor Plans Section"
      className="w-full bg-white py-[clamp(56px,5vw,80px)]"
    >
      <div className="shell flex flex-col gap-[40px]">
        {/* Section Header (Figma 8036:25189) */}
        <div className="max-w-[714px]">
          <Heading
            size={64}
            min={36}
            leading={1.1}
            mask
            className="text-[#054b3c]"
          >
            Spacious Floor Plans
          </Heading>
        </div>

        {/* 2-Column Specification Box (Figma 8036:25191, border #E0D1B6) */}
        <div className="grid grid-cols-1 border border-[#e0d1b6] lg:grid-cols-[716fr_724fr]">
          {/* Left Column: Blueprint Image Box (716 × 824, bg #F5F5F5) */}
          <Shutter
            tone="bg-[#f5f5f5]"
            className="relative min-h-[380px] bg-[#f5f5f5] sm:min-h-[480px] lg:min-h-[824px]"
          >
            <div className="zoom-frame relative size-full p-6 sm:p-10">
              <Image
                src={resolvedImage}
                alt={`${projectName} Spacious Floor Plans`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-4"
              />
            </div>
          </Shutter>

          {/* Right Column: Specification Rows (724 × 824, border #E0D1B6) */}
          <div className="relative flex flex-col border-t border-[#e0d1b6] lg:border-l lg:border-t-0">
            {specs.map((spec, idx) => (
              <Appear
                key={spec.label}
                preset="lift"
                delay={0.08 + idx * 0.05}
                className={cn(
                  "flex min-h-[88px] flex-1 items-center justify-between gap-[24px] border-b border-[#e0d1b6] px-6 py-5 last:border-b-0 sm:min-h-[117.7px] sm:px-[48px] sm:py-[40px]",
                  idx % 2 === 1 ? "bg-white" : "bg-transparent",
                )}
              >
                <span
                  className="trim font-display font-medium capitalize text-[#054b3c]"
                  style={{ fontSize: fluid(32, 22), lineHeight: 1.1 }}
                >
                  {spec.label}
                </span>
                <span
                  className="trim text-right font-display font-medium capitalize text-[#054b3c]"
                  style={{ fontSize: fluid(28, 20), lineHeight: 1.1 }}
                >
                  {spec.value}
                </span>
              </Appear>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
