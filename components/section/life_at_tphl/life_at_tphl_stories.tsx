"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import team01 from "@/public/image/life-at-tphl/stories-team01.png";
import team02 from "@/public/image/life-at-tphl/stories-team02.png";
import team03 from "@/public/image/life-at-tphl/stories-team03.png";
import team04 from "@/public/image/life-at-tphl/stories-team04.png";
import team05 from "@/public/image/life-at-tphl/stories-team05.png";

// Stage = the design frame in design px (1600 wide). Cards, pins and the wave
// all use these coordinates, so they scale together at every screen width.
const W = 1600;
const H = 700;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

// Exported PNGs are 1x design px, already rotated + grayscaled.
// x/y = image centre. DOM order = stacking order.
const CARDS = [
  { img: team04, alt: "Colleagues chatting over coffee in the lounge", x: 423, y: 240 },
  { img: team05, alt: "Team member receiving a recognition award", x: 189, y: 260 },
  { img: team01, alt: "Festive cultural celebration at the TPHL office", x: 1434, y: 222 },
  { img: team02, alt: "Project presentation in the TPHL boardroom", x: 1203, y: 223 },
  { img: team03, alt: "TPHL team members bonding over games at the office", x: 790, y: 376 },
];

// Exact wave from the design (its own 1600×149 box), shifted down WAVE_Y in the stage.
const WAVE_Y = 20;
const WAVE =
  "M-12 147.932C27.5 104.432 122.5 26.0319 186.5 60.4319C266.5 103.432 272.5 146.435 348 103.433C423.5 60.4319 463 -6.06662 522.5 36.9334C582 79.9334 654.5 110.938 721 73.9357C787.5 36.9334 905 -28.5606 968.5 15.9357C1032 60.4319 1054 132.931 1147.5 103.433C1241 73.9357 1252.5 45.9322 1303 36.9334C1353.5 27.9346 1356 -0.0688858 1415.5 36.9334C1475 73.9357 1469.5 94.9335 1518 84.4346C1566.5 73.9357 1569.5 57.9311 1612.5 36.9334";

// Pin x from the design; y sampled from WAVE at that x, so each pin sits on the line.
const PINS = [
  [310, 119.6],
  [626, 87.0],
  [1218, 75.2],
  [1484, 85.3],
];

export function LifeAtTphlStories() {
  return (
    <section
      aria-label="Stories From The Team"
      className="relative w-full bg-white text-[#1f2723] pt-14 sm:pt-20 md:pt-24 lg:pt-28 pb-16 sm:pb-24 md:pb-28 overflow-hidden select-none"
    >
      {/* Section Heading */}
      <div className="w-full text-center max-w-3xl mx-auto px-4 mb-4 sm:mb-6">
        <h2 className="font-heading font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-[#054b3c] leading-[1.08] tracking-tight">
          Stories From
          <br />
          The Team.
        </h2>
      </div>

      {/* Photo stage: fixed aspect ratio, everything positioned in stage % */}
      <div
        className="relative w-full max-w-[1600px] mx-auto"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg
          viewBox={`0 ${-WAVE_Y} ${W} ${H}`}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <path
            d={WAVE}
            fill="none"
            stroke="#546360"
            strokeWidth="2"
            strokeDasharray="12 12"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {CARDS.map((c) => {
          const w = c.img.width;
          return (
            <div
              key={c.img.src}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-[scale] duration-300 hover:scale-105 hover:z-40"
              style={{ left: pct(c.x, W), top: pct(c.y, H), width: pct(w, W) }}
            >
              <Image
                src={c.img}
                alt={c.alt}
                priority={c.img === team03}
                sizes={`(max-width: ${W}px) ${Math.round((w / W) * 100)}vw, ${w}px`}
                className="w-full h-auto"
              />
            </div>
          );
        })}

        {PINS.map(([x, y]) => (
          <span
            key={x}
            aria-hidden="true"
            className="absolute z-50 aspect-square rounded-full bg-[#e5262b] shadow-[0_1px_2px_rgba(0,0,0,0.35)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(x, W), top: pct(y + WAVE_Y, H), width: `max(8px, ${pct(22, W)})` }}
          />
        ))}
      </div>

      {/* Bottom Description & CTA */}
      <div className="text-center max-w-2xl mx-auto mt-6 sm:mt-8 md:mt-10 px-4">
        <p className="font-sans text-xs sm:text-sm md:text-[14.5px] text-[#4a5550] font-normal leading-relaxed mb-6 sm:mb-8">
          TPHL Gives Me The Space To Grow And Contribute To Real
          <br className="hidden sm:inline" /> Impact. Hear From The People
          Shaping TPHL’s Growth,
          <br className="hidden sm:inline" /> Culture, And Customer Experience.
        </p>

        <Link
          href="/career"
          className="group inline-flex items-center justify-center px-7 sm:px-8 py-2.5 sm:py-3 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#054b3c] hover:bg-[#075947] transition-all duration-300 shadow-sm active:scale-95"
        >
          <span>JOIN OUR TEAM</span>
        </Link>
      </div>
    </section>
  );
}
