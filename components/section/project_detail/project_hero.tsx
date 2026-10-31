
"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useIntro } from "@/components/providers/intro";
import { Appear, Words } from "@/components/ui/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { fluid, SETTLE } from "@/lib/utils";

interface ProjectHeroProps {
  name:
    | string
    | { id?: string | number; name?: string; address?: string; slug?: string };
  image: string;
  tag?:
    | string
    | {
        id?: string | number;
        name?: string;
      }
    | null;
  location?:
    | string
    | {
        id?: string | number;
        name?: string;
        address?: string;
        slug?: string;
      }
    | null;
}

/**
 * Figma "Hero" (1600 × 800, mobile 375 × 714): full-bleed project photo that settles from a slow
 * zoom and drifts on scroll, with the location eyebrow above the 100px display title.
 */
export function ProjectHero({
  name,
  image,
  tag,
  location,
}: ProjectHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const displayName =
    typeof name === "string"
      ? name
      : name?.name || name?.slug || "Prestige Residence";

  const displayLocation =
    typeof location === "string"
      ? location
      : location?.address ||
        location?.name ||
        (typeof tag === "string" ? tag : tag?.name || "");

  return (
    <section
      ref={ref}
      aria-label={displayName}
      className="relative isolate flex h-[clamp(580px,50vw,800px)] items-end overflow-hidden bg-green-deep pb-[clamp(56px,6.5vw,104px)] pt-28 text-white"
    >
      {/* Background photo with slow zoom-settle and scroll parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 1.14 }}
          animate={done ? { scale: 1 } : undefined}
          transition={reduce ? { duration: 0 } : { duration: 2.6, ease: SETTLE }}
          className="absolute inset-0"
        >
          <Image
            src={image || "/image/projects/projectsHero.png"}
            alt={displayName}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Top header gradient for navbar legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />

        {/* Figma gradient overlay for crisp text contrast */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 0% 100%, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.52) 35%, rgba(0, 0, 0, 0.2) 60%, transparent 80%)",
          }}
        />
      </motion.div>

      {/* Figma Content Block (x: 80, max-w: 622px): Location above 100px K Victor title */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 w-full"
      >
        <div className="flex max-w-[622px] flex-col gap-4">
          {displayLocation && (
            <Appear
              as="p"
              preset="lift"
              play={done}
              delay={0.1}
              className="trim text-[14px] font-medium leading-[1.5] text-white sm:text-[16px]"
            >
              {displayLocation}
            </Appear>
          )}

          <Words
            as="h1"
            play={done}
            delay={0.25}
            by="words"
            mask
            text={displayName}
            className="font-display font-medium capitalize text-white"
            style={{ fontSize: fluid(100, 44), lineHeight: 1 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
