"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Appear, ShutterMask, Words } from "@/components/ui/motion";
import { fluid } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/us/app/tphl-premium-homes-ltd/id6752620266";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.premium_homes.tech&pcampaignid=web_share";

/* Hand + phone composite. Coordinates live in a 958 × 858 box (Figma x 560→1518, y 0→858). */
function Device({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <div ref={ref} className="relative aspect-[958/858] w-full">
      {/* The whole hand rises into frame on one slow spring, then drifts with the scroll. */}
      <motion.div style={{ y }} className="absolute inset-0">
        {/* Hand and phone open with the shutter; masked rather than covered, as they spill over the gradient. */}
        <ShutterMask play={play} delay={0.35} className="absolute inset-0">
          <div
            className="absolute overflow-hidden rounded-[clamp(24px,3vw,48px)]"
            style={{ left: 0, top: "1.49%", width: "100%", height: "98.48%" }}
          >
            <div
              className="absolute inset-x-0"
              style={{ top: "8.59%", height: "118.7%" }}
            >
              <Image
                src="/home/img/app-hand.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: "1.51%",
              top: 0,
              width: "71.03%",
              height: "103.22%",
            }}
          >
            <div
              className="relative"
              style={{ rotate: "-29.69deg", width: "43.99%", height: "95.84%" }}
            >
              {/* Shadow as a blurred shape, not a filter on the moving image */}
              <div
                aria-hidden
                className="absolute inset-[6%_4%_-2%_4%] rounded-[18%]"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0.42), rgba(0,0,0,0) 72%)",
                  transform: "translateY(5%)",
                }}
              />
              <div
                className="absolute"
                style={{ inset: "1.39% 0.4% 0.5% 0.13%" }}
              >
                <Image
                  src="/home/img/app-phone.png"
                  alt="Premium Homes mobile app home screen"
                  fill
                  sizes="(min-width: 1024px) 24vw, 60vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </ShutterMask>
      </motion.div>
    </div>
  );
}

function StoreButton({ store }: { store: "apple" | "google" }) {
  const apple = store === "apple";
  return (
    <a
      href={apple ? APP_STORE_URL : PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={apple ? "Download on the App Store" : "Get it on Google Play"}
      className="glass press relative flex h-[56px] items-center overflow-hidden rounded-full bg-white/85 pl-6 pr-6 backdrop-blur-[6px] md:h-[66.07px] md:pl-8 md:pr-[34px]"
    >
      <Image
        src={apple ? "/home/icons/appstore.svg" : "/home/icons/googleplay.svg"}
        alt=""
        width={apple ? 120 : 139}
        height={apple ? 30 : 33}
        className="relative w-auto"
        style={{
          height: apple
            ? "clamp(24px, 1.88vw, 30.07px)"
            : "clamp(26px, 2.07vw, 33.19px)",
        }}
      />
    </a>
  );
}

export function MobileAppSection() {
  // One trigger for the whole block so it plays in order: card, device, title lines, store buttons.
  const ref = useRef<HTMLDivElement>(null);
  const play = useInView(ref, { once: true, amount: 0.3 });
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(179.38deg, #fff 0.9%, #cfa564 95.8%)",
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-10 lg:aspect-[1600/945] lg:p-0"
      >
        {/* Card */}
        <Appear
          preset="grow"
          slow
          play={play}
          className="relative overflow-hidden rounded-[32px] bg-green-deep lg:absolute lg:left-[5.125%] lg:top-[23.1%] lg:h-[67.72%] lg:w-[89.75%] lg:rounded-[clamp(32px,3vw,48px)]"
        >
          <div className="relative z-10 flex flex-col gap-10 px-6 pb-4 pt-10 sm:px-10 lg:absolute lg:left-[3.62%] lg:top-[50.16%] lg:w-[583px] lg:max-w-[42%] lg:p-0 xl:gap-14">
            <Words
              as="h2"
              play={play}
              delay={0.9}
              mask
              text="Your Dream Home Is Just a Tap Away"
              className="max-w-[8.85em] font-display font-normal! capitalize leading-[1.2] text-gold"
              style={{ fontSize: fluid(60, 36) }}
            />
            <Appear
              preset="lift"
              play={play}
              delay={1.35}
              className="flex flex-wrap gap-[11.2px]"
            >
              <StoreButton store="apple" />
              <StoreButton store="google" />
            </Appear>
          </div>

          {/* Device inside the card on small screens */}
          <div className="relative -mb-6 ml-auto mt-4 w-[110%] max-w-[700px] translate-x-[6%] lg:hidden">
            <Device play={play} />
          </div>
        </Appear>

        {/* Device breaking out of the card on desktop */}
        {/* Clipped at the card's bottom edge (and its rounded corner), as the Figma frame clips the hand and phone shadow. */}
        <div className="pointer-events-none absolute left-[35%] top-0 hidden w-[59.875%] [clip-path:inset(-50%_0_0_-20%_round_0_0_clamp(32px,3vw,48px)_0)] lg:block">
          <Device play={play} />
        </div>
      </div>
    </section>
  );
}
