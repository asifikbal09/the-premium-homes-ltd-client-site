"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Appear,
  Drift,
  InkScrub,
  Shutter,
  Words,
} from "@/components/ui/motion";
import { Eyebrow } from "@/components/ui/primitives";
import { SETTLE, fluid } from "@/lib/utils";

const QUOTE =
  "Our commitment goes beyond delivering homes. We are here to shape environments where families grow, connections thrive, and legacies are built.";

export function FounderMessage() {
  const reduce = useReducedMotion();
  const colRef = useRef<HTMLDivElement>(null);
  const play = useInView(colRef, { once: true, amount: 0.25 });
  return (
    <section
      id="founder"
      className="relative isolate overflow-hidden bg-green-deep pb-20 pt-16 text-white md:pb-[124px] md:pt-[120px]"
    >
      {/* Glow — Figma ellipse 537px at (158, 261) blurred 300 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 left-[calc(9.875%-600px)] top-[-339px] size-[1737px] max-md:left-[-900px] max-md:top-[-500px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(5,75,60,0.95) 0%, rgba(5,75,60,0.55) 18%, rgba(9,34,28,0) 42%)",
        }}
      />

      <div className="shell">
        {/* Quote inks in word by word as it travels up the screen */}
        <div className="relative">
          <Appear
            preset="grow"
            amount={0.8}
            className="absolute left-0 top-[0.125em] block md:left-[3.93em]"
            style={{
              fontSize: fluid(56, 28),
              width: "0.94em",
              height: "0.818em",
            }}
          >
            <Image
              src="/home/icons/quote.svg"
              alt=""
              fill
              className="object-contain"
            />
          </Appear>
          <InkScrub
            text={QUOTE}
            className="font-display font-normal capitalize leading-[1.2] indent-[1.4em] md:indent-[5.27em]"
            style={{ fontSize: fluid(56, 28) }}
          />
        </div>

        <div className="mt-14 grid gap-12 md:mt-[85px] lg:grid-cols-[minmax(0,658fr)_minmax(0,612fr)] lg:gap-[clamp(40px,10.6vw,169px)]">
          {/* One trigger for the column: eyebrow, title lines, paragraph lines, rule, then signature. */}
          <div
            ref={colRef}
            className="flex flex-col justify-between gap-16 lg:pt-[70px] xl:gap-[160px]"
          >
            <div className="flex flex-col gap-[30px]">
              <div className="flex flex-col gap-4">
                <Appear preset="lift" play={play}>
                  <Eyebrow>from the founder</Eyebrow>
                </Appear>
                <div
                  className="font-display font-normal capitalize leading-[1.2]"
                  style={{ fontSize: fluid(80, 40) }}
                >
                  <Words
                    as="h2"
                    play={play}
                    delay={0.15}
                    mask
                    text="Built for Trust."
                    className="text-white"
                  />
                  <Words
                    as="p"
                    play={play}
                    delay={0.3}
                    mask
                    text="Designed for life"
                    className="text-white"
                  />
                </div>
              </div>
              <Words
                as="p"
                play={play}
                delay={0.55}
                mask
                stagger={0.1}
                text="At Premium Homes, we believe a home is more than architecture, it’s a promise. Every brick we lay, every detail we refine, is rooted in craftsmanship, transparency, and a long-term vision for thriving communities."
                className="max-w-[638px] text-[16px] leading-[1.6] text-white md:text-[20px]"
              />
            </div>

            <div className="flex max-w-[560px] flex-col gap-[29px]">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: play ? 1 : 0 }}
                transition={{
                  duration: reduce ? 0 : 1.6,
                  ease: SETTLE,
                  delay: reduce ? 0 : 0.9,
                }}
                className="block h-px origin-left bg-gold-line"
              />
              <Appear
                preset="lift"
                play={play}
                delay={1.15}
                className="flex flex-col"
              >
                <p
                  className="font-script capitalize leading-[1.2] text-gold"
                  style={{ fontSize: fluid(40, 32) }}
                >
                  Mainul Hasan Dulon
                </p>
                <p className="text-[16px] leading-[1.6] text-white md:text-[20px]">
                  Managing Director &amp; CEO
                </p>
              </Appear>
            </div>
          </div>

          {/* Same shutter as the other photos; blades in the section's deep green so nothing flashes white. */}
          <Shutter
            tone="bg-green-deep"
            className="relative aspect-[612/729] w-full max-w-[612px] justify-self-end"
          >
            <Drift amount={36} className="size-full">
              <Image
                src="/home/img/founder.jpg"
                alt="Mainul Hasan Dulon, Managing Director & CEO"
                fill
                sizes="(min-width: 1024px) 612px, 100vw"
                className="object-cover object-bottom"
              />
            </Drift>
          </Shutter>
        </div>
      </div>
    </section>
  );
}
