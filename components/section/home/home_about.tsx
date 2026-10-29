"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { Appear, Counter, Drift, Shutter, Words } from "@/components/ui/motion";
import { Eyebrow, GreenPill, Heading } from "@/components/ui/primitives";
import { SETTLE, fluid } from "@/lib/utils";

const STATS = [
  { value: "12+", label: "International Partnerships", w: 168 },
  { value: "10+", label: "Years of Development Excellence", w: 226 },
  { value: "75+", label: "outstanding Projects", w: 168 },
  { value: "02", label: "Countries of Operation", w: 168 },
];

/** Hairline that draws itself across once in view. */
function Rule() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reduce ? 0 : 1.8, ease: SETTLE }}
      className="h-px origin-left bg-stone/40"
    />
  );
}

export function HomeAbout() {
  return (
    <section
      id="about"
      className="relative bg-white pb-16 pt-16 md:pb-24 md:pt-[100px]"
    >
      {/* About */}
      <div className="shell">
        <div className="relative grid items-start gap-10 lg:grid-cols-[minmax(0,473fr)_minmax(0,832fr)] lg:gap-[clamp(40px,8.4vw,135px)]">
          <div className="relative lg:h-[430px]">
            {/* Same shutter as the community collage: bands open top to bottom. */}
            <Shutter className="relative aspect-[473/521] w-full max-w-[473px] lg:absolute lg:inset-x-0 lg:top-[-77px]">
              <Drift amount={40} className="size-full">
                {/* Figma crops the left half of a wider render (204% width). */}
                <div
                  className="absolute"
                  style={{
                    left: "-0.14%",
                    top: "-30.92%",
                    width: "204.27%",
                    height: "130.92%",
                  }}
                >
                  <Image
                    src="/home/img/about-houses.png"
                    alt="Brownstone townhouses with trees on a corner lot"
                    fill
                    sizes="(min-width: 1024px) 970px, 180vw"
                    className="object-cover"
                  />
                </div>
              </Drift>
            </Shutter>
          </div>
          <div className="flex flex-col gap-6">
            <Eyebrow>About</Eyebrow>
            <Heading size={72} min={38} mask>
              A Development House Built on Trust and Detail
            </Heading>
            <div className="flex max-w-[784px] flex-col items-start gap-8 md:gap-12">
              {/* Each line rises out of its own clip, a beat after the one above. */}
              <Words
                as="p"
                by="lines"
                mask
                delay={0.25}
                stagger={0.11}
                className="text-[16px] leading-[1.6] text-sage md:text-[20px]"
                text="Every part of this project is shaped around how people truly live. From open spaces and shared moments to private comfort and daily convenience, the community is designed to make everyday life feel easier, warmer, and more connected."
              />
              <Appear preset="lift" delay={0.6}>
                <GreenPill href="/about" arrow>
                  more about us
                </GreenPill>
              </Appear>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-col gap-12 md:mt-[100px] md:gap-16">
          <Rule />
          <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4 xl:flex xl:items-center xl:justify-center xl:gap-[clamp(32px,6.25vw,100px)]">
            {STATS.map((s, i) => (
              <div key={s.label} className="contents">
                {i > 0 && (
                  <span
                    className="hidden h-[118px] w-px shrink-0 bg-taupe/80 xl:block"
                    style={{ width: 0.5 }}
                  />
                )}
                <Appear
                  preset="rise"
                  delay={i * 0.12}
                  className="flex flex-col items-center gap-6 text-center"
                >
                  <span
                    className="font-display font-normal leading-none text-green"
                    style={{ fontSize: fluid(64, 44) }}
                  >
                    <Counter value={s.value} className="tabular-nums" />
                  </span>
                  <p
                    className="trim text-[13px] uppercase leading-[1.5] tracking-[1.28px] text-sage md:text-[16px]"
                    style={{ maxWidth: s.w }}
                  >
                    {s.label}
                  </p>
                </Appear>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
