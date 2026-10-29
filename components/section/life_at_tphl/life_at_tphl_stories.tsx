"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear } from "@/components/ui/motion";
import { GreenPill, Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE, SPRING_SOFT } from "@/lib/utils";
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

const COPY =
  "TPHL gives me the space to grow and contribute to real impact. Hear from the people shaping TPHL’s growth, culture, and customer experience.";

/**
 * Photos pinned along a dashed line. Once the stage is in view the line draws across, the photos
 * pop onto it one after another and the pins drop in last. The About page reuses it with its own
 * title and button.
 */
export function LifeAtTphlStories({
  title = "Stories from the team.",
  cta = { label: "Join our team", href: "/career" },
}: {
  title?: string;
  cta?: { label: string; href: string };
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const play = useInView(stageRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <section
      aria-label={title}
      className="relative w-full overflow-hidden bg-white pb-16 pt-14 select-none sm:pb-24 sm:pt-20 md:pb-28 md:pt-[120px]"
    >
      <div className="shell flex justify-center">
        <Heading size={72} min={40} leading={1} mask className="max-w-[680px] text-center">
          {title}
        </Heading>
      </div>

      {/* Photo stage: fixed aspect ratio, everything positioned in stage % */}
      <div ref={stageRef} className="relative mx-auto w-full max-w-[1600px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 ${-WAVE_Y} ${W} ${H}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {/* The dashed line is revealed through a solid twin used as a mask, so the dashes stay put while it draws. */}
          <defs>
            <mask id="stories-wave-reveal" maskUnits="userSpaceOnUse">
              <motion.path
                d={WAVE}
                fill="none"
                stroke="white"
                strokeWidth="8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: play ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 1.6, ease: SETTLE }}
              />
            </mask>
          </defs>
          <path
            d={WAVE}
            mask="url(#stories-wave-reveal)"
            fill="none"
            stroke="#546360"
            strokeWidth="2"
            strokeDasharray="12 12"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {CARDS.map((c, i) => {
          const w = c.img.width;
          return (
            <div
              key={c.img.src}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-[scale] duration-300 hover:z-40 hover:scale-105"
              style={{ left: pct(c.x, W), top: pct(c.y, H), width: pct(w, W) }}
            >
              <Appear preset="pop" play={play} delay={0.3 + i * 0.1}>
                {/* Once pinned, each photo sways a little on the line, every one at its own pace. */}
                <motion.div
                  animate={play && !reduce ? { rotate: [0, 1.2, -0.8, 0] } : { rotate: 0 }}
                  transition={{ duration: 6 + i * 0.7, delay: 1.2 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "50% 0%" }}
                >
                  <Image
                    src={c.img}
                    alt={c.alt}
                    sizes={`(max-width: ${W}px) ${Math.round((w / W) * 100)}vw, ${w}px`}
                    className="h-auto w-full"
                  />
                </motion.div>
              </Appear>
            </div>
          );
        })}

        {PINS.map(([x, y], i) => (
          <motion.span
            key={x}
            aria-hidden="true"
            initial={{ opacity: 0, y: -24 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
            transition={reduce ? { duration: 0 } : { ...SPRING_SOFT, delay: 0.9 + i * 0.08 }}
            className="absolute z-50 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e5262b] shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            style={{ left: pct(x, W), top: pct(y + WAVE_Y, H), width: `max(8px, ${pct(22, W)})` }}
          />
        ))}
      </div>

      {/* Bottom description & CTA */}
      <div className="shell mt-6 flex flex-col items-center gap-6 text-center sm:mt-8 md:mt-[clamp(40px,3.9vw,62px)]">
        <Appear as="p" preset="lift" className="max-w-[644px] text-[clamp(16px,1.5vw,24px)] capitalize leading-[1.4] text-sage">
          {COPY}
        </Appear>
        <Appear preset="lift" delay={0.15}>
          <GreenPill href={cta.href} arrow className="text-white">
            {cta.label}
          </GreenPill>
        </Appear>
      </div>
    </section>
  );
}
