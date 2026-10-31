"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Coffee,
  Cross,
  School as SchoolIcon,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import type { ProjectDetail } from "@/lib/projects";
import { cn, fluid } from "@/lib/utils";

interface AroundTheHomeProps {
  project: ProjectDetail;
}

type CategoryTab = {
  id: string | number;
  name: string;
  image?: string;
  fallbackIcon: LucideIcon;
};

const DEFAULT_TABS: CategoryTab[] = [
  { id: "school", name: "School", fallbackIcon: SchoolIcon },
  { id: "hospital", name: "Hospital", fallbackIcon: Cross },
  { id: "playground", name: "Playground", fallbackIcon: Trees },
  { id: "restaurant", name: "Restaurant", fallbackIcon: Coffee },
];

export function AroundTheHome({ project }: AroundTheHomeProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const tabs: CategoryTab[] =
    project.amenities && project.amenities.length > 0
      ? project.amenities.map((a, idx) => ({
          id: a.id || idx,
          name: a.name,
          image: a.image || a.img,
          fallbackIcon: DEFAULT_TABS[idx % DEFAULT_TABS.length].fallbackIcon,
        }))
      : DEFAULT_TABS;

  const mapSrc = project.map_image || "/image/progress/Group.svg";

  return (
    <section
      aria-label="Nearby Locations"
      className="bg-white py-[clamp(56px,6.25vw,100px)]"
    >
      <div className="shell flex flex-col gap-10">
        {/* Figma Section Header (1440 × 169) */}
        <div className="flex max-w-[714px] flex-col gap-4">
          <Eyebrow>nearby locations</Eyebrow>
          <Heading size={64} min={36} leading={1.1} mask>
            See what’s around the Home
          </Heading>
        </div>

        {/* Map & Category Tabs Block (1440 × 777) */}
        <div className="flex flex-col gap-6">
          <Shutter className="relative aspect-[1440/641] w-full bg-warm">
            <Image
              src={mapSrc}
              alt={`${project.name} Location Map`}
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
          </Shutter>

          {/* Figma Category Tabs (354 × 112 each, 8px gap, #E6E6E6 border, active #054B3C) */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {tabs.map((tab, idx) => {
              const active = idx === activeIdx;
              const FallbackIcon = tab.fallbackIcon;
              return (
                <Appear key={tab.id} preset="lift" delay={0.1 + idx * 0.06}>
                  <button
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    aria-pressed={active}
                    className={cn(
                      "flex h-[84px] w-full items-center gap-4 border px-5 text-left transition-colors duration-300 sm:h-[112px] sm:px-8",
                      active
                        ? "border-green bg-green text-white"
                        : "border-[#E6E6E6] bg-white text-ink hover:border-green/50 hover:bg-warm",
                    )}
                  >
                    {tab.image ? (
                      <span className="relative size-9 shrink-0 sm:size-12">
                        <Image
                          src={tab.image}
                          alt=""
                          fill
                          sizes="48px"
                          className={cn(
                            "object-contain",
                            active && "brightness-0 invert",
                          )}
                        />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center sm:size-12",
                          active ? "text-white" : "text-green",
                        )}
                      >
                        <FallbackIcon className="size-6 sm:size-8" strokeWidth={1.5} />
                      </span>
                    )}

                    <span
                      className={cn(
                        "trim font-display font-medium capitalize",
                        active ? "text-white" : "text-ink",
                      )}
                      style={{ fontSize: fluid(24, 16), lineHeight: 1.3 }}
                    >
                      {tab.name}
                    </span>
                  </button>
                </Appear>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
