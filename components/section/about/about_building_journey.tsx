"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Heading } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SPRING_SLOW } from "@/lib/utils";

const PHOTOS = [
  { src: "/image/about/journy/journy03.png", alt: "TPHL consultation lounge" },
  { src: "/image/about/journy/journy07.png", alt: "TPHL team discussion" },
  { src: "/image/about/journy/journy09.png", alt: "TPHL architectural showcase" },
  { src: "/image/about/journy/journy04.png", alt: "TPHL architectural planning" },
  { src: "/image/about/journy/journy10.png", alt: "TPHL architectural consultation" },
  { src: "/image/about/journy/journy12.png", alt: "TPHL community celebration" },
  { src: "/image/about/journy/journy08.png", alt: "TPHL tree planting initiative" },
  { src: "/image/about/journy/journy11.png", alt: "TPHL team milestone celebration" },
  { src: "/image/about/journy/journy02.png", alt: "TPHL milestone recognition" },
  { src: "/image/about/journy/journy05.png", alt: "TPHL family gathering" },
  { src: "/image/about/journy/journy01.png", alt: "TPHL architectural blueprints" },
  { src: "/image/about/journy/journy06.png", alt: "TPHL official ceremony" },
];

/*
 * Figma: two rings of 12 photos (204 × 233 each) on a radius near 620, centred off either side of
 * the 1600 × 1080 frame so only the inner arc shows. The rings sit at slightly different heights and
 * angles, so the photos facing the title on each side don't line up. Sizes are shares of the width.
 */
const CARD = { width: 12.73, ratio: 203.7 / 232.8 };
const RADIUS = 38.75;
const RINGS = {
  left: { x: -20.5, y: 52, offset: 5.38 },
  right: { x: -17.5, y: 49, offset: 24.88 },
};

/**
 * One ring. It sweeps a third of a turn into place the first time it shows, then scroll keeps it
 * turning: the left ring clockwise, the right one the other way.
 */
function Ring({ side, turn, play }: { side: "left" | "right"; turn: MotionValue<number>; play: boolean }) {
  const left = side === "left";
  const ring = RINGS[side];
  const rotate = useTransform(turn, (v) => (left ? v : -v));
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={reduce ? false : { rotate: left ? -60 : 60, opacity: 0 }}
      animate={play ? { rotate: 0, opacity: 1 } : undefined}
      transition={{ ...SPRING_SLOW, opacity: { duration: 0.6 } }}
      style={{ top: `${ring.y}%`, [side]: `${ring.x}%` }}
      className="absolute size-0"
    >
      <motion.div style={{ rotate }} className="absolute size-0">
        {PHOTOS.map((p, i) => {
          const angle = (i * 360) / PHOTOS.length + ring.offset;
          return (
            <div
              key={p.src}
              className="absolute left-0 top-0"
              style={{
                width: `${CARD.width}cqw`,
                aspectRatio: CARD.ratio,
                transform: `rotate(${angle}deg) translateY(-${RADIUS}cqw) translate(-50%, -50%)`,
                transformOrigin: "0 0",
              }}
            >
              <div className="relative size-full overflow-hidden rounded-[5px]">
                <Image src={p.src} alt="" fill sizes="13vw" className="object-cover" />
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/** The title masks up while two rings of photos turn against each other as the page scrolls past. */
export function AboutBuildingJourney() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const turn = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  // The rings are zero-size pivots, so the section decides when they sweep in.
  const play = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      aria-label="The building journey"
      // Container units let the rings scale with the section's own width.
      className="@container relative grid aspect-[1600/1080] min-h-[520px] w-full place-items-center overflow-hidden bg-warm"
    >
      <Ring side="left" turn={turn} play={play} />
      <Ring side="right" turn={turn} play={play} />
      <Heading as="h2" size={144} min={56} leading={1} weight="regular" mask className="relative z-10 max-w-[5em] text-center">
        The building journey
      </Heading>
    </section>
  );
}
