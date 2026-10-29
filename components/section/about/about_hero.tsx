"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, Words } from "@/components/ui/motion";
import { GreenPill } from "@/components/ui/primitives";
import { useIntro } from "@/components/providers/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SPRING_SLOW, fluid } from "@/lib/utils";

/** Figma "Heri animation flow" frame: 1600 × 1080, nav included. */
const STAGE = { w: 1600, h: 1080 };

type Photo = {
  src: string;
  alt: string;
  /** Figma box on the 1600 × 1080 stage. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Scroll parallax in px across the hero; nearer photos travel further. */
  drift: number;
  preload?: boolean;
};

const PHOTOS: Photo[] = [
  { src: "/image/about/about_hero05.png", alt: "TPHL team lunch in the office", x: 46, y: 274, w: 222, h: 254, drift: -90 },
  { src: "/image/about/about_hero04.png", alt: "TPHL team reviewing a master plan scale model", x: 294, y: 381, w: 256, h: 293, drift: -40 },
  { src: "/image/about/about_hero03.png", alt: "TPHL milestone celebration and cake cutting", x: 632, y: 140, w: 351, h: 400, drift: -140, preload: true },
  { src: "/image/about/about_hero02.png", alt: "Excellence in leadership award ceremony", x: 1009, y: 184, w: 239.65, h: 273.88, drift: -70 },
  { src: "/image/about/about_hero01.png", alt: "TPHL team celebrating in traditional attire", x: 1303, y: 420, w: 222, h: 254, drift: -110 },
];

const COPY =
  "TPHL is shaping accessible premium living in Bangladesh through honest communication, structured buying journeys, and homes designed around real families.";

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/**
 * Figma's intro flow, condensed: the photos start gathered at the centre of the stage, turned like
 * a fanned stack, and spring out to their places one after another; then the title rises letter by
 * letter out of a clip and the copy and button follow.
 */
function StagePhoto({ p, i, play, progress }: { p: Photo; i: number; play: boolean; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [0, p.drift]);
  // Offset from the photo's slot to the stage centre, in its own size, so it holds at any width.
  const fromX = `${((STAGE.w / 2 - (p.x + p.w / 2)) / p.w) * 100}%`;
  const fromY = `${((STAGE.h / 2 - (p.y + p.h / 2)) / p.h) * 100}%`;
  const hidden = { x: fromX, y: fromY, scale: 0.5, rotate: (i - 2) * 9, opacity: 0.001 };
  const shown = { x: "0%", y: "0%", scale: 1, rotate: 0, opacity: 1 };
  return (
    <motion.div
      style={{ left: pct(p.x, STAGE.w), top: pct(p.y, STAGE.h), width: pct(p.w, STAGE.w), aspectRatio: `${p.w} / ${p.h}`, y }}
      className="absolute"
    >
      <motion.div
        initial={hidden}
        animate={play ? shown : hidden}
        transition={reduce ? { duration: 0 } : { ...SPRING_SLOW, delay: 0.1 + i * 0.08 }}
        className="zoom-frame relative size-full rounded-[5.7px]"
      >
        <div className="absolute inset-0">
          <Image src={p.src} alt={p.alt} fill preload={p.preload} sizes="(min-width: 1024px) 22vw, 60vw" className="object-cover" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} aria-label="Story of a dream" className="relative overflow-hidden bg-white">
      {/* Desktop: the Figma stage, every box placed as a share of 1600 × 1080. */}
      <div className="relative mx-auto hidden aspect-[1600/1080] w-full max-w-[1600px] lg:block">
        {PHOTOS.map((p, i) => (
          <StagePhoto key={p.src} p={p} i={i} play={done} progress={scrollYProgress} />
        ))}

        {/* Title — Figma: x 617, y 594, 632 wide, 160px. */}
        <div className="absolute" style={{ left: pct(617, STAGE.w), top: pct(594, STAGE.h) }}>
          <h1
            aria-label="Story Of A Dream"
            className="font-display font-medium leading-none text-green"
            style={{ fontSize: fluid(160, 96) }}
          >
            {["Story Of", "A Dream"].map((line, i) => (
              <Words key={line} as="span" play={done} delay={0.75 + i * 0.2} by="chars" mask text={line} className="block whitespace-nowrap" />
            ))}
          </h1>
        </div>

        {/* Copy and button — Figma: x 83, centred at y 892, 408 wide. */}
        <div
          className="absolute flex w-[25.5%] -translate-y-1/2 flex-col items-start gap-6"
          style={{ left: pct(83, STAGE.w), top: pct(892, STAGE.h) }}
        >
          <Appear as="p" preset="lift" play={done} delay={1.1} className="text-[clamp(15px,1.125vw,18px)] capitalize leading-[1.4] text-sage">
            {COPY}
          </Appear>
          <Appear preset="lift" play={done} delay={1.25}>
            <GreenPill href="/careers" arrow className="h-12 px-[29px] text-[16px] text-white">
              join our team
            </GreenPill>
          </Appear>
        </div>
      </div>

      {/* Phones and tablets: title, a swipeable strip of the same photos, then the copy. */}
      <div className="shell flex flex-col gap-8 pb-14 pt-32 lg:hidden">
        <h1 aria-label="Story Of A Dream" className="font-display font-medium leading-none text-green" style={{ fontSize: fluid(160, 56) }}>
          {["Story Of", "A Dream"].map((line, i) => (
            <Words key={line} as="span" play={done} delay={0.2 + i * 0.2} by="chars" mask text={line} className="block" />
          ))}
        </h1>
        <div className="no-scrollbar -mx-[clamp(16px,5vw,80px)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(16px,5vw,80px)]">
          {PHOTOS.map((p, i) => (
            <Appear key={p.src} preset="right" play={done} delay={0.3 + i * 0.08} className="relative aspect-[222/254] w-[62vw] max-w-[280px] shrink-0 snap-center overflow-hidden rounded-[5.7px]">
              <Image src={p.src} alt={p.alt} fill sizes="62vw" className="object-cover" />
            </Appear>
          ))}
        </div>
        <div className="flex flex-col items-start gap-6">
          <Appear as="p" preset="lift" play={done} delay={0.6} className="max-w-[421px] text-[16px] capitalize leading-[1.4] text-sage">
            {COPY}
          </Appear>
          <Appear preset="lift" play={done} delay={0.75}>
            <GreenPill href="/careers" arrow className="h-12 px-[29px] text-[16px] text-white">
              join our team
            </GreenPill>
          </Appear>
        </div>
      </div>
    </section>
  );
}
