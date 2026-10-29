"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Words } from "@/components/ui/motion";
import { useIntro } from "@/components/providers/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SPRING_SLOW, fluid } from "@/lib/utils";

/** Figma "523" frame: the photo pile sits on a 1600 × 466 strip, cut off by the title band below. */
const STAGE = { w: 1600, h: 466 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

type Card = {
  /** Figma box of the rotated card, relative to the strip (frame y − 100 for the nav). */
  x: number;
  y: number;
  /** Unrotated photo size inside the 12px white mat. */
  w: number;
  h: number;
  rotate: number;
  /** Scroll parallax in px; nearer cards travel further. */
  drift: number;
  photo?: { src: string; alt: string };
};

// DOM order = Figma stacking order.
const CARDS: Card[] = [
  { x: 644, y: 169, w: 231.18, h: 301.94, rotate: -11.57, drift: -60, photo: { src: "/image/life-at-tphl/tplt-team04.png", alt: "Executive team presentation with a tower render on screen" } },
  { x: 1057, y: 104, w: 188, h: 258, rotate: 7, drift: -90, photo: { src: "/image/life-at-tphl/tplt-team02.png", alt: "Project team reviewing a scale model" } },
  { x: 145, y: 61, w: 231.18, h: 301.94, rotate: -7.23, drift: -110, photo: { src: "/image/life-at-tphl/tplt-team05.png", alt: "TPHL architect reviewing the master plan board" } },
  { x: 79, y: 205, w: 233.44, h: 130.62, rotate: -8.22, drift: -40, photo: { src: "/image/life-at-tphl/tplt-team06.png", alt: "Team festive celebration in traditional attire" } },
  { x: 884, y: 209, w: 233.44, h: 130.62, rotate: 11.57, drift: -50, photo: { src: "/image/life-at-tphl/tplt-team03.png", alt: "TPHL team collaborating at the conference table" } },
  { x: 398, y: 124, w: 218.98, h: 303, rotate: 10.78, drift: -80 },
  { x: 1244, y: 169, w: 172.02, h: 255.54, rotate: -12, drift: -120, photo: { src: "/image/life-at-tphl/tplt-team1.png", alt: "Team members in conversation in the lounge" } },
];

const QUOTE = "A culture built around people, stories, ambition, and the human side of building homes.";

/** One card of the pile. It falls in from above the strip, spinning onto its resting angle. */
function PileCard({ c, i, play, progress }: { c: Card; i: number; play: boolean; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [0, c.drift]);
  // Card + 12px mat (quote card: 12px border + 12px padding) as a share of the strip.
  const pad = c.photo ? 24 : 48;
  const hidden = { y: "-140%", rotate: c.rotate + (i % 2 ? 24 : -24), opacity: 0.001 };
  const shown = { y: "0%", rotate: c.rotate, opacity: 1 };
  return (
    <motion.div
      style={{ left: pct(c.x, STAGE.w), top: pct(c.y, STAGE.h), width: pct(c.w + pad, STAGE.w), y }}
      className="absolute"
    >
      <motion.div
        initial={hidden}
        animate={play ? shown : hidden}
        transition={reduce ? { duration: 0 } : { ...SPRING_SLOW, delay: 0.15 + i * 0.09 }}
        // Hover straightens the card and lifts it off the pile.
        whileHover={reduce ? undefined : { rotate: 0, scale: 1.06, zIndex: 10, transition: { type: "spring", bounce: 0.25, duration: 0.6 } }}
        className="relative shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]"
      >
        {c.photo ? (
          <div className="bg-white p-[clamp(5px,0.75vw,12px)]">
            <div className="relative w-full" style={{ aspectRatio: `${c.w} / ${c.h}` }}>
              <Image src={c.photo.src} alt={c.photo.alt} fill preload={i < 3} sizes="(min-width: 1024px) 16vw, 28vw" className="object-cover" />
            </div>
          </div>
        ) : (
          <div
            className="border-[clamp(5px,0.75vw,12px)] border-gold bg-white p-[clamp(5px,0.75vw,12px)]"
            style={{ aspectRatio: `${c.w + pad} / ${c.h + pad}` }}
          >
            <p className="font-display font-medium leading-[1.4] text-green" style={{ fontSize: fluid(24, 11) }}>
              {QUOTE}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Figma "523": a pile of polaroids tossed above a big "Life At TPHL" title. After the preloader
 * the cards fall onto the pile one after another, then the title rises out of a clip letter by
 * letter. On scroll the cards drift up at different speeds.
 */
export function LifeAtTphlHero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <section ref={ref} aria-label="Life At TPHL" className="relative overflow-hidden bg-sage pt-[clamp(88px,6.25vw,100px)]">
      {/* Phones get a wider-than-screen strip so the cards stay a readable size; the sides crop. */}
      <div className="relative w-full overflow-hidden">
        <div
          className="relative left-1/2 w-[max(100%,820px)] max-w-[1600px] -translate-x-1/2"
          style={{ aspectRatio: `${STAGE.w} / ${STAGE.h}` }}
        >
          {CARDS.map((c, i) => (
            <PileCard key={i} c={c} i={i} play={done} progress={scrollYProgress} />
          ))}
        </div>
      </div>

      {/* Title band: painted over the bottom of the pile, as in Figma. */}
      <div className="relative z-10 -mt-px bg-sage pb-[clamp(40px,4.375vw,70px)] pt-[clamp(24px,3.125vw,50px)]">
        <h1
          aria-label="Life At TPHL"
          className="mx-auto max-w-[962px] text-center font-display font-normal leading-none text-white"
          style={{ fontSize: fluid(260, 84) }}
        >
          {["Life At", "TPHL"].map((line, i) => (
            <Words key={line} as="span" play={done} delay={0.75 + i * 0.18} by="chars" mask text={line} className="block whitespace-nowrap" />
          ))}
        </h1>
      </div>
    </section>
  );
}
