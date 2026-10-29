"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, InkScrub, Words } from "@/components/ui/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SETTLE } from "@/lib/utils";

// Figma breaks the close into short lines so the quote steps clear of the portrait.
const QUOTE =
  "At the heart of TPHL is a simple commitment: build trust first, then build everything else around\nit. When people\nbelieve in the\nprocess, they\nbelieve in\nthe home.”";

/**
 * Figma "Founder-Led Trust" (1600 × 1189): the portrait fills the frame, cropped from a larger
 * 2156 × 1463 image, with a black fade on the left under the copy. The portrait drifts as the
 * section scrolls, the title masks up and the quote inks in word by word.
 */
export function AboutFounderTrust() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} aria-label="Founder-led trust" className="relative overflow-hidden bg-[#0d0d0d] text-white">
      <div className="relative mx-auto min-h-[720px] w-full max-w-[1600px] lg:aspect-[1600/1189] lg:min-h-0">
        <motion.div style={{ y }} className="absolute inset-[-6%_0]">
          <div className="absolute" style={{ left: "-8.375%", top: "-19%", width: "134.75%", height: "123.05%" }}>
            <Image
              src="/image/about/DolonSir.png"
              alt="Mainul Hasan Dulon, Managing Director and CEO"
              fill
              sizes="135vw"
              className="object-cover object-[60%_center]"
            />
          </div>
        </motion.div>
        {/* Figma: 791 wide, black at the left edge fading out by about three quarters across. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-full lg:w-[49.4%]"
          style={{ backgroundImage: "linear-gradient(to left, rgba(0,0,0,0) 24.08%, #000 105.69%)" }}
        />

        <div className="shell relative flex flex-col gap-[clamp(40px,4.5vw,72px)] py-16 lg:absolute lg:inset-x-0 lg:top-[9.25%] lg:py-0">
          <h2 aria-label="Founder-Led Trust" className="font-display font-medium capitalize leading-none text-[clamp(56px,7.5vw,120px)]">
            <Words as="span" text="Founder-Led" mask className="block" />
            <Words as="span" text="Trust" mask delay={0.12} className="block" />
          </h2>
          <div className="flex flex-col gap-[clamp(40px,4.75vw,76px)]">
            <InkScrub
              text={QUOTE}
              className="max-w-[13.67em] font-display font-medium capitalize leading-[1.2] text-[clamp(28px,3vw,48px)]"
            />
            <div className="flex w-full max-w-[502px] flex-col gap-[29px]">
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 1 }}
                transition={{ duration: reduce ? 0 : 1.2, ease: SETTLE }}
                className="block h-px w-full origin-left bg-white/60"
              />
              <Appear preset="lift" delay={0.3} className="flex flex-col">
                <p className="font-[family-name:var(--font-seaweed-script)] capitalize leading-[1.2] text-[clamp(30px,2.5vw,40px)]">
                  Mainul Hasan Dulon
                </p>
                <p className="text-[clamp(16px,1.25vw,20px)] leading-[1.6]">Managing Director &amp; CEO</p>
              </Appear>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
