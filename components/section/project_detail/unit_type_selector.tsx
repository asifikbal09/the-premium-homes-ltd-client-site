"use client";

import Image from "next/image";
import { useState } from "react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, GreenPill, Heading } from "@/components/ui/primitives";
import type { ProjectDetail, ProjectUnit } from "@/lib/projects";
import { cn, fluid } from "@/lib/utils";

interface UnitTypeSelectorProps {
  units: ProjectUnit[];
  projectName: string;
  projectImages?: string[];
  projectDescription?: string;
  projectPrice?: string;
}

const INITIAL_VISIBLE = 2;

function UnitSpec({
  icon,
  children,
}: {
  icon: "sqft" | "bath" | "balcony";
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-sage">
      {icon === "sqft" && (
        <Image
          src="/projects/icons/house.svg"
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0"
        />
      )}
      {icon === "bath" && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 shrink-0"
          aria-hidden="true"
        >
          <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z" />
          <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
          <path d="m4 21 1-1.5" />
          <path d="m20 21-1-1.5" />
        </svg>
      )}
      {icon === "balcony" && (
        <Image
          src="/projects/icons/balcony.svg"
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0"
        />
      )}
      <span className="trim whitespace-nowrap text-[13px] font-medium uppercase leading-none text-sage sm:text-[14px]">
        {children}
      </span>
    </span>
  );
}

function UnitCard({
  unit,
  idx,
  projectName,
  projectImages = [],
  projectDescription,
  projectPrice,
}: {
  unit: ProjectUnit;
  idx: number;
  projectName: string;
  projectImages?: string[];
  projectDescription?: string;
  projectPrice?: string;
}) {
  const baseImage =
    unit.floor_plan_image ||
    projectImages[idx % Math.max(1, projectImages.length)] ||
    "/image/projects/projectsHero.png";

  // Build up to 6 gallery thumbnails from unit floor plan + project images
  const thumbs = Array.from(
    new Set([baseImage, ...projectImages].filter(Boolean)),
  ).slice(0, 6);

  const [activeThumb, setActiveThumb] = useState(0);
  const currentImg = thumbs[activeThumb] || baseImage;

  const formattedSqft = unit.sqft
    ? `${unit.sqft} sqft`
    : unit.size || "1600 sqft";
  const beds = unit.bedrooms;
  const baths = unit.bathrooms || 3;
  const balconies = unit.balcony || 3;
  const priceText = unit.price || projectPrice || "80lac - 2cr BDT";
  const unitTitle = beds
    ? `${beds} Bedrooms`
    : unit.unit_name || unit.name || "3 Bedrooms";
  const subtitle =
    projectDescription ||
    `${projectName} is a modern residential address designed for elevated living.`;

  return (
    <Appear
      as="article"
      preset="rise"
      delay={idx * 0.12}
      className="group flex flex-col justify-between border border-[#E6E6E6] bg-white p-4 sm:p-6"
    >
      <div className="flex flex-col gap-6">
        {/* Main Image (662 × 406) */}
        <Shutter className="relative aspect-[662/406] w-full bg-warm">
          <div className="zoom-frame relative size-full">
            <Image
              src={currentImg}
              alt={`${projectName} - ${unitTitle}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </Shutter>

        {/* Thumbnail Strip (6 × 102 × 62) */}
        {thumbs.length > 1 && (
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {thumbs.map((src, tIdx) => {
              const selected = tIdx === activeThumb;
              return (
                <button
                  key={`${src}-${tIdx}`}
                  type="button"
                  onClick={() => setActiveThumb(tIdx)}
                  aria-label={`Preview image ${tIdx + 1}`}
                  className={cn(
                    "relative aspect-[102/62] w-full overflow-hidden border transition-all duration-300",
                    selected
                      ? "border-green ring-1 ring-green"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="110px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Title, Description & Price Row */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <div className="flex max-w-[464px] flex-col gap-2">
            <h3
              className="trim font-display font-medium capitalize text-green"
              style={{ fontSize: fluid(32, 24), lineHeight: 1.3 }}
            >
              {unitTitle}
            </h3>
            <p className="line-clamp-2 max-w-[362px] text-[14px] leading-[1.4] text-sage sm:text-[16px]">
              {subtitle}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
            <span className="trim text-[14px] leading-[1.5] text-sage sm:text-[16px]">
              Starting from
            </span>
            <span className="trim whitespace-nowrap text-[18px] leading-[1.5] text-ink sm:text-[20px]">
              {priceText}
            </span>
          </div>
        </div>
      </div>

      {/* Divider + Specs & Contact Now CTA */}
      <div className="mt-6 flex flex-col gap-6">
        <span className="relative block h-px w-full overflow-hidden bg-stone-2">
          <span className="absolute inset-0 origin-left scale-x-0 bg-green transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
        </span>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <UnitSpec icon="sqft">{formattedSqft}</UnitSpec>
            <UnitSpec icon="bath">{baths} Bathroom</UnitSpec>
            <UnitSpec icon="balcony">{balconies} balcony</UnitSpec>
          </div>

          <GreenPill href="#contact" arrow>
            contact now
          </GreenPill>
        </div>
      </div>
    </Appear>
  );
}

export function UnitTypeSelector({
  units,
  projectName,
  projectImages = [],
  projectDescription,
  projectPrice,
}: UnitTypeSelectorProps) {
  const [showAll, setShowAll] = useState(false);

  const displayUnits: ProjectUnit[] =
    units && units.length > 0
      ? units
      : [
          {
            id: 1,
            name: "3 Bedrooms",
            unit_name: "3 Bedrooms",
            size: "1600 sqft",
            sqft: 1600,
            bedrooms: 3,
            bathrooms: 3,
            balcony: 3,
            price: projectPrice || "80lac - 2cr BDT",
            status: "Available",
            floor_plan_image:
              projectImages[0] || "/image/projects/projectsHero.png",
          },
          {
            id: 2,
            name: "3 Bedrooms",
            unit_name: "3 Bedrooms",
            size: "1600 sqft",
            sqft: 1600,
            bedrooms: 3,
            bathrooms: 3,
            balcony: 3,
            price: projectPrice || "80lac - 2cr BDT",
            status: "Available",
            floor_plan_image:
              projectImages[1] ||
              projectImages[0] ||
              "/image/projects/projectsHero.png",
          },
        ];

  const visibleUnits = showAll
    ? displayUnits
    : displayUnits.slice(0, INITIAL_VISIBLE);

  return (
    <section
      aria-label="Choose Unit Type"
      className="bg-white py-[clamp(56px,6.25vw,100px)]"
    >
      <div className="shell flex flex-col gap-10">
        {/* Figma Centered Header */}
        <div className="mx-auto flex max-w-[835px] flex-col items-center gap-4 text-center">
          <Eyebrow>Unit Types</Eyebrow>
          <Heading size={64} min={36} leading={1.1} mask>
            choose Unit type
          </Heading>
        </div>

        {/* 2-Column Unit Cards Grid (1440px, 20px gap) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {visibleUnits.map((unit, idx) => (
            <UnitCard
              key={unit.id || idx}
              unit={unit}
              idx={idx}
              projectName={projectName}
              projectImages={projectImages}
              projectDescription={projectDescription}
              projectPrice={projectPrice}
            />
          ))}
        </div>

        {/* Figma "view more" button centered below the cards */}
        {displayUnits.length > INITIAL_VISIBLE && (
          <div className="relative flex justify-center pt-2">
            <Appear preset="lift">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="press inline-flex h-[42px] items-center justify-center rounded-full border border-sage bg-white px-6 text-[14px] font-medium uppercase tracking-[2px] text-green transition-colors duration-300 hover:border-green hover:bg-warm"
              >
                <span className="trim leading-[1.7]">
                  {showAll ? "show less" : "view more"}
                </span>
              </button>
            </Appear>
          </div>
        )}
      </div>
    </section>
  );
}
