"use client";

import React from "react";
import { Appear } from "@/components/ui/motion";

interface SpecItem {
  iconSrc: string;
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
  carParking?: number | string;
  expectedHandover?: string;
  suiteSizes?: string;
  unitPerFloor?: number | string;
  developer?: string;
}

const DEFAULT_SPECS: SpecItem[] = [
  {
    iconSrc: "/image/progress/icons/spec-location.svg",
    label: "Location",
    value: "Bashundhara R/A, Dhaka",
  },
  {
    iconSrc: "/image/progress/icons/spec-land-area.svg",
    label: "Land area",
    value: "5.25 katha",
  },
  {
    iconSrc: "/image/progress/icons/spec-total-unit.svg",
    label: "Total unit",
    value: "256",
  },
  {
    iconSrc: "/image/progress/icons/spec-apartment.svg",
    label: "Total floors",
    value: "G+10",
  },
  {
    iconSrc: "/image/progress/icons/spec-parking.svg",
    label: "Parking",
    value: "2 Levels",
  },
  {
    iconSrc: "/image/progress/icons/spec-total-unit.svg",
    label: "Unit type",
    value: "3 & 4 Bed, Penthouse",
  },
  {
    iconSrc: "/image/progress/icons/spec-apartment.svg",
    label: "Developer",
    value: "The Premium Homes Ltd.",
  },
  {
    iconSrc: "/image/progress/icons/spec-calendar.svg",
    label: "Expected handover",
    value: "Dec 2027",
  },
];

export function ProgressSpecsGrid({
  location,
  landArea,
  totalShare,
  buildingType,
  buildingFace,
  frontRoad,
  passengerLift,
  carParking,
  expectedHandover,
  suiteSizes,
  unitPerFloor,
  developer = "The Premium Homes Ltd.",
}: ProgressSpecsGridProps) {
  const hasDynamicProps = Boolean(
    location ||
      landArea ||
      totalShare !== undefined ||
      buildingType ||
      buildingFace ||
      frontRoad ||
      passengerLift !== undefined ||
      carParking !== undefined ||
      expectedHandover ||
      suiteSizes ||
      unitPerFloor !== undefined,
  );

  const specItems: SpecItem[] = React.useMemo(() => {
    if (!hasDynamicProps) return DEFAULT_SPECS;

    const list: SpecItem[] = [];

    if (location) {
      list.push({
        iconSrc: "/image/progress/icons/spec-location.svg",
        label: "Location",
        value: String(location),
      });
    }
    if (landArea) {
      list.push({
        iconSrc: "/image/progress/icons/spec-land-area.svg",
        label: "Land area",
        value: String(landArea),
      });
    }
    if (
      totalShare !== undefined &&
      totalShare !== null &&
      String(totalShare) !== ""
    ) {
      list.push({
        iconSrc: "/image/progress/icons/spec-total-unit.svg",
        label: "Total unit",
        value: String(totalShare),
      });
    }
    if (buildingType) {
      list.push({
        iconSrc: "/image/progress/icons/spec-apartment.svg",
        label: "Total floors",
        value: String(buildingType),
      });
    }
    if (
      carParking !== undefined &&
      carParking !== null &&
      String(carParking) !== ""
    ) {
      list.push({
        iconSrc: "/image/progress/icons/spec-parking.svg",
        label: "Parking",
        value:
          Number(carParking) === 1 ||
          String(carParking).toLowerCase() === "yes"
            ? "Designated Parking"
            : String(carParking),
      });
    } else if (frontRoad) {
      list.push({
        iconSrc: "/image/progress/icons/spec-parking.svg",
        label: "Front road",
        value: String(frontRoad),
      });
    }
    if (suiteSizes) {
      list.push({
        iconSrc: "/image/progress/icons/spec-total-unit.svg",
        label: "Unit type",
        value: String(suiteSizes),
      });
    } else if (
      unitPerFloor !== undefined &&
      unitPerFloor !== null &&
      String(unitPerFloor) !== ""
    ) {
      list.push({
        iconSrc: "/image/progress/icons/spec-total-unit.svg",
        label: "Unit per floor",
        value: String(unitPerFloor),
      });
    } else if (buildingFace) {
      list.push({
        iconSrc: "/image/progress/icons/spec-total-unit.svg",
        label: "Building face",
        value: String(buildingFace),
      });
    }
    if (developer) {
      list.push({
        iconSrc: "/image/progress/icons/spec-apartment.svg",
        label: "Developer",
        value: String(developer),
      });
    }
    if (expectedHandover) {
      list.push({
        iconSrc: "/image/progress/icons/spec-calendar.svg",
        label: "Expected handover",
        value: String(expectedHandover),
      });
    } else if (
      passengerLift !== undefined &&
      passengerLift !== null &&
      String(passengerLift) !== ""
    ) {
      list.push({
        iconSrc: "/image/progress/icons/spec-apartment.svg",
        label: "Passenger lift",
        value: String(passengerLift),
      });
    }

    return list;
  }, [
    hasDynamicProps,
    location,
    landArea,
    totalShare,
    buildingType,
    buildingFace,
    frontRoad,
    passengerLift,
    carParking,
    expectedHandover,
    suiteSizes,
    unitPerFloor,
    developer,
  ]);

  if (specItems.length === 0) return null;

  return (
    <section
      aria-label="Project Key Specifications"
      className="w-full bg-[#f5f6f7] py-[clamp(48px,5vw,80px)]"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2 lg:grid-cols-4">
          {specItems.slice(0, 8).map((item, idx) => (
            <Appear
              key={`${item.label}-${idx}`}
              preset="lift"
              delay={0.06 + idx * 0.05}
              className="group flex flex-col items-start justify-between gap-[40px] bg-white px-[24px] pb-[28px] pt-[24px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs"
            >
              <div className="relative size-[56px] shrink-0 transition-transform duration-300 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.iconSrc}
                  alt=""
                  width={56}
                  height={56}
                  className="size-[56px]"
                />
              </div>

              <div className="flex w-full flex-col items-start gap-[16px]">
                <p className="trim whitespace-nowrap font-sans text-[14px] font-medium uppercase leading-[1.7] text-[#546360]">
                  {item.label}
                </p>
                <p className="font-sans text-[18px] font-normal leading-[1.4] text-[#054b3c] sm:text-[20px]">
                  {item.value}
                </p>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}
