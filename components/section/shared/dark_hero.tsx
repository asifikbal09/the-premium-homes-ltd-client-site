"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Appear, Words } from "@/components/ui/motion";
import { Eyebrow } from "@/components/ui/primitives";
import { useIntro } from "@/components/providers/intro";
import { cn, fluid } from "@/lib/utils";

/**
 * Figma "Hero" of the Team and Career pages: a 700 tall deep-green band with a centred eyebrow, a
 * 100px title, a line of 80% white copy and an optional action. Once the intro lifts the title rises
 * letter by letter out of a clip and the copy and action follow; on scroll the block lifts away.
 */
export function DarkHero({
  eyebrow,
  title,
  copy,
  copyWidth,
  compact = false,
  children,
}: {
  /** The 493 tall band of the FAQ and Blog pages, centred under the nav. */
  compact?: boolean;
  eyebrow: string;
  /** One entry per line, as Figma breaks the title. */
  title: string[];
  copy: string;
  /** Figma width of the copy block in px. */
  copyWidth: number;
  /** Action under the copy. */
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label={title.join(" ")}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-green-deep text-white",
        compact
          ? "min-h-[clamp(400px,30.8vw,493px)] pb-[30px] pt-[110px]"
          : "min-h-[clamp(560px,43.75vw,700px)] py-[120px]",
      )}
    >
      <motion.div style={{ y, opacity }} className="shell flex flex-col items-center text-center">
        <Eyebrow play={done}>{eyebrow}</Eyebrow>
        <h1
          aria-label={title.join(" ")}
          className="mt-4 font-display font-medium leading-none"
          style={{ fontSize: fluid(100, 44) }}
        >
          {/* No `capitalize`: with one span per letter the browser would uppercase every letter. */}
          {title.map((line, i) => (
            <Words key={line} as="span" play={done} delay={0.2 + i * 0.25} by="chars" mask text={line} className="block" />
          ))}
        </h1>
        <Appear
          as="p"
          preset="lift"
          play={done}
          delay={0.9}
          className="mt-6 text-[clamp(16px,1.25vw,20px)] leading-[1.6] text-white/80"
          style={{ maxWidth: copyWidth }}
        >
          {copy}
        </Appear>
        {children && (
          <Appear preset="lift" play={done} delay={1.05} className="mt-9">
            {children}
          </Appear>
        )}
      </motion.div>
    </section>
  );
}
