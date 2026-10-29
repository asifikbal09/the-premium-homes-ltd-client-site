"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Words } from "@/components/ui/motion";
import { useIntro } from "@/components/providers/intro";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE, fluid } from "@/lib/utils";

const TITLE_LINES = ["Exclusive Properties", "In Prime Locations"];

/**
 * Same choreography as the home hero: once the intro lifts the photo settles from a slow zoom and
 * the title rises letter by letter out of a clip; on scroll the photo drifts and the title lifts away.
 */
export function ProjectsHero() {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Exclusive properties in prime locations"
      className="relative isolate h-[clamp(520px,43.75vw,700px)] overflow-hidden bg-green-deep text-white"
    >
      {/* Background — Figma "Image" layer, 1609 × 1072 from the top-left, cropped onto the tower. */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 1.14 }}
          animate={done ? { scale: 1 } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 2.6, ease: SETTLE }}
          className="absolute inset-x-0 top-0 h-[max(100%,66.63vw)] overflow-hidden"
        >
          <div
            className="absolute"
            style={{ left: "-29.12%", top: "-0.79%", width: "153.07%", height: "142.1%" }}
          >
            <Image
              src="/image/projects/projectsHero.png"
              alt="Premium Homes residential tower at dusk"
              fill
              preload
              sizes="160vw"
              className="object-cover"
            />
          </div>
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(242.87deg, rgba(0,0,0,0.7) 7.12%, rgba(0,0,0,0) 52.65%, rgba(0,0,0,0.7) 92.5%)",
          }}
        />
      </motion.div>

      {/* Title — Figma: x 80, centred 42px below the middle of the 700 tall frame. */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell absolute inset-x-0 top-[calc(50%+42px)] -translate-y-1/2"
      >
        {/* Figma breaks the title after "Properties"; each line is its own reveal, the second a beat later. */}
        <h1
          aria-label="Exclusive Properties In Prime Locations"
          className="font-display font-medium leading-none"
          style={{ fontSize: fluid(100, 44) }}
        >
          {/* No `capitalize` here: with one inline-block span per letter the browser would uppercase every letter. */}
          {TITLE_LINES.map((line, i) => (
            <Words key={line} as="span" play={done} delay={0.2 + i * 0.25} by="chars" mask text={line} className="block" />
          ))}
        </h1>
      </motion.div>
    </section>
  );
}
