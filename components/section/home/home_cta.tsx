"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, Shutter, Words } from "@/components/ui/motion";
import { GreenPill } from "@/components/ui/primitives";

const PRICE_PREDICTOR_URL = "https://prop-value.xyz/";

export function HomeCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  // One trigger for the whole card so its parts play in order, not as each happens to scroll in.
  const cardRef = useRef<HTMLDivElement>(null);
  const play = useInView(cardRef, { once: true, amount: 0.35 });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate flex h-[clamp(720px,59.375vw,950px)] items-center justify-center overflow-hidden bg-[#e6e4e0] px-4"
    >
      {/* Background house — Figma "image" layer, 2032 wide, offset -216 */}
      <motion.div
        style={{ y: bgY }}
        className="absolute -z-10 inset-y-[-6%] left-[-13.5%] w-[127%]"
      >
        <div
          className="absolute"
          style={{
            left: "-24.78%",
            top: "-0.28%",
            width: "170.57%",
            height: "237.26%",
          }}
        >
          <Image
            src="/home/img/cta-bg.jpg"
            alt=""
            fill
            sizes="220vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* The card grows in, the photo opens with the shutter, then eyebrow, title lines and button follow. */}
      <motion.div
        ref={cardRef}
        style={{ y: cardY }}
        className="w-full max-w-[592px]"
      >
        <Appear
          preset="grow"
          slow
          play={play}
          className="group relative overflow-hidden border-[6px] border-white bg-white"
        >
          <Shutter
            play={play}
            delay={0.2}
            className="relative aspect-[580/443] w-full"
          >
            <div className="zoom-frame relative size-full">
              <div className="absolute inset-0">
                <Image
                  src="/home/img/cta-base.jpg"
                  alt="Premium Homes tower surrounded by trees at dusk"
                  fill
                  sizes="592px"
                  className="object-cover"
                />
              </div>
            </div>
          </Shutter>
          <div className="flex flex-col items-center gap-5 px-6 pb-6 pt-7 text-center md:pb-[19px] md:pt-[30px]">
            <div className="flex flex-col items-center gap-1.5">
              <Appear
                as="p"
                preset="lift"
                play={play}
                delay={0.7}
                className="text-[14px] font-medium uppercase leading-[1.5] tracking-[0.32px] text-gold md:text-[16px]"
              >
                Start Your Journey
              </Appear>
              <Words
                as="h2"
                play={play}
                delay={0.85}
                mask
                text="Find Your Next Address with TPH"
                className="max-w-[426px] font-display text-[30px] font-medium capitalize leading-[1.22] text-green md:text-[36px] md:leading-[44px]"
              />
            </div>
            <Appear preset="lift" play={play} delay={1.25}>
              <GreenPill href={PRICE_PREDICTOR_URL} size="lg" arrow>
                try property price predictor
              </GreenPill>
            </Appear>
          </div>
        </Appear>
      </motion.div>
    </section>
  );
}
