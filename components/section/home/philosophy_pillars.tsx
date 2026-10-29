"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { Appear } from "@/components/ui/motion";
import { Heading } from "@/components/ui/primitives";
import { PILLAR_PATHS } from "./pillar_paths";
import { fluid } from "@/lib/utils";

/* Figma composes each pillar icon from several vector layers; positions are kept 1:1 inside a 100×100 box. */
type Layer = { src: string; x: number; y: number; w: number; h: number };

const PILLARS: { title: string; icon: Layer[] }[] = [
  {
    title: "Transparency",
    icon: [
      { src: "p1-a", x: 0, y: 0, w: 33.809, h: 100.001 },
      { src: "p1-b", x: 66.19, y: 0, w: 33.809, h: 100.001 },
      { src: "p1-c", x: 23.67, y: 23.68, w: 52.651, h: 52.651 },
    ],
  },
  {
    title: "Growth",
    icon: [
      { src: "p2-a", x: 0, y: 0, w: 100, h: 100 },
      { src: "p2-b", x: 16.17, y: 16.17, w: 67.638, h: 67.638 },
      { src: "p2-c", x: 32.36, y: 32.36, w: 35.275, h: 35.275 },
    ],
  },
  {
    title: "Client Experience",
    icon: [
      { src: "p3-3095", x: 16.08, y: 31.83, w: 7.833, h: 19.627 },
      { src: "p3-3094", x: 31.78, y: 76.07, w: 36.342, h: 7.746 },
      { src: "p3-3087", x: 64.16, y: 19.95, w: 19.628, h: 31.508 },
      { src: "p3-3086", x: 19.92, y: 19.98, w: 15.783, h: 15.842 },
      { src: "p3-3054", x: 39.87, y: 62.06, w: 20.151, h: 5.591 },
      { src: "p3-3047", x: 56.03, y: 33.96, w: 11.561, h: 17.501 },
      { src: "p3-3046", x: 32.27, y: 33.99, w: 11.532, h: 17.501 },
      { src: "p3-3099", x: 0, y: 0, w: 100, h: 100 },
    ],
  },
  {
    title: "Trust",
    icon: [
      { src: "p4-2489", x: 27.52, y: 24.02, w: 44.962, h: 51.922 },
      { src: "p4-2488", x: 0, y: 0, w: 100, h: 100 },
      { src: "p4-2487", x: 48.54, y: 72.83, w: 2.912, h: 27.169 },
      { src: "p4-2486", x: 48.54, y: 0.03, w: 2.912, h: 27.169 },
    ],
  },
];

function PillarCard({ p, i }: { p: (typeof PILLARS)[number]; i: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <Appear
      as="article"
      preset="rise"
      delay={i * 0.14}
      amount={0.3}
      className="group relative flex h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-b from-cream to-white p-8 md:h-[420px] md:p-10 xl:h-[493px]"
    >
      <span
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0"
      />
      {/* Hover wash rises from the floor of the card */}
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-green to-green-deep transition-transform duration-[900ms] ease-out-expo group-hover:scale-y-100" />
      <span className="relative transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">
        <PillarIcon layers={p.icon} draw={inView} delay={i * 0.14} />
      </span>
      <div className="relative">
        <span className="mb-4 block font-sans text-[14px] font-medium tracking-[2px] text-gold opacity-0 transition-all duration-700 ease-out-expo group-hover:opacity-100">
          0{i + 1}
        </span>
        <h3
          className="max-w-[6.6em] font-display font-normal leading-none text-green transition-colors duration-700 group-hover:text-warm"
          style={{ fontSize: fluid(48, 36) }}
        >
          {p.title}
        </h3>
      </div>
    </Appear>
  );
}

/**
 * The icon draws itself on reveal: every Figma vector layer sits in its own
 * nested viewBox at the design position, strokes in along its outline with a
 * non-scaling hairline, then its fill settles. Layers follow one another.
 */
function PillarIcon({
  layers,
  draw,
  delay = 0,
}: {
  layers: Layer[];
  draw: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-[72px] overflow-visible md:size-[100px]"
      aria-hidden
    >
      {layers.map((l, i) => {
        const path = PILLAR_PATHS[l.src];
        const at = delay + 0.15 + i * 0.09;
        return (
          <svg
            key={i}
            x={l.x}
            y={l.y}
            width={l.w}
            height={l.h}
            viewBox={path.viewBox}
            overflow="visible"
          >
            <motion.path
              d={path.d}
              fill="#CFA564"
              stroke="#CFA564"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={
                draw
                  ? { pathLength: 1, fillOpacity: 1 }
                  : { pathLength: 0, fillOpacity: 0 }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      pathLength: {
                        duration: 1.1,
                        ease: [0.65, 0, 0.35, 1],
                        delay: at,
                      },
                      fillOpacity: {
                        duration: 0.5,
                        ease: "easeOut",
                        delay: at + 0.75,
                      },
                    }
              }
            />
          </svg>
        );
      })}
    </svg>
  );
}

/** The four pillars, as a section of their own (sits just before Testimonials). */
export function PhilosophyPillars() {
  return (
    <section className="relative bg-white pt-16 md:pt-[100px]">
      {/* Pillars */}
      <div className="shell lg:pl-[calc(clamp(16px,5vw,80px)+min(0.375vw,6px))]">
        <Heading size={72} min={38} by="chars" mask>
          The Pillars of Our Philosophy
        </Heading>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 xl:grid-cols-4">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
