"use client";

import { navPillClass } from "@/components/navbar";
import { DarkHero } from "@/components/section/shared/dark_hero";
import { cn } from "@/lib/utils";

export function CareerHero() {
  return (
    <DarkHero
      eyebrow="Homepage / Career"
      title={["Build Your Future", "With Premium Homes"]}
      copy="Join a fast-growing real estate group shaping tomorrow’s communities across the region. We’re looking for passionate people ready to innovate, grow, and make an impact."
      copyWidth={850}
    >
      {/* Figma: the same warm glass pill as the nav's menu toggle. */}
      <button
        type="button"
        onClick={() => document.getElementById("open-positions")?.scrollIntoView({ behavior: "smooth" })}
        className={cn(navPillClass("warm", false), "px-6")}
      >
        <span className="trim relative leading-[1.7]">View Open Positions</span>
      </button>
    </DarkHero>
  );
}
