"use client";

import React from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import type { ProjectDetail } from "@/lib/projects";
import { BrochureButton } from "./brochure_button";

interface SpecificationSectionProps {
  project: ProjectDetail;
}

export function SpecificationSection({ project }: SpecificationSectionProps) {
  // Prioritize project.image2 for specification blueprint
  const blueprintImage =
    project.image2 ||
    project.units?.[0]?.floor_plan_image ||
    project.images?.[1] ||
    project.image ||
    "/image/projects/projectsHero.png";

  const specsList = [
    {
      label: "Building Type",
      value: project.building_type || "B+G+8",
    },
    {
      label: "Total Share",
      value:
        project.total_share !== undefined && project.total_share !== null
          ? project.total_share
          : 16,
    },
    {
      label: "Unit Per Floor",
      value:
        project.unit_per_floor !== undefined && project.unit_per_floor !== null
          ? project.unit_per_floor
          : 2,
    },
    {
      label: "Front Road",
      value: project.front_road || 25,
    },
    {
      label: "Passenger Lift",
      value:
        project.passenger_lift !== undefined && project.passenger_lift !== null
          ? project.passenger_lift
          : 1,
    },
    {
      label: "Electricity Backup",
      value:
        project.electricity_backup !== undefined
          ? project.electricity_backup
            ? "Yes"
            : "No"
          : "Yes",
    },
    {
      label: "Car Parking",
      value:
        project.car_parking !== undefined
          ? project.car_parking
            ? "Yes"
            : "No"
          : "Yes",
    },
  ];

  return (
    <section
      aria-label="Technical Specification"
      className="w-full bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
              TECHNICAL INFO
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-normal text-[#044133] mt-2 tracking-tight">
              Specification
            </h2>
          </div>

          {project.brochure_link ? (
            <BrochureButton
              propertyId={project.id}
              brochureLink={project.brochure_link}
              projectName={project.name}
            />
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065e49] text-[#d0a65b] text-xs font-normal tracking-wider uppercase transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-[#d0a65b]" />
              <span>GET BROCHURE</span>
            </a>
          )}
        </div>

        {/* 2 Columns: Architectural Blueprint on Left, Table on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Blueprint Image Box */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] lg:min-h-full bg-[#f4f4f4] rounded-none p-6 sm:p-10 flex items-center justify-center">
            <Image
              src={blueprintImage}
              alt={`${project.name} Blueprint Specification`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4 rounded-none"
            />
          </div>

          {/* Right Column: Spec Key-Value List */}
          <div className="lg:col-span-6 flex flex-col justify-between divide-y divide-[#ede7dc]">
            {specsList.map((item, idx) => (
              <div
                key={idx}
                className="py-5 sm:py-6 flex items-center justify-between gap-4"
              >
                <span className="font-heading text-xl sm:text-2xl md:text-[25px] font-normal text-[#044133]">
                  {item.label}
                </span>
                <span className="font-heading text-xl sm:text-2xl md:text-[25px] font-normal text-[#14261f] text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
