"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import type { ProjectDetail } from "@/lib/projects";
import { cn, fluid } from "@/lib/utils";
import { BrochureButton } from "./brochure_button";

interface SpecificationSectionProps {
  project: ProjectDetail;
}

export function SpecificationSection({ project }: SpecificationSectionProps) {
  // Prioritize project.image2 or unit floor plan for specification blueprint
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
      className="bg-white py-[clamp(56px,6.25vw,100px)]"
    >
      <div className="shell flex flex-col gap-10">
        {/* Figma Section Header Row (1440 × 99) */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-4">
            <Eyebrow>technical INFO</Eyebrow>
            <Heading size={64} min={36} leading={1.1} mask>
              Specification
            </Heading>
          </div>

          <Appear preset="lift" delay={0.2}>
            {project.brochure_link ? (
              <BrochureButton
                propertyId={project.id}
                brochureLink={project.brochure_link}
                projectName={project.name}
              />
            ) : (
              <a
                href="#contact"
                className="press inline-flex h-[48px] shrink-0 items-center gap-3 self-start rounded-full bg-green px-6 text-[14px] font-medium uppercase tracking-[2px] text-gold transition-colors hover:bg-emerald-deep sm:self-auto"
              >
                <Download className="size-5 text-gold" />
                <span className="trim leading-[1.7]">get brochure</span>
              </a>
            )}
          </Appear>
        </div>

        {/* Figma Specification Table (1440 × 824, border #E0D1B6) */}
        <div className="grid grid-cols-1 border border-[#E0D1B6] lg:grid-cols-[716fr_724fr]">
          {/* Left Column: Blueprint Image Box (716 × 824, bg #F5F5F5) */}
          <Shutter
            tone="bg-[#F5F5F5]"
            className="relative min-h-[380px] bg-[#F5F5F5] sm:min-h-[480px] lg:min-h-[824px]"
          >
            <div className="zoom-frame relative size-full p-6 sm:p-10">
              <Image
                src={blueprintImage}
                alt={`${project.name} Blueprint Specification`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-4"
              />
            </div>
          </Shutter>

          {/* Right Column: 7 Spec Rows (724 × 824, border #E0D1B6) */}
          <div className="relative flex flex-col border-t border-[#E0D1B6] lg:border-l lg:border-t-0">
            {specsList.map((item, idx) => (
              <Appear
                key={item.label}
                preset="lift"
                delay={0.1 + idx * 0.06}
                className={cn(
                  "flex min-h-[88px] flex-1 items-center justify-between gap-6 border-b border-[#E0D1B6] px-6 py-5 last:border-b-0 sm:min-h-[118px] sm:px-12",
                  idx % 2 === 1 ? "bg-white" : "bg-transparent",
                )}
              >
                <span
                  className="trim font-display font-medium text-green"
                  style={{ fontSize: fluid(32, 22), lineHeight: 1.1 }}
                >
                  {item.label}
                </span>
                <span
                  className="trim text-right font-display font-medium text-green"
                  style={{ fontSize: fluid(28, 20), lineHeight: 1.1 }}
                >
                  {item.value}
                </span>
              </Appear>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
