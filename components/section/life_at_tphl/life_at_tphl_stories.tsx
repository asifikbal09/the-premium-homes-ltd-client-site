"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Stage coordinate system, measured from the design (728×320).
// Cards, pins and the wave all use it, so they scale together at every width.
const W = 728;
const H = 320;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

// x/y = card centre, w/h = unrotated size. DOM order = stacking order.
const CARDS = [
  { src: "/image/life-at-tphl/tplt-team1.png", alt: "Colleagues discussing plans in the lounge", x: 194, y: 110, w: 88, h: 118, rotate: -6, gray: true, img: "object-top" },
  { src: "/image/life-at-tphl/stories-team-award.png", alt: "Team member recognition and award ceremony", x: 87, y: 118, w: 96, h: 136, rotate: 7, gray: true, img: "object-top scale-[1.8] origin-top" },
  { src: "/image/life-at-tphl/tplt-team06.png", alt: "Traditional cultural festival celebration at TPHL", x: 656, y: 101, w: 87, h: 104, rotate: -4, gray: true, img: "object-top" },
  { src: "/image/life-at-tphl/tplt-team04.png", alt: "Team presentation and project review", x: 549, y: 101, w: 103, h: 130, rotate: 4, gray: true, img: "object-center" },
  { src: "/image/life-at-tphl/stories-team-center.png", alt: "TPHL team members bonding over games at the office", x: 360, y: 171, w: 205, h: 254, rotate: 4, gray: false, img: "object-center scale-[1.12]" },
];

// Pins sit exactly on the wave's dips (same coordinates as the path below).
const PINS = [
  [141, 64],
  [285, 47],
  [554, 43],
  [675, 50],
];

// Quadratic arcs between pins; segments beyond 0..728 extend the string edge-to-edge on wide screens.
const WAVE =
  "M -364 50 Q -182 -10 0 70 Q 59.5 -1 141 64 Q 197 -9.5 285 47 Q 400.5 -25 554 43 Q 609.5 -6.5 675 50 Q 702 40 728 30 Q 910 -10 1092 60";

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
        className="relative w-full max-w-[1440px] mx-auto"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <path
            d={WAVE}
            fill="none"
            stroke="#3f4843"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {CARDS.map((c) => (
          <div
            key={c.src}
            className="absolute shadow-lg shadow-black/20 transition-[scale] duration-300 hover:scale-105 hover:z-40"
            style={{
              left: pct(c.x, W),
              top: pct(c.y, H),
              width: pct(c.w, W),
              aspectRatio: `${c.w} / ${c.h}`,
              transform: `translate(-50%, -50%) rotate(${c.rotate}deg)`,
            }}
          >
            <div className={`relative w-full h-full overflow-hidden bg-neutral-100 ${c.gray ? "grayscale" : ""}`}>
              <Image
                src={c.src}
                alt={c.alt}
                fill
                priority={!c.gray}
                sizes={`(max-width: 1440px) ${Math.round((c.w / W) * 100)}vw, ${Math.round((c.w / W) * 1440)}px`}
                className={`object-cover ${c.img}`}
              />
            </div>
          </div>
        ))}

        {PINS.map(([x, y]) => (
          <span
            key={x}
            aria-hidden="true"
            className="absolute z-50 aspect-square rounded-full bg-[#e5262b] shadow-[0_1px_2px_rgba(0,0,0,0.35)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(x, W), top: pct(y, H), width: "max(8px, 1.4%)" }}
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
